const express = require('express');
const router = express.Router();
const tahunAkademikController = require('../../controllers/master/tahunAkademikController');
const { verifyToken } = require('../../middlewares/auth');

// Middleware: Hanya pastikan user sudah login (tidak ada batasan role spesifik karena ini master data umum)
router.use(verifyToken);

// 1. Endpoint Ambil Semua Data (Read Only)
router.get('/', tahunAkademikController.index);

module.exports = router;
