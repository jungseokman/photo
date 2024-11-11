import { Image, Text, Wrapper } from "@/components/commomComponents";
import Theme from "@/components/Theme";
import { PHOTO_UPLOAD_REQUEST } from "@/reducers/photo";
import { Upload } from "antd";
import ImgCrop from "antd-img-crop";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSwipeable } from "react-swipeable";
import styled from "styled-components";

const MobileWrapper = styled(Wrapper)`
  max-width: 370px;
  height: 100vh;
  border-left: 1px solid ${Theme.adminLightGrey_C};
  border-right: 1px solid ${Theme.adminLightGrey_C};
  justify-content: start;
  padding: 0 15px;
`;

const StyledUpload = styled(Upload)`
  width: 100% !important;
  .ant-upload {
    width: 100% !important;
  }
`;

const PhotoWrapper = styled(Wrapper)`
  position: relative;
  overflow: hidden;
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  transition: transform 0.3s;
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  width: 100px;
  height: 100%;
  background-color: red;
  color: white;
  border: none;
  cursor: pointer;
  opacity: ${(props) => (props.visible ? 1 : 0)};
  transition: opacity 0.3s;
`;

// PhotoItem 컴포넌트
const PhotoItem = ({ data, index, onDelete }) => {
  const [translateX, setTranslateX] = useState(0);
  const [showDeleteButton, setShowDeleteButton] = useState(false);

  const handlers = useSwipeable({
    onSwiping: (eventData) => {
      const { deltaX } = eventData;
      if (deltaX < 0) {
        // 왼쪽으로 드래그, 최대 100px 이동
        setTranslateX(Math.max(deltaX, -100));
      } else if (deltaX > 0 && translateX < 0) {
        // 오른쪽으로 드래그, 원래 위치로 복귀
        setTranslateX(Math.min(0, translateX + deltaX));
      }
    },
    onSwiped: () => {
      if (translateX <= -100) {
        // 왼쪽으로 100px 이상 이동 시 삭제 버튼 표시
        setTranslateX(-100);
        setShowDeleteButton(true);
      } else {
        // 원래 위치로 복귀
        setTranslateX(0);
        setShowDeleteButton(false);
      }
    },
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  return (
    <PhotoWrapper {...handlers} style={{ touchAction: "none" }}>
      <ImageContainer style={{ transform: `translateX(${translateX}px)` }}>
        <Image
          src={`http://localhost:4000/uploads/${data.imageName}`}
          alt="Preview"
          style={{ width: "100%" }}
        />
      </ImageContainer>
      <DeleteButton visible={showDeleteButton} onClick={() => onDelete(index)}>
        삭제
      </DeleteButton>
    </PhotoWrapper>
  );
};

const Main = () => {
  const { photos } = useSelector((state) => state.photo);
  const dispatch = useDispatch();

  const onChange = ({ file }) => {
    if (file.status === "done" && file.originFileObj) {
      const formData = new FormData();
      formData.append("file", file.originFileObj);

      dispatch({
        type: PHOTO_UPLOAD_REQUEST,
        data: formData,
      });
    }
  };

  const handleDelete = (index) => {
    dispatch({
      type: "PHOTO_DELETE", // 삭제를 위한 액션 타입 (정의 필요)
      index,
    });
  };

  return (
    <Wrapper>
      <MobileWrapper>
        <Wrapper margin="20px 0" dr="row" fontSize="18px">
          <Text color={Theme.naver_C} fontWeight="700">
            위루트 파이낸셜
          </Text>
          <Text fontWeight="500"> - 사진 인쇄</Text>
        </Wrapper>
        <ImgCrop rotationSlider aspect={3 / 2}>
          <StyledUpload
            listType="picture-card"
            onChange={onChange}
            showUploadList={false}
          >
            + 사진 업로드
          </StyledUpload>
        </ImgCrop>
        {photos.length > 0 &&
          photos.map((data, index) => (
            <PhotoItem
              key={index}
              data={data}
              index={index}
              onDelete={handleDelete}
            />
          ))}
      </MobileWrapper>
    </Wrapper>
  );
};

export default Main;
