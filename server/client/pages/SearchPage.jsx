import Layout from "../src/components/layout/Layout";
import { useSearch } from "../src/context/Search";
import { useNavigate } from "react-router-dom";
import { Card } from 'antd';
import { Link } from "react-router-dom";
const { Meta } = Card;
const SearchPage = () => {
  const navigate=useNavigate()
  const [search, setSearch] = useSearch();

  return (
    <Layout>
      {search && search.result && search.result.length ? (
        <h1 className="text-center mt-3">
          Products found : {search.result.length}
        </h1>
      ) : (
        <h1 className="text-center mt-3">No Products Found</h1>
      )}
      <div className="row  d-flex flex-wrap">
        {search &&
          search.result &&
          search.result.map((item) => {
            return (
              <Card
                  key={item._id}
                  className="m-3"
                  hoverable
                  style={{
                    width: 250,
                  }}
                  cover={
                    <img
                      alt="example"
                      src={`http://localhost:8080/api/v1/product/get-product-photo/${item._id}`}
                    />
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
            );
          })}
      </div>
    </Layout>
  );
};

export default SearchPage;
