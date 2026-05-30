const express = require('express');
const router = express.Router();
const kerjasamaController = require('../../controllers/lppm/4c1_kerjasama_pkm');
const { verifyToken, authorize } = require('../../middlewares/auth');
const { UNITS } = require('../../config/permissions');

router.use(verifyToken, authorize(UNITS.LPPM, UNITS.ADMIN));

router.get('/', kerjasamaController.index);
router.get('/trash', kerjasamaController.trash);
router.put('/:id', kerjasamaController.update);
router.delete('/:id', kerjasamaController.destroy);
router.put('/:id/restore', kerjasamaController.restore);
router.delete('/:id/hard', kerjasamaController.hardDestroy);

module.exports = router;
