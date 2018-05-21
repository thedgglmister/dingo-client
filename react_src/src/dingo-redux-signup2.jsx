import React from 'react'; //need this?


//make a reusable button container component that takes a to prop and onclick does a changePage. renders props.children for presentation of buttons.















const ProfilePhotoForm = (props) => {

	const img_css = {
		borderRadius: '100%',
		width: '60vw',
		height: '60vw',
	};

	const button_css = {
		backgroundColor: 'steelblue',
		color: 'white',
		width: '25vw',
		height: '6vh',
		borderRadius: '5px',
		margin: '20px',
	};

	return (
		<form>
			<img style={img_css} src={props.img} onClick={props.handlePhotoClick}/>
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
			<button style={button_css} onClick={props.handleSubmitButtonClick}>
				Sign Up
			</button>
		</form>
	);
};



export default ProfilePhotoForm;



