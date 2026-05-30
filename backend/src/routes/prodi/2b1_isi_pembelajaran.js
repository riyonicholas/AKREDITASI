const express = require('express');
const router = express.Router();
const isiPembelajaran2B1Controller = require('../../controllers/prodi/2b1_isi_pembelajaran');

const { verifyToken, authorize } = require('../../middlewares/auth');
const { UNITS } = require('../../config/permissions');

router.use(verifyToken, authorize(UNITS.PRODI, UNITS.ADMIN));

router.get('/', isiPembelajaran2B1Controller.index);
router.get('/:id', isiPembelajaran2B1Controller.show);
router.post('/', isiPembelajaran2B1Controller.store);
router.put('/:id', isiPembelajaran2B1Controller.update);
router.delete('/:id', isiPembelajaran2B1Controller.destroy);

module.exports = router;
