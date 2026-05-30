const express = require('express');
const router = express.Router();
const kerjasamaController = require('../../controllers/lppm/3c1_kerjasama_penelitian');
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
