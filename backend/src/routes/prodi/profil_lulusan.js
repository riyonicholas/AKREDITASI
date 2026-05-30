const express = require('express');
const router = express.Router();
const profilLulusanController = require('../../controllers/prodi/profil_lulusan');

const { verifyToken, authorize } = require('../../middlewares/auth');
const { UNITS } = require('../../config/permissions');

router.use(verifyToken, authorize(UNITS.PRODI, UNITS.ADMIN));

router.get('/', profilLulusanController.index);
router.get('/:id', profilLulusanController.show);
router.post('/', profilLulusanController.store);
router.put('/:id', profilLulusanController.update);
router.delete('/:id', profilLulusanController.destroy);

module.exports = router;
