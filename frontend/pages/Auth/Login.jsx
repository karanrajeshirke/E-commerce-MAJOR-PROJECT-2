import Layout from "../../src/components/layout/Layout"
import { useNavigate,useLocation } from "react-router-dom"
import { useState,useEffect } from "react"
import toast from 'react-hot-toast';
import axios from "axios"
import { useAuth } from "../../src/context/Auth";
const Login=()=>
{

    const location=useLocation()
    const [auth,setAuth]=useAuth()
    const navigate=useNavigate()
    const [user,setUser]=useState({
        email:"",
        password:"",
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
       let response= await axios.post('http://localhost:8080/api/v1/auth/login',user)
    
     

        setAuth((prevAuth)=>
        {
            return{
                ...prevAuth,
                user:response.data.user,
                token:response.data.token
            }
        })
        //! we are setting the 'auth' this is context data therefore it will be accessible globally

        //! we have stored data in local storage bcoz we want persistent authentication if a user is logged in and he refreshes the page the logged in data should not vainish and we should not be logging in again...so we are going to store the user data in local storage (MAINLY STORING TOKEN IS IMPORANT BCOZ THAT IS GOING TO BE VERIFIED )

        localStorage.setItem('auth',JSON.stringify(response.data))
       
        alert("Logged In")

        navigate(location.state || '/');
       
    
        //! we are using useLocation hook to store the page user wanted to visit before he was logged in 
        //! if location.state is null it means user wanted to direclty login he was not accessing an procted route witohut being logged in therfore it will be null 
        //!therfore we have given a second condition if it is so ..go to '/' home
             }
       catch(error) 
       {
        if(error.response)
        {
            
            toast.error(error.response.data.message)
        }
        else
        {
            toast.error("Something went wrong")
        }
       

       }
    }
    return(
        <Layout>
           
           <h1 className="text-center">Login</h1>
        <div className="row">
          <div className="col-lg-5 offset-lg-4  col-sm-1 offset-sm-1 col-md-11 col-xs-1">
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
          </div>
        </div>
        </Layout>
       
    )
}
export default Login