import { useState, useEffect, useContext } from "react";
//&& user.role.includes("Instructor")
import { Menu } from "antd";
import Link from "next/link";
import {
  AppstoreAddOutlined,
  LoginOutlined,
  LogoutOutlined,
  UserAddOutlined,
  UserOutlined,
  CarryOutOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Context } from "../context/";
import axios from "axios";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
const { Item, SubMenu, ItemGroup } = Menu;

const TopNav = () => {
  let [current, setCurrent] = useState("");
  const {
    state: { user },
    dispatch,
  } = useContext(Context);

  const router = useRouter();

  useEffect(() => {
    process.browser && setCurrent(window.location.pathname);
    // console.log(window.location.pathname);
  }, [process.browser && window.location.pathname]);

  const logout = async () => {
    dispatch({ type: "LOGOUT" });
    window.localStorage.removeItem("user");
    const { data } = await axios.get("/api/logout");
    //  toast (data.message);
    toast.success("signout successful");
    router.push("/login");
  };
  return (
    <Menu mode="horizontal" selectedKeys={[current]} className="mb-2">
      <Item
        key="/"
        onClick={(e) => (setCurrent = e.key)}
        icon={<AppstoreAddOutlined />}
      >
        <Link href="/">App</Link>
      </Item>

      {user !== null && user.role.includes("Instructor") ? (
        <Item
          key="/instructor/course/create"
          onClick={(e) => setCurrent(e.key)}
          icon={<CarryOutOutlined />}
        >
          <Link href="/instructor/course/create">Create Course</Link>
        </Item>
      ) : (
        <Item
          key="/user/become-instructor"
          onClick={(e) => setCurrent(e.key)}
          icon={<TeamOutlined />}
        >
          <Link href="/user/become-instructor">Become an Instructor</Link>
        </Item>
      )}

      {user === null && (
        <>
          <Item
            key="/login"
            onClick={(e) => setCurrent(e.key)}
            icon={<LoginOutlined />}
          >
            <Link href="/login">Login</Link>
          </Item>
          <Item
            key="/register"
            onClick={(e) => setCurrent(e.key)}
            icon={<UserAddOutlined />}
          >
            <Link href="/register">Register</Link>
          </Item>
        </>
      )}

      {user !== null && (
        <SubMenu
          icon={<UserOutlined />}
          title={user && user.name}
          style={{ marginLeft: "auto" }}
        >
          <ItemGroup>
            <Item key="/user">
              <Link href="/user">Dashboard</Link>
            </Item>

            <Item
              className="float-end"
              onClick={logout}
              icon={<LogoutOutlined />}
            >
              Logout
            </Item>
          </ItemGroup>
        </SubMenu>
      )}
      {user !== null && user.role.includes("Instructor") && (
        // <span class="float-end"></span>
        <Item
          key="/instructor"
          onClick={(e) => setCurrent(e.key)}
          icon={<TeamOutlined />}
          className="float-end"
        >
          <Link href="/instructor">Instructor</Link>
        </Item>
      )}
    </Menu>
  );
};

export default TopNav;
