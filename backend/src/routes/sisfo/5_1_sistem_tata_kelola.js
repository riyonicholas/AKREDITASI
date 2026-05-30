const express = require('express');
const router = express.Router();
const Controller51 = require('../../controllers/sisfo/5_1_sistem_tata_kelola');
const { verifyToken, authorize } = require('../../middlewares/auth');

// Gunakan authorize jika SISFO sudah terdaftar di sistem Anda
router.use(verifyToken, authorize('SISFO', 'ADMIN')); 

// --- Export ---
router.get('/export', Controller51.exportExcel);

// --- Trash ---
router.get('/trash', Controller51.trash);
router.post('/restore/:id', Controller51.restore);
router.delete('/hard/:id', Controller51.hardDestroy);

// --- CRUD Aktif ---
router.get('/', Controller51.index);
router.get('/:id', Controller51.show);
router.post('/', Controller51.store);
router.put('/:id', Controller51.update);
router.delete('/:id', Controller51.destroy);

module.exports = router;
