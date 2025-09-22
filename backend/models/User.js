const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // bcrypt hash
  role: { type: String, enum: ['Admin','Member'], default: 'Member' },
  tenant: { type: String, required: true },   // tenant slug
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
