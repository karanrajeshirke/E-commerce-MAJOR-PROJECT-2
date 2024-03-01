import { useParams } from "react-router-dom";
import Layout from "../src/components/layout/Layout";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import { useCart } from "../src/context/Cart";
import { useAuth } from "../src/context/Auth";
import { Button, Card } from "antd";
import { Link } from "react-router-dom";
const { Meta } = Card;
import { Avatar } from "antd";
const ProductDetails = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [product, setProduct] = useState("");
  const [similarProduct, setSimilarProduct] = useState("");
  // const [cart, setCart] = useCart();
  const [auth, setAuth] = useAuth();

  const getProductDetails = async () => {
    try {
      let response = await axios.get(
        `http://localhost:8080/api/v1/product/get-single-product/${slug}`
      );
      setProduct(response.data.product);
      getSimilarProducts(
        response.data.product._id,
        response.data.product.category._id
      );
    } catch (error) {
      console.log(error);
    }
  };

  const getSimilarProducts = async (pid, cid) => {
    try {
      let response = await axios.get(
        `http://localhost:8080/api/v1/product/get-similar-products/${pid}/${cid}`
      );
      setSimilarProduct(response.data.simPro);
      console.log(response.data.simPro);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProductDetails();
  }, [navigate]);

  //! we have added here navigate because when someone clicks on navigate we want the page to rendered

  const addToCart = async (pid) => {
    try {
      let response = await axios.get(
        `http://localhost:8080/api/v1/product/add-to-cart/${pid}`,
        {
          headers: {
            Authorization: auth.token,
          },
        }
      );

      // console.log(response.data.message)
      alert(response.data.message);
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        alert(error.response.data.message);
      }

      console.log(error);
    }

    // setCart((prev) => {
    //   const updatedCart = [...prev, product];
    //   localStorage.setItem("cart", JSON.stringify(updatedCart));
    //   return updatedCart;
    // });
  };

  return (
    <Layout>
      <div className="row p-3   ">
        <h3>Product Details</h3>
        <div className="col-5   d-flex justify-content-center align-items-center mt-3">
          <Card
            hoverable
            style={{ width: 350, boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}
            cover={
              product &&
              product._id && (
                <img
                  alt="example"
                  src={`http://localhost:8080/api/v1/product/get-product-photo/${product._id}`}
                />
              )
            }
          ></Card>
          {/* <img
            src={`http://localhost:8080/api/v1/product/get-product-photo/${product._id}`}
            alt={product.name}
            className="img-fluid rounded"
            style={{
              width: "400px",
              height: "400px",
              boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
            }}
          /> */}
        </div>
        <div
          className="col-6   d-flex flex-column justify-content-around ml-5"
          style={{
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            padding: "20px",
            borderRadius: "8px",
          }}
        >
          <h2 className="mb-4">{product.name}</h2>
          <p className="mb-3">
            <strong>Category:</strong>{" "}
            {product.category && product.category.name}
          </p>
          <p className="mb-3">
            <strong>Description:</strong> {product.description}
          </p>
          <p className="mb-3">
            <strong>Price:</strong>{" "}
            {product &&
              product.price &&
              product.price.toLocaleString("en-IN", {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0,
              })}
          </p>

          {product.inStock != 0 && (
            <strong>
              <p className="mb-3">{product.inStock}</p>
            </strong>
          )}

          <p>
            <strong>Shipping:</strong> {product.shipping ? "YES" : "NO"}
          </p>

          <p>
            <strong>Seller : </strong> {product.seller && product.seller.name}
          </p>

          {product.inStock !== 0 ? (
            auth.token ? (
              <button
                className="btn btn-primary col-3"
                onClick={() => {
                  addToCart(product._id);
                  // setisAddedToCart(true);
                }}
              >
                Add to Cart
              </button>
            ) : (
              <p style={{ color: "red", fontSize: "1.2rem" }}>
                You need to be logged in to add to cart
              </p>
            )
          ) : (
            <Button type="primary" className="col-3" danger>
              OUT OF STOCK
            </Button>
          )}
        </div>

        <hr className="mt-3" />

        <div className="col-12 mt-3 ">
          <h3>Similar Products...</h3>
          <div className=" d-flex justify-content-between flex-wrap bg-danger">
            {similarProduct &&
              similarProduct.map((item, index) => (
                <Card
                  key={item._id}
                  className="m-3"
                  hoverable
                  style={{
                    width: 250,
                  }}
                  cover={
                    item &&
                    item._id && (
                      <img
                        alt="example"
                        src={`http://localhost:8080/api/v1/product/get-product-photo/${item._id}`}
                      />
                    )
                  }
                >
                  <Meta
                    title={item.name}
                    description={
                      <p style={{ fontWeight: "bold", color: "black" }}>
                        {item.price.toLocaleString("en-IN", {
                          style: "currency",
                          currency: "INR",
                          maximumFractionDigits: 0,
                        })}
                        Rs
                      </p>
                    }
                  />
                  <p>
                    {item.description.substring(0, 60)}
                    <br />
                    <Link to={`/product/${item.slug}`}>More Details</Link>
                  </p>

                  {/* Add any other details here */}
                </Card>
              ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;
