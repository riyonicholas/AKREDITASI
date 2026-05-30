const express = require('express');
const router = express.Router();
const controller1a5 = require('../../controllers/kepegawaian/1a5_tendik');
const { verifyToken, authorize } = require('../../middlewares/auth');

router.use(verifyToken, authorize('SARPRAS', 'ADMIN'));

router.get('/', controller1a5.index);
router.get('/export', controller1a5.exportExcel);


module.exports = router;