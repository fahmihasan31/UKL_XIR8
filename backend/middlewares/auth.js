const jwt = require('jsonwebtoken');
const { Admin } = require('../models');

module.exports = {
  async verifyToken(req, res, next) {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({
      success: false,
      message: 'Unauthorized access'
    });

    try {
      const decoded = jwt.verify(token, 'secret_key');
      req.admin = await Admin.findByPk(decoded.id);
      next();
    } catch (error) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized access'
      });
    }
  }
};