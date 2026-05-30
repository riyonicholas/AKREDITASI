const express = require('express');
const router = express.Router();
const penelitianController = require('../../controllers/lppm/3a2_penelitian_dtpr');
const { verifyToken, authorize } = require('../../middlewares/auth');
const { UNITS } = require('../../config/permissions');

router.use(verifyToken, authorize(UNITS.LPPM, UNITS.ADMIN));

router.get('/', penelitianController.index);
router.get('/export', penelitianController.exportExcel);
router.get('/trash', penelitianController.trash);
router.post('/', penelitianController.store);
router.put('/:id', penelitianController.update);
router.delete('/:id', penelitianController.destroy);
router.put('/:id/restore', penelitianController.restore);
router.delete('/:id/hard', penelitianController.hardDestroy);

module.exports = router;
