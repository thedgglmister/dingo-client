import React, { Component } from 'react'
import { connect } from 'react-redux'

import * as actions  from './redux-action-creators'

import Route from './dingo-redux-button'

import { Input } from './dingo-redux-signup'

const server_url = "https://dingo-test.herokuapp.com";


const LoginPage = (props) => ( //presentational
	<div>
		<LoginHeader />
		<LoginBody>
			<LoginFormContainer />
		</LoginBody>
	</div>
);



const LoginHeader = (props) => { //presentational
	const css = {
		height: '10vh',
		backgroundColor: 'steelblue',
		color: 'white',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		textAlign: 'center',
		position: 'relative',
		fontSize: '5vh'
	};

	return (
		<div style={css}>
			Log In
			<Route to="SIGNUP">
				<ToSignUpButton />
			</Route>
		</div>
	);
}








const ToSignUpButton = (props) => {   //presentational
	const css = {
		position: 'absolute',
		right: '0',
		top: '0',
		padding: '10px',
		fontSize: '2vh',
		color: '#fff',
	};

	return (
		<button style={css} onClick={props.handleClick}>
			Sign Up
		</button>
	);
}











const LoginBody = (props) => {  //presentational
	const css = {
		display: 'flex',
		height: '90vh',
		flexDirection: 'column',
		justifyContent: 'center',
		textAlign: 'center',
		backgroundColor: '#eee',
	}

	return (
		<div style={css}>
			{props.children}
		</div>
	);
}













const mapDispatchToLoginFormContainerProps = (dispatch) => ({
	updateUserId: (userId) => {
		dispatch(
			actions.updateUserId(userId)
		);
	},
	changePage: (newPage) => {
		dispatch(
			actions.changePage(newPage)
		);
	},
});





class LoginFormContainer extends Component {
	constructor(props) {
		super(props);

		this.state = {};
		this.state.errorMsg = "";
		this.state.email = "";
		this.state.password = "";

		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleSubmitButtonClick= this.handleSubmitButtonClick.bind(this);
	}

	handleInputChange(e) {
		this.setState({
			[e.target.name]: e.target.value
		});
	}

	handleSubmitButtonClick(e) {
		e.preventDefault();
		const { email, password } = this.state;
		fetch(
			server_url + "/login", 
			{
				method: 'POST',
				body: JSON.stringify({ email, password }),
				headers: {
		  			"Content-Type": "application/json",
				},
			}
		).then(
			(response) =>
				(response.status >= 200 && response.status < 300) ? response.json() : Promise.reject(new Error(response.statusText))
		).then(
			(data) => {
				if (data.success) {
					localStorage.setItem('userId', data.userId);
					this.props.updateUserId(data.userId);
					this.props.changePage("SPLASH");
				}
				else {
					this.setState({
						"errorMsg": data.errorMsg
					});
				}
			}
		).catch(
			(error) => console.log("Network Error: " + error.message)
		); //put in alert or errorMsg?
	}

	render() {
		return (
			<LoginForm
				errorMsg={this.state.errorMsg}
				email={this.state.email}
				password={this.state.password}
				handleInputChange={this.handleInputChange}
				handleSubmitButtonClick={this.handleSubmitButtonClick}
			/>
		);
	}
}
LoginFormContainer = connect(null, mapDispatchToLoginFormContainerProps)(LoginFormContainer);




const LoginForm = (props) => {

	const button_css = {
		backgroundColor: 'steelblue',
		color: 'white',
		width: '25vw',
		height: '6vh',
		borderRadius: '5px',
		margin: '20px',
	};

	const error_css = {
		color: 'red',
		height: '3vh',
	};

	return (
		<form>
			<p style={error_css}>{props.errorMsg}</p>
			<Input
				name="email"
				value={props.email}
				placeholder="Email"
				onChange={props.handleInputChange}
			/>
			<br />
			<Input
				name="password"
				value={props.password}
				placeholder="Password"
				onChange={props.handleInputChange}
			/>
			<br />
			<button 
				style={button_css} 
				onClick={props.handleSubmitButtonClick}
			>
				Log In
			</button>
		</form>
	);
}


export default LoginPage;

