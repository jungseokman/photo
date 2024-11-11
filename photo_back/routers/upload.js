const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const db = require("../db/db");
const { v4: uuidv4 } = require("uuid");

// multer 설정 (파일 업로드용)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // 한글 파일 이름 처리: UUID를 사용하여 파일 이름 생성
    const uniqueName = `${Date.now()}-${uuidv4()}${path.extname(
      file.originalname
    )}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage: storage });

// Base64 또는 파일 형식의 이미지 처리 및 DB 저장
router.post("/upload-image", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const imageName = file.filename;
    const orderNum = uuidv4();
    const query = `INSERT INTO m_print_asset (pa_ordernum, pa_file, pa_shopid, pa_printerid, pa_payment, pa_status, pa_groupid, pa_regdt, pa_price, pa_ea, pa_total_price)
                   VALUES (?, ?, 'obesis', 'obprnt01', 'N', 'W', ?, NOW(), 1000, 1, 1000)`;
    const params = [orderNum, imageName, req.cookies.AuthShopCOOKIEID];

    const connection = db.getConnection();
    await connection.query(query, params);

    // 이미지 이름과 orderNum을 반환
    res.json({ orderNum, imageName });
  } catch (err) {
    res.status(500).json({ error: "Failed to save upload data" });
  }
});

// 다중 파일 업로드 처리
router.post("/upload-images", upload.array("images", 10), async (req, res) => {
  console.log("Uploaded files:", req.files); // 로그 추가
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "No files uploaded" });
  }

  try {
    const orderNum = uuidv4();

    // 파일 데이터가 없으면 에러 반환
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const files = req.files.map((file) => ({
      pa_ordernum: orderNum,
      pa_file: file.filename,
      pa_shopid: "d83add6a720a",
      pa_printerid: "EPSON-L8050-Series",
      pa_payment: "N",
      pa_status: "W",
      pa_groupid: req.cookies.AuthShopCOOKIEID,
      pa_price: 1000,
      pa_ea: 1,
      pa_total_price: 1000,
    }));

    const query = `INSERT INTO m_print_asset (pa_ordernum, pa_file, pa_shopid, pa_printerid, pa_payment, pa_status, pa_groupid, pa_regdt, pa_price, pa_ea, pa_total_price)
                   VALUES ?`;
    const values = files.map((file) => [
      file.pa_ordernum,
      file.pa_file,
      file.pa_shopid,
      file.pa_printerid,
      file.pa_payment,
      file.pa_status,
      file.pa_groupid,
      new Date(),
      file.pa_price,
      file.pa_ea,
      file.pa_total_price,
    ]);

    // values 배열이 비어 있으면 에러 반환
    if (values.length === 0) {
      return res.status(400).json({ error: "No values to insert" });
    }

    const connection = db.getConnection();
    await connection.query(query, [values]);
    res.json({ orderNum, files });
  } catch (err) {
    console.error("Error in uploading images:", err);
    res.status(500).json({ error: "Failed to upload images" });
  }
});

module.exports = router;
