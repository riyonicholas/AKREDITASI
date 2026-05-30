const express = require('express');
const router = express.Router();
const pkmController = require('../../controllers/lppm/4a2_pkm_dtpr');
const { verifyToken, authorize } = require('../../middlewares/auth');
const { UNITS } = require('../../config/permissions');

router.use(verifyToken, authorize(UNITS.LPPM, UNITS.ADMIN));

router.get('/', pkmController.index);
router.get('/export', pkmController.exportExcel);
router.get('/trash', pkmController.trash);
router.post('/', pkmController.store);
router.put('/:id', pkmController.update);
router.delete('/:id', pkmController.destroy);
router.put('/:id/restore', pkmController.restore);
router.delete('/:id/hard', pkmController.hardDestroy);

module.exports = router;
