import Layout from "../../src/components/layout/Layout"
import { useAuth } from "../../src/context/Auth"
import UserMenu from "../../src/components/layout/UserMenu"
const Dashboard=()=>
{

    const [auth]=useAuth()
    return(
        <>
        <Layout>
            <div className="row">
                <div className="col-3">
                    <UserMenu/>
                </div>
                <div className="col-9">
                <h3>{auth && auth.user.name}</h3>
                <h3>{auth && auth.user.email}</h3>
                
                </div>
                   
            </div>
        </Layout>
        </>
        
    )
}

export default Dashboard