import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/router";
import { SyncOutlined } from "@ant-design/icons";
// import UserNav from "../nav/UserNav";

const UserNav = () => {
  const [current, setCurrent] = useState("");

  useEffect(() => {
    process.browser && setCurrent(window.location.pathname);
    // console.log(window.location.pathname);
  }, [process.browser && window.location.pathname]);

  return (
    <div className="nav flex-column nav-pills">
      <Link
        href="/user"
        className={`nav-link ${current === "/user" && "active"}`}
      >
        Dashboard
      </Link>
    </div>
  );
};
const UserRoute = ({ children }) => {
  //state
  const [ok, setOk] = useState(false);

  //router
  const router = useRouter();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/current-user");

      // console.log(data.ok);
      if (data.ok) setOk(true);
    } catch (err) {
      // console.log(err);
      // console.log("error aali");
      setOk(false);
      router.push("/login");
    }
  };
  return (
    <>
      {!ok ? (
        <SyncOutlined
          spin
          className="d-flex justify-content-center display-1 text-primary p-5"
        />
      ) : (
        <>
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-2">{UserNav}</div>
            </div>
            <div className="col-md-10">{children}</div>
          </div>
        </>
      )}
    </>
  );
};

export default UserRoute;
