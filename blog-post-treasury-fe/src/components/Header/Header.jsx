import { Link, useLocation } from "react-router-dom";
import styles from "./styles.module.scss";
import classNames from "classnames";
import { StoreContext } from "@contexts/storeProvider";
import { useContext } from "react";
import { IoIosLogOut } from "react-icons/io";

function Header() {
  const { containerTitle, homeTitle, btn, login, userClass, btnLogout } =
    styles;
  const location = useLocation();
  const { userInfo, handleLogOut } = useContext(StoreContext);
  
  const handleRenderText = (content) => {
    if (content === "Login" && userInfo) {
      return `Hello, ${userInfo?.username}`;
    } else {
      return (
        <Link to={`/sign-in`} className={classNames(btn, login)}>
          {content}
        </Link>
      );
    }
  };

  return (
    <div className={containerTitle}>
      <div>
        <h1 className={homeTitle}>
          <Link to="/">My Awesome Blog</Link>
        </h1>
      </div>
      {location.pathname === "/" && (
        <div className={userClass}>
          {handleRenderText("Login")}
          {userInfo && (
            <div className={btnLogout} onClick={handleLogOut}>
              <IoIosLogOut />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Header;
