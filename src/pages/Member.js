import React from "react"
import { Modal } from "bootstrap";
import axios from "axios"
import { baseUrl, authorization } from "../config.js";

class Member extends React.Component {
    constructor() {
        super()
        this.state = {
            members: [
                {
                    id_member: "111", nama: "Larasati",
                    alamat: "Jln. Danau Buyan E13",
                    jenis_kelamin: "Wanita", telepon: "09876543"
                },
                {
                    id_member: "112", nama: "Azkiyya",
                    alamat: "Jln. Danau Ranau G7",
                    jenis_kelamin: "Wanita", telepon: "09876544"
                },
                {
                    id_member: "113", nama: "Ahmad",
                    alamat: "Jln. Danau Kerinci 2",
                    jenis_kelamin: "Pria", telepon: "09876545"
                }
            ],
            id_member: "",
            nama: "",
            alamat: "",
            telepon: "",
            jenis_kelamin: "",
            action: "",//menyimpan aksi dai tambah atau ubah data
            role: "",
            visible: true,
        }
        if(!localStorage.getItem("token")){
            window.location.href ="/login"
        }
    }
    
    tambahData() {
        //memunculkan modal
        this.modalMember = new Modal(document.getElementById("modal-member"))
        this.modalMember.show()

        //mengosongkan inputan
        this.setState({
            nama: "", alamat: "", telepon: "", jenis_kelamin: "Wanita",
            id_member: Math.random(1, 1000000), action: "tambah"

        })
    }

    simpanData(event) {
        event.preventDefault()
        //mencegah berjalannya aksi default dari aksi form submit

        //menghilangkan modal
        this.modalMember.hide()

        //check aksi tambah atau ubah
        if (this.state.action === "tambah") {
            let endpoint = `${baseUrl}/member`
            let newMember = {
                id_member: this.state.id_member,
                nama: this.state.nama,
                alamat: this.state.alamat,
                telepon: this.state.telepon,
                jenis_kelamin: this.state.jenis_kelamin
            }

            //let temp = this.state.members
            //temp.push(newMember)

            //this.setState({ members: temp })
            axios.post(endpoint, newMember, authorization)
            .then(response => {
                window.alert(response.data.message)
                this.getData()
            })
            .catch(error => console.log(error))
        } else if (this.state.action === "ubah") {
            this.modalMember.hide()
            let endpoint = `${baseUrl}/member/` + this.state.id_member
            let newMember = {
                id_member: this.state.id_member,
                nama: this.state.nama,
                alamat: this.state.alamat,
                telepon: this.state.telepon,
                jenis_kelamin: this.state.jenis_kelamin
            }
            axios.put(endpoint, newMember, authorization)
            .then(response => {
                window.alert(response.data.message)
                this.getData()
            })
            .catch(error => console.log(error))
            //mencari posisi indeks dari data member
            //berdasarkan id_member nya pada array "members"
            //let index = this.state.members.findIndex(
               // member => member.id_member === this.state.id_member
            //)
            //let temp = this.state.members
            //temp[index].nama = this.state.nama
            //temp[index].alamat = this.state.alamat
            ///temp[index].telepon = this.state.telepon
            //temp[index].jenis_kelamin = this.state.jenis_kelamin

            //this.setState({ members: temp })
        }
    }
    ubahData(id_member) {
        this.modalMember = new Modal(document.getElementById("modal-member"))
        this.modalMember.show()

        //mencari posisi indeks dari data member
        //berdasarkan id_member nya pada array "members"
        let index = this.state.members.findIndex(
            member => member.id_member === id_member
        )

        this.setState({
            id_member: this.state.members[index].id_member,
            nama: this.state.members[index].nama,
            alamat: this.state.members[index].alamat,
            jenis_kelamin: this.state.members[index].jenis_kelamin,
            telepon: this.state.members[index].telepon,
            action: "ubah"
        })
    }

    hapusData(id_member) {
        if (window.confirm("Apakah anda yakin ingin meghapus data ini?")){
            let endpoint = `${baseUrl}/member/` + id_member
            axios.delete(endpoint, authorization)
            .then(response => {
                window.alert(response.data.message)
                this.getData()
            })
            .catch(error => console.log(error))
            //let temp = this.state.members
            //let index = temp.findIndex(
                //member => member.id_member === id_member
            //)

        //menghapus data array
       // temp.splice(index, 1)

        //this.setState({ members: temp })
        }
    }

    getData(){
        let endpoint = `${baseUrl}/member`
        axios.get(endpoint, authorization)
        .then(response => {
            this.setState({ members: response.data})
        })
        .catch(error => console.log(error))
    }
    componentDidMount() {
        this.getData()
        let user = JSON.parse(localStorage.getItem("user"))
        //cara pertama
        this.setState({
            role: user.role
        })
        //cara kedua
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
    showAddButton(){
        if(this.state.role === 'admin' || this.state.role === 'kasir'){
            <button type="button" class="btn btn-outline-dark"
                            onClick={() => this.tambahData()}>
                            Tambah</button>
        }
    }
    render() {
        return (
            <div className="card">


                <div className="card-body">
                    <ul className="list-group">
                        {this.state.members.map(member => (
                            <li className="list-group-item">
                                <div className="row">
                                    {/*bagian untuk nama */}
                                    <div className="col-lg-4">
                                        <small className="text-info">Nama</small> <br />
                                        {member.nama}
                                    </div>
                                    {/*bagian untuk gender*/}
                                    <div className="col-lg-3">
                                        <small className="text-info">Gender</small> <br />
                                        {member.jenis_kelamin}
                                    </div>
                                    {/*bagian untuk telepon */}
                                    <div className="col-lg-3">
                                        <small className="text-info">Telepon</small> <br />
                                        {member.telepon}
                                    </div>
                                    <div className="col-lg-2">
                                        <button type="button" className={`btn btn-outline-info mx-3 ${this.state.visible ? ``: `d-none`}`}
                                            onClick={() => this.ubahData(member.id_member)}>Edit</button>
                                        <button type="button" className={`btn btn-outline-danger ${this.state.visible ? ``: `d-none`}`}
                                            onClick={() => this.hapusData(member.id_member)}>Delete</button>
                                    </div>
                                    {/*bagian untuk alamat */}
                                    <div className="col-lg-12">
                                        <small className="text-info">Alamat</small> <br />
                                        {member.alamat}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <br />
                    <div className="col-lg-3">
                        {this.showAddButton()}
                    </div>
                </div>
                {/* form modal member */}
                <div className="modal" id="modal-member">
                    <div className="modal-dialog modal-md">
                        <div className="modal-content">
                            <div className="modal-header bg-dark">
                                <h4 className="text-white">
                                    Form Member
                                </h4>
                            </div>

                            <div className="modal-body">
                                <form onSubmit={ev => this.simpanData(ev)}>
                                    Nama
                                    <input type="text" className="form-control mb-2"
                                        value={this.state.nama}
                                        onChange={ev => this.setState({ nama: ev.target.value })}
                                        required />

                                    Alamat
                                    <input type="text" className="form-control mb-2"
                                        value={this.state.alamat}
                                        onChange={ev => this.setState({ alamat: ev.target.value })}
                                        required />

                                    Telepon
                                    <input type="text" className="form-control mb-2"
                                        value={this.state.telepon}
                                        onChange={ev => this.setState({ telepon: ev.target.value })}
                                        required />

                                    Jenis Kelamin
                                    <select className="form-control mb-2"
                                        calue={this.state.jenis_kelamin}
                                        onChange={ev => this.setState({ jenis_kelamin: ev.target.value })}>
                                        <option value="Pria">Pria</option>
                                        <option value="Wanita">Wanita</option>
                                    </select>

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
export default Member