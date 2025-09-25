const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Models
const Tenant = require('./models/Tenant');
const User = require('./models/User');

// Routes
const authRoutes = require('./routes/auth');
const notesRoutes = require('./routes/notes');
const tenantsRoutes = require('./routes/tenants');
app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/tenants', tenantsRoutes);

// Seed function
const bcrypt = require('bcryptjs');
async function ensureSeed() {
  if (!await Tenant.findOne({ slug: 'acme' })) {
    await Tenant.create([{ slug: 'acme', name: 'Acme' }, { slug: 'globex', name: 'Globex' }]);
  }

  const accounts = [
    { email: 'admin@acme.test', role: 'Admin', tenant: 'acme' },
    { email: 'user@acme.test', role: 'Member', tenant: 'acme' },
    { email: 'admin@globex.test', role: 'Admin', tenant: 'globex' },
    { email: 'user@globex.test', role: 'Member', tenant: 'globex' },
  ];

  for (const a of accounts) {
    if (!await User.findOne({ email: a.email })) {
      const p = await bcrypt.hash('password', 10);
      await User.create({ ...a, password: p });
    }
  }
}

// Health check
app.get('/api/health', async (req, res) => {
  await ensureSeed();
  res.json({ status: 'ok' });
});

// Connect DB & start server
mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('MongoDB connected');
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => console.log(err));
