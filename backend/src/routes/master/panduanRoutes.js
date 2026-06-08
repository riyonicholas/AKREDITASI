const express = require('express');
const router = express.Router();
const panduanController = require('../../controllers/master/panduanController');
const { verifyToken, authorize } = require('../../middlewares/auth');

// Gunakan verifyToken untuk semua route
router.use(verifyToken);

// User biasa hanya boleh melihat (GET)
router.get('/unit/:id_unit', panduanController.getByUnit);

// Admin boleh melihat semua panduan dan melakukan C-U-D
router.get('/', authorize('ADMIN'), panduanController.getAll);
router.get('/:id_panduan', authorize('ADMIN'), panduanController.getById);

router.post('/', authorize('ADMIN'), panduanController.store);
router.put('/:id_panduan', authorize('ADMIN'), panduanController.update);
router.delete('/:id_panduan', authorize('ADMIN'), panduanController.destroy);

module.exports = router;
