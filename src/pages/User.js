import React from "react"
import { Modal } from "bootstrap";
import axios from "axios"
import { baseUrl, authorization } from "../config.js";


class User extends React.Component {
    constructor() {
        super()
        this.state = {
            users: [
                {
                    id_user: "1",
                    nama: "Laras",
                    username: "Larascand",
                    password: "Moklet"
                },
                {
                    id_user: "2",
                    nama: "Diva",
                    username: "Divacute",
                    password: "Telkom"
                },
                {
                    id_user: "3",
                    nama: "Edi",
                    username: "Edibas",
                    password: "Malang"
                }
            ],
            id_user: "",
            nama: "",
            username: "",
            password: "",
            action: "",
            role: "",
            fillPassword: true,
            visible: true
        }
        if (!localStorage.getItem("token")) {
            window.location.href = "/login"
        }
    }
    tambahData() {
        //memunculkan modal
        this.modalUser = new Modal(document.getElementById("modal-user"))
        this.modalUser.show()

        //mengosongkan inputan
        this.setState({
            nama: "", username: "", password: "", role: "admin",
            id_user: Math.random(1, 1000000), action: "tambah",
            fillPassword: true

        })
    }

    simpanData(event) {
        event.preventDefault()
        //mencegah berjalannya aksi default dari aksi form submit

        //menghilangkan modal
        this.modalUser.hide()

        //check aksi tambah atau ubah
        if (this.state.action === "tambah") {
            let endpoint = `${baseUrl}/users`
            //menampung data dari penggguna
            let newUser = {
                id_user: this.state.id_user,
                nama: this.state.nama,
                username: this.state.username,
                password: this.state.password,
                role: this.state.role
            }

            // let temp = this.state.users
            // temp.push(newUser)

            // this.setState({users: temp})
            axios.post(endpoint, newUser, authorization)
                .then(response => {
                    window.alert(response.data.message)
                    this.getData()
                })
                .catch(error => console.log(error))
        } else if (this.state.action === "ubah") {
            this.modalUser.hide()
            let endpoint = `${baseUrl}/users/` + this.state.id_user
            let newUser = {
                id_user: this.state.id_user,
                nama: this.state.nama,
                username: this.state.username,
                role: this.state.role
            }

            if(this.state.fillPassword === true) {
                newUser.password = this.state.password
            }
            axios.put(endpoint, newUser, authorization)
                .then(response => {
                    window.alert(response.data.message)
                    this.getData()
                })
                .catch(error => console.log(error))
            //mencari posisi indeks dari data member
            //berdasarkan id_member nya pada array "members"
            //let index = this.state.users.findIndex(
            //user => user.id_user === this.state.id_user
            //)
            //let temp = this.state.users
            //temp[index].nama = this.state.nama
            //temp[index].username = this.state.username
            //temp[index].password = this.state.password

            //this.setState({ users: temp })
        }
    }
    ubahData(id_user) {
        this.modalUser = new Modal(document.getElementById("modal-user"))
        this.modalUser.show()

        //mencari posisi indeks dari data member
        //berdasarkan id_member nya pada array "members"
        let index = this.state.users.findIndex(
            user => user.id_user === id_user
        )

        this.setState({
            id_user: this.state.users[index].id_user,
            nama: this.state.users[index].nama,
            username: this.state.users[index].username,
            password: "",
            role: this.state.users[index].role,
            action: "ubah",
            fillPassword: false
        })
    }
    hapusData(id_user) {
        if (window.confirm("Apakah anda yakin ingin meghapus data ini?")) {
            let endpoint = `${baseUrl}/users/` + id_user
            axios.delete(endpoint, authorization)
                .then(response => {
                    window.alert(response.data.message)
                    this.getData()
                })
                .catch(error => console.log(error))
            // let temp = this.state.users
            //let index = temp.findIndex
            // user => user.id_user === id_user
            //)

            //menghapus data array
            // temp.splice(index, 1)

            //this.setState({ users: temp })
        }
    }
    getData() {
        let endpoint = `${baseUrl}/users/`
        axios.get(endpoint, authorization)
            .then(response => {
                this.setState({ users: response.data })
            })
            .catch(error => console.log(error))
    }
    componentDidMount() {
        this.getData()
        let user = JSON.parse(localStorage.getItem("user"))
        if (user.role === 'admin' || user.role === 'kasir') {
            this.setState({
                visible: true
            })
        } else {
            this.setState({
                visible: false
            })
        }
    }
    showPassword() {
        if(this.state.fillPassword === true){
            return(
                <div>
                    password
                    <input type="password" className="form-control mb-1"
                    required
                    value={this.state.password}
                    onChange={ev => this.setState({password: ev.target.value})}
                    ></input>
                </div>
            );
        }else {
            return(
                <button className="mb-1 btn btn-info"
                onClick={()=> this.setState({fillPassword: true})}>
                 change password
                </button>
            )
        }
    }
    render() {
        return (
            <div className="card bg-light">
                <div className="card-header">
                    <div className="card-body">
                        <h4 className="text-dark">Data User</h4>
                        <p>Dibawah ini adalah data user Londry :</p>
                        <ul className="list-group">
                            {this.state.users.map(user => (
                                <li className="list-group-item">
                                    <div className="row">
                                        {/*bagian untuk Nama */}
                                        <div className="col-lg-4">
                                            <small className="text-info">Nama</small> <br />
                                            {user.nama}
                                        </div>
                                        {/*bagian untuk Username*/}
                                        <div className="col-lg-3">
                                            <small className="text-info">Username</small> <br />
                                            {user.username}
                                        </div>
                                        {/*bagian untuk Password*/}
                                        <div className="col-lg-3">
                                            <small className="text-info">Role</small> <br />
                                            {user.role}
                                        </div>
                                        <div className="col-lg-2">
                                            <button type="button" className={`btn btn-outline-info mx-3 ${this.state.visible ? `` : `d-none`}`}
                                                onClick={() => this.ubahData(user.id_user)}><i class="fa-solid fa-pen-to-square" ></i></button>
                                            <button type="button" className={`btn btn-outline-danger ${this.state.visible ? `` : `d-none`}`}
                                                onClick={() => this.hapusData(user.id_user)}><i class="fa-solid fa-trash-can"></i></button>
                                        </div>

                                    </div>
                                </li>
                            ))}
                        </ul>
                        <br />
                        <div className="col-lg-3">
                            <button type="button" class={`btn btn-outline-dark ${this.state.visible ? `` : `d-none`}`}
                                onClick={() => this.tambahData()}>
                                Tambah</button>
                        </div>
                    </div>
                    {/* form modal member */}
                    <div className="modal" id="modal-user">
                        <div className="modal-dialog modal-md">
                            <div className="modal-content">
                                <div className="modal-header bg-dark">
                                    <h4 className="text-white">
                                        Form User
                                    </h4>
                                </div>

                                <div className="modal-body">
                                    <form onSubmit={ev => this.simpanData(ev)}>
                                        Nama
                                        <input type="text" className="form-control mb-2"
                                            value={this.state.nama}
                                            onChange={ev => this.setState({ nama: ev.target.value })}
                                            required />

                                        Username
                                        <input type="text" className="form-control mb-2"
                                            value={this.state.username}
                                            onChange={ev => this.setState({ username: ev.target.value })}
                                            required />

                                        Role
                                        <select
                                            className="form-control mb-2"
                                            value={this.state.role}
                                            onChange={(ev) => this.setState({ role: ev.target.value })}
                                            required >
                                            <option value="Admin">Admin</option>
                                            <option value="Kasir">kasir</option>
                                        </select>
                                        {this.showPassword()}

                                        <button className="btn btn-outline-dark btn-sm" type="submit">
                                            Simpan
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default User