const TahunAkademik = require('../../models/master/tahunAkademik');

const tahunAkademikController = {
    // READ: Ambil semua data tahun akademik
    index: async (req, res) => {
        try {
            const data = await TahunAkademik.getAll();
            res.status(200).json({
                success: true,
                message: "Data Tahun Akademik Berhasil Diambil",
                data: data
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Terjadi kesalahan server saat mengambil data Tahun Akademik" });
        }
    }
};

module.exports = tahunAkademikController;
