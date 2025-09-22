const Note = require('../models/Note');

const tenantEnforce = async (req, res, next) => {
  req.tenant = req.user.tenant; // set tenant slug
  next();
};

module.exports = { tenantEnforce };
