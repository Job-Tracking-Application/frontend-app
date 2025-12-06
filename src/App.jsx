import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Sidebar from "./components/layout/Sidebar";


export default function App(){
return (
<div>
<Navbar />
<div className="container-fluid">
<div className="row">
<div className="col-md-2 p-0">
<Sidebar />
</div>
<div className="col-md-10">
<Outlet />
</div>
</div>
</div>
</div>
);
}