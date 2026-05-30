const express = require('express');
const router = express.Router();
const controllerBentuk = require('../../controllers/prodi/bentuk_pembelajaran');
const { verifyToken, authorize } = require('../../middlewares/auth');

router.use(verifyToken, authorize('PRODI', 'ADMIN')); // Prodi & Admin boleh mengisi

router.get('/', controllerBentuk.index);
router.get('/:id', controllerBentuk.show);
router.post('/', controllerBentuk.store);
router.put('/:id', controllerBentuk.update);
router.delete('/:id', controllerBentuk.destroy);

module.exports = router;
