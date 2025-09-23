const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TenantSchema = new Schema({
  name: String,
  slug: { type: String, unique: true },
  plan: { type: String, enum: ['free','pro'], default: 'free' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Tenant', TenantSchema);
