import React, { Component , Fragment} from 'react';
import { Redirect, Link, NavLink, withRouter} from "react-router-dom";
// import './main.scss';
import Input from "../../components/Input";
import api from "../../requester";
import validateResponse from "../../utils/validateResponse";

class Login extends Component {
    state = {
        login: "",
        password: ""
    };
    handleFieldChange = ({name,value}) => this.setState({[name] : value});
    login = async (e) => {
        e.preventDefault();
        const {setUser, history} = this.props;
        const data = {
            login: this.state.login,
            password: this.state.password
        };
        const response = await api.post('/users/login', data);
        if (validateResponse(response)) {
            console.log(response.data.user);
            setUser(response.data.user);
            history.push("/me");
        }
    };
    
    componentDidMount() {
        this.fetchUserProfile()
    }

    fetchUserProfile = async () => {
        const {history} = this.props
        const response = await api.get('/users/me')
        if (validateResponse(response)) {
            console.log(response.data.user);
            history.push("/me")
        }
        // вызова метода GET /users/me
        // в случае успешной обработки вызвать setUser
        // в случае получения Http status 401 перенаправить  пользователя на login
        // использовать await + try/catch или .then((response, err) => {})
    }
    
    render() {
        return (
            <div className="login-page">
                <form onSubmit={this.login}>
                    <h2>Логин</h2>
                    <Input
                        onChange={this.handleFieldChange}
                        name = "login"
                        placeholder="Логин"
                        value={this.state.login}
                    />
                    <Input
                        onChange={this.handleFieldChange}
                        name = "password"
                        placeholder="Пароль"
                        type = "password"
                        value={this.state.password}
                    />
                    <button>Войти</button>
                </form>
            </div>
        )
    }
}


export default withRouter(Login);
