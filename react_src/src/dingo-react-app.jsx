//const server_url = "http://0.0.0.0:5000";
const server_url = "https://dingo-test.herokuapp.com";
const local_storage = {};
local_storage.user_id = 16;

import React from 'react';
import ReactDOM from 'react-dom';
import Home from './dingo-react-home';
import SignUpPage from './dingo-react-signup-login';


class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {};
		this.state.user_id = local_storage.user_id;

		this.handleAddUserId = this.handleAddUserId.bind(this);
	}

	handleAddUserId(id) {
		local_storage.user_id = id;
		this.setState({user_id: local_storage.user_id});
	} 

	render() {
		return (this.state.user_id ? 
			<Home user_id={this.state.user_id} /> :
			<SignUpPage handleAddUserId={this.handleAddUserId} />);
	}
}




ReactDOM.render( //if loggin in render home, else render signup //put in app class, not global.
	<App />,
	document.getElementById('root')
);