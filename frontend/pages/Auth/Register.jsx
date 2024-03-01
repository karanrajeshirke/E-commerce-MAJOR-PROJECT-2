import { useState } from "react";
import Layout from "../../src/components/layout/Layout";
import axios from "axios"
import toast from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
const Register = () => {


    const navigate=useNavigate()
    const [user,setUser]=useState({
        name:"",
        email:"",
        password:"",
        phone:"",
        address:"",
        role:""

    })

    function handleInput(event)
    {
        setUser((prevUser)=>
        {
            return{
                ...prevUser,[event.target.name]:event.target.value
            }
        })
    }

    async function handleSubmit(event)
    {
        event.preventDefault()

       try
       {
       let response= await axios.post('http://localhost:8080/api/v1/auth/register',user)
       console.log(response.data)
       alert("Registerd")
        navigate('/login')
       }
       catch(error)
       {

            console.log(error.response.status)
            toast.error(error.response.data.message)
       }
    }

    

  return (
    <Layout>
       <h1 className="text-center mt-2">Register</h1>
        <div className="row">
          <div className="col-lg-8 offset-lg-2 col-md-8 offset-md-2 col-sm-5 ">
            <form onSubmit={handleSubmit} >
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
      </div>
    </Layout>
  );
};
export default Register;
