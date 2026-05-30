const express = require('express');
const router = express.Router();
const controller1b = require('../../controllers/tpm/1b_unit_spmi');
const { verifyToken, authorize } = require('../../middlewares/auth');

// Keamanan: Hanya TPM dan ADMIN
router.use(verifyToken, authorize('TPM', 'ADMIN'));

// --- Data Aktif ---
router.get('/', controller1b.index);
router.post('/', controller1b.store);
router.put('/:id', controller1b.update);
router.delete('/:id', controller1b.destroy);

// --- Tempat Sampah ---
router.get('/trash', controller1b.trash);
router.post('/restore/:id', controller1b.restore);
router.delete('/hard/:id', controller1b.hardDestroy);

// --- Ekspor ---
router.get('/export', controller1b.exportExcel);

module.exports = router;