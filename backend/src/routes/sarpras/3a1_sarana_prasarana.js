const express = require('express');
const router = express.Router();
const controller3a1 = require('../../controllers/sarpras/3a1_sarana_prasarana');
const { verifyToken, authorize } = require('../../middlewares/auth');

// Keamanan: Hanya bidang SARPRAS dan ADMIN
router.use(verifyToken, authorize('SARPRAS', 'ADMIN'));

// --- Rute Utama ---
router.get('/', controller3a1.index);
router.post('/', controller3a1.store);
router.put('/:id', controller3a1.update);
router.delete('/:id', controller3a1.destroy);

// --- Rute Recycle Bin ---
router.get('/trash', controller3a1.trash);
router.post('/restore/:id', controller3a1.restore);
router.delete('/hard/:id', controller3a1.hardDestroy);

// --- Ekspor ---
router.get('/export', controller3a1.exportExcel);

module.exports = router;