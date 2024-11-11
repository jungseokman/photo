import { useEffect, useState } from "react";

const useWidth = () => {
  const [width, setWidth] = useState(0); // 초기값은 0으로 설정

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);

    if (typeof window !== "undefined") {
      // 클라이언트에서만 실행되도록 체크
      setWidth(window.innerWidth); // 처음에 화면 너비 설정
      window.addEventListener("resize", handleResize);

      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  return width;
};

export default useWidth;
