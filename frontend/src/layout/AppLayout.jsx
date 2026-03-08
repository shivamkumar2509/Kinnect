import Navbar from "../componenets/Navbar";
import Sidebar from "../componenets/Sidebar";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <>
      <Navbar />

      <div className="container-fluid" style={{ marginTop: "70px" }}>
        <div className="row">
          <div className="col-md-3 col-lg-2 p-0">
            <Sidebar />
          </div>

          <div className="col-md-9 col-lg-10 p-3">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default AppLayout;
