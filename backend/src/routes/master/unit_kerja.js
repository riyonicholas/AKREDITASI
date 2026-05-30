const express = require('express');
const router = express.Router();
const controllerUnitKerja = require('../../controllers/master/unit_kerja');
const { verifyToken } = require('../../middlewares/auth');

router.use(verifyToken);

router.get('/', controllerUnitKerja.index);
router.get('/:id', controllerUnitKerja.show);
router.post('/', controllerUnitKerja.store);
router.put('/:id', controllerUnitKerja.update);
router.delete('/:id', controllerUnitKerja.destroy);

module.exports = router;
