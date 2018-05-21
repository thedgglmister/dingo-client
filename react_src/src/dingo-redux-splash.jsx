import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actions from './redux-action-creators'

const server_url = "https://dingo-test.herokuapp.com";
//const server_url = "http://0.0.0.0:5000";



const mapStateToSplashContainerProps = (state) => ({
	userId: state.userId
});

const mapDispatchToSplashContainerProps = (dispatch) => ({
	goToHomePage: () => {
		dispatch(
			actions.changePage("HOME")
		);
	},
	addAllData: (data) => {
		dispatch(
			actions.addAllData(data)
		);	
	},
});


class SplashContainer extends Component {
	componentDidMount() {
		this.loadAllData();
	}

	loadAllData() {
		const startTime = Date.now();

		fetch(
			server_url + "/all_data", 
			{
				method: 'POST',
				body: JSON.stringify({userId: this.props.userId}),
				headers: {
					'Content-Type': 'application/json',
				},
			}
		).then(
			(response) =>
				(response.status >= 200 && response.status < 300) ? response.json() : Promise.reject(new Error(response.statusText))
		).then(
			(data) => {
				const timeElapsed = Date.now() - startTime
				setTimeout(() => {
					//DISPATCH ALL DATA TO STATE
					this.props.addAllData(data);
					this.props.goToHomePage();
				}, 1000 - timeElapsed);
			}
		).catch(
			(error) => console.log("Network Error: " + error.message) //put in alert or errorMsg?
		);
	}

	render() {
		return (
			<Splash />
		);
	}
}
SplashContainer = connect(mapStateToSplashContainerProps, mapDispatchToSplashContainerProps)(SplashContainer);



const Splash = (props) => {
	const container_css = {
		height: '100vh',
		width: '100vw',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	};

	const img_css = {
		width: '60vw',
	};

	const randint = Math.floor(Math.random() * 6);

	return (
		<div style={container_css}>
			<img style={img_css} src={"../img/splash" + randint + ".png"} />
		</div>
	);
}

export default SplashContainer;