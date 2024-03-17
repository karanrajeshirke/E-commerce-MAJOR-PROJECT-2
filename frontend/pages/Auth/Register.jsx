import { useState } from "react";
import Layout from "../../src/components/layout/Layout";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
const Register = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    role: "",
    photo: "",
  });

  function handleInput(event) {
    setUser((prevUser) => {
      return {
        ...prevUser,
        [event.target.name]: event.target.files
          ? event.target.files[0]
          : event.target.value,
      };
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const formData = new FormData();

      for (const key in user) {
        formData.append(key, user[key]);
      }

      console.log(formData);
      let response = await axios.post(
        "http://localhost:8080/api/v1/auth/register",
        formData
      );
      console.log(response.data);
      alert("Registerd");
      navigate("/login");
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
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
            marginTop: "15px",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            padding: "20px",
          }} // Add background color and padding to form container
        >
          <div className="form-content">
            <header>Register</header>
            <form onSubmit={handleSubmit}>
              <div className="field input-field">
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  placeholder="Karan Rajeshirke"
                  name="name"
                  onChange={handleInput}
                  value={user.name}
                  required
                />
              </div>
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
                  className="form-control"
                  name="password"
                  placeholder="karan123"
                  id="password"
                  onChange={handleInput}
                  value={user.password}
                  required
                />
              </div>
              <div className="field input-field">
                <input
                  type="file"
                  accept="image/*"
                  className="form-control"
                  id="photo"
                  name="photo"
                  onChange={handleInput}
                  required
                />
              </div>
              <div className="field input-field">
                <input
                  type="number"
                  className="form-control"
                  name="phone"
                  placeholder="8788965893"
                  id="phone"
                  onChange={handleInput}
                  value={user.phone}
                  required
                />
              </div>
              <div className="field input-field">
                <input
                  type="text"
                  className="form-control"
                  name="address"
                  placeholder="A/P Dervan Taluka Chiplun"
                  id="address"
                  onChange={handleInput}
                  value={user.address}
                  required
                />
              </div>
              <div className="field input-field">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Enter Role (0 or 1)"
                  id="role"
                  name="role"
                  onChange={handleInput}
                  value={user.role}
                  required
                />
              </div>
              <div className="field button-field">
                <button>Login</button>
              </div>
            </form>
            <div className="form-link">
              <span>
                Already have an account ? <Link to="/login">Login</Link>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* <h1 className="text-center mt-2">Register</h1>
      <div className="row">
        <div className="col-lg-8 offset-lg-2 col-md-8 offset-md-2 col-sm-5 ">
          <form onSubmit={handleSubmit}>
            <div className="form-group mt-3">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                className="form-control"
                id="name"
                placeholder="Karan Rajeshirke"
                name="name"
                onChange={handleInput}
                value={user.name}
                required
              />
              <div className="invalid-feedback">Enter</div>
            </div>
            <div className="form-group mt-3">
              {user.photo ? (
                <>
                  <img
                    src={URL.createObjectURL(user.photo)}
                    className="img-fluid"
                  />
                </>
              ) : (
                <>
                  <label htmlFor="photo">Photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="form-control"
                    id="photo"
                    name="photo"
                    onChange={handleInput}
                    required
                  />
                </>
              )}
              <div className="invalid-feedback">Enter</div>
            </div>
            <div className="form-group mt-3">
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
            <div className="form-group mt-3">
              <label htmlFor="phone">Phone</label>
              <input
                type="number"
                className="form-control"
                name="phone"
                placeholder="8788965893"
                id="phone"
                onChange={handleInput}
                value={user.phone}
                required
              />
            </div>
            <div className="form-group mt-3">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                className="form-control"
                name="address"
                placeholder="A/P Dervan Taluka Chiplun"
                id="address"
                onChange={handleInput}
                value={user.address}
                required
              />
            </div>
            <div className="form-group mt-3">
              <label htmlFor="role">Role</label>
              <input
                type="number"
                className="form-control"
                placeholder="Enter Role (0 or 1)"
                id="role"
                name="role"
                onChange={handleInput}
                value={user.role}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary mt-3">
              Submit
            </button>
          </form>
        </div>
      </div> */}
    </Layout>
  );
};
export default Register;
