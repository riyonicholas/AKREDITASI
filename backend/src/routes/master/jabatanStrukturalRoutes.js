const express = require('express');
const router = express.Router();
const JabatanStruktural = require('../../models/master/jabatan_struktural');
const { verifyToken } = require('../../middlewares/auth');

router.get('/', verifyToken, async (req, res) => {
    try {
        const data = await JabatanStruktural.getAll();
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
