const express = require('express');
const router = express.Router();
const pmbController = require('../../controllers/pmb/2a1_pmb_controller');
const { verifyToken, authorize } = require('../../middlewares/auth');

router.use(verifyToken, authorize('PMB', 'ADMIN'));

// Ambil data aktif (IKU: RESTful API)
router.get('/:id_prodi', pmbController.getData);

// Simpan atau Update data (Upsert Logic)
router.post('/store', pmbController.store);

// Export Excel Presisi (Goals Utama)
router.get('/export/:id_prodi', pmbController.exportExcel);

// --- FITUR MANAJEMEN DATA (IKU: Integritas Data) ---

// Soft Delete (Pindahkan ke sampah PMB)
router.post('/delete', pmbController.softDelete);

// Ambil data yang ada di tempat sampah
router.get('/trash/:id_prodi', pmbController.getTrash);

// Restore data dari sampah
router.post('/restore/:id_2a1', pmbController.restore);

// Hard Delete (Hapus Permanen dengan pengecekan ALA)
router.post('/hard-delete/:id_2a1', pmbController.hardDelete);

// Force Delete (Hapus Paksa meski ALA masih aktif)
router.post('/force-delete/:id_2a1', pmbController.forceDelete);

module.exports = router;