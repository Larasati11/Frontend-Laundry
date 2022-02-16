import React from "react";
import {Link} from "react-router-dom";

function Logout(){
    //remove data token dan user dari local storage
    localStorage.removeItem("user")
    localStorage.removeItem("token")
}
export default function Navbar(props){
    return(
        <div>
            <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
  <div class="container-fluid">
    <a class="navbar-brand" >Londry</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" 
    data-bs-target="#navbarNavAltMarkup" 
    aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
      <div class="navbar-nav">
        <a class="nav-link active" aria-current="page" href="/">Home</a>
        <a class="nav-link" href="/member">Member</a>
        <a class="nav-link" href="/user">User</a>
        <a class="nav-link" href="/paket">Paket</a>
        <a class="nav-link" href="/transaksi">Transaksi</a>
        <a class="nav-link" href="/formtransaksi">Form Transaksi</a>
        <a class="nav-link" href="/login" onClick={() => Logout()}>Logout</a>
      </div>
    </div>
  </div>
</nav>
{props.children}
        </div>
    )
}