const express = require('express');
const router = express.Router();
const controller1a1 = require('../../controllers/upps/1a1_pimpinan_dan_tupoksi');
const { verifyToken, authorize } = require('../../middlewares/auth');

/**
 * ROUTES: Tabel 1.A.1 Pimpinan dan Tupoksi
 * Memenuhi IKU: Pengembangan RESTful API & IKT: Keamanan
 */

// Middleware keamanan: Hanya UPPS dan ADMIN
router.use(verifyToken, authorize('UPPS', 'ADMIN'));

// --- Operasi Data Aktif ---
router.get('/', controller1a1.index);
router.post('/', controller1a1.store);
router.put('/:id', controller1a1.update);
router.delete('/:id', controller1a1.destroy); // Soft Delete

// --- Operasi Tempat Sampah ---
router.get('/trash', controller1a1.trash);          // Lihat sampah
router.post('/restore/:id', controller1a1.restore); // Pulihkan
router.delete('/hard/:id', controller1a1.hardDestroy); // Hapus Permanen

// --- Ekspor ---
router.get('/export', controller1a1.exportExcel);

module.exports = router;