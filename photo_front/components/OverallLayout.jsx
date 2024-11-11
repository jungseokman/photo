import {
  ApartmentOutlined,
  BellOutlined,
  DollarOutlined,
  HomeOutlined,
  LogoutOutlined,
  SettingOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Menu, message } from "antd";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";
import { Text, Wrapper } from "./commomComponents";
import Theme from "./Theme";

const items = [
  {
    key: "/overall/home",
    icon: <HomeOutlined />,
    label: "홈",
  },
  {
    key: "/overall/user",
    icon: <UserOutlined />,
    label: "회원 관리",
  },
  {
    key: "/overall/sales",
    icon: <DollarOutlined />,
    label: "매출 관리",
  },
  {
    key: "/overall/spot",
    icon: <ApartmentOutlined />,
    label: "지점 관리",
  },
  {
    key: "/overall/employee",
    icon: <TeamOutlined />,
    label: "직원 관리",
    children: [
      {
        key: "/overall/employee/trainer",
        label: "트레이너 관리",
      },
    ],
  },

  // {
  //   key: "/overall/schedule",
  //   icon: <ScheduleOutlined />,
  //   label: "일정 관리",
  // },
  // {
  //   key: "/overall/1",
  //   icon: <DatabaseOutlined />,
  //   label: "락커 관리",
  // },

  // {
  //   key: "/overall/3",
  //   icon: <FormOutlined />,
  //   label: "방명록 관리",
  // },
  {
    key: "/overall/setting",
    icon: <SettingOutlined />,
    label: "설정",
    children: [
      {
        key: "/overall/setting/tuition",
        label: "수업료 설정",
      },
      {
        key: "/overall/setting/goods",
        label: "상품 설정",
      },
    ],
  },
];

const OverallLayout = ({ content }) => {
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("gym_overall_login");
    if (!isLoggedIn) {
      router.push("/");
      message.info("로그인이 필요합니다.");
    }
  }, []);

  const findSelectedKeys = (items, pathname) => {
    for (let item of items) {
      if (item.key === pathname) {
        return { selectedKey: item.key, openKeys: [] };
      }
      if (item.children) {
        const found = findSelectedKeys(item.children, pathname);
        if (found.selectedKey) {
          return {
            selectedKey: found.selectedKey,
            openKeys: [item.key, ...found.openKeys],
          };
        }
      }
    }
    return { selectedKey: null, openKeys: [] };
  };

  const onMenuClick = (item) => {
    router.push(item.key);
  };

  const { selectedKey, openKeys } = findSelectedKeys(items, router.pathname);

  const logoutHandler = useCallback(() => {
    localStorage.removeItem("gym_overall_login");
    router.push("/");
  }, []);

  return (
    <Wrapper overflow="hidden">
      <Wrapper
        height="30px"
        bgColor={Theme.black2_C}
        dr="row"
        ju="space-between"
      >
        <Text
          color={Theme.white_C}
          fontSize="15px"
          fontWeight="700"
          margin="0 0 0 20px"
        >
          WHITE GYM
        </Text>
        <Wrapper width="auto" dr="row">
          <BellOutlined
            onClick={() => {}}
            style={{
              color: Theme.white_C,
              fontSize: "15px",
              marginRight: "10px",
            }}
          />
          <LogoutOutlined
            onClick={logoutHandler}
            style={{
              color: Theme.white_C,
              fontSize: "15px",
              marginRight: "20px",
            }}
          />
        </Wrapper>
      </Wrapper>
      <Wrapper dr="row" ju="start" height="calc(100vh - 30px)">
        <Menu
          mode="inline"
          theme="dark"
          selectedKeys={[selectedKey]}
          defaultOpenKeys={openKeys}
          items={items}
          onClick={onMenuClick}
          style={{
            width: "170px",
            height: "calc(100vh - 30px)",
          }}
        />
        <Wrapper
          width="calc(100vw - 170px)"
          height="calc(100vh - 30px)"
          ju="start"
          al="start"
          overflowY="auto"
        >
          {content}
        </Wrapper>
      </Wrapper>
    </Wrapper>
  );
};

export default OverallLayout;
