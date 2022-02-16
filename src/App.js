import React from "react";
import NotFound from "./notfound";
import Member from "./pages/Member";
import Paket from './pages/Paket';
import User from "./pages/User";
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard";
import Header from "./header";
import Footer from "./footer";
import Transaksi from "./pages/Transaksi";
import FormTransaksi from './pages/FormTransaksi';
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Navbar from "./Navbar";

export default function App(){
  return(
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Navbar><Dashboard /></Navbar>}/>
        <Route path="login" element={<Login />}/>
        <Route path="member" element={<Navbar><Member /></Navbar>}/>
        <Route path="paket" element={<Navbar><Paket /></Navbar>}/>
        <Route path="user" element={<Navbar><User /></Navbar>}/>
        <Route path="transaksi" element={<Navbar><Transaksi /></Navbar>}/>
        <Route path="formtransaksi" element={<Navbar><FormTransaksi /></Navbar>}/>
        <Route component = {NotFound}/>
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

