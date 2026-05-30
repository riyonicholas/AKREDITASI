const express = require('express');
const router = express.Router();
const controller2b4 = require('../../controllers/kemahasiswaan/2b4_masa_tunggu');
const { verifyToken, authorize } = require('../../middlewares/auth');

router.use(verifyToken, authorize('KEMAHASISWAAN', 'ADMIN'));

// --- CRUD Aktif ---
router.get('/', controller2b4.index);
router.post('/', controller2b4.store);
router.put('/:id', controller2b4.update);
router.delete('/:id', controller2b4.destroy);

// --- Trash & Maintenance ---
router.get('/trash', controller2b4.trash);
router.post('/restore/:id', controller2b4.restore);
router.delete('/hard/:id', controller2b4.hardDestroy);

// --- Export ---
router.get('/export', controller2b4.exportExcel);

module.exports = router;