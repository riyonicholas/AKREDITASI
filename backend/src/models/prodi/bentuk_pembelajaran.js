const db = require('../../config/db');

const ModelBentuk = {
    findAll: async () => {
        const [rows] = await db.execute("SELECT * FROM `master_bentuk_pembelajaran` ORDER BY id_bentuk ASC");
        return rows;
    },

    findById: async (id) => {
        const [rows] = await db.execute("SELECT * FROM `master_bentuk_pembelajaran` WHERE id_bentuk = ?", [id]);
        return rows[0];
    },

    create: async (data) => {
        return await db.execute("INSERT INTO `master_bentuk_pembelajaran` (nama_bentuk, keterangan) VALUES (?, ?)", 
        [data.nama_bentuk, data.keterangan]);
    },

    update: async (id, data) => {
        return await db.execute("UPDATE `master_bentuk_pembelajaran` SET nama_bentuk = ?, keterangan = ? WHERE id_bentuk = ?", 
        [data.nama_bentuk, data.keterangan, id]);
    },

    hardDelete: async (id) => {
        return await db.execute("DELETE FROM `master_bentuk_pembelajaran` WHERE id_bentuk = ?", [id]);
    }
};

module.exports = ModelBentuk;
