const express = require('express');
const router = express.Router();
const controller1a3 = require('../../controllers/keuangan/1a3_penggunaan_dana');
const { verifyToken, authorize } = require('../../middlewares/auth');
const { UNITS } = require('../../config/permissions');

// Keamanan: Keuangan, Admin, dan Waket 2
router.use(verifyToken, authorize(UNITS.KEUANGAN, UNITS.ADMIN, UNITS.WAKET_2));

router.get('/', controller1a3.index);
router.post('/', controller1a3.store);
router.put('/:id', controller1a3.update);
router.delete('/:id', controller1a3.destroy);

router.get('/trash', controller1a3.trash);
router.post('/restore/:id', controller1a3.restore);
router.delete('/hard/:id', controller1a3.hardDestroy);

router.get('/export', controller1a3.exportExcel);

module.exports = router;