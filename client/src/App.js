import React, { Component , Fragment} from 'react';
import { BrowserRouter as Router, Route, Redirect} from "react-router-dom";
import 'normalize.css';
import './styles/index.scss';
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import Me from "./pages/Me";
import api from "./requester";
import validateResponse from "./utils/validateResponse";

class App extends Component {
    constructor(props) {
        super(props)
        this.state = { user: undefined }
    }
    fetchUserProfile = async () => {
        //const {history} = this.props
        const response = await api.get('/users/me')
        if (validateResponse(response)) {
            console.log(response.data)
            return(response.data.user)
            //history.push("/me")
        }
        return null
    }
    async componentDidMount() {
        const data = await this.fetchUserProfile()
        this.setState({ user: data })
    }
    setUser = (user) => this.setState({user});
    render() {
        /*
          console.log('user!!!!!!!!!')
          console.log(this.state.user)
        */
        return(
            this.state.user === undefined ?
            null : (
            <Router>
                <Fragment>
                    <Route exact
                        path="/"
                        render={() => <Redirect to="/me" />}
                    />
                    <Route
                        path="/login"
                        render={
                            this.state.user === undefined ?
                            null : this.state.user ?
                            () => <Redirect to="/me" /> :
                            () => <Login setUser={this.setUser} {...this.state}/>
                        }
                    />
                    <Route
                        path="/registration"
                        render={
                            this.state.user === undefined ?
                            null : this.state.user ?
                            () => <Redirect to="/me" /> :
                            () => <Registration setUser={this.setUser} {...this.state}/>
                        }
                    />
                    <Route
                        path="/me"
                        render={
                            this.state.user === undefined ?
                            null : this.state.user ?
                            () => <Me setUser={this.setUser} {...this.state}/> :
                            () => <Redirect to="/login" />
                        }
                    />
                </Fragment>
            </Router>
        )
    )
    }
}


export default App;
