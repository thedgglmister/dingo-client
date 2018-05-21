import React, { Component } from 'react'
import { connect } from 'react-redux'

import * as actions from './redux-action-creators'

import { HeaderButton } from './dingo-redux-home'


const server_url = "https://dingo-test.herokuapp.com";

//need to validate here. alpha chracsters with spaces and hyphens, email validation? check if email is used?



const mapStateToProfilePageProps = (state) => ({
	userId: state.userId,
	origProfile: state.profiles[state.userId],
});

const mapDispatchToProfilePageProps = (dispatch) => ({
	returnHome: (e) => {
		e.preventDefault();
		dispatch(
			actions.changePage("HOME")
		);
	},
	updateProfile: (newProfile) => {
		dispatch(
			actions.updateProfiles(newProfile)
		);
	}
});


class ProfilePage extends Component {
	constructor(props) {
		super(props);

		this.state = {};
		this.state.img = this.props.origProfile.img;
		this.state.firstName = this.props.origProfile.firstName;
		this.state.lastName = this.props.origProfile.lastName;
		this.state.email = this.props.origProfile.email;
		this.state.errorMsg = "";
		this.state.imgChange = false;
		this.state.formChange = false;

		this.handleInputChange = this.handleInputChange.bind(this);
		this.saveProfile = this.saveProfile.bind(this);
		this.temp_handle_img_change = this.temp_handle_img_change.bind(this);
		this.temp_for_mobile = this.temp_for_mobile.bind(this); //doesnt need bind?
		this.handlePhotoClick = this.handlePhotoClick.bind(this);
	}

	handleInputChange(e) {
		const newFirstName = e.target.name == "firstName" ? e.target.value : this.state.firstName;
		const newLastName = e.target.name == "lastName" ? e.target.value : this.state.lastName;
		const newEmail = e.target.name == "email" ? e.target.value : this.state.email;
		const { firstName, lastName, email } = this.props.origProfile;
		const formChange = 
			(newFirstName.toLowerCase() != firstName.toLowerCase()
			|| newLastName.toLowerCase() != lastName.toLowerCase()
			|| newEmail.toLowerCase() != email.toLowerCase());
		this.setState({
			[e.target.name]: e.target.value,
			formChange: formChange
		});
	}

	handlePhotoClick(e) {
//web
//		document.getElementById("testt").click();
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
		const that = this;
		reader.onload = (e) => {
			that.setState({
				img: event.target.result, 
				imgChange: true
			});
		};
		reader.readAsDataURL(imgURI);
	}

	temp_handle_img_change(e) {
		if (e.target.files[0]) {
			const reader = new FileReader();
			const that = this;
	        reader.onload = function (event) {
        		that.setState({
        			img: event.target.result, 
        			imgChange: true
        		});
			};
	        reader.readAsDataURL(e.target.files[0]);
	    }
	}

	saveProfile(e) {
		e.preventDefault();
		const { img, firstName, lastName, email } = this.state;
		const requestData = { img, firstName, lastName, email };
		requestData.userId = this.props.userId;

		fetch(
			server_url + "/update_profile", 
			{
				method: 'POST',
				body: JSON.stringify(requestData),
				headers: {
					'Content-Type': 'application/json',
				},
			}
		).then(
			(response) => (response.status >= 200 && response.status < 300) ? response.json() : Promise.reject(new Error(response.statusText))
		).then(
			(data) => {
				if (data.errorMsg) {
					this.setState({errorMsg: data.errorMsg});
				}
				else {
					const newProfile = {};
					newProfile[this.props.userId] = data;
					this.props.updateProfile(newProfile);
					this.props.returnHome(e);
				}
			}
		).catch(
			(error) => console.log("Network Error: " + error.message)//put in alert or errorMsg?
		);
	}


	render() {
		return (
			<div>
				<ProfileHeader 
					save={this.state.imgChange || this.state.formChange}
					returnHome={this.props.returnHome}
					saveProfile={this.saveProfile}
				/>
				<ProfileForm 
					img={this.state.img}
					firstName={this.state.firstName}
					lastName={this.state.lastName}
					email={this.state.email}
					errorMsg={this.state.errorMsg}
					onChange={this.handleInputChange}
					handlePhotoClick={this.handlePhotoClick}
					temp_handle_img_change={this.temp_handle_img_change}
				/>
			</div>
		);
	}
}
ProfilePage = connect(mapStateToProfilePageProps, mapDispatchToProfilePageProps)(ProfilePage);


const ProfileHeader = (props) => {

	const css = {
		display: 'flex',
		justifyContent: 'space-between',
		backgroundColor: 'steelblue',
		height: '10vh',
		color: '#fff',

	};

	const saveCSS = {
		color: (props.save ? 'white' : 'lightgrey'),
	};

	const titleCSS = {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		textAlign: 'center',
		fontSize: '5vh',
	};

	return (
		<div style={css}>
			<HeaderButton onClick={props.returnHome}>
				&#8617;
			</HeaderButton>
			<div style={titleCSS}>
				EDIT PROFILE
			</div>
			<HeaderButton onClick={props.save ? props.saveProfile : null}>
				<span style={saveCSS}>Save</span>
			</HeaderButton>
		</div>
	);
}



const ProfileForm = (props) => {

	const css = {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		padding: '15vw',
	};

	const imgCSS = {
		borderRadius: '100%',
		width: '60vw',
		height: '60vw',
	};

	const labelCSS = {
		position: 'relative',
		display: 'block',
		width: '80vw',
		borderBottom: '1px solid lightgrey',
	};

	const inputCSS = {
		position: 'absolute',
		right: '0',
		width: '55vw',
		border: 'none',
	};

	const errorCSS = {
		color: 'red',
		height: '3vh',
		textAlign: 'center',
	};


	return (
		<div style={css}>
			<img style={imgCSS} src={props.img} onClick={props.handlePhotoClick} />
			<input id="testt" style={{opacity: '0'}} name="img" type="file" accept="image/*" onChange={props.temp_handle_img_change} />
			<form>
				<p style={errorCSS}>
					{props.errorMsg}
				</p>
				<label style={labelCSS}>
					First Name
					<input style={inputCSS} onChange={props.onChange} type="text" name="firstName" value={props.firstName} />
				</label>
				<br />
				<label style={labelCSS}>
					Last Name
					<input style={inputCSS} onChange={props.onChange} type="text" name="lastName" value={props.lastName} />
				</label>
				<br />
				<label style={labelCSS}>
					Email
					<input style={inputCSS} onChange={props.onChange} type="text" name="email" value={props.email} />
				</label>
			</form>
		</div>
	);
}





export default ProfilePage;