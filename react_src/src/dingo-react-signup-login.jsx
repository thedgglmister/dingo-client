import React from 'react';
import ReactDOM from 'react-dom';

//const server_url = "http://0.0.0.0:5000";
const server_url = "https://dingo-test.herokuapp.com";
const local_storage = {};


class Page extends React.Component {
	constructor(props) {
		super(props);

		this.state = {};
		this.state.login = false;

		this.handleToggleLogin = this.handleToggleLogin.bind(this);
	}

	handleToggleLogin(e) {
		e.preventDefault();
		this.setState({login: !this.state.login});
	}

	render() {
		return (
			<div>
				<Header 
					login={this.state.login} 
					handleToggleLogin={this.handleToggleLogin} />
				<Content 
					login={this.state.login} 
					handleAddUserId={this.props.handleAddUserId} />
			</div>
		);
	}
}

class Header extends React.Component {
	render() {

		const main_css = {
			height: '15vh',
			backgroundColor: 'steelblue',
			color: 'white',
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			textAlign: 'center',
			position: 'relative',
			fontSize: '5vh'
		};

		const button_css = {
			position: 'absolute',
			right: '0',
			top: '0',
			padding: '10px',
			fontSize: '2vh',
		}

		return (
			<div style={main_css}>
				{this.props.login ? "Log In" : "Sign Up"}
				<div style={button_css} onClick={this.props.handleToggleLogin}>
					{this.props.login ? "Sign Up" : "Login"}
				</div>
			</div>
		);
	}
}

class Content extends React.Component {
	render() {

		const css = {
			display: 'flex',
			height: '85vh',
			flexDirection: 'column',
			justifyContent: 'center',
			textAlign: 'center',
			backgroundColor: '#eee',
		}

		return (
			<div style={css}>
				{this.props.login ? 
					<LogInForm handleAddUserId={this.props.handleAddUserId} /> : 
					<SignUpForm handleAddUserId={this.props.handleAddUserId} />}
			</div>
		);
	}
}

class SignUpForm extends React.Component {
	constructor(props) {
		super(props);

		this.state = {};
		this.state.errorMsg = " ";
		this.state.firstName = "";
		this.state.lastName = "";
		this.state.emailAddress = "";
		this.state.password = "";
		this.state.confirmPassword = "";
		this.state.img = "missing.png";
		this.state.uploadPhoto = false;

		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleSubmitUserInfo = this.handleSubmitUserInfo.bind(this);
		this.handleSubmitSignUp = this.handleSubmitSignUp.bind(this);
		this.validateInput = this.validateInput.bind(this);
		this.temp_handle_img_change2 = this.temp_handle_img_change2.bind(this);
	}

	handleInputChange(e) {
		this.setState({
			[e.target.name]: e.target.value
		});
	}

	validateInput() { //validtae email format? 
		if (Object.values(this.state).includes("")) { 
			this.setState({errorMsg: "Fields cannot be empty"});
			return (false);
		}
		else if (this.state.password.length < 8) {
			this.setState({errorMsg: "Password must be at least 8 characters"});
			return (false);
		}
		else if (this.state.password != this.state.confirmPassword) {
			this.setState({errorMsg: "Passwords do not match"});
			return (false);
		}
		return (true);
	}

	temp_handle_img_change2(e) {
		if (e.target.files[0]) {
			var reader = new FileReader();
			var that = this;
	        reader.onload = (event) => that.setState({img: event.target.result});
	        reader.readAsDataURL(e.target.files[0]);
	    }
	}

	handleSubmitUserInfo(e) {  //what if it takes a long time to process request and I close app or push submit again?
		e.preventDefault(); //important

		if (!this.validateInput()) {
			return (false);
		}

		fetch(server_url + "/email_availability", {
			method: 'POST',
			body: JSON.stringify({emailAddress: this.state.emailAddress}),
			headers: {
      			"Content-Type": "application/json",
    		},
		})
		.then((response) => 
			(response.status >= 200 && response.status < 300) ? response.json() : Promise.reject(new Error(response.statusText))
		)
		.then((data) => 
			{
				if (data.email_available) {
					this.setState({uploadPhoto: true})
				}
				else {
					this.setState({errorMsg: "Email address " + this.state.emailAddress + " has already been used"})
				}
			}
		)
		.catch((error) => 
			{console.log("Network Error: " + error.message);} //put in alert or errorMsg?
		);
	}

	handleSubmitSignUp(e) {
		e.preventDefault();

		fetch(server_url + "/signup", {
			method: 'POST',
			body: JSON.stringify(this.state),
			headers: {
      			"Content-Type": "application/json",
    		},
		})
		.then((response) => (response.status >= 200 && response.status < 300) ? response.json() : Promise.reject(new Error(response.statusText)))
		.then((data) => this.props.handleAddUserId(data.user_id))
		.catch((error) => console.log("Network Error: " + error.message));
	}
	
	render() {

		const input_css = {
			width: '80vw',
			height: '5vh',
			margin: '5px',
			borderRadius: '4px',
			border: 'none',
			fontSize: '1em',
			padding: '3px',
		};

		const button_css = {
			backgroundColor: 'steelblue',
			color: 'white',
			width: '25vw',
			height: '6vh',
			borderRadius: '5px',
			margin: '20px',
		};

		const img_css = {
			borderRadius: '100%',
			width: '60vw',
			height: '60vw',
		};

		const error_css = {
			color: 'red',
			height: '3vh',
		};

		const userInfoForm = 
			<form>
				<p style={error_css}>{this.state.errorMsg}</p>
				<input
					style={input_css}
					name="firstName"
					type="text"
					value={this.state.firstName}
					placeholder="First Name"
					onChange={this.handleInputChange} />
				<br />
				<input
					style={input_css}
					name="lastName"
					type="text"
					value={this.state.lastName}
					placeholder="Last Name"
					onChange={this.handleInputChange} />
				<br />
				<input
					style={input_css}
					name="emailAddress"
					type="text"
					value={this.state.emailAddress}
					placeholder="Email"
					onChange={this.handleInputChange} />
				<br />
				<input
					style={input_css}
					name="password"
					type="text"
					value={this.state.password}
					placeholder="Password"
					onChange={this.handleInputChange} />
				<br />
				<input
					style={input_css}
					name="confirmPassword"
					type="text"
					value={this.state.confirmPassword}
					placeholder="Confirm Password"
					onChange={this.handleInputChange} />
				<br />
				<button style={button_css} onClick={this.handleSubmitUserInfo}>
					Next
				</button>
			</form>;

		const photoUploadForm =
			<form>
				<img style={img_css} src={this.state.img} onClick={function(e) {document.getElementById("testtt").click();}}/>
				<p>Upload Profile Picture</p>
				<input id="testtt" style={{opacity: '0'}} name="file" type="file" accept="image/*" onChange={this.temp_handle_img_change2} />
				<br />
				<button style={button_css} onClick={this.handleSubmitSignUp}>
					Sign Up
				</button>
			</form>;

		return (this.state.uploadPhoto ? photoUploadForm : userInfoForm);

	}
}

class LogInForm extends React.Component {
	constructor(props) {
		super(props);

		this.state = {};
		this.state.emailAddress = "";
		this.state.password = "";
		this.state.errorMsg = "";

		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleInputChange(e) {
		this.setState({
			[e.target.name]: e.target.value
		});
	}

	handleSubmit(e) {  //what if it takes a long time to process request and I close app or push submit again? //add spinner
		e.preventDefault(); //important

		fetch(server_url + "/login", {
			method: 'POST',
			body: JSON.stringify(this.state),
			headers: {
      			"Content-Type": "application/json",
    		},
		})
		.then((response) => 
			(response.status >= 200 && response.status < 300) ? response.json() : Promise.reject(new Error(response.statusText))
		)
		.then((data) => 
			{
				if (data.success) {
					this.props.handleAddUserId(data.user_id)
				}
				else {
					this.setState({errorMsg: data.error_msg});
				}
			}
		)
		.catch((error) => 
			{console.log("Network Error: " + error.message);} //put in alert or errorMsg?
		);
	}

	render() {
		const input_css = {
			width: '80vw',
			height: '5vh',
			margin: '5px',
			borderRadius: '4px',
			border: 'none',
			fontSize: '1em',
			padding: '3px',
		};

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
				<p style={error_css}>{this.state.errorMsg}</p>
				<input
					style={input_css}
					name="emailAddress"
					type="text"
					value={this.state.emailAddress}
					placeholder="Email"
					onChange={this.handleInputChange} />
				<br />
				<input
					style={input_css}
					name="password"
					type="text"
					value={this.state.password}
					placeholder="Password"
					onChange={this.handleInputChange} />
				<br />
				<button style={button_css} onClick={this.handleSubmit}>
					Log In
				</button>
			</form>
		);
	}
}

export default Page;










