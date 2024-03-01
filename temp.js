import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Layout from "../../src/components/layout/Layout";
import AdminMenu from "../../src/components/layout/AdminMenu";
import { Select } from "antd";
import axios from "axios";
import { useAuth } from "../../src/context/Auth";
import { useNavigate } from "react-router-dom";
const UpdateProduct = () => {
  const navigate = useNavigate();
  const [auth, setAuth] = useAuth();
  const [allCategories, setAllCategories] = useState("");
  const { slug } = useParams();

  const getAllCategories = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/v1/category/get-allcategory"
      );
      setAllCategories(response.data.allCategory);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const [productData, setProductData] = useState({
    id: "",
    name: "",
    category: { id: "", name: "" },
    description: "",
    price: "",
    inStock: "",
    shipping: "",
    photo: "",
  });

  const getProductData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/v1/product/get-single-product/${slug}`
      );
      const product = response.data.product;
      console.log(product);
      setProductData({
        id: product._id,
        name: product.name,
        category: { id: product.category._id, name: product.category.name },
        description: product.description,
        price: product.price,
        inStock: product.inStock,
        shipping: product.shipping,
      });
    } catch (error) {
      console.log(error.response.data);
    }
  };

  useEffect(() => {
    getAllCategories();
    getProductData();
  }, []);

  const handleUpdateForm = async (event) => {
    event.preventDefault();
    console.log("form submitted");

    try {
      const formData = new FormData();
      //!------------------------------------

      for (const key in productData) {
        if (key === "category") {
          formData.append(key, productData.category.id);
        } else {
          formData.append(key, productData[key]);
        }
      }

      //!------------------------------
      //!with axios you dont need to provide content type:multipart form

      const response = await axios.put(
        `http://localhost:8080/api/v1/product/update-product/${productData.id}`,
        formData,
        {
          headers: {
            Authorization: auth.token,
          },
        }
      );
      alert("Updated");
      navigate(`/dashboard/admin/products/${auth.user.id}`);
      console.log(response);
    } catch (error) {}
  };

  function handleChange(event) {
    const { name, value, files } = event.target;

    setProductData((prev) => {
      return {
        ...prev,
        [name]: files ? files[0] : value,
      };
    });
  }

  return (
    <Layout>
      <div className="row mt-3">
        <div className="col-3">
          <AdminMenu />
        </div>
        <div className="col-9">
          <form className="form" onSubmit={handleUpdateForm}>
            <Select
              name="category"
              showSearch
              placeholder="Select a category"
              optionFilterProp="children"
              className="w-50"
              value={productData.category.name}
              onChange={(value) =>
                setProductData((prev) => ({
                  ...prev,
                  category: {
                    ...prev.category,
                    name: value,
                    id: allCategories.find((cat) => cat.name === value)._id,
                  },
                }))
              }
            >
              {allCategories &&
                allCategories.map((cat) => (
                  <Select.Option key={cat._id} value={cat.name}>
                    {cat.name}
                  </Select.Option>
                ))}
            </Select>

            <div className="form-group w-50">
              Name
              <input
                name="name"
                type="text"
                className="form-control"
                placeholder="Product name"
                value={productData.name}
                onChange={handleChange}
              />
            </div>

            {productData.photo ? (
              <img
                src={URL.createObjectURL(productData.photo)}
                alt=""
                style={{ width: "300px", height: "300px" }}
              />
            ) : (
              <img
                src={
                  productData &&
                  productData.id &&
                  `http://localhost:8080/api/v1/product/get-product-photo/${productData.id}`
                }
                style={{ width: "300px", height: "300px" }}
                alt=""
              />
            )}

            <div>
              <label className="btn btn-secondary col-lg-6 col-sm-4">
                Update Photo
                <input
                  type="file"
                  accept="image/*"
                  name="photo"
                  hidden
                  onChange={handleChange}
                />
              </label>
            </div>

            <div className="form-group w-50">
              Description
              <input
                name="description"
                type="text"
                className="form-control"
                placeholder="Product description"
                value={productData.description}
                onChange={handleChange}
              />
            </div>

            <div className="form-group w-50">
              Price
              <input
                name="price"
                type="number"
                className="form-control"
                placeholder="Product price"
                value={productData.price}
                onChange={handleChange}
              />
            </div>

            <div className="form-group w-50">
            inStock
              <input
                name="inStock"
                type="number"
                className="form-control"
                placeholder="Product inStock"
                value={productData.inStock}
                onChange={handleChange}
              />
            </div>

            <Select
              showSearch
              placeholder="Select shipping"
              optionFilterProp="children"
              className="w-50"
              name="shipping"
              value={productData.shipping ? "YES" : "NO"}
              onChange={(value) => {
                return setProductData((prev) => {
                  return {
                    ...prev,
                    shipping: value,
                  };
                });
              }}
            >
              <Select.Option value="1">YES</Select.Option>
              <Select.Option value="0">NO</Select.Option>
            </Select>

            <button className="btn btn-outline-dark mt-3" type="submit">
              Submit
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default UpdateProduct;
