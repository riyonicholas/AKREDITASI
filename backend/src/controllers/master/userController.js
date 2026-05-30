const User = require('../../models/master/user');
const bcrypt = require('bcrypt');

/**
 * Tabel Master: Users (Akun)
 * Controller untuk mengelola data akun pengguna.
 */

// 1. Get All Data
exports.index = async (req, res) => {
    try {
        const data = await User.getAll();
        res.json({
            success: true,
            message: 'Berhasil mengambil data users.',
            data: data
        });
    } catch (error) {
        console.error('[Error GET Users]', error);
        res.status(500).json({ success: false, message: 'Gagal mengambil data users.', error: error.message });
    }
};

// 2. Get Data by ID
exports.show = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await User.getById(id);

        if (!data) {
            return res.status(404).json({ success: false, message: 'Data user tidak ditemukan.' });
        }

        res.json({
            success: true,
            message: 'Berhasil mengambil detail data user.',
            data: data
        });
    } catch (error) {
        console.error('[Error GET User By ID]', error);
        res.status(500).json({ success: false, message: 'Gagal mengambil data user.', error: error.message });
    }
};

// 3. Create Data
exports.store = async (req, res) => {
    try {
        const { id_unit, username, password } = req.body;

        if (!id_unit || !username || !password) {
            return res.status(400).json({ success: false, message: 'id_unit, username, dan password wajib diisi.' });
        }

        // Enkripsi kata sandi
        const hashedPassword = await bcrypt.hash(password, 10);

        const insertId = await User.create({
            id_unit, 
            username, 
            password: hashedPassword
        });

        res.status(201).json({
            success: true,
            message: 'Data user berhasil ditambahkan.',
            data: { id_user: insertId, id_unit, username }
        });
    } catch (error) {
        console.error('[Error POST User]', error);
        res.status(500).json({ success: false, message: 'Gagal menambahkan data user (Username mungkin sudah ada).', error: error.message });
    }
};

// 4. Update Data
exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { id_unit, username, password } = req.body;

        if (!id_unit || !username) {
            return res.status(400).json({ success: false, message: 'id_unit dan username wajib diisi.' });
        }

        const checkData = await User.getById(id);
        if (!checkData) {
            return res.status(404).json({ success: false, message: 'Data user tidak ditemukan.' });
        }

        const updateData = { id_unit, username };

        // Hanya enkripsi dan masukkan password bila admin ingin menggantinya
        if (password && password.trim() !== '') {
            updateData.password = await bcrypt.hash(password, 10);
        }

        await User.update(id, updateData);

        res.json({ success: true, message: 'Data user berhasil diperbarui.' });
    } catch (error) {
        console.error('[Error PUT User]', error);
        res.status(500).json({ success: false, message: 'Gagal memperbarui data user.', error: error.message });
    }
};

// 5. Delete Data
exports.destroy = async (req, res) => {
    try {
        const { id } = req.params;
        
        const checkData = await User.getById(id);
        if (!checkData) return res.status(404).json({ success: false, message: 'Data user tidak ditemukan.' });

        await User.hardDelete(id);

        res.json({ success: true, message: 'Data user berhasil dihapus.' });
    } catch (error) {
        console.error('[Error DELETE User]', error);
        res.status(500).json({ success: false, message: 'Gagal menghapus data user.', error: error.message });
    }
};
