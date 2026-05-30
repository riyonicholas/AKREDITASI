const express = require('express');
const router = express.Router();
const dosenController = require('../../controllers/master/dosenController');
const { verifyToken, authorize } = require('../../middlewares/auth');
const { UNITS } = require('../../config/permissions');

/**
 * ROUTES: Tabel Master Dosen
 * - GET: Semua role terautentikasi (untuk dropdown Pilih Dosen di seluruh modul)
 * - POST/PUT/DELETE: Hanya ADMIN
 */

// Read: semua user yang sudah login bisa akses (untuk dropdown Dosen)
router.get('/', verifyToken, dosenController.index);
router.get('/:id', verifyToken, dosenController.show);

// Write: hanya ADMIN
router.post('/', verifyToken, authorize(UNITS.ADMIN), dosenController.store);
router.put('/:id', verifyToken, authorize(UNITS.ADMIN), dosenController.update);
router.delete('/:id', verifyToken, authorize(UNITS.ADMIN), dosenController.destroy);

module.exports = router;
