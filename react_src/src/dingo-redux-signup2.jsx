import React from 'react'; //need this?


//make a reusable button container component that takes a to prop and onclick does a changePage. renders props.children for presentation of buttons.















const ProfilePhotoForm = (props) => {

	const imgCSS = {
		borderRadius: '100%',
		width: '60vw',
		height: '60vw',
	};

	const signupCSS = {
		display: 'block',
		backgroundColor: 'steelblue',
		color: 'white',
		width: '20vw',
		height: '3vh',
		borderRadius: '5px',
		margin: '10px auto',
		padding: '4px',
	};

	return (
		<form>
			<img style={imgCSS} src={props.img} onClick={props.handlePhotoClick}/>
			<p>Upload Profile Picture</p>
			<input id="testtt" style={{opacity: '0'}} name="img" type="file" accept="image/*" onChange={(e) => { //temp
				if (e.target.files[0]) {
					const reader = new FileReader();
			        reader.onload = (event) => {
			        	const fakeEvent = {target: {name: "img", value: event.result}};
			        	props.handleInputChange(fakeEvent);
			        }
			        reader.readAsDataURL(e.target.files[0]);
			    }
			}} />
			<br />
			<a style={signupCSS} onClick={props.handleSubmitButtonClick}>
				Sign Up
			</a>
		</form>
	);
};



export default ProfilePhotoForm;



