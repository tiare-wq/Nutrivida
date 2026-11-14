import { Outlet } from "react-router-dom";
import NavbarLateral from "../components/NavBarLateral";

function PrivateLayout() {
    return (
        <div>
            <div className="private">
                <NavbarLateral />

                <main>
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
export default PrivateLayout;