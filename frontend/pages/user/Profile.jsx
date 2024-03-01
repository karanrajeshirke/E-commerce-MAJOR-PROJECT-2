import UserMenu from "../../src/components/layout/UserMenu";
import Layout from "../../src/components/layout/Layout";
import { useParams } from "react-router-dom";
const Profile = () => {

  return (
    <>
      <Layout>
        <div className="row">
          <div className="col-3">
            <UserMenu />
          </div>
          <div className="col-9">
            <h1>WELCOME</h1>

           
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Profile;
