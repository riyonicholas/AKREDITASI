const express = require('express');
const router = express.Router();
const prodiController = require('../../controllers/master/prodiController');
const { verifyToken, authorize } = require('../../middlewares/auth');
const { UNITS } = require('../../config/permissions');

/**
 * ROUTES: Tabel Master Program Studi (Prodi)
 * - GET: Semua role terautentikasi (untuk dropdown di seluruh modul)
 * - POST/PUT/DELETE: Hanya ADMIN
 */

// Read: semua user yang sudah login bisa akses (untuk dropdown Program Studi)
router.get('/', verifyToken, prodiController.index);
router.get('/:id', verifyToken, prodiController.show);

// Write: hanya ADMIN
router.post('/', verifyToken, authorize(UNITS.ADMIN), prodiController.store);
router.put('/:id', verifyToken, authorize(UNITS.ADMIN), prodiController.update);
router.delete('/:id', verifyToken, authorize(UNITS.ADMIN), prodiController.destroy);

module.exports = router;
