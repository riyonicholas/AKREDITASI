const express = require('express');
const router = express.Router();
const controller2c = require('../../controllers/prodi/2c_fleksibilitas_pembelajaran');
const { verifyToken, authorize } = require('../../middlewares/auth');

router.use(verifyToken, authorize('PRODI', 'ADMIN'));

// --- Export ---
router.get('/export', controller2c.exportExcel);

// --- Trash ---
router.get('/trash', controller2c.trash);
router.post('/restore/:id', controller2c.restore);
router.delete('/hard/:id', controller2c.hardDestroy);

// --- CRUD Aktif ---
router.get('/', controller2c.index);
router.get('/:id', controller2c.show);
router.post('/', controller2c.store);
router.put('/:id', controller2c.update);
router.delete('/:id', controller2c.destroy);

module.exports = router;
