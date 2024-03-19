import axios from "axios";
import Layout from "../src/components/layout/Layout";
import { useAuth } from "../src/context/Auth";
import { useEffect, useState } from "react";
import { Checkbox } from "antd";
import { Input, Radio, Space } from "antd";
import { Price } from "../src/components/Price";
import { Link, useNavigate } from "react-router-dom";
import { Card } from "antd";
const { Meta } = Card;

// import Card from "@mui/material/Card";
// import CardActions from "@mui/material/CardActions";
// import CardContent from "@mui/material/CardContent";
// import CardMedia from "@mui/material/CardMedia";
// import Button from "@mui/material/Button";
// import Typography from "@mui/material/Typography";

const HomePage = () => {
  const navigate = useNavigate();
  const [allProducts, setAllProducts] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [catFilter, setCatFilter] = useState([]);
  const [radioFilter, setRadioFilter] = useState([]);

  const getAllProducts = async () => {
    try {
      let response = await axios.get(
        "http://localhost:8080/api/v1/product/get-products"
      );
      setAllProducts(response.data.allproducts);
    } catch (error) {
      console.log("error fetching in all products", error);
    }
  };

  const getAllCategories = async () => {
    try {
      let response = await axios.get(
        "http://localhost:8080/api/v1/category/get-allcategory"
      );

      setAllCategories(response.data.allCategory);
    } catch (error) {
      console.log("error fetching in all categoires", error);
    }
  };
  useEffect(() => {
    getAllProducts();
    getAllCategories();
  }, []);

  // useEffect(() => {
  //   if (!catFilter.length || !radioFilter.length) getAllProducts();
  // }, [catFilter.length, radioFilter.length]);

  useEffect(() => {
    if (catFilter.length || radioFilter.length) {
      filterProduct();
    }
  }, [catFilter, radioFilter]);

  const filterProduct = async () => {
    try {
      let response = await axios.post(
        "http://localhost:8080/api/v1/product/product-filters",
        { catFilter, radioFilter }
      );
      // console.log(response.data.filteredData);

      setAllProducts(response.data.filteredData);
    } catch (error) {
      console.log("error occurred while fetching the filterd data", error);
    }
  };

  const [auth, setAuth] = useAuth();

  return (
    <Layout>
      <div className="row">
        <div className="col-2 m-3 d-flex flex-column column-container ">
          <h3>Category</h3>
          <Checkbox.Group onChange={(val) => setCatFilter(val)}>
            <Space direction="vertical">
              {allCategories.map((cat) => {
                return (
                  <Checkbox value={cat._id} key={cat._id}>
                    {cat.name}
                  </Checkbox>
                );
              })}
            </Space>
          </Checkbox.Group>

          <hr />
          <h3>Price</h3>

          <Radio.Group onChange={(e) => setRadioFilter(e.target.value)}>
            <Space direction="vertical">
              {Price.map((pr) => {
                return (
                  <div key={pr._id}>
                    <Radio value={pr.array}>{pr.name}</Radio>;
                  </div>
                );
              })}
            </Space>
          </Radio.Group>
        </div>
        <div className="col-9 next-column mr-4 p-3 d-flex flex-wrap  bg-light justify-content-around">
          {allProducts &&
            allProducts.map((item) => {
              return (
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
                      <p
                        style={{
                          fontWeight: "bold",
                          fontSize: "1.5rem",
                          color: "#1ec51e",
                        }}
                      >
                        {item.price.toLocaleString("en-IN", {
                          style: "currency",
                          currency: "INR",
                          maximumFractionDigits: 0,
                        })}
                      </p>
                    }
                  />
                  <p>
                    {item.description.substring(0, 60)}
                    <br />
                    <Link to={`/product/${item.slug}`}>More Details</Link>
                  </p>
                </Card>
              );
            })}
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
