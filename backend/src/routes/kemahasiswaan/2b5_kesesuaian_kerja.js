const express = require('express');
const router = express.Router();
const controller2b5 = require('../../controllers/kemahasiswaan/2b5_kesesuaian_kerja');
const { verifyToken, authorize } = require('../../middlewares/auth');

/**
 * ROUTES: Tabel 2.B.5 Kesesuaian Bidang Kerja
 * Memastikan semua handler terhubung ke fungsi controller yang ada.
 */

router.use(verifyToken, authorize('KEMAHASISWAAN', 'ADMIN'));

// --- Data Aktif ---
router.get('/', controller2b5.index);
router.post('/', controller2b5.store);
router.put('/:id', controller2b5.update);
router.delete('/:id', controller2b5.destroy);

// --- Sampah & Maintenance ---
router.get('/trash', controller2b5.trash);
router.post('/restore/:id', controller2b5.restore); // Pastikan ini tidak undefined di controller
router.delete('/hard/:id', controller2b5.hardDestroy);

// --- Export ---
router.get('/export', controller2b5.exportExcel);

module.exports = router;