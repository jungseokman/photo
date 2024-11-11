import axios from "axios";
import { useState } from "react";

const TestPage = () => {
  const [info, setInfo] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);

  // 1. Print Info 조회
  const fetchPrintInfo = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/print/info");
      setInfo(response.data);
    } catch (error) {
      console.error("Error fetching print info:", error);
    }
  };

  // 2. 다중 이미지 파일 선택 및 업로드
  const handleFileChange = (e) => {
    setSelectedFiles(e.target.files);
  };

  const uploadImages = async () => {
    const formData = new FormData();
    Array.from(selectedFiles).forEach((file) => {
      formData.append("images", file);
    });

    try {
      const response = await axios.post(
        "http://localhost:4000/api/upload/upload-images",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: false, // 쿠키 전송을 위해 추가
        }
      );
      setUploadStatus(response.data);
    } catch (error) {
      console.error("Error uploading images:", error);
    }
  };

  // 3. 결제 상태 업데이트
  const updatePaymentStatus = async () => {
    try {
      const response = await axios.post(
        "http://localhost:4000/api/payment/update",
        {
          pano: 147, // 실제 pa_no 값
          ordernums: "a42a6c18-02d0-4fe5-a2f3-b5bce4041591", // 실제 pa_ordernum 값
        },
        { withCredentials: false }
      );
      setPaymentStatus(response.data);
    } catch (error) {
      console.error("Error updating payment status:", error);
    }
  };

  return (
    <div>
      <h1>Print Service API Test</h1>

      {/* 1. Print Info 조회 */}
      <button onClick={fetchPrintInfo}>1. Fetch Print Info</button>
      {info && <pre>{JSON.stringify(info, null, 2)}</pre>}

      {/* 2. 파일 선택 및 업로드 */}
      <input type="file" multiple onChange={handleFileChange} />
      <button onClick={uploadImages}>2. Upload Images</button>
      {uploadStatus && <pre>{JSON.stringify(uploadStatus, null, 2)}</pre>}

      {/* 3. 결제 상태 업데이트 */}
      <button onClick={updatePaymentStatus}>3. Update Payment Status</button>
      {paymentStatus && <pre>{JSON.stringify(paymentStatus, null, 2)}</pre>}
    </div>
  );
};

export default TestPage;
