const express = require('express');
const router = express.Router();
const UnitKerja = require('../../models/master/unit_kerja');
const { verifyToken } = require('../../middlewares/auth');

router.get('/', verifyToken, async (req, res) => {
    try {
        const data = await UnitKerja.getAll();
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
