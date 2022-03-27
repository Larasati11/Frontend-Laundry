import React from "react"
import axios from "axios"
import { baseUrl, formatNumber, authorization } from "../config";
import domToPdf from "dom-to-pdf"

export default class Transaksi extends React.Component {
    constructor() {
        super()
        this.state = {
            transaksi: []
        }
    }

    getData() {
        let endpoint = `${baseUrl}/transaksi`
        axios.get(endpoint, authorization)
            .then(response => {
                let dataTransaksi = response.data
                for (let i = 0; i < dataTransaksi.length; i++) {
                    let total = 0;
                    for (let j = 0; j < dataTransaksi[i].detail_transaksi.length; j++) {
                        let harga = dataTransaksi[i].detail_transaksi[j].paket.harga
                        let qty = dataTransaksi[i].detail_transaksi[j].qty

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

    convertStatus(id_transaksi, status) {
        if (status === 1) {
            return (
                <div className="badge bg-info">
                    Transaksi Baru
                    <br />
                    <a onClick={() => this.changeStatus(id_transaksi, 2)} className="text-dark">
                        Click here to the next level
                    </a>
                </div>
            )
        } else if (status === 2) {
            return (
                <div className="badge bg-warning">
                    Sedang diproses
                    <br />
                    <a onClick={() => this.changeStatus(id_transaksi, 3)} className="text-dark">
                        Click here to the next level
                    </a>
                </div>
            )
        } else if (status === 3) {
            return (
                <div className="badge bg-secondary">
                    Siap diambil
                    <br />
                    <a onClick={() => this.changeStatus(id_transaksi, 4)} className="text-dark">
                        Click here to the next level
                    </a>
                </div>
            )
        } else if (status === 4) {
            return (
                <div className="badge bg-success">
                    Sudah diambil
                </div>
            )
        }
        if (!localStorage.getItem("token")) {
            window.location.href = "/login"
        }
    }

    changeStatus(id, status) {
        if (window.confirm(`Apakah anda yakin ingin mengganti status transaksi ini?`)) {
            let endpoint = `${baseUrl}/transaksi/status/${id}`
            let data = {
                status: status
            }
            axios.post(endpoint, data, authorization)
                .then(response => {
                    window.alert(`Status transaksi telah diubah`)
                    this.getData()
                })
                .catch(error => console.log(error))
        }
    }

    convertStatusBayar(id_transaksi, dibayar) {
        if (dibayar == 0) {
            return (
                <div className="badge bg-danger text-white">
                    Belum dibayar
                    <br />
                    <a onClick={() => this.changeStatusBayar(id_transaksi, 1)} className="text-primary">
                        Click here to the next level
                    </a>
                </div>

            )
        } else if (dibayar == 1) {
            return (
                <div className="badge bg-dark text-white">
                    Sudah dibayar

                </div>
            )

        }

    }
    changeStatusBayar(id, status) {
        if (window.confirm(`Apakah anda yakin ingin merubah status pembayaran?`)) {
            let endpoint = `${baseUrl}/transaksi/bayar/${id}`
            axios.get(endpoint, authorization)
                .then(response => {
                    window.alert(`Status pembayaran telah diubah`)
                    this.getData()
                })
                .catch(error => console.log(error))
        }
    }
    deleteTransaksi(id) {
        if (window.confirm(`Apakah anda yakin ingin menghapus transaksi?`)) {
            let endpoint = `${baseUrl}/transaksi/${id}`
            axios.delete(endpoint, authorization)
                .then(response => {
                    window.alert(response.data.message)
                    this.getData()
                })
                .catch(error => console.log(error))
        }
    }
    convertPdf() {
        //ambil element yang akan diconvert ke PDF
        let element = document.getElementById(`target`)
        let options = {
            filename: "Coba.pdf"
        }

        domToPdf(element, options, () => {
            window.alert("File will download soon")
        })
    }

    printStruk(id) {
        var element = document.getElementById(`struk${id}`);
        var options = {
            filename: `struk-${id}.pdf`
        }
        domToPdf(element, options, function (pdf) {
            window.alert(`Struk will download soon`)
        });
    }

    render() {
        const target = React.createRef()
        const optionPDF = {
            orientation: `landscape`,
            unit: 'cm',
            format: [21, 29.7]
        }
        return (
            <div className="card bg-light">
                <div className="card-header">
                    <div className="card-body">
                        <h4 className="text-success">Data Transaksi <i class="fa-regular fa-clipboard"></i></h4>
                        <p>Dibawah ini adalah data transaksi Londry :</p>
                        {/* <ReactToPdf targetRef={target} filename="Coba.pdf"
                    scale={0.8}options={optionPDF}>
                        {({toPdf}) => (
                            <button className="btn btn-danger"
                            onClick={toPdf}>
                                Generate PDF
                            </button>
                        )}
                    </ReactToPdf> */}
                        <button classNamw="btn btn-danger"
                            onClick={() => this.convertPdf()}>
                            Convert to PDF
                        </button>
                        <div ref={target} id="target">
                            <ul className="list-group">
                                {this.state.transaksi.map(trans => (
                                    <li className="list-group-item">
                                        <div className="row">
                                            {/* this is member area */}
                                            <div className="col-lg-3">
                                                <small className="text-success">
                                                    Member
                                                </small> <br />
                                                {trans.member.nama}
                                            </div>
                                            {/* this is Tgl Trans area */}
                                            <div className="col-lg-3">
                                                <small className="text-success">
                                                    Tgl Transaksi
                                                </small> <br />
                                                {trans.tgl}
                                            </div>
                                            {/* this is Batas Waktu area */}
                                            <div className="col-lg-3">
                                                <small className="text-success">
                                                    Batas Waktu
                                                </small> <br />
                                                {trans.batas_waktu}
                                            </div>
                                            {/* this is Tgl Bayar area */}
                                            <div className="col-lg-3">
                                                <small className="text-success">
                                                    Tanggal Bayar
                                                </small> <br />
                                                {trans.tgl_bayar}
                                            </div>
                                            {/* this is status area */}
                                            <div className="col-lg-3">
                                                <small className="text-success">
                                                    Status
                                                </small> <br />
                                                {this.convertStatus(trans.id_transaksi, trans.status)}
                                            </div>
                                            {/* this is status area */}
                                            <div className="col-lg-3">
                                                <small className="text-success">
                                                    Status Pembayaran
                                                </small> <br />
                                                {this.convertStatusBayar(trans.id_transaksi, trans.dibayar)}
                                            </div>
                                            {/* this is total area */}
                                            <div className="col-lg-3">
                                                <small className="text-success">
                                                    Total
                                                </small> <br />
                                                Rp {formatNumber(trans.total)}
                                            </div>
                                            {/* this is delet area */}
                                            <div className="col-lg-3">
                                                <small className="text-success">
                                                    Option
                                                </small> <br />
                                                <button className="btn btn-outline-danger btn-sm"
                                                    onClick={() => this.deleteTransaksi(trans.id_transaksi)}>
                                                    <i class="fa-solid fa-trash-can"></i> 
                                                </button>

                                            </div>
                                            {/* this is struk area */}
                                            <div className="col-lg-3">
                                                <small className="text-light">
                                                    struk
                                                </small> <br />
                                                <button className="btn btn-success"
                                                    onClick={() => this.printStruk(trans.id_transaksi)}>
                                                    Struk PDF
                                                </button>
                                            </div>
                                            <div style={{ display: `none` }}>
                                                <div className="col-lg-12 p-3"
                                                    id={`struk${trans.id_transaksi}`}>
                                                    <h3 className="text-center text-info">
                                                        Londry
                                                    </h3>
                                                    <h5 className="text-center">Jl Danau Buyan G7 E13
                                                        <br />
                                                        Telp. 0341-8793-9373 | IG: @Londry_
                                                    </h5>


                                                    <h4 className="text-dark">Member: {trans.member.nama}</h4>
                                                    <h4 className="text-dark" ss>Tgl: {trans.tgl}</h4>

                                                    <div className="row mt-3"
                                                        style={{ borderBottom: `1px dotted black` }}>
                                                        <div className="col-4">
                                                            Paket
                                                        </div>
                                                        <div className="col-2">
                                                            Qty
                                                        </div>
                                                        <div className="col-3">
                                                            Harga Satuan
                                                        </div>
                                                        <div className="col-3">
                                                            Total
                                                        </div>
                                                    </div>
                                                    {trans.detail_transaksi.map(item => (
                                                        <div className="row mt-3"
                                                            style={{ borderBottom: `1px dotted black` }}>
                                                            <div className="col-4">
                                                                <h5>{item.paket.jenis_paket}</h5>
                                                            </div>
                                                            <div className="col-2">
                                                                <h5>{item.qty}</h5>
                                                            </div>
                                                            <div className="col-3">
                                                                <h5> Rp {item.paket.harga}</h5>
                                                            </div>
                                                            <div className="col-3">
                                                                <h5>Rp {formatNumber(item.paket.harga * item.qty)}</h5>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    <div className="row mt-2">
                                                        <div className="col-lg-9"></div>
                                                        <div className="col-lg-3">
                                                            <h4> Rp {trans.total} </h4>
                                                        </div>

                                                    </div>
                                                </div>

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
                </div>
            </div>
        )
    }
}