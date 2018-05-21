import React, { Component } from 'react';
import { connect } from 'react-redux'
import * as actions from './redux-action-creators'

import Avatar from './dingo-redux-avatar'

//get rid of Routes

//i can sometimes get an error when i accept an invite then go back home. Cannot read property 'userId' of undefined happens in <GamesListItemPlayers>

const server_url = "https://dingo-test.herokuapp.com";


const HomePage = (props) => {
	return (
		<div>
			<HomeHeader />
			<NewGameButtonContainer />
			<GamesListContainer />
		</div>
	);
}


const mapStateToHomeHeaderProps = (state) => ({ //temp just for name or use this container to pass into buttons as well
	name: state.profiles[state.userId].firstName + " " + state.profiles[state.userId].lastName,
});

let HomeHeader = (props) => { //let just for now because const cant be connected.

	const css = {
		display: 'flex',
		justifyContent: 'space-between',
		backgroundColor: 'steelblue',
		height: '10vh',
		color: '#fff',
	};

	const title_css = {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		textAlign: 'center',
		fontSize: '5vh',
	};

	return (
		<div style={css}>
			<ProfileButtonContainer />
			<div style={title_css}>
				{props.name}
			</div>	
			<InvsButtonContainer />
		</div>
	);	
}
HomeHeader = connect(mapStateToHomeHeaderProps, null)(HomeHeader);


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
		width: '15vw',
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
		backgroundColor: 'red',
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

	const gamesListItems = props.games.map(
		(game) => (
			<GamesListItemContainer 
				key={game.gameId}
				gameId={game.gameId} 
			/>
		)
	);

	return (
		<div>
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
	goToNots: (e) => {
		e.preventDefault();
		dispatch(
			actions.goToGame(ownProps.gameId)
		);
		dispatch(
			actions.toggleNots()
		);
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
	};

	return (
		<a 
			style={css}
			onClick={props.onClick}
		>
			X
		</a>
	);
}


const GamesListItemPlayers = (props) => {

	const css = {
		display: 'flex',
		width: '70vw',
		borderRight: '1px solid lightgrey', //temp?
		overflow: 'scroll',
		borderBottom: '1px solid lightgrey',
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
		backgroundColor: (props.unreadNotsCount > 0 ? 'red' : 'lightgrey'),
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

