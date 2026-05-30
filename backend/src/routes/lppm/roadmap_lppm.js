const express = require('express');
const router = express.Router();
const roadmapController = require('../../controllers/lppm/roadmap_lppm');
const { verifyToken, authorize } = require('../../middlewares/auth');
const { UNITS } = require('../../config/permissions');

router.use(verifyToken, authorize(UNITS.LPPM, UNITS.ADMIN));

router.get('/', roadmapController.index);
router.get('/trash', roadmapController.trash);
router.post('/', roadmapController.store);
router.put('/:id', roadmapController.update);
router.delete('/:id', roadmapController.destroy);
router.put('/:id/restore', roadmapController.restore);
router.delete('/:id/hard', roadmapController.hardDestroy);

// Route untuk melihat item yang ada di dalam roadmap (Penelitian & PkM)
router.get('/:id/items', roadmapController.getItems);

module.exports = router;
