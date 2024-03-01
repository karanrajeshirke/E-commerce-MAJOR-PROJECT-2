import UserMenu from "../../src/components/layout/UserMenu";
import Layout from "../../src/components/layout/Layout";
import axios from "axios";
import { useAuth } from "../../src/context/Auth";
import { useEffect, useState } from "react";
const Order = () => {
  const [auth, setAuth] = useAuth();
  const [orders, setOrders] = useState([]);
  const getAllOrders = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/v1/product/all-orders",
        {
          headers: {
            Authorization: auth.token,
          },
        }
      );
      console.log(response.data.productArr[0]);
      setOrders(response.data.productArr);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllOrders();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return date.toLocaleDateString("en-GB", options);
  };

  const formattedTotal = (total)=>
{
  const amount=total.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });
  return amount
}
  return (
    <>
      <Layout>
        <div className="row">
          <div className="col-2  bg-warning-subtle ">
            <UserMenu />
          </div>
          <div className="col-10 bg-body-tertiary d-flex flex-column">
            <h1>Order</h1>

            <table className="table table-bordered">
              <thead>
                <tr>
                  <th scope="col">SR </th>
                  <th scope="col">Product Photo</th>
                  <th scope="col">Name</th>
                  <th scope="col">Price</th>
                  <th scope="col">Quantity</th>
                  <th scope="col">Total</th>
                  <th scope="col">Purchased Date</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders &&
                  orders.map((item, index) => {
                    return (
                      <tr key={index}>
                        <th scope="row">{index + 1}</th>
                        {item && item.product && item.product._id && (
                          <td className="text-center ">
                            <img
                              src={`http://localhost:8080/api/v1/product/get-product-photo/${item.product._id}`}
                              alt=""
                              className="img-fluid  rounded-circle"
                              style={{ width: "100px", height: "100px" }}
                            />
                          </td>
                        )}
                        <td>{item.product.name}</td>
                        <td>{formattedTotal(item.product.price)}</td>
                        <td>{item.quantity}</td>
                        <td>{formattedTotal(item.product.price*item.quantity)}</td>


                        <td>{formatDate(item && item.createdAt)}</td>
                        {/* 2024-02-17T17:19:37.128Z */}
                        <td>{item.status}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>

            {/* {JSON.stringify(orders[0].status)} */}
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Order;

