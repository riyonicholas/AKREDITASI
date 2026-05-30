const express = require('express');
const router = express.Router();
const userController = require('../../controllers/master/userController');
const { verifyToken, authorize } = require('../../middlewares/auth');
const { UNITS } = require('../../config/permissions');

/**
 * ROUTES: Tabel Master User (Pengguna)
 */

router.use(verifyToken, authorize(UNITS.ADMIN));

// Get All Data
router.get('/', userController.index);

// Get Data by ID
router.get('/:id', userController.show);

// Create Data
router.post('/', userController.store);

// Update Data
router.put('/:id', userController.update);

// Delete Data
router.delete('/:id', userController.destroy);

module.exports = router;
