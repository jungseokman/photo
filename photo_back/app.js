// app.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");
const hpp = require("hpp");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const path = require("path");

const { initializeDB } = require("./db/db");
const printRouter = require("./routers/print");
const paymentRouter = require("./routers/payment");
const uploadRouter = require("./routers/upload");

dotenv.config();

async function main() {
  await initializeDB(); // 연결 초기화

  const app = express();
  const PORT = process.env.NODE_ENV === "production" ? process.env.PORT : 4000;

  if (process.env.NODE_ENV === "production") {
    app.set("trust proxy", 1);
    app.use(morgan(`combined`));
    app.use(hpp());
    app.use(helmet());
    app.use(
      cors({
        origin: [process.env.DEPLOY_DOMAIN, "http://localhost:3000", "*"],
        credentials: false,
      })
    );
  } else {
    app.set("trust proxy", 1);
    app.use(morgan(`dev`));
    app.use(
      cors({
        origin: "*",
        allowedHeaders: "X-Requested-With,content-type",
        credentials: false,
      })
    );
  }

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  //   // 쿠키 설정 경로 예시
  //   app.get("/set-cookie", (req, res) => {
  //     const cookieValue = "user_unique_id"; // 예시 값 (사용자 ID 등 고유값으로 설정)
  //     res.cookie("AuthShopCOOKIEID", cookieValue, {
  //       maxAge: 24 * 60 * 60 * 1000, // 1일 동안 유지
  //       httpOnly: true, // 클라이언트 JS로 접근 불가
  //       secure: process.env.NODE_ENV === "production", // HTTPS에서만 전송
  //     });
  //     res.send("AuthShopCOOKIEID 쿠키가 설정되었습니다!");
  //   });

  app.use("/api/print", printRouter);
  app.use("/api/payment", paymentRouter);
  app.use("/api/upload", uploadRouter);
  app.use("/uploads", express.static(path.join(__dirname, "./uploads")));

  app.get("/", (req, res) => {
    res.send("🍀 WEB SERVER WITH EXPRESS FRAMEWORK");
  });

  app.listen(PORT, () => {
    console.log(`🍀 ${PORT} NODE WEB_SERVER EXPRESS STARTING!`);
  });
}

main();
