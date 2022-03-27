import React from "react";
import axios from "axios";
import { Modal } from "bootstrap";
import { baseUrl, authorization } from "../config";

export default class FormTransaksi extends React.Component {
  constructor() {
    super();
    this.state = {
      id_member: "",
      tgl: "",
      batas_waktu: "",
      tgl_bayar: "",
      dibayar: false,
      detail_transaksi: [],
      members: [],
      pakets: [],
      id_paket: "",
      qty: 0,
      jenis_paket: "",
      harga: 0,
    };
  }

  getMember() {
    let endpoint = `${baseUrl}/member`;
    axios
      .get(endpoint, authorization)
      .then((response) => {
        this.setState({ members: response.data });
      })
      .catch((error) => console.log(error));
  }

  componentDidMount() {
    this.getMember();
    this.getPaket();

    let user = JSON.parse(localStorage.getItem("user"));
    

    if (user.role !== "admin" && user.role !== "kasir") {
      window.alert(`Maaf Anda tidak berhak untuk mengakses halaman ini`);

      window.location.href = "/";
    }
  }

  tambahPaket(e) {
    e.preventDefault();
    //tutup modal
    this.modal.hide();
    // untuk menyimpan data paket yang dipiih beserta jumlahnya kedalam array detail transaksi
    let idPaket = this.state.id_paket;
    let selectedPaket = this.state.pakets.find(
      (paket) => paket.id_paket == idPaket
    );
    let newPaket = {
      id_paket: this.state.id_paket,
      qty: this.state.qty,
      jenis_paket: selectedPaket.jenis_paket,
      harga: selectedPaket.harga,
    };

    //ambil array detail transaksi nya
    let temp = this.state.detail_transaksi;
    temp.push(newPaket);
    this.setState({ detail_transaksi: temp });
  }

  getPaket() {
    let endpoint = `${baseUrl}/paket`;
    axios
      .get(endpoint, authorization)
      .then((response) => {
        this.setState({ pakets: response.data });
      })
      .catch((error) => console.log(error));
  }

  addPaket() {
    //menampilan form modal untuk memilih paket
    this.modal = new Modal(document.getElementById("modal_paket"));
    this.modal.show();
    // kosongkan formnya
    this.setState({
      id_paket: "",
      qty: 0,
      jenis_paket: "",
      harga: 0,
    });
  }

  hapusData(id_paket) {
    if (window.confirm("Apakah anda yakin menghapus data ini?")) {
      //mencari posisi index dari data yang akan dihapus
      let temp = this.state.detail_transaksi;
      let index = temp.findIndex((detail) => detail.id_paket === id_paket);

      //menghapus data
      temp.splice(index, 1);

      this.setState({ detail_transaksi: temp });
    }
  }

  simpanTransaksi() {
    if (document.getElementById("member").value == "") {
      alert("missing member");
      return;
    }
    if (document.getElementById("tgl").value == "") {
      alert("missing tanggal transaksi");
      return;
    }
    if (document.getElementById("batas_waktu").value == "") {
      alert("missing batas waktu");
      return;
    }
    if (document.getElementById("tgl_bayar").value == "") {
      alert("missing tanggal transaksi");
      return;
    }
    if (document.getElementById("status").value == "") {
      alert("missing status");
      return;
    }

    let endpoint = `${baseUrl}/transaksi`;
    let user = JSON.parse(localStorage.getItem("user"));
    let newData = {
      id_member: this.state.id_member,
      batas_waktu: this.state.batas_waktu,
      tgl: this.state.tgl,
      tgl_bayar: this.state.tgl_bayar,
      dibayar: this.state.dibayar,
      id_user: this.state.user,
      detail_transaksi: this.state.detail_transaksi,
    };

    axios
      .post(endpoint, newData, authorization)
      .then((response) => {
        window.alert(response.data.message);
      })
      .catch((error) => console.log(error));
  }

  render() {
    return (
      <div className="card bg-light">
          <div className="card-header">
        <div className="card-body">
        <h4 className="text-dark">Transaksi Baru <i class="fa-solid fa-user-group"></i></h4>
                <p>Isi kolom dibawah untuk menambahkan transaksi baru :</p>
          Member
          <select
            className="form-control mb-2"
            id="member"
            value={this.state.id_member}
            onChange={(e) => this.setState({ id_member: e.target.value })}
          >
            <option value="" selected hidden>
              Pilih Member
            </option>
            {this.state.members.map((member) => (
              <option value={member.id_member}>{member.nama}</option>
            ))}
          </select>
          Tanggal Transaksi
          <input
            id="tgl"
            type="date"
            className="form-control mb-2"
            value={this.state.tgl}
            onChange={(e) => this.setState({ tgl: e.target.value })}
          />
          Batas Waktu
          <input
            id="batas_waktu"
            type="date"
            className="form-control mb-2"
            value={this.state.batas_waktu}
            onChange={(e) => this.setState({ batas_waktu: e.target.value })}
          />
          Tanggal Bayar
          <input
            id="tgl_bayar"
            type="date"
            className="form-control mb-2"
            value={this.state.tgl_bayar}
            onChange={(e) => this.setState({ tgl_bayar: e.target.value })}
          />
          Status Bayar
          <select
            id="status"
            className="form-control mb-2"
            value={this.state.dibayar}
            onChange={(e) => this.setState({ dibayar: e.target.value })}
          >
            <option value={true}>Sudah Dibayar</option>
            <option value={false}> Dibayar</option>
          </select>
          <button
            className="btn btn-outline-dark"
            onClick={() => this.addPaket()}
          >
            Tambah Paket
          </button>
          {/* tampilkan isi detail */}
          {/*  area detail transaksi */}
          <h5> Detail Transaksi </h5>
          {this.state.detail_transaksi.map((detail) => (
            <div className="row">
              {/* area jenis paket col-3 */}
              <div className="col-lg-2">{detail.jenis_paket}</div>
              {/* area quantity col-2 */}
              <div className="col-lg-2">Qty: {detail.qty}</div>
              {/* area harga paket col-3 */}
              <div className="col-lg-3">@ Rp {detail.harga}</div>
              {/* area harga total col-4 */}
              <div className="col-lg-3">Rp {detail.harga * detail.qty}</div>
              <div className="col-lg-2">
                <button
                  type="submit"
                  className="btn btn-danger btn-sm"
                  onClick={() => this.hapusData(detail.id_paket)}
                >
                  <i class="fa-solid fa-trash-can" ></i>
                </button>
              </div>
            </div>
          ))}
          <br />
          <button
            className="btn btn-outline-dark"
            type="submit"
            onClick={() => this.simpanTransaksi()}
          >
            Simpan
          </button>
          {/* modal untuk pilihan paket */}
          <div className="modal" id="modal_paket">
            <div className="modal-dialog modal-md">
              <div className="modal-content">
                <div className="modal-header bg-danger">
                  <h4 className="text-white">Pilih Paket</h4>
                </div>
                <div className="modal-body">
                  <form onSubmit={(e) => this.tambahPaket(e)}>
                    Pilih paket
                    <select
                      className="form-control mb-2"
                      value={this.state.id_paket}
                      onChange={(e) =>
                        this.setState({ id_paket: e.target.value })
                      }
                    >
                      <option value="" selected hidden>
                        Pilih Paket
                      </option>
                      {this.state.pakets.map((paket) => (
                        <option value={paket.id_paket}>
                          {paket.jenis_paket}
                        </option>
                      ))}
                    </select>
                    Jumlah (Qty)
                    <input
                      type="number"
                      className="form-control mb-2"
                      value={this.state.qty}
                      onChange={(e) => this.setState({ qty: e.target.value })}
                    />
                    <button type="submit" className="btn btn-outline-dark">
                      Tambah
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    );
  }
}