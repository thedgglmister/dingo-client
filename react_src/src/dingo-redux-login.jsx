import React, { Component } from 'react'
import { connect } from 'react-redux'

import * as actions  from './redux-action-creators'

import { Input, LoginSignupToggleButton } from './dingo-redux-signup'

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
		fontSize: '5vh',
		borderBottom: '1px solid #264662'
	};

	return (
		<div style={css}>
			Log In
			<SignupButtonContainer />
		</div>
	);
}





const mapDispatchToSignupButtonProps = (dispatch) => ({
	handleClick: (e) => {
		e.preventDefault();
		dispatch(
			actions.changePage("SIGNUP")
		);
	}
});

class SignupButtonContainer extends Component {
	render() {
		return (
			<LoginSignupToggleButton 
				text="Sign Up"	
				onClick={this.props.handleClick}
			/>
		);
	}
}
SignupButtonContainer = connect(null, mapDispatchToSignupButtonProps)(SignupButtonContainer);
















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

	const LoginCSS = {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		textAlign: 'center',
		backgroundColor: 'steelblue',
		color: 'white',
		width: '25vw',
		height: '6vh',
		borderRadius: '5px',
		margin: '10px auto',
	};

	const errorCSS = {
		color: 'red',
		height: '3vh',
	};

	return (
		<form>
			<p style={errorCSS}>{props.errorMsg}</p>
			<Input
				name="email"
				value={props.email.toLowerCase()}
				placeholder="Email"
				onChange={props.handleInputChange}
			/>
			<br />
			<Input
				name="password"
				password={true}
				value={props.password}
				placeholder="Password"
				onChange={props.handleInputChange}
			/>
			<br />
			<a 
				style={LoginCSS} 
				onClick={props.handleSubmitButtonClick}
			>
				Log In
			</a>
		</form>
	);
}


export default LoginPage;

