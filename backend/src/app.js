const express = require('express');
const cors = require('cors');
require('dotenv').config();

// 1. Import Routes (IKU: Pengembangan RESTful API)
const authRoutes = require('./routes/authRoutes');

// Import Routes Master
const pegawaiRoutes = require('./routes/master/pegawaiRoutes');
const dosenRoutes = require('./routes/master/dosenRoutes');
const tendikRoutes = require('./routes/master/tendikRoutes');
const userRoutes = require('./routes/master/userRoutes');
const prodiRoutes = require('./routes/master/prodiRoutes');
const tahunAkademikRoutes = require('./routes/master/tahunAkademikRoutes');
const mataKuliahRoutes = require('./routes/prodi/mata_kuliah');
const profilLulusanRoutes = require('./routes/prodi/profil_lulusan');
const cplRoutes = require('./routes/prodi/cpl');
const cpmkRoutes = require('./routes/prodi/cpmk');
const unitKerjaRoutes = require('./routes/master/unitKerjaRoutes');
const jabatanStrukturalRoutes = require('./routes/master/jabatanStrukturalRoutes');

// Import Routes Upps
const route1a1 = require('./routes/upps/1a1_pimpinan_dan_tupoksi');
const route1a4 = require('./routes/upps/1a4_beban_dtpr');
const route3a3 = require('./routes/upps/3a3_pengembangan_dtpr');
const route6 = require('./routes/upps/6_visi_misi');

// import Routes Tpm
const route1b = require('./routes/tpm/1b_unit_spmi');
const app = express();

//import Routes Keuangan
const route1a2 = require('./routes/keuangan/1a2_sumber_pendanaan');
const route1a3 = require('./routes/keuangan/1a3_penggunaan_dana');

//import Routes Kepegawaian
const route1a5 = require('./routes/kepegawaian/1a5_tendik');

//import Routes Sarpras
const route3a1 = require('./routes/sarpras/3a1_sarana_prasarana');
const route4a1 = require('./routes/sarpras/4a1_sarana_prasarana');
const route5_2 = require('./routes/sarpras/5_2_sarana_prasarana');

//import Routes Sisfo
const route5_1 = require('./routes/sisfo/5_1_sistem_tata_kelola');

//import Routes Kemahasiswaan
const route2b4 = require('./routes/kemahasiswaan/2b4_masa_tunggu');
const route2b5 = require('./routes/kemahasiswaan/2b5_kesesuaian_kerja');
const route2b6 = require('./routes/kemahasiswaan/2b6_kepuasan');
const route2d = require('./routes/kemahasiswaan/2d_rekognisi');

// Import Routes Prodi
const route2b1 = require('./routes/prodi/2b1_isi_pembelajaran');
const route2b2 = require('./routes/prodi/2b2_pemetaan_cpl_pl');
const route2b3 = require('./routes/prodi/2b3_peta_pemenuhan_cpl');
const route2c = require('./routes/prodi/2c_fleksibilitas_pembelajaran');

// Import Routes LPPM
const lppmRoadmap = require('./routes/lppm/roadmap_lppm');
const lppmPenelitian = require('./routes/lppm/3a2_penelitian_dtpr');
const lppmKerjasama = require('./routes/lppm/3c1_kerjasama_penelitian');
const lppmPublikasi = require('./routes/lppm/3c2_publikasi_penelitian');
const lppmHki = require('./routes/lppm/3c3_perolehan_hki');

const lppmPkm = require('./routes/lppm/4a2_pkm_dtpr');
const lppmKerjasamaPkm = require('./routes/lppm/4c1_kerjasama_pkm');
const lppmPublikasiPkm = require('./routes/lppm/4c2_publikasi_pkm');
const lppmHkiPkm = require('./routes/lppm/4c3_perolehan_hki_pkm');

// Import Routes PMB (Kriteria 2.A.1 & 2.A.2)
const route2a1_pmb = require('./routes/pmb/2a1_data_mahasiswa');
const route2a2_pmb = require('./routes/pmb/2a2_keragaman_asal_maba');

// Import Routes ALA (Kriteria 2.A.1)
const route2a1_ala = require('./routes/ala/2a1_data_mahasiswa');

// 2. Middleware Global
app.use(cors({
    exposedHeaders: ['Content-Disposition']
}));
app.use(express.json());

// 3. Definisi Route Utama
app.use('/api/auth', authRoutes);

// Master Routes
app.use('/api/master/pegawai', pegawaiRoutes);
app.use('/api/master/dosen', dosenRoutes);
app.use('/api/master/tendik', tendikRoutes);
app.use('/api/master/users', userRoutes);
app.use('/api/master/prodi', prodiRoutes);
app.use('/api/master/tahun-akademik', tahunAkademikRoutes);
app.use('/api/master/mata-kuliah', mataKuliahRoutes);
app.use('/api/master/profil-lulusan', profilLulusanRoutes);
app.use('/api/master/cpl', cplRoutes);
app.use('/api/master/cpmk', cpmkRoutes);
app.use('/api/master/unit-kerja', unitKerjaRoutes);
app.use('/api/master/jabatan-struktural', jabatanStrukturalRoutes);

// Routes Upps
app.use('/api/upps/1a1-pimpinan', route1a1);
app.use('/api/upps/1a4-beban', route1a4);
app.use('/api/upps/3a3-pengembangan', route3a3);
app.use('/api/upps/6-visi-misi', route6);

// Routes Tpm
app.use('/api/tpm/1b-spmi', route1b);

// Routes Keuangan
app.use('/api/keuangan/1a2-sumber-pendanaan', route1a2);
app.use('/api/keuangan/1a3-penggunaan-dana', route1a3);

// Routes Kepegawaian
app.use('/api/kepegawaian/1a5-tendik', route1a5);

// Routes Sarpras
app.use('/api/sarpras/3a1-sarana-prasarana', route3a1);
app.use('/api/sarpras/4a1-sarana-prasarana-pkm', route4a1);
app.use('/api/sarpras/5-2-sarana-prasarana', route5_2);

// Routes Sisfo
app.use('/api/sisfo/5-1-sistem-tata-kelola', route5_1);

// Routes Kemahasiswaan
app.use('/api/kemahasiswaan/2b4-masa-tunggu', route2b4);
app.use('/api/kemahasiswaan/2b5-kesesuaian-kerja', route2b5);
app.use('/api/kemahasiswaan/2b6-kepuasan', route2b6);
app.use('/api/kemahasiswaan/2d-rekognisi', route2d);

// Routes Prodi
app.use('/api/prodi/2b1-isi-pembelajaran', route2b1);
app.use('/api/prodi/2b2-pemetaan-cpl', route2b2);
app.use('/api/prodi/2b3-peta-pemenuhan', route2b3);
app.use('/api/prodi/2c-fleksibilitas', route2c);

// Routes PMB (Tabel 2.A.1 & 2.A.2)
app.use('/api/pmb/2a1-data-mahasiswa', route2a1_pmb);
app.use('/api/pmb/2a2-keragaman-asal', route2a2_pmb);

// Routes ALA (Tabel 2.A.1)
app.use('/api/ala/2a1-data-mahasiswa', route2a1_ala);

// Routes LPPM
app.use('/api/lppm/roadmap-lppm', lppmRoadmap);
app.use('/api/lppm/3a2-penelitian-dtpr', lppmPenelitian);
app.use('/api/lppm/3c1-kerjasama-penelitian', lppmKerjasama);
app.use('/api/lppm/3c2-publikasi-penelitian', lppmPublikasi);
app.use('/api/lppm/3c3-perolehan-hki', lppmHki);

app.use('/api/lppm/4a2-pkm-dtpr', lppmPkm);
app.use('/api/lppm/4c1-kerjasama-pkm', lppmKerjasamaPkm);
app.use('/api/lppm/4c2-publikasi-pkm', lppmPublikasiPkm);
app.use('/api/lppm/4c3-perolehan-hki-pkm', lppmHkiPkm);

// 4. Root Endpoint (Checking Status)
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'API Sistem Akreditasi STIKOM PGRI Banyuwangi - Online',
        version: '2.1 (LAM INFOKOM)'
    });
});

// 5. Global Error Handling (IKU: Error Handling yang Informatif)
app.use((err, req, res, next) => {
    console.error(`[Error]: ${err.message}`);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Terjadi kesalahan internal pada server.'
    });
});

// 6. Menjalankan Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server berjalan di port ${PORT}`);
    console.log(`✅ Auth: http://localhost:${PORT}/api/auth/login`);
});