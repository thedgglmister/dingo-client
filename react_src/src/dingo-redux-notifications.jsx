import React, { Component } from 'react';
import { connect } from 'react-redux'
import * as actions from './redux-action-creators'

import Avatar from './dingo-redux-avatar'

const server_url = "https://dingo-test.herokuapp.com";


const NotsMenu = (props) => {

	const css = {
		position: 'absolute',
		top: '0',
		backgroundColor: '#fff',
		height: '100vh',
		width: '100vw',
		zIndex: '2',
	};

	return (
		<div style={css}>
			<NotsHeader />
			<NotsListContainer />
		</div>
	);
}



const NotsHeader = (props) => {

	const css = {
		width: '100vw',
		height: '10vh',
		backgroundColor: 'orange',
		position: 'relative',
		color: '#fff',
		fontSize: '8vw',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		textAlign: 'center',
	};

	return (
		<div style={css}>
			<CancelButtonContainer />
			NOTIFICATIONS
		</div>
	);
}




const mapDispatchToCancelButtonProps = (dispatch) => ({
	closeMenu: (e) => {
		e.preventDefault();
		dispatch(
			actions.toggleNots()
		);
	}
});

class CancelButtonContainer extends Component {
	render() {
		return (
			<CancelButton onClick={this.props.closeMenu} />
		);
	}
}
CancelButtonContainer = connect(null, mapDispatchToCancelButtonProps)(CancelButtonContainer);


const CancelButton = (props) => {

	const css = {
		position: 'absolute',
		height: '10vh',
		width: '15vw',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		textAlign: 'center',
		fontSize: '4vw',
	};

	return (
		<a style={css} onClick={props.onClick}>
			&#8617;
		</a>
	);
}



const formatMsg = (type, name) => {
	switch (type) {
		case "join":
			return (name + " joined the game");
		case "leave":
			return (name + " left the game");
		default:
			return (name + " found a " + type);
	}
}



const mapStateToNotsListProps = (state) => ({
	nots: state.nots[state.currentGame].map(
		(not) => ({
			notId: not.notId,
			img: state.profiles[not.fromId].img,
			msg: formatMsg(not.type, state.profiles[not.fromId].firstName),
			read: not.read
		})
	),
	gameId: state.currentGame,
	userId: state.userId,
});

const mapDispatchToNotsListProps = (dispatch) => ({
	markNotsRead: (notIds) => {
		dispatch(
			actions.markNotsRead(notIds)
		);
	}
});

class NotsListContainer extends Component {

	componentDidMount() {
		fetch(
			server_url + "/read_nots", 
			{
				method: 'POST',
				body: JSON.stringify({gameId: this.props.gameId, userId: this.props.userId}),
				headers: {
	      			"Content-Type": "application/json",
	    		},
			}
		).then(
			(response) => (
				(response.status >= 200 && response.status < 300) ? response : Promise.reject(new Error(response.statusText))
			)
		).catch(
			(error) => console.log("Network Error: " + error.message) //put in alert or errorMsg?
		);
	}

	componentWillUnmount() {
		this.props.markNotsRead(this.props.gameId);
	}

	render() {
		const notsItems = this.props.nots.map(
			(not) => (
				<NotsItem
					key={not.notId}				
					img={not.img}
					msg={not.msg}
					read={not.read}
				/>
			)
		);

		return (
			<NotsList
				items={notsItems}
			/>
		);
	}
}
NotsListContainer = connect(mapStateToNotsListProps, mapDispatchToNotsListProps)(NotsListContainer);


const NotsList = (props) => {
//make enough empty slots to fit in screen, fill it top few with items...?


	return (
		<div>
			{props.items}
		</div>
	);
}






const NotsItem = (props) => {

	const css = {
		display: 'flex',
		justifyContent: 'flex-start',
//		marginLeft: '5vw',
//		width: '95vw',
		borderBottom: '1px solid lightgrey',
		padding: '10px 0 10px 5vw',
		backgroundColor: props.read ? '#eee' : '#fff',
	};

	const nameCSS = {
		display: 'flex',
		alignItems: 'center',
		marginLeft: '60px',
	};

	return (
		<div style={css}>
			<Avatar
				img={props.img}
				width='10vw'
			/>
			<div style={nameCSS}>
				{props.msg}
			</div>
		</div>
	);
}



export default NotsMenu;