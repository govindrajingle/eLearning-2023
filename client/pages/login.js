import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { SyncOutlined } from "@ant-design/icons";
import Link from "next/link";
import { Context } from "../context";
import { useRouter } from "next/router";

const Login = () => {
  //const [name,setName] =useState('');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { state, dispatch } = useContext(Context);
  const { user } = state;
  //router

  console.log("STATE", state);

  const router = useRouter();

  useEffect(() => {
    if (user !== null) router.push("/user");
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.table({name,email,password});
    try {
      setLoading(true);

      const { data } = await axios.post("/api/login", {
        email,
        password,
      });
      // console.log("LOGIN_RESPONSE",data);
      // console.table({email,password})
      // if(this.email === undefined || this.password===undefined) {return}

      //  console.log(data)
      dispatch({
        type: "LOGIN",
        payload: data,
      });

      //save in local storage
      window.localStorage.setItem("user", JSON.stringify(data));
      router.push("/user");
      // console.log("login response",data);
      // toast.success("login succesful ")
      // setLoading(false);
    } catch (err) {
      // toast.error(err.response.data);
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="jumbotron text-center bg-primary square">Login</h1>

      <div className="container col-md-4 offset-md-4 pb-5">
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            className="form-control mb-4 p-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter Email"
            required
          />

          <input
            type="password"
            className="form-control mb-4 p-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Password"
            required
          />
          <div className="d-grid gap-2">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!email || !password || loading}
            >
              {loading ? <SyncOutlined spin /> : "Submit"}
            </button>
          </div>
        </form>

        <p className="text-center pt-3">
          Not yet registerd? <Link href="/register">register</Link>
        </p>

        <p className="text-center">
          {/* forgot password?{" " } */}
          <Link href="/forgot-password" className="text-danger">
            forgot password
          </Link>
        </p>
      </div>
    </>
  );
};

export default Login;
