require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Tenant = require('./models/Tenant');
const User = require('./models/User');
const Note = require('./models/Note');
const { verifyJWT, requireRole } = require('./middleware/auth');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// ---------- Seed function ----------
async function ensureSeed() {
  // Tenants
  const tenants = [
    { name: 'Acme', slug: 'acme' },
    { name: 'Globex', slug: 'globex' }
  ];
  for (const t of tenants) {
    if (!await Tenant.findOne({ slug: t.slug })) await Tenant.create(t);
  }

  // Users
  const accounts = [
    { email: 'admin@acme.test', role: 'Admin', tenant: 'acme' },
    { email: 'user@acme.test', role: 'Member', tenant: 'acme' },
    { email: 'admin@globex.test', role: 'Admin', tenant: 'globex' },
    { email: 'user@globex.test', role: 'Member', tenant: 'globex' },
  ];

  for (const a of accounts) {
    if (!await User.findOne({ email: a.email })) {
      const hash = await bcrypt.hash('password', 10);
      await User.create({ ...a, password: hash });
    }
  }
}

// ---------- Routes ----------

// Health endpoint
app.get('/health', async (req, res) => {
  await ensureSeed();
  res.json({ status: 'ok' });
});

// Login
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: 'Invalid' });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ error: 'Invalid' });

  const token = jwt.sign({
    userId: user._id,
    email: user.email,
    role: user.role,
    tenant: user.tenant
  }, process.env.JWT_SECRET, { expiresIn: '8h' });

  res.json({ token });
});

// ---------- Notes CRUD (example: POST + GET) ----------
app.post('/notes', verifyJWT, async (req, res) => {
  const tenantSlug = req.user.tenant;
  const tenant = await Tenant.findOne({ slug: tenantSlug });
  if (tenant.plan === 'free') {
    const count = await Note.countDocuments({ tenant: tenantSlug });
    if (count >= 3) return res.status(403).json({ error: 'Free plan limit reached' });
  }
  const note = await Note.create({
    title: req.body.title,
    content: req.body.content,
    tenant: tenantSlug,
    author: req.user.userId
  });
  res.status(201).json(note);
});

app.get('/notes', verifyJWT, async (req, res) => {
  const notes = await Note.find({ tenant: req.user.tenant });
  res.json(notes);
});

// Upgrade endpoint (Admin only)
app.post('/tenants/:slug/upgrade', verifyJWT, async (req, res) => {
  const slug = req.params.slug;
  if (req.user.tenant !== slug) return res.status(403).json({ error: 'Invalid tenant' });
  if (req.user.role !== 'Admin') return res.status(403).json({ error: 'Admin only' });

  await Tenant.updateOne({ slug }, { $set: { plan: 'pro' } });
  res.json({ ok: true });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
