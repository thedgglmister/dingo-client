import React, { Component } from 'react';
import { connect } from 'react-redux'
import * as actions  from './redux-action-creators'

import Route from './dingo-redux-button'
import ProfilePhotoForm from './dingo-redux-signup2'

//make a reusable button container component that takes a to prop and onclick does a changePage. renders props.children for presentation of buttons.

const server_url = "https://dingo-test.herokuapp.com";

//GIE SIGN UP AND LOGIN CONTAINERS REACT STATES INSTEAD.
//validate first and last name for alpha characters plus hyphen and space. no apostrophes because of python's title()

const SignUpPage = (props) => ( //presentational
	<div>
		<SignUpHeader />
		<SignUpBody>
			<SignUpFormContainer />
		</SignUpBody>
	</div>
);



const SignUpHeader = (props) => { //presentational
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
			Sign Up
			<Route to="LOGIN">
				<ToLoginButton />
			</Route>
		</div>
	);
}








const ToLoginButton = (props) => {   //presentational
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
			Log In
		</button>
	);
}











const SignUpBody = (props) => {  //presentational
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





class SignUpFormContainer extends Component {
	constructor(props) {
		super(props);

		this.state = {};
		this.state.currentForm = "USER_INFO"
		this.state.errorMsg = "";
		this.state.firstName = "";
		this.state.lastName = "";
		this.state.email = "";
		this.state.password = "";
		this.state.confirmPassword = "";
		this.state.img = "../img/missing.png";

		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleNextButtonClick = this.handleNextButtonClick.bind(this);
		this.handleSubmitButtonClick = this.handleSubmitButtonClick.bind(this);
		this.temp_for_mobile = this.temp_for_mobile.bind(this); //doesnt need bind?
		this.handlePhotoClick = this.handleNextButtonClick.bind(this);
	}

	handleInputChange(e) {
		this.setState({
			[e.target.name]: e.target.value
		});
	}

	handlePhotoClick(e) {
//web
//		document.getElementById("testtt").click();
//web

//mobile
//		navigator.camera.getPicture(
//			this.temp_for_mobile, 
//			null, //?
//			{quality: 50, allowEdit: false, sourceType: 0} ///true allows zooming? quality? //1 for camera, 0 for library
//		); 
//mobiile

		navigator.camera.getPicture(
			this.temp_for_mobile, 
			null, //?
			{quality: 50, allowEdit: true, sourceType: 0} ///true allows zooming? quality? //1 for camera, 0 for library
		);		
	}

	temp_for_mobile(imgURI) {
		const reader = new FileReader();
		reader.onload = (e) => {
			this.setState({
				img: e.result,
			})
		}
		reader.readAsDataURL(imgURI);
	}

	handleNextButtonClick(e) {
		e.preventDefault();
		const { firstName, lastName, email, password, confirmPassword } = this.state;
		fetch(
			server_url + "/validate_signup", 
			{
				method: 'POST',
				body: JSON.stringify({ firstName, lastName, email, password, confirmPassword }),
				headers: {
	  				"Content-Type": "application/json",
				},
	    	}
	    ).then(
	    	(response) => 
	    		(response.status >= 200 && response.status < 300) ? response.json() : Promise.reject(new Error(response.statusText))
	    ).then(
	    	(data) => {
				if (data.errorMsg) {
					this.setState({
						errorMsg: data.errorMsg
					});
				}
				else {
					this.setState({
						currentForm: "PROFILE_PHOTO"
					});
				}
	    	}
	    ).catch(
			(error) => 
				console.log("Network Error: " + error.message) 
	    );
	}

	handleSubmitButtonClick(e) {
		e.preventDefault();
		const { firstName, lastName, email, password, img } = this.state;
		fetch(
			server_url + "/signup", 
			{
				method: 'POST',
				body: JSON.stringify({ firstName, lastName, email, password, img }),
				headers: {
		  			"Content-Type": "application/json",
				},
			}
		).then(
			(response) =>
				(response.status >= 200 && response.status < 300) ? response.json() : Promise.reject(new Error(response.statusText))
		).then(
			(data) => {
				localStorage.setItem('userId', data.userId);
				this.props.updateUserId(data.userId);
				this.props.changePage("SPLASH");
			}
		).catch(
			(error) => console.log("Network Error: " + error.message)
		); //put in alert or errorMsg?
	}

	render() {
		if (this.state.currentForm == "USER_INFO") {
			return (
				<UserInfoForm 
					errorMsg={this.state.errorMsg}
					firstName={this.state.firstName}
					lastName={this.state.lastName}
					email={this.state.email}
					password={this.state.password}
					confirmPassword={this.state.confirmPassword}
					handleInputChange={this.handleInputChange}
					handleNextButtonClick={this.handleNextButtonClick}
				/>
			);
		}
		else {
			return (
				<ProfilePhotoForm
					img={this.state.img}
					handleInputChange={this.handleInputChange}
					handleSubmitButtonClick={this.handleSubmitButtonClick}
					handlePhotoClick={this.handlePhotoClick}
				/>
			);
		}
	}
}

const mapDispatchToSignUpFormContainerProps = (dispatch) => ({
	updateUserId: (userId) => {
		dispatch(
			actions.updateUserId(userId)
		);
	},
	changePage: (newPage) => {
		dispatch(
			actions.changePage(newPage)
		);
	}
});


SignUpFormContainer = connect(null, mapDispatchToSignUpFormContainerProps)(SignUpFormContainer);















const UserInfoForm = (props) => {

	const errorCSS = {
		color: 'red',
		height: '3vh',
	};

	const buttonCSS = {
		backgroundColor: 'steelblue',
		color: 'white',
		width: '25vw',
		height: '6vh',
		borderRadius: '5px',
		margin: '20px',
	};

	return (
		<form>
			<p style={errorCSS}>{props.errorMsg}</p>
			<Input 
				name="firstName"
				value={props.firstName}
				placeholder="First Name"
				onChange={props.handleInputChange}
			/>
			<br />
			<Input 
				name="lastName"
				value={props.lastName}
				placeholder="Last Name"
				onChange={props.handleInputChange}
			/>
			<br />
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
			<Input 
				name="confirmPassword"
				value={props.confirmPassword}
				placeholder="Confirm Password"
				onChange={props.handleInputChange}
			/>
			<br />
			<button 
				style={buttonCSS} 
				onClick={props.handleNextButtonClick}
		 	>
				Next
			</button>
		</form>

	);
}



const Input = (props) => {

	const input_css = {
		width: '80vw',
		height: '5vh',
		margin: '5px',
		borderRadius: '4px',
		border: 'none',
		fontSize: '1em',
		padding: '3px',
	};

	return (
		<input
			style={input_css}
			name={props.name}
			type="text"
			value={props.value}
			placeholder={props.placeholder}
			onChange={props.onChange}
		/>
	);
}






export { SignUpPage, Input };
