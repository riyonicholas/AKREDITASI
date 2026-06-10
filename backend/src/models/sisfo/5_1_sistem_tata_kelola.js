const db = require('../../config/db');

const Model51 = {
    getAll: async () => {
        const sql = `
            SELECT * 
            FROM \`5_1_sistem_tata_kelola\`
            WHERE deleted_at IS NULL
            ORDER BY id_5_1 DESC
        `;
        const [rows] = await db.execute(sql);
        return rows;
    },

    findById: async (id) => {
        const sql = `SELECT * FROM \`5_1_sistem_tata_kelola\` WHERE id_5_1 = ? AND deleted_at IS NULL`;
        const [rows] = await db.execute(sql, [id]);
        return rows[0];
    },

    findTrash: async () => {
        const sql = `SELECT * FROM \`5_1_sistem_tata_kelola\` WHERE deleted_at IS NOT NULL`;
        const [rows] = await db.execute(sql);
        return rows;
    },

    create: async (data) => {
        const sql = `INSERT INTO \`5_1_sistem_tata_kelola\` (jenis_tata_kelola, nama_sistem, akses, unit_pengelola, link_bukti, created_by) VALUES (?, ?, ?, ?, ?, ?)`;
        return await db.execute(sql, [data.jenis_tata_kelola, data.nama_sistem, data.akses, data.unit_pengelola || null, data.link_bukti, data.created_by]);
    },

    update: async (id, data) => {
        const sql = `UPDATE \`5_1_sistem_tata_kelola\` SET jenis_tata_kelola = ?, nama_sistem = ?, akses = ?, unit_pengelola = ?, link_bukti = ?, updated_by = ? WHERE id_5_1 = ?`;
        return await db.execute(sql, [data.jenis_tata_kelola, data.nama_sistem, data.akses, data.unit_pengelola || null, data.link_bukti, data.updated_by, id]);
    },

    softDelete: async (id, deleted_by) => {
        const sql = "UPDATE \`5_1_sistem_tata_kelola\` SET deleted_at = CURRENT_TIMESTAMP, deleted_by = ? WHERE id_5_1 = ?";
        return await db.execute(sql, [deleted_by, id]);
    },

    restore: async (id) => {
        const sql = "UPDATE \`5_1_sistem_tata_kelola\` SET deleted_at = NULL, deleted_by = NULL WHERE id_5_1 = ?";
        return await db.execute(sql, [id]);
    },

    hardDelete: async (id) => {
        const sql = "DELETE FROM \`5_1_sistem_tata_kelola\` WHERE id_5_1 = ?";
        return await db.execute(sql, [id]);
    }
};

module.exports = Model51;
