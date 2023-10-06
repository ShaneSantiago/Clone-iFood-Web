import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "../Pages/LoginPage/Login";
import SignUp from "../Pages/SignUp/Signup";
import SignUpAddress from "../Pages/SignUp/SignupAddress";
import Feedpage from "../Pages/FeedPage/Feed";
import RequestRestaurant from "../Pages/RequestRestaurant/RequestRestaurant";
import Cart from "../Pages/Cart/Cart";
import Header from "../Components/Header/Header";
import Profile from "../Pages/Profile/Profile";
import { useResults } from "../Components/Context/GlobalContext";

const Routers = () => {
  const { token } = useResults();

  return (
    <>
      <Router>
        {token ? <Header /> : null}
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/cadastro" element={<SignUp />} />
          <Route path="/cadastro/endereco" element={<SignUpAddress />} />
          <Route path="/feed" element={<Feedpage />} />
          <Route path="/pedido/:id" element={<RequestRestaurant />} />
          <Route path="/pagamento" element={<Cart />} />
          <Route path="/perfil" element={<Profile />} />
        </Routes>
      </Router>
    </>
  );
};
export default Routers;
