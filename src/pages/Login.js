���B�TƤS~5B��/6v�*C>� ��6,l|k1,"�(C8B�Z�EB�M=MH~ED� 7Zb��!�B�!?B �                                                                                                                                                                                                                                                                                                                                                                                                                                               point, request)
        .then(result =>{
            if (result.data.logged) {
                // store token in local storaage
                localStorage.setItem("token", result.data.token)
                localStorage.setItem("user", JSON.stringify(result.data.user))
                window.alert("Congratulation! You're logged babe")
                window.location.href = "/"

            } else {
                window.alert("Sorry, your username and password is invalid")
            }
        })
        .catch(error => console.log(error))
    }

    render(){
        return(
            <div className="login-page">
            <div className= "container d-flex h-100 justify-content-center align-item-center"> 
                <div className="col-lg-5 my-5">
                    <div className="card ">
                    <div className="login-header text-center mb-5">
                    <img src="login.png" width="350px"/>
                    <h3>Welcome to Londry!</h3>
                    <h5>Please login your account</h5>
                    </div>
                        <div className="card-body">
                            <form onSubmit={ev => this.loginProcess(ev)}>
                                Username
                                <div class="input-group flex-nowrap ">
                                <span class="input-group-text" id="addon-wrapping">@</span>
                                <input type="text" className="form-control"
                                required value={this.state.username}
                                onChange={ev => this.setState({username: ev.target.value})}
                                />
                                </div>

                                Password
                                <input type="password" className="form-control mb-2"
                                required value={this.state.password}
                                onChange={ev => this.setState({password: ev.target.value})}
                                />

                                <button type="submit" className="btn btn-outline-dark">
                                    Log in
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
export default Login