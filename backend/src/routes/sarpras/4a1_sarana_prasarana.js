const express = require('express');
const router = express.Router();
const controller4a1 = require('../../controllers/sarpras/4a1_sarana_prasarana');
const { verifyToken, authorize } = require('../../middlewares/auth');

// Keamanan: Hanya bidang SARPRAS dan ADMIN
router.use(verifyToken, authorize('SARPRAS', 'ADMIN'));

// --- Rute Utama ---
router.get('/', controller4a1.index);
router.post('/', controller4a1.store);
router.put('/:id', controller4a1.update);
router.delete('/:id', controller4a1.destroy);

// --- Rute Recycle Bin ---
router.get('/trash', controller4a1.trash);
router.post('/restore/:id', controller4a1.restore);
router.delete('/hard/:id', controller4a1.hardDestroy);

// --- Ekspor ---
router.get('/export', controller4a1.exportExcel);

module.exports = router;