const express = require('express');
const router = express.Router();
const alaController = require('../../controllers/ala/2a1_ala_controller');
const { verifyToken, authorize } = require('../../middlewares/auth');

router.use(verifyToken, authorize('ALA', 'ADMIN'));

// Ambil data mahasiswa aktif (IKU: RESTful API)
router.get('/:id_prodi', alaController.getData);

// Simpan atau Update data mahasiswa aktif
router.post('/store', alaController.store);

// Export Excel Presisi (Sinkron dengan data PMB)
router.get('/export/:id_prodi', alaController.exportExcel);

// --- FITUR MANAJEMEN DATA (IKU: Integritas Data) ---

// Soft Delete (Pindahkan ke sampah ALA)
router.post('/delete', alaController.softDelete);

// Ambil data yang ada di tempat sampah ALA
router.get('/trash/:id_prodi', alaController.getTrash);

// Restore data dari sampah ALA
router.post('/restore/:id_2a1', alaController.restore);

module.exports = router;