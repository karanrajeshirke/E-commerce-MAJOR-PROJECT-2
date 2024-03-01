import Layout from "../../src/components/layout/Layout";
import AdminMenu from "../../src/components/layout/AdminMenu";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../src/context/Auth";
import Chart from "react-apexcharts";

const AdminProfile = () => {
  const [auth, setAuth] = useAuth();

  const [statusNames, setStatusNames] = useState([]);
  const [statusCount, setStatusCount] = useState([]);
  const [productNames, setProductNames] = useState([]);
  const [productCount, setProductCount] = useState([]);

  const [totalProducts, setTotalProducts] = useState("");
  const [ordersCount, setOrdersCount] = useState("");
  const [amount, setAmountCount] = useState("");

  const getStatusCount = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/v1/product/getcount",
        {
          headers: {
            Authorization: auth.token,
          },
        }
      );
      setStatusNames(response.data.namesArr);
      setStatusCount(response.data.valuesArr);
    } catch (error) {
      console.log(error);
    }
  };

  const getProductCount = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/v1/product/individualProductCount",
        {
          headers: {
            Authorization: auth.token,
          },
        }
      );
      setProductNames(response.data.productNames);
      setProductCount(response.data.productCount);
    } catch (error) {
      console.log(error);
    }
  };

  const getAdminProfileOrder = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/v1/product/admin-profile-details",
        {
          headers: {
            Authorization: auth.token,
          },
        }
      );

      console.log(response.data);
      setTotalProducts(response.data.productsCount);
      setOrdersCount(response.data.ordersCount);
      setAmountCount(response.data.amount);
    } catch (error) {
      console.log(error);
    }
  };

  const changetoINR = (amount) => {
    return amount.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    });
  };
  useEffect(() => {
    getStatusCount();
    getProductCount();
    getAdminProfileOrder();
  }, []);

  return (
    <Layout>
      <div className="row">
        <div className="col-2">
          <AdminMenu />
        </div>
        <div
          className="col-10   p-5"
          style={{
            border: "2px solid black",
            backgroundColor: "rgb(242,242,242)",
          }}
        >
          <div className="row">
            <div className="col-4 ">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea
              repudiandae porro labore dicta repellat nesciunt rem voluptate,
              adipisci qui commodi fugit pariatur, officia modi perspiciatis?
              Amet officiis dolores eius distinctio! Impedit fugiat maiores
              facilis ut eligendi voluptas esse optio, officiis nisi itaque ab
              totam perspiciatis possimus deserunt nulla magni, aut nam sunt
              mollitia, ullam neque quisquam corporis maxime magnam! Natus?
              Dolorem vero tenetur quibusdam ipsam molestias magnam a. Quod sit,
              qui quae nostrum magnam facilis, at magni officiis provident,
              eligendi dignissimos dicta ullam dolorum nihil quidem incidunt
              repudiandae consectetur eius?
            </div>
            <div className="col-8 ">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ad porro
              nulla alias maxime nemo magni recusandae sequi velit optio
              possimus voluptas, dicta expedita deserunt soluta. Corrupti
              voluptate eaque voluptas assumenda? Molestias consectetur officiis
              quos. Quos voluptatem nisi velit autem amet nostrum? Suscipit
              quisquam laboriosam rem fugit adipisci quas consequatur veritatis
              omnis maiores? Rerum, explicabo. Expedita corporis dolor eveniet
              minus alias. Dolorum veritatis aliquam vero itaque ipsa
              repellendus facere delectus praesentium tempora. Nihil quidem
              voluptas quas deserunt nulla! Nobis eum suscipit mollitia numquam
              expedita reiciendis, accusantium sint, eveniet a cupiditate autem.
              Nulla itaque vitae rerum in magnam cumque eaque ipsa deleniti
              commodi, atque corrupti rem optio. Repellat, mollitia, suscipit
              vel esse perferendis illum inventore fuga consequatur repudiandae
              eius voluptate deleniti. Eligendi. Dolores hic architecto quae qui
              temporibus totam excepturi voluptatibus sequi ad voluptatum
              commodi repellendus placeat at, natus doloremque, cupiditate,
              officiis nisi! Beatae aliquam exercitationem quisquam fugiat
              repellendus magnam quas dolor.
            </div>
          </div>

          <div className="row ">
            <div className="admin-cards-list">
              <div className="admin-card 1">
                <div
                  className="admin-card_title title-white d-flex justify-content-center align-items-center flex-column "
                  style={{ height: "100%" }}
                >
                  <h3>Products</h3>
                  <h1>{totalProducts}</h1>
                </div>
              </div>

              <div className="admin-card 1">
                <div
                  className="admin-card_title title-white d-flex justify-content-center align-items-center flex-column "
                  style={{ height: "100%" }}
                >
                  <h3>Orders</h3>
                  <h1>{ordersCount}</h1>
                </div>
              </div>

              <div className="admin-card 1">
                <div
                  className="admin-card_title title-white d-flex justify-content-center align-items-center flex-column "
                  style={{ height: "100%" }}
                >
                  {" "}
                  <h3>Amount</h3>
                  <h2>{changetoINR(amount)}</h2>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="d-flex  mt-3 justify-content-around ">
                <Chart
                  options={{
                    title: {
                      text: "Status of Orders",
                      align: "center",
                      style: {
                        fontSize: "20px",
                        fontWeight: "bold",
                        fontFamily: "Arial",
                        color: "#333",
                      },
                    },
                    labels: statusNames,
                  }}
                  series={statusCount}
                  type="pie"
                  width="500"
                />

                <Chart
                  options={{
                    chart: {
                      type: "bar",
                    },
                    xaxis: {
                      categories: productNames,
                      title: {
                        text: "Products",
                      },
                    },
                    yaxis: {
                      title: {
                        text: "Sales Count",
                      },
                    },
                    title: {
                      text: "Product Sales Count",
                      align: "center",
                      style: {
                        fontSize: "20px",
                        fontWeight: "bold",
                        fontFamily: "Arial",
                        color: "#333",
                      },
                    },
                    colors: ["#FF5733"],
                  }}
                  series={[
                    {
                      name: "Sales Count",
                      data: productCount,
                    },
                  ]}
                  type="bar"
                  width="600"
                />
              </div>

              <div className="d-flex   flex-row-reverse mt-3"></div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminProfile;
