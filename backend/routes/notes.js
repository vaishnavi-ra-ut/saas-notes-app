const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const Tenant = require('../models/Tenant');
const { verifyJWT } = require('../middleware/auth');

// List notes
router.get('/', verifyJWT, async (req, res) => {
  const notes = await Note.find({ tenant: req.user.tenant });
  res.json(notes);
});

// Create note
router.post('/', verifyJWT, async (req, res) => {
  const tenant = await Tenant.findOne({ slug: req.user.tenant });
  if (tenant.plan === 'free') {
    const count = await Note.countDocuments({ tenant: tenant.slug });
    if (count >= 3) return res.status(403).json({ error: 'Free plan limit reached' });
  }

  const note = await Note.create({
    title: req.body.title,
    content: req.body.content,
    tenant: req.user.tenant,
    author: req.user.userId
  });
  res.status(201).json(note);
});

// Get single note
router.get('/:id', verifyJWT, async (req, res) => {
  const note = await Note.findOne({ _id: req.params.id, tenant: req.user.tenant });
  if (!note) return res.status(404).json({ error: 'Note not found' });
  res.json(note);
});

// Update note
router.put('/:id', verifyJWT, async (req, res) => {
  const note = await Note.findOne({ _id: req.params.id, tenant: req.user.tenant });
  if (!note) return res.status(404).json({ error: 'Note not found' });
  if (note.author.toString() !== req.user.userId) return res.status(403).json({ error: 'Forbidden' });

  note.title = req.body.title || note.title;
  note.content = req.body.content || note.content;
  await note.save();
  res.json(note);
});

// Delete note
router.delete('/:id', verifyJWT, async (req, res) => {
  const note = await Note.findOne({ _id: req.params.id, tenant: req.user.tenant });
  if (!note) return res.status(404).json({ error: 'Note not found' });
  if (note.author.toString() !== req.user.userId) return res.status(403).json({ error: 'Forbidden' });

  await note.deleteOne();
  res.json({ ok: true });
});

module.exports = router;
