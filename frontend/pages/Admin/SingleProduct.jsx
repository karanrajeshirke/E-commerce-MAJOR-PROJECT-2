import { useEffect, useState } from 'react';
import Layout from '../../src/components/layout/Layout';
import { useParams,Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AdminMenu from '../../src/components/layout/AdminMenu';
import { useAuth } from '../../src/context/Auth';
const SingleProduct = () => {

    const [auth,setAuth]=useAuth()
    const { slug } = useParams();
    const [singleUserData, setSingleUserData] = useState("");
    const navigate=useNavigate()
    useEffect(() => {
        getSingleUser();
    }, []);

    const getSingleUser = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/v1/product/get-single-product/${slug}`);
            setSingleUserData(response.data.product);
            console.log(response.data.product)
        } catch (error) {
           console.log(error.response.data)
        }
    };


    const deleteProduct=async()=>
    {
        try {

            const response = await axios.delete(`http://localhost:8080/api/v1/product/delete-product/${singleUserData._id}`,
            {
                headers:
                {
                    "Authorization":auth.token
                }
            });
            console.log(response)
            alert("deleted ")
            navigate('/dashboard/admin/products')
        } catch (error) {
            console.log(error.response)
            console.log(error)
        }
    }

    return (
        <Layout>
           
           <div className="row   p-2 " >
  
            <div className="col-3">
                <AdminMenu/>
            </div>
            <div className="col-9">
            <div className="card mt-2 p-3 offset-1 " style={{width: '25rem',height:"35rem",boxShadow: " 0 45px 65px rgba(0,0,0,0.50), 0 35px 22px rgba(0,0,0,0.16)"}}>
  <img   src={ singleUserData && singleUserData._id && `http://localhost:8080/api/v1/product/get-product-photo/${singleUserData._id}`} className="card-img-top img-fluid" alt="..." style={{height:"13rem",borderRadius:"10px"}}/>
  <div className="card-body">
    <h5 className="card-title"> Name : {singleUserData.name}</h5>
    <p className="card-text">Description: {singleUserData.description}</p>
    <p className="card-text">Category : {singleUserData && singleUserData.category && singleUserData.category.name}</p>
    <p className="card-text">Price: {singleUserData.price}</p>
    <p className="card-text">Quantity : {singleUserData.inStock}</p>
    <p className="card-text">Shipping :{singleUserData.shipping ? "YES" :" NO"}</p>

    <div className=''>
   <Link to={`/dashboard/admin/product/update/${slug}`}><button className=' btn btn-primary mr-3 btn-lg' >Edit</button></Link>
    <button className='btn btn-danger btn-lg ' onClick={deleteProduct}>Delete</button>
    </div>

  </div>
</div>
            </div>
           
          




          
           </div>

        </Layout>
    );
};

export default SingleProduct;
