import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

export default function AccountNavigation() {
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const signedOut = [
    { to: "/Kambaz/Account/Signin", label: "Signin", id: "wd-account-signin-link" },
    { to: "/Kambaz/Account/Signup", label: "Signup", id: "wd-account-signup-link" },
  ];
  const signedIn = [
    { to: "/Kambaz/Account/Profile", label: "Profile", id: "wd-account-profile-link" },
  ];
  const links = currentUser ? signedIn : signedOut;

  return (
    <div id="wd-courses-navigation" className="wd list-group fs-5 rounded-0">
      {links.map(({ to, label, id }) => (
        <NavLink key={to} to={to} id={id} className={({ isActive }) =>
          `list-group-item border-0 ${isActive ? "active" : "text-danger"}`}>
          {label}
        </NavLink>
      ))}
      {currentUser && currentUser.role === "ADMIN" && (
        <NavLink to="/Kambaz/Account/Users" className={({ isActive }) =>
          `list-group-item border-0 ${isActive ? "active" : "text-danger"}`}>
          Users
        </NavLink>
      )}
    </div>
    
  );
}
