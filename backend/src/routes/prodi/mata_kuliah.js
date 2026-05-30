const express = require('express');
const router = express.Router();
const mataKuliahController = require('../../controllers/prodi/mata_kuliah');

const { verifyToken, authorize } = require('../../middlewares/auth');
const { UNITS } = require('../../config/permissions');

router.use(verifyToken, authorize(UNITS.PRODI, UNITS.ADMIN));

router.get('/', mataKuliahController.index);
router.get('/:id', mataKuliahController.show);
router.post('/', mataKuliahController.store);
router.put('/:id', mataKuliahController.update);
router.delete('/:id', mataKuliahController.destroy);

module.exports = router;
