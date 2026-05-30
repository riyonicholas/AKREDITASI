const express = require('express');
const router = express.Router();
const controller5_2 = require('../../controllers/sarpras/5_2_sarana_prasarana');
const { verifyToken, authorize } = require('../../middlewares/auth');

router.use(verifyToken, authorize('SARPRAS', 'ADMIN'));

router.get('/', controller5_2.index);
router.get('/trash', controller5_2.trash);
router.post('/', controller5_2.store);
router.put('/:id', controller5_2.update);
router.delete('/:id', controller5_2.destroy);
router.post('/restore/:id', controller5_2.restore);
router.delete('/hard/:id', controller5_2.hardDestroy);
router.get('/export', controller5_2.exportExcel);

module.exports = router;