const express = require('express');
const router = express.Router();
const Tenant = require('../models/Tenant');
const { verifyJWT, requireRole } = require('../middleware/auth');

router.post('/:slug/upgrade', verifyJWT, requireRole('Admin'), async (req, res) => {
  const slug = req.params.slug;
  if (req.user.tenant !== slug) return res.status(403).json({ error: 'Invalid tenant' });

  await Tenant.updateOne({ slug }, { $set: { plan: 'pro' } });
  res.json({ ok: true });
});

module.exports = router;
