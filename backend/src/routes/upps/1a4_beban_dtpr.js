const express = require('express');
const router = express.Router();
const controller1a4 = require('../../controllers/upps/1a4_beban_dtpr');
const { verifyToken, authorize } = require('../../middlewares/auth');

/**
 * ROUTES: Tabel 1.A.4 Rata-rata Beban DTPR (EWMP)
 */

// Middleware keamanan: Hanya UPPS dan ADMIN
router.use(verifyToken, authorize('UPPS', 'ADMIN'));

// --- Operasi Data Aktif ---
router.get('/', controller1a4.index);
router.post('/', controller1a4.store);
router.put('/:id', controller1a4.update);
router.delete('/:id', controller1a4.destroy); // Soft Delete

// --- Operasi Tempat Sampah ---
router.get('/trash', controller1a4.trash);          // Lihat sampah
router.post('/restore/:id', controller1a4.restore); // Pulihkan
router.delete('/hard/:id', controller1a4.hardDestroy); // Hapus Permanen

// --- Ekspor ---
router.get('/export', controller1a4.exportExcel);

module.exports = router;