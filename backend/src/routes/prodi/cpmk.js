const express = require('express');
const router = express.Router();
const cpmkController = require('../../controllers/prodi/cpmk');

const { verifyToken, authorize } = require('../../middlewares/auth');
const { UNITS } = require('../../config/permissions');

router.use(verifyToken, authorize(UNITS.PRODI, UNITS.ADMIN));

router.get('/', cpmkController.index);
router.get('/:id', cpmkController.show);
router.post('/', cpmkController.store);
router.put('/:id', cpmkController.update);
router.delete('/:id', cpmkController.destroy);

module.exports = router;
