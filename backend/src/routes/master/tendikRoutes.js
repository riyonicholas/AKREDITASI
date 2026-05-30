const express = require('express');
const router = express.Router();
const tendikController = require('../../controllers/master/tendikController');
const { verifyToken, authorize } = require('../../middlewares/auth');
const { UNITS } = require('../../config/permissions');

/**
 * ROUTES: Tabel Master Tenaga Kependidikan
 * - GET: Semua role terautentikasi (untuk dropdown di seluruh modul)
 * - POST/PUT/DELETE: Hanya ADMIN
 */

// Read: semua user yang sudah login bisa akses
router.get('/', verifyToken, tendikController.index);
router.get('/:id', verifyToken, tendikController.show);

// Write: hanya ADMIN
router.post('/', verifyToken, authorize(UNITS.ADMIN), tendikController.store);
router.put('/:id', verifyToken, authorize(UNITS.ADMIN), tendikController.update);
router.delete('/:id', verifyToken, authorize(UNITS.ADMIN), tendikController.destroy);

module.exports = router;
