import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actions from './redux-action-creators'

import Avatar from './dingo-redux-avatar'

//get rid of Routes

//i can sometimes get an error when i accept an invite then go back home. Cannot read property 'userId' of undefined happens in <GamesListItemPlayers>

const server_url = "https://dingo-test.herokuapp.com";


const HomePage = (props) => {
	return (
		<div style={{transition: 'opacity 2000ms ease-in-out'}}>
			{props.status}
			<HomeHeader />
			<NewGameButtonContainer />
			<GamesListContainer />
		</div>
	);
}



const HomeHeader = (props) => { 

	const css = {
		display: 'flex',
		justifyContent: 'space-between',
		backgroundColor: 'steelblue',
		height: '10vh',
		color: '#fff',
		borderBottom: '1px solid #264662'
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
			<ProfileButtonContainer />
			<div style={titleCSS}>
				DINGO
			</div>	
			<InvsButtonContainer />
		</div>
	);	
}


const mapStateToInvsButtonProps = (state) => ({
	invCount: state.invs.length
});

const mapDispatchToInvsButtonProps = (dispatch) => ({
	onClick: (e) => {
		e.preventDefault();
		dispatch(
			actions.changePage("INVITATIONS")
		);
	}
});

class InvsButtonContainer extends Component {
	render() {
		return (
			<HeaderButton onClick={this.props.onClick}>
				{this.props.invCount > 0 ? <Alert count={this.props.invCount} /> : 'I'}
			</HeaderButton>
		);
	}	
}
InvsButtonContainer = connect(mapStateToInvsButtonProps, mapDispatchToInvsButtonProps)(InvsButtonContainer);



const HeaderButton = (props) => {
	const css = {
		width: props.width ? props.width : '15vw',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		zIndex: '1',
	};

	return (
		<a 
			style={css}
			onClick={props.onClick}
		>
			{props.children}
		</a>
	);
}


const Alert = (props) => {

	const css = {
		backgroundColor: '#c00',
		borderRadius: '100%',
		width: '6vw',
		height: '6vw',
		fontSize: '4vw',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		textAlign: 'center',
	};

	return (
		<div style={css}>
			{props.count}
		</div>
	);
}






const mapDispatchToProfileButtonProps = (dispatch) => ({
	onClick: (e) => {
		e.preventDefault();
		dispatch(
			actions.changePage("PROFILE")
		);
	}
});

class ProfileButtonContainer extends Component {
	render() {
		return (
			<HeaderButton onClick={this.props.onClick}>
				P
			</HeaderButton>
		);
	}
}
ProfileButtonContainer = connect(null, mapDispatchToProfileButtonProps)(ProfileButtonContainer);






const mapStatetoNewGameButtonProps = (state) => ({
	userId: state.userId
});


const mapDispatchToNewGameButtonProps = (dispatch) => ({
	addNewGame: (games, players, matches, nots) => {
		dispatch(
			actions.newGame(games, players, matches, nots)
		);
	}
});


class NewGameButtonContainer extends Component {
	constructor(props) {
		super(props);

		this.handleNewGameClick = this.handleNewGameClick.bind(this);
	}

	handleNewGameClick(e) {
		alert(JSON.stringify(cordova));
		alert(JSON.stringify(SpinnerDialog));
		alert(JSON.stringify(SpinnerDialog.show));
		SpinnerDialog.show(null, null, true);
	/*
		e.preventDefault();
		fetch(
			server_url + "/new_game", 
			{
				method: 'POST',
				body: JSON.stringify({userId: this.props.userId}),
				headers: {
					'Content-Type': 'application/json',
				},
			}
		).then(
			(response) => (response.status >= 200 && response.status < 300) ? response.json() : Promise.reject(new Error(response.statusText))
		).then(
			(data) => this.props.addNewGame(data.games, data.players, data.matches, data.nots)
		).catch(
			(error) => console.log("Network Error: " + error.message)//put in alert or errorMsg?
		);
	*/
	}

	render() {
		return (
			<NewGameButton onClick={this.handleNewGameClick} />
		);
	}
}
NewGameButtonContainer = connect(mapStatetoNewGameButtonProps, mapDispatchToNewGameButtonProps)(NewGameButtonContainer);



const NewGameButton = (props) => {

	const css = {
		height: '10vh',
		backgroundColor: 'lightgrey',
		borderBottom: '1px solid grey',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		textAlign: 'center',
	}

	return (
		<a style={css} onClick={props.onClick}>
			NEW GAME
		</a>
	);
}







const mapStateToGamesListProps = (state) => ({
	games: state.games
});

class GamesListContainer extends Component {
	render() {
		return (
			<GamesList games={this.props.games} />
		);
	}
}
GamesListContainer = connect(mapStateToGamesListProps, null)(GamesListContainer);



const GamesList = (props) => {

	const css = {
		height: '80vh',
		overflow: 'scroll',
	};

	const gamesListItems = props.games.map(
		(game) => (
			<GamesListItemContainer 
				key={game.gameId}
				gameId={game.gameId} 
			/>
		)
	);

	return (
		<div style={css}>
			{gamesListItems}
		</div>
	);
}





const mapDispatchToGamesListItemProps = (dispatch, ownProps) => ({
	leaveGame: () => {
		dispatch(
			actions.leaveGame(ownProps.gameId)
		);
	},
	goToGame: (e) => {
		e.preventDefault();
		dispatch(
			actions.goToGame(ownProps.gameId)
		);
	},
	goToNots: (e) => { //eventually just put on click on container of playersarea and nots alert area
		e.preventDefault();
		dispatch(
			actions.goToGame(ownProps.gameId)
		);
	//	dispatch(
	//		actions.toggleNots()
	//	);
	},	
});


const mapStateToGamesListItemProps = (state, ownProps) => ({
	userId: state.userId,
	profiles: state.players[ownProps.gameId].slice(1).map(
		(playerId) => (state.profiles[playerId])
	),
	unreadNotsCount: state.nots[ownProps.gameId].reduce((total, not) => total + (not.read ? 0 : 1), 0)
});



class GamesListItemContainer extends Component {
	constructor(props) {
		super(props);

		this.handleLeaveGameClick = this.handleLeaveGameClick.bind(this);
	}

	handleLeaveGameClick(e) {
		e.preventDefault();
		fetch(
			server_url + "/leave_game", 
			{
				method: 'POST',
				body: JSON.stringify({userId: this.props.userId, gameId: this.props.gameId}),
				headers: {
					'Content-Type': 'application/json',
				},
			}
		).then(
			(response) => (
				(response.status >= 200 && response.status < 300) ? response : Promise.reject(new Error(response.statusText))
			)
		).then(
			(data) => {
				this.props.leaveGame()
			}
		).catch(
			(error) => console.log("Network Error: " + error.message) //put in alert or errorMsg? 
		);
	}

	render() {
		return (
			<GamesListItem 
				profiles={this.props.profiles}
				unreadNotsCount={this.props.unreadNotsCount}
				leaveGame={this.handleLeaveGameClick}
				goToGame={this.props.goToGame}
				goToNots={this.props.goToNots}
			/>
		);
	}
}
GamesListItemContainer = connect(mapStateToGamesListItemProps, mapDispatchToGamesListItemProps)(GamesListItemContainer);









const GamesListItem = (props) => {
	const css = {
		display: 'flex',
		height: '15vh',
	};

	return (
		<div style={css}>
			<LeaveGameButton 
				onClick={props.leaveGame}
			/>
			<GamesListItemPlayers
				profiles={props.profiles}
				onClick={props.goToGame}
			/>
			<GamesListItemNotificationsButton
				unreadNotsCount={props.unreadNotsCount}
				onClick={props.goToNots}
			/>
		</div>

	);
}



const LeaveGameButton = (props) => {

	const css = {
		display: 'flex',
		width: '10vw',
		flexDirection: 'column',
		justifyContent: 'center',
		textAlign: 'center',
		color: 'grey',
	};

	return (
		<a 
			style={css}
			onClick={props.onClick}
		>
			&times;
		</a>
	);
}


const GamesListItemPlayers = (props) => {

	const css = {
		display: 'flex',
		width: '70vw',
		overflow: 'scroll',
		borderBottom: '1px solid lightgrey',
		borderRight: '1px solid #e8e8e8',
	};

	const justYouCSS = {
		display: 'flex',
		width: '100%',
		height: '100%',	
		flexDirection: 'column',
		justifyContent: 'center',
		textAlign: 'center',	
	};

	const avatars = props.profiles.map(
		(profile) => (
			<Avatar 
				key={profile.userId}
				width='18vw'
				img={profile.img} 
				name={profile.firstName} 
			/>
		)
	);

	const justYou =
		<div style={justYouCSS}>
			Just You
		</div>;

	return (
		<a 
			style={css} 
			onClick={props.onClick}
		>
			{props.profiles.length > 0 ? avatars : justYou} 
		</a>
	);
}



const GamesListItemNotificationsButton = (props) => {

	const css = {
		display: 'flex',
		width: '20vw',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		borderBottom: '1px solid lightgrey',
	};

	const notsAlertCSS = {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		textAlign: 'center',
		width: '10vw',
		height: '10vw',
		borderRadius: '100%',
		color: (props.unreadNotsCount > 0 ? '#fff' : '#000'),
		backgroundColor: (props.unreadNotsCount > 0 ? '#c00' : 'transparent'),
	};

	return (
		<a 
			style={css}
			onClick={props.onClick}
		>
			<div style={notsAlertCSS}>
				{props.unreadNotsCount}
			</div>
		</a>
	);
}



export { HomePage, HeaderButton, Alert };

