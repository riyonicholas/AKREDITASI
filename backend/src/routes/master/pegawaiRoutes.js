const express = require('express');
const router = express.Router();
const pegawaiController = require('../../controllers/master/pegawaiController');
const { verifyToken, authorize } = require('../../middlewares/auth');
const { UNITS } = require('../../config/permissions');

/**
 * ROUTES: Tabel Master Pegawai
 * - GET: Semua role terautentikasi (untuk dropdown di seluruh modul)
 * - POST/PUT/DELETE: Hanya ADMIN
 */

// Read: semua user yang sudah login bisa akses
router.get('/', verifyToken, pegawaiController.index);
router.get('/:id', verifyToken, pegawaiController.show);

// Write: hanya ADMIN
router.post('/', verifyToken, authorize(UNITS.ADMIN), pegawaiController.store);
router.put('/:id', verifyToken, authorize(UNITS.ADMIN), pegawaiController.update);
router.delete('/:id', verifyToken, authorize(UNITS.ADMIN), pegawaiController.destroy);

module.exports = router;
