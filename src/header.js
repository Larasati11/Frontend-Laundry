import react from "react";
import { NavLink } from "react-router-dom";

function Header() {
    return (
        <nav>
            <NavLink exact activeClassName="active" to="/pages/Login.js">
                Login
            </NavLink>
            <NavLink exact activeClassName="active" to="/pages/User.js">
                User
            </NavLink>
            <NavLink exact activeClassName="active" to="/pages/Member.js">
                Member
            </NavLink>
            <NavLink exact activeClassName="active" to="/pages/Paket.js">
                Paket
            </NavLink>
            <NavLink exact activeClassName="active" to="/pages/Transaksi.js">
                Transaksi
            </NavLink>
        </nav>
        
    )
}
export default Header;