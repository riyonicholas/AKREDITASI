const express = require('express');
const router = express.Router();
const hkiController = require('../../controllers/lppm/3c3_perolehan_hki');
const { verifyToken, authorize } = require('../../middlewares/auth');
const { UNITS } = require('../../config/permissions');

router.use(verifyToken, authorize(UNITS.LPPM, UNITS.ADMIN));

router.get('/', hkiController.index);
router.get('/trash', hkiController.trash);
router.put('/:id', hkiController.update);
router.delete('/:id', hkiController.destroy);
router.put('/:id/restore', hkiController.restore);
router.delete('/:id/hard', hkiController.hardDestroy);

module.exports = router;
