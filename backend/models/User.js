const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: { type: String, unique: true },
  password: String, // bcrypt hash
  role: { type: String, enum: ['Admin','Member'], default: 'Member' },
  tenant: String, // tenant slug
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
