const express = require('express');
const router = express.Router();
const publikasiController = require('../../controllers/lppm/3c2_publikasi_penelitian');
const { verifyToken, authorize } = require('../../middlewares/auth');
const { UNITS } = require('../../config/permissions');

router.use(verifyToken, authorize(UNITS.LPPM, UNITS.ADMIN));

router.get('/', publikasiController.index);
router.get('/trash', publikasiController.trash);
router.put('/:id', publikasiController.update);
router.delete('/:id', publikasiController.destroy);
router.put('/:id/restore', publikasiController.restore);
router.delete('/:id/hard', publikasiController.hardDestroy);

module.exports = router;
