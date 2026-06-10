const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// ... (import tetap sama)

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // 1. Gunakan .execute untuk keamanan dan performa lebih baik
        const query = `
            SELECT u.id_user, u.id_unit, u.username, u.password, uk.nama_unit 
            FROM users u 
            JOIN unit_kerja uk ON u.id_unit = uk.id_unit 
            WHERE u.username = ?
        `;
        
        const [rows] = await db.execute(query, [username]);

        if (rows.length === 0) {
            return res.status(401).json({ success: false, message: 'Username tidak ditemukan' });
        }

        const user = rows[0];

        // 2. Cek Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Password salah' });
        }

        // 3. Buat Token JWT
        const token = jwt.sign(
            { 
                id_user: user.id_user, 
                username: user.username, 
                id_unit: user.id_unit,
                nama_unit: user.nama_unit 
            },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        // Kirim respons tanpa menyertakan password sama sekali
        res.json({
            success: true,
            message: 'Login Berhasil',
            token,
            user: {
                username: user.username,
                unit: user.nama_unit,
                id_unit: user.id_unit // Untuk membantu routing di Frontend Next.js
            }
        });

    } catch (error) {
        // IKU: Error Handling informatif
        console.error("Auth Error:", error.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
const changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id_user;

    try {
        const [rows] = await db.execute('SELECT password FROM users WHERE id_user = ?', [userId]);
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
        }

        const user = rows[0];
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Password saat ini salah' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await db.execute('UPDATE users SET password = ? WHERE id_user = ?', [hashedPassword, userId]);

        res.json({ success: true, message: 'Password berhasil diubah' });
    } catch (error) {
        console.error("Change Password Error:", error.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

module.exports = { login, changePassword };