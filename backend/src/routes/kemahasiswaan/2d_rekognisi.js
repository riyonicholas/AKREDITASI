const express = require('express');
const router = express.Router();
const controller2d = require('../../controllers/kemahasiswaan/2d_rekognisi');
const { verifyToken, authorize } = require('../../middlewares/auth');

router.use(verifyToken, authorize('KEMAHASISWAAN', 'ADMIN'));

// Data Aktif
router.get('/', controller2d.index);
router.post('/', controller2d.store);

// Trash
router.get('/trash', controller2d.trash);
router.post('/restore/:id', controller2d.restore);
router.delete('/:id', controller2d.destroy);
router.delete('/hard/:id', controller2d.hardDestroy);

// Export
router.get('/export', controller2d.exportExcel);

module.exports = router;