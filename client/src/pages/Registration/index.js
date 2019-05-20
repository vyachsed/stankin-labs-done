import React, { Component , Fragment} from 'react';
import { Redirect, Link, NavLink} from "react-router-dom";
// import './main.scss';
import Input from "../../components/Input";
import api from "../../requester";
import validateResponse from "../../utils/validateResponse";
import {withRouter} from "react-router-dom";

class Registration extends Component {
    state = {
        login: "",
        password: "",
        first_name: "",
        last_name: ""
    };
    handleFieldChange = ({name, value}) => this.setState({[name] : value});
    registration = async (e) => {
        e.preventDefault();
        const {setUser, history} = this.props;
        const data = {
            login: this.state.login,
            password: this.state.password,
            first_name: this.state.first_name,
            last_name: this.state.last_name
        };
        const response = await api.post('/users', data);
        if (validateResponse(response)) {
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
            <div className="registration-page">
                <form onSubmit={this.registration}>
                    <h2>Регистрация</h2>
                    <Input
                        onChange={this.handleFieldChange}
                        name = "first_name"
                        placeholder="Имя"
                        value={this.state.first_name}
                    />
                    <Input
                        onChange={this.handleFieldChange}
                        name = "last_name"
                        placeholder="Фамилия"
                        value={this.state.last_name}
                    />
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
                    <button>Регистрация</button>
                </form>
            </div>
        )
    }
}


export default withRouter(Registration);
