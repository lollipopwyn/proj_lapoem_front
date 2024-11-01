import React from "react";
import { Link } from "react-router-dom"; // Link 추가
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/features/auth/authSlice";

function Navbar() {
  const dispatch = useDispatch();
  const { isLoggedIn, user } = useSelector((state) => state.auth);

  return (
    <div>
      <h1>Main Page</h1>
      {isLoggedIn ? (
        <div>
          <h2>Welcome, {user.nickname}!</h2>
          <p>Email: {user.email}</p>
          <button onClick={() => dispatch(logout())}>Logout</button>
        </div>
      ) : (
        <div>
          <h2>Sign Up or Log In</h2>
          <Link to="/join">Go to Sign Up</Link>
          <br />
          <Link to="/login">Go to Log In</Link>
        </div>
      )}
    </div>
  );
}

export default Navbar;
