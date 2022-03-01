import React from "react"
import axios from "axios"
import {baseUrl, formatNumber, authorization} from "../config";

export default class Transaksi extends React.Component {
    constructor() {
        super()
        this.state = {
            transaksi: []
        }
    }

    getData() {
        let endpoint =  `${baseUrl}/transaksi`
        axios.get(endpoint, authorization)
            .then(response => {
                let dataTransaksi = response.data
                for (let i = 0; i < dataTransaksi.length; i++){
                    let total = 0;
                    for (let j = 0; j < dataTransaksi[i].detail_transaksi.length; j++) {
                    let harga = dataTransaksi[i].detail_transaksi[j].paket.harga
                    let qty =dataTransaksi[i].detail_transaksi[j].qty

                    total += (harga * qty)                      
                    }

                    //tambahkan key total
                    dataTransaksi[i].total = total
                }
                this.setState({ transaksi: dataTransaksi })
            })
            .catch(error => console.log(error))
    }

    componentDidMount() {
        this.getData()
    }

    convertStatus(id_transaksi, status){
        if (status === 1) {
            return (
                <div className="badge bg-info">
                    Transaksi Baru
                <br />
                    <a onClick={() => this.changeStatus(id_transaksi,2)}className="text-dark">
                        Click here to the next level
                    </a>
                </div>
            )
        } else if(status ===2) {
            return (
                <div className="badge bg-warning">
                    Sedang diproses
                    <br />
                    <a onClick={() => this.changeStatus(id_transaksi,3)}className="text-dark">
                        Click here to the next level
                    </a>
                </div>
            )
        } else if(status === 3) {
            return (
                <div className="badge bg-secondary">
                    Siap diambil
                    <br />
                    <a onClick={() => this.changeStatus(id_transaksi,4)}className="text-dark">
                        Click here to the next level
                    </a>
                </div>
            )
        } else if(status === 4) {
            return (
                <div className="badge bg-success">
                    Sudah diambil
                </div>
            )
        }
        if(!localStorage.getItem("token")){
            window.location.href ="/login"
        }
    }

    changeStatus(id, status){
        if(window.confirm(`Apakah anda yakin ingin mengganti status transaksi ini?`)){
            let endpoint = `${baseUrl}/transaksi/status/${id}`
            let data = {
                status: status
            }
            axios.post(endpoint,data, authorization)
            .then(response => {
                window.alert(`Status transaksi telah diubah`)
                this.getData()
            })
            .catch(error => console.log(error))
        }
    }

    convertStatusBayar(id_transaksi, dibayar){
        if(dibayar == 0){
            return(
                <div className="badge bg-danger text-white">
                    Belum dibayar
                    <br />
                    <a onClick={() => this.changeStatusBayar(id_transaksi,1)}className="text-primary">
                        Click here to the next level
                    </a>
                </div>
                
            )
        }else if(dibayar == 1){
            return(
                <div className="badge bg-dark text-white">
                    Sudah dibayar
                   
                </div>
            )

        }

    }
    changeStatusBayar(id,status){
        if(window.confirm(`Apakah anda yakin ingin merubah status pembayaran?`)){
            let endpoint = `${baseUrl}/transaksi/bayar/${id}`
            axios.get(endpoint, authorization)
            .then(response => {
                window.alert(`Status pembayaran telah diubah`)
                this.getData()
            })
            .catch(error => console.log(error))
        }
    }
    deleteTransaksi(id){
        if(window.confirm(`Apakah anda yakin ingin menghapus transaksi?`)){
            let endpoint = `${baseUrl}/transaksi/${id}`
            axios.delete(endpoint, authorization)
            .then(response => {
                window.alert(response.data.message)
                this.getData()
            })
            .catch(error => console.log(error))
        }
    }



    
    render() {
        return (
            <div className="card">
               
                <div className="card-body">
                    <ul className="list-group">
                        {this.state.transaksi.map(trans => (
                            <li className="list-group-item">
                                <div className="row">
                                    {/* this is member area */}
                                    <div className="col-lg-3">
                                        <small className="text-info">
                                            Member
                                        </small> <br />
                                        {trans.member.nama}
                                    </div>
                                    {/* this is Tgl Trans area */}
                                    <div className="col-lg-3">
                                        <small className="text-info">
                                            Tgl Transaksi
                                        </small> <br />
                                        {trans.tgl}
                                    </div>
                                    {/* this is Batas Waktu area */}
                                    <div className="col-lg-3">
                                        <small className="text-info">
                                            Batas Waktu
                                        </small> <br />
                                        {trans.batas_waktu}
                                    </div>
                                    {/* this is Tgl Bayar area */}
                                    <div className="col-lg-3">
                                        <small className="text-info">
                                            Tanggal Bayar
                                        </small> <br />
                                        {trans.tgl_bayar}
                                    </div>
                                    {/* this is status area */}
                                    <div className="col-lg-3">
                                        <small className="text-info">
                                            Status
                                        </small> <br />
                                        {this.convertStatus(trans.id_transaksi,trans.status)}
                                    </div>
                                        {/* this is status area */}
                                    <div className="col-lg-3">
                                        <small className="text-info">
                                            Status Pembayaran
                                        </small> <br />
                                        {this.convertStatusBayar(trans.id_transaksi,trans.dibayar)}
                                    </div>
                                    {/* this is total area */}
                                    <div className="col-lg-3">
                                        <small className="text-info">
                                            Total
                                        </small> <br />
                                       Rp {formatNumber(trans.total)}
                                    </div>
                                    {/* this is delet area */}
                                    <div className="col-lg-3">
                                    <small className="text-info">
                                            Option
                                        </small> <br />
                                        <button className="bt bt-sm btn-dark"
                                        onClick={() => this.deleteTransaksi(trans.id_transaksi)}>
                                            Hapus
                                        </button> 
                                       
                                    </div>
                                    
                                </div>

                                {/* area detail transaksi */}
                                <hr />
                                <h5>Detail Transaksi</h5>
                                {trans.detail_transaksi.map(detail => ( 
                                    <div className="row">
                                        {/* area nama paket */}
                                        <div className="col-lg-3">
                                            {detail.paket.jenis_paket}
                                        </div>
                                        {/* area qty */}
                                        <div className="col-lg-2">
                                            Qty: {detail.qty}
                                        </div>
                                        {/* area harga paket */}
                                        <div className="col-lg-3">
                                            @ Rp {formatNumber(detail.paket.harga)}
                                        </div>
                                        {/* area harga total */}
                                        <div className="col-lg-4">
                                            Rp {formatNumber(detail.paket.harga * detail.qty)}
                                        </div>
                                    </div>
                                ))}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        )
    }
}