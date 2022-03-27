import React from "react";
import axios from "axios";
import { baseUrl, formatNumber, authorization } from "../config";
import '@fortawesome/fontawesome-free/css/all.min.css'


export default class Dashboard extends React.Component {
    constructor() {
        super()

        this.state = {
            jmlMember: 0,
            jmlPaket: 0,
            jmlTransaksi: 0,
            income: 0

        }

        if (!localStorage.getItem("token")) {
            window.location.href = "/login"
        }
    }
    getSummary() {
        let endpoint = `${baseUrl}/member`
        axios.get(endpoint, authorization)
            .then(response => {
                this.setState({ jmlMember: response.data.length })
            })
            .catch(error => console.log(error))

        endpoint = `${baseUrl}/paket`
        axios.get(endpoint, authorization)
            .then(response => {
                this.setState({ jmlPaket: response.data.length })
            })
            .catch(error => console.log(error))

        endpoint = `${baseUrl}/transaksi`
        axios.get(endpoint, authorization)
            .then(response => {
                let dataTransaksi = response.data
                let income = 0
                for (let i = 0; i < dataTransaksi.length; i++) {
                    let total = 0;
                    for (let j = 0; j < dataTransaksi[i].detail_transaksi.length; j++) {
                        let harga = dataTransaksi[i].detail_transaksi[j].paket.harga
                        let qty = dataTransaksi[i].detail_transaksi[j].qty

                        total += (harga * qty)
                    }

                    income += total
                }
                this.setState({
                    jmlTransaksi: response.data.length,
                    income: income
                })
            })
            .catch(error => console.log(error))
    }

    componentDidMount() {
        this.getSummary()
    }
    render() {
        return (
            <div className="dashboard-page">
                <div className="main-content container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="hello">
                            <div className="row">
                                <div className="col-lg-5 col-sm-6 ">

                                    <h2>WELCOME TO LONDRY!</h2>
                                    <h6>"Jangan membuat kasar tanganmu dengan mencuci sendiri!"</h6>
                                    

                                </div>
                                <div className="col-lg-2"></div>
                                    <div className="col-lg-5">
                                <img src="laundry.jpg" class="rounded float-right" ></img>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-6 col-md-6">
                                <div className="card text-center bg-warning m-1 text-white">
                                    <div class="card-header">Data Member</div>
                                    <div className="card-body">
                                        <i class="fa-solid fa-user-group"></i>
                                        <h2>{this.state.jmlMember}</h2>
                                        <h6>Member yang telah bergabung di Londry</h6>
                                        <a href="/member"><i class="fa-solid fa-angles-right"></i></a>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-6">
                                <div className="card text-center bg-info m-1 text-white">
                                    <div class="card-header">Data Paket</div>
                                    <div className="card-body">
                                        <i class="fa-solid fa-shirt"></i>
                                        <h2>{this.state.jmlPaket}</h2>
                                        <h6>Paket yang tersedia di Londry</h6>
                                        <a href="/paket"><i class="fa-solid fa-angles-right"></i></a>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-6">
                                <div className="card text-center bg-danger m-1 text-white">
                                    <div class="card-header">Data Transaksi</div>
                                    <div className="card-body">
                                        <i class="fa-regular fa-clipboard"></i>
                                        <h2>{this.state.jmlTransaksi}</h2>
                                        <h6>Transaksi yang dilakukan di Londry</h6>
                                        <a href="/transaksi"><i class="fa-solid fa-angles-right"></i></a>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-6">
                                <div className="card text-center bg-success m-1 text-white">
                                <div class="card-header">Income</div>
                                <div className="card-body">
                                    <i class="fa-solid fa-calculator" ></i>
                                    <h2>Rp {formatNumber(this.state.income)}</h2>
                                    <h6>Jumlah Income Londry</h6>
                                    
                                </div>
                            </div>
                        </div>
                       
                        <img src="baju2.png" class="card-img" width="100px"/>
  
                        </div>
                    </div>
                </div>
            </div>
        </div>

        )

    }
}