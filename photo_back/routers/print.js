const express = require("express");
const router = express.Router();
const db = require("../db/db");

// 인쇄 서비스와 프린터 정보를 조회
router.get("/info", async (req, res) => {
  try {
    const connection = db.getConnection();
    if (!connection) {
      return res.status(500).json({ error: "Database not connected" });
    }

    const [plist] = await connection.query(
      "SELECT * FROM m_print_svr a LEFT JOIN m_print_printer b ON a.ps_svrcd=b.psp_pssvrcd WHERE a.ps_no=1"
    );
    const [cpinfo] = await connection.query(
      "SELECT * FROM m_company WHERE cp_no=1"
    );
    res.json({ plist, cpinfo });
  } catch (err) {
    console.error("Error retrieving print info:", err);
    res.status(500).json({ error: "Failed to retrieve print info" });
  }
});

module.exports = router;
