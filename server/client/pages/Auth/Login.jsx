import Layout from "../../src/components/layout/Layout";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useAuth } from "../../src/context/Auth";
import "../../src/login.css";

const Login = () => {
  const location = useLocation();
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  function handleInput(event) {
    setUser((prevUser) => {
      return {
        ...prevUser,
        [event.target.name]: event.target.value,
      };
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      let response = await axios.post(
        "http://localhost:8080/api/v1/auth/login",
        user
      );

      setAuth((prevAuth) => {
        return {
          ...prevAuth,
          user: response.data.user,
          token: response.data.token,
        };
      });

      localStorage.setItem("auth", JSON.stringify(response.data));

      alert("Logged In");

      navigate(location.state || "/");
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  }

  return (
    <Layout>
      <div
        className="row d-flex justify-content-center"
        style={{
          backgroundImage:
            "url(https://blog-frontend.envato.com/cdn-cgi/image/width=2560,quality=75,format=auto/uploads/sites/2/2022/04/E-commerce-App-JPG-File-scaled.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "100vh", // Ensure the background covers the entire screen
        }}
      >
        <div
          className="form login col-4 text-center"
          style={{
            marginTop: "150px",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            padding: "20px",
          }} // Add background color and padding to form container
        >
          <div className="form-content">
            <header>Login</header>
            <form onSubmit={handleSubmit}>
              <div className="field input-field">
                <input
                  type="email"
                  placeholder="Email"
                  className="input"
                  name="email"
                  onChange={handleInput}
                  value={user.email}
                  required
                />
              </div>
              <div className="field input-field">
                <input
                  type="password"
                  placeholder="Password"
                  className="password"
                  name="password"
                  onChange={handleInput}
                  value={user.password}
                  required
                />
                <i className="bx bx-hide eye-icon" />
              </div>
              <div className="field button-field">
                <button>Login</button>
              </div>
            </form>
            <div className="form-link">
              <span>
                Don't have an account? <Link to="/register">Sign Up</Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;

{
  /* <div className="col-lg-5 offset-lg-4  col-sm-1 offset-sm-1 col-md-11 col-xs-1">
            <form onSubmit={handleSubmit} >
            
              <div className="form-group">
                <label htmlFor="email">Email address</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  aria-describedby="emailHelp"
                  placeholder="karanrajeshirke11@gmail.com"
                  name="email"
                  onChange={handleInput}
                  value={user.email}
                  required
                />
              </div>
              <div className="form-group mt-3">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  className="form-control"
                    name="password"
                  placeholder="karan123"
                  id="password"
                  onChange={handleInput}
                  value={user.password}
                  required
                />
              </div>
            
              <button type="submit" className="btn btn-primary mt-3">
                Submit
              </button>
            </form>
          </div> */
}
