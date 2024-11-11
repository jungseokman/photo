const express = require("express");
const router = express.Router();
const db = require("../db/db");

// 결제 상태 업데이트
router.post("/update", async (req, res) => {
  const { ordernum } = req.body;

  if (!ordernum) {
    return res.status(400).json({ error: "Invalid parameters" });
  }

  const query = `UPDATE m_print_asset SET pa_payment='Y' WHERE pa_ordernum = ? AND pa_payment <> 'Y' AND pa_status='W'`;

  try {
    // 데이터베이스 업데이트
    const connection = db.getConnection();
    const [result] = await connection.query(query, [ordernum]);
    res.json({ success: true, result });
  } catch (err) {
    console.error("Error updating payment status:", err);
    res.status(500).json({ error: "Failed to update payment status" });
  }
});

module.exports = router;
