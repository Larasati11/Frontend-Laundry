import React from "react"
import {Modal} from "bootstrap";
import axios from "axios"
import { baseUrl, authorization } from "../config.js";

class Paket extends React.Component{
    constructor(){
        super()
        this.state = {
            pakets: [
                {
                    id_paket: "001", 
                    jenis_paket: "bedcover",
                    harga: "20000"
                },
                {
                    id_paket: "002", 
                    jenis_paket: "boneka",
                    harga: "25000"
                },
                {
                    id_paket: "003", 
                    jenis_paket: "Sprei",
                    harga: "10000"
                }
            ],
            id_paket: "",
            jenis_paket: "",
            harga: "",
            action: "",
            role: "",
            visible: true //menyimpan aksi dai tambah atau ubah data
        }
        if(!localStorage.getItem("token")){
            window.location.href ="/login"
        }
    }

    tambahData(){
        //memunculkan modal
        this.modalPaket = new Modal(document.getElementById("modal-paket"))
        this.modalPaket.show()

        //mengosongkan inputan
        this.setState({
            jenis_paket: "", harga: "", 
            id_paket: Math.random(1,1000000), action: "tambah"

        })
    }

    simpanData(event){
        event.preventDefault()
        //mencegah berjalannya aksi default dari aksi form submit

        //menghilangkan modal
        this.modalPaket.hide()

        //check aksi tambah atau ubah
        if (this.state.action === "tambah"){
            let endpoint = `${baseUrl}/paket`
            //menampung data dari penggguna
            let newPaket = {
                id_paket: this.state.id_paket,
                jenis_paket: this.state.jenis_paket,
                harga: this.state.harga
            }

            //let temp = this.state.pakets
            //temp.push(newPaket)

            //this.setState({pakets: temp})
            axios.post(endpoint, newPaket, authorization)
            .then(response => {
                window.alert(response.data.message)
                this.getData()
            })
            .catch(error => console.log(error))
        }else if(this.state.action === "ubah"){
            this.modalPaket.hide()
            let endpoint = `${baseUrl}/paket/` + this.state.id_paket
            let newPaket = {
                id_paket: this.state.id_paket,
                jenis_paket: this.state.jenis_paket,
                harga: this.state.harga
            }
            axios.put(endpoint, newPaket, authorization)
            .then(response => {
                window.alert(response.data.message)
                this.getData()
            })
            .catch(error => console.log(error))
            //mencari posisi indeks dari data member
            //berdasarkan id_member nya pada array "members"
            //let index = this.state.pakets.findIndex(
                //paket => paket.id_paket === this.state.id_paket
            //)
            //let temp = this.state.pakets
            //temp[index].jenis_paket = this.state.jenis_paket
            //temp[index].harga = this.state.harga
           

            //this.setState({ pakets: temp })
        }
    }
    ubahData(id_paket) {
        this.modalPaket = new Modal(document.getElementById("modal-paket"))
        this.modalPaket.show()

        //mencari posisi indeks dari data member
        //berdasarkan id_member nya pada array "members"
        let index = this.state.pakets.findIndex(
            paket => paket.id_paket === id_paket
        )

        this.setState({
            id_paket: this.state.pakets[index].id_paket,
            jenis_paket: this.state.pakets[index].jenis_paket,
            harga: this.state.pakets[index].harga,
            action: "ubah"
        })
    }
    hapusData(id_paket) {
        if (window.confirm("Apakah anda yakin ingin meghapus data ini?")){
            let endpoint = `${baseUrl}/paket/` + id_paket
            axios.delete(endpoint, authorization)
            .then(response => {
                window.alert(response.data.message)
                this.getData()
            })
            .catch(error => console.log(error))
            //let temp = this.state.pakets
            //let index = temp.findIndex(
               //paket => paket.id_paket === id_paket
            //)

        //menghapus data array
        //temp.splice(index, 1)

        //this.setState({ pakets: temp })
        }
    }
    getData(){
        let endpoint =`${baseUrl}/paket`
        axios.get(endpoint, authorization)
        .then(response => {
            this.setState({ pakets: response.data})
        })
        .catch(error => console.log(error))
    }
    componentDidMount() {
        this.getData()
        let user = JSON.parse(localStorage.getItem("user"))
        if(user.role === 'admin' || this.state.role === 'kasir'){
            this.setState({
                visible: true
            })
        }else {
            this.setState({
                visible: false
            })
        }
    }
    render(){
        return(
            <div className="card">
        
                <div className="card-body">
                    <ul className="list-group">
                        {this.state.pakets.map(paket => (
                            <li className="list-group-item">
                                <div className="row">
                                    {/*bagian untuk jenis paket */}
                                    <div className="col-lg-4">
                                        <small className="text-info">Jenis Paket</small> <br />
                                        {paket.jenis_paket}
                                    </div>
                                     {/*bagian untuk harga*/}
                                     <div className="col-lg-4">
                                        <small className="text-info">Harga</small> <br />
                                        {paket.harga}
                                    </div>
                                    <div className="col-lg-4">
                                    <button type="button" className={`btn btn-outline-info mx-3 ${this.state.visible ? ``: `d-none`}`}
                                            onClick={() => this.ubahData(paket.id_paket)}>Edit</button>
                                        <button type="button" className={`btn btn-outline-danger ${this.state.visible ? ``: `d-none`}`}
                                            onClick={() => this.hapusData(paket.id_paket)}>Delete</button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <br />
                    <div className="col-lg-3">
                    <button type="button" class={`btn btn-outline-dark ${this.state.visible ? ``: `d-none`}`}
                            onClick={() => this.tambahData()}>
                            Tambah</button>
                    </div>
                </div>
                 {/* form modal paket */}
                 <div className="modal" id="modal-paket">
                    <div className="modal-dialog modal-md">
                        <div className="modal-content">
                            <div className="modal-header bg-dark">
                                <h4 className="text-white">
                                    Form Paket
                                </h4>
                            </div>

                            <div className="modal-body">
                            <form onSubmit={ev => this.simpanData(ev)}>
                                Jenis Paket
                                <input type="text" className="form-control mb-2"
                                    value={this.state.jenis_paket}
                                    onChange={ev => this.setState({ jenis_paket: ev.target.value })}
                                    required />

                                Harga
                                <input type="text" className="form-control mb-2"
                                    value={this.state.harga}
                                    onChange={ev => this.setState({ harga: ev.target.value })}
                                    required />

                                <button className="btn btn-outline-dark btn-sm" type="submit">
                                    Simpan
                                </button>
                            </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default Paket