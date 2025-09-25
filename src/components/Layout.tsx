import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";

export default function Layout() {
  return (
    <>
      <NavBar />
      <div className="content">
        <Outlet /> {/* Ici s'affichent les pages */}
      </div>
    </>
  );
}