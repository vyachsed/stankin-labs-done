import React, { Component , Fragment} from 'react';
import { withRouter } from 'react-router-dom';
import api from "../../requester";
import validateResponse from "../../utils/validateResponse";

class Me extends Component {
    componentDidMount() {
        this.fetchUserProfile()
    }
    
    fetchUserProfile = async () => {
        const {setUser, history} = this.props
        const response = await api.get('/users/me')
        if (validateResponse(response)) {
            console.log(response.data.user);
            setUser(response.data.user);
            //history.push("/me");
        }
        else {
            history.push("/login")
        }
        // вызова метода GET /users/me
        // в случае успешной обработки вызвать setUser
        // в случае получения Http status 401 перенаправить  пользователя на login
        // использовать await + try/catch или .then((response, err) => {})
    }
    
    logout = async (e) => {
        e.preventDefault()
        const {setUser, history} = this.props
        const response = await api.get('/users/logout')
        setUser(response.data.user)
        history.push("/login")
    }
    render(){
        const {user = {}} = this.props
        return (
            <div className="me">
                <div className="me__profile">
                    <h2>Профиль</h2>
                    <div className="me__property">
                        <p>
                            <span className="first">Ваше имя: </span>
                            <span> {user.first_name} {user.last_name}</span>
                        </p>
                    </div>
                    <div className="me__property" id="lastProp">
                        <p>
                            <span className="first">Ваш логин: </span>
                            <span> {user.login}</span>
                        </p>
                    </div>
                </div>
                <button onClick={this.logout}>Выйти</button>
            </div>
        )
    }
}

export default withRouter(Me)