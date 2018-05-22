import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actions from './redux-action-creators'

import { HeaderButton, Alert } from './dingo-redux-home'
import { AddPlayerMenu } from './dingo-redux-addplayer'
import NotsMenu from './dingo-redux-notifications' //?? are some of these not used?
import Avatar from './dingo-redux-avatar'

const server_url = "https://dingo-test.herokuapp.com";

//fix all ../img/ paths. what is teh righ tway to do this?



const mapStateToGamePageProps = (state) => ({
	addPlayerMenuOpen: state.addPlayerMenuOpen,
	notsMenuOpen: state.notsMenuOpen,
	userId: state.userId,
});


const mapDispatchToGamePageProps = (dispatch) => ({ ///temp!
	changePlayer: (id) => {
		dispatch(
			actions.changePlayer(id)
		);
	}
})

class GamePage extends Component {

	componentWillUnmount() {
		this.props.changePlayer(this.props.userId)
	}

	render() {
		return (
			<div>
				<GameHeader />
				<GameBodyContainer />
				{this.props.addPlayerMenuOpen && <AddPlayerMenu />}
				{this.props.notsMenuOpen && <NotsMenu />}
			</div>
		);
	}
}
GamePage = connect(mapStateToGamePageProps, mapDispatchToGamePageProps)(GamePage);






const GameHeader = (props) => {

	const css = {
		display: 'flex',
		justifyContent: 'space-between',
		backgroundColor: 'steelblue',
		height: '10vh',
		color: '#fff',
		borderBottom: '1px solid #264662',
		paddingRight: '3vw',
	};

	const titleCSS = {
		position: 'absolute',
		left: '0',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		textAlign: 'center',
		fontSize: '5vh',
		width: '100vw',
		height: '10vh',
	};

	const menuButtonsCSS = {
		display: 'flex',
	}

	return (
		<div style={css}>
			<ReturnButtonContainer />
			<div style={titleCSS}>
				DINGO
			</div>	
			<div style={menuButtonsCSS}>
				<AddPlayerButtonContainer />
				<NotsButtonContainer />
			</div>
		</div>
	);	
}





const mapStateToNotsButtonProps = (state) => ({
	unreadNotsCount: state.nots[state.currentGame].reduce((total, not) => total + (not.read ? 0 : 1), 0)
});


const mapDispatchToNotsButtonProps = (dispatch) => ({
	onClick: (e) => {
		e.preventDefault();
		dispatch(
			actions.toggleNots()
		);
	}
});

class NotsButtonContainer extends Component {
	render() {
		return (
			<HeaderButton width="10vw" onClick={this.props.onClick}>
				{this.props.unreadNotsCount > 0 ? <Alert count={this.props.unreadNotsCount} /> : 'N'}
			</HeaderButton>
		);
	}	
}
NotsButtonContainer = connect(mapStateToNotsButtonProps, mapDispatchToNotsButtonProps)(NotsButtonContainer);



const mapDispatchToAddPlayerButtonProps = (dispatch) => ({
	onClick: (e) => {
		e.preventDefault();
		dispatch(
			actions.toggleAddPlayer()
		);
	}
});

class AddPlayerButtonContainer extends Component {
	render() {
		return (
			<HeaderButton width="10vw" onClick={this.props.onClick}>
				+
			</HeaderButton>
		);
	}
}
AddPlayerButtonContainer = connect(null, mapDispatchToAddPlayerButtonProps)(AddPlayerButtonContainer);



const mapDispatchToReturnButtonProps = (dispatch) => ({
	returnHome: (e) => {
		e.preventDefault();
		dispatch(
			actions.changePage("HOME") //also need to set currentplayer back to me.
		);
	}
});

class ReturnButtonContainer extends Component {
	render() {
		return (
			<HeaderButton onClick={this.props.returnHome}>
				&lang;	
			</HeaderButton>
		);
	}
}
ReturnButtonContainer = connect(null, mapDispatchToReturnButtonProps)(ReturnButtonContainer);









const mapStateToGameBodyProps = (state) => {

	const currentIndex = state.players[state.currentGame].indexOf(state.currentPlayer);
	const playerIds = state.players[state.currentGame];

	return ({
		profiles: playerIds.map(
			(playerId) => ({
				userId: playerId,
				img: state.profiles[playerId].img,
			})
		),
		currentIndex: currentIndex,
		currentName: state.currentPlayer == state.userId ? 'You' : state.profiles[state.currentPlayer].firstName,
		prevPlayer: currentIndex == 0 ? null : playerIds[currentIndex - 1],
		nextPlayer: currentIndex == playerIds.length - 1 ? null : playerIds[currentIndex + 1],
	});
}


class GameBodyContainer extends Component {
	render() {

		const css = {
			marginTop: '3vh',
		}

		const mainCSS = {
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			marginTop: '5vh',
		};

		return (
			<div style={css}>
				<Rolodex
					profiles={this.props.profiles}
					currentIndex={this.props.currentIndex}
					currentName={this.props.currentName}
				/>
				<div style={mainCSS}>
					<ArrowContainer to={this.props.prevPlayer}>
						&lsaquo;
					</ArrowContainer>
					<Card />
					<ArrowContainer to={this.props.nextPlayer}> 
						&rsaquo;
					</ArrowContainer>
				</div>
			</div>
		);
	}
}
GameBodyContainer = connect(mapStateToGameBodyProps, null)(GameBodyContainer);













const Rolodex = (props) => {

	const css = {
		overflow: 'hidden',
	};

	const left = 42 - (props.currentIndex * 8) - (props.currentIndex + 0.5) + 'vw'; //extra subtraction of (props.currentIndex + 0.5) is for the 0.5vw avatar padding
	const rolodexCSS = {
		position: 'relative',
		left: left,
		display: 'flex',
	};

	const nameCSS = {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		textAlign: 'center',
		fontSize: '7vw',
	};

	const avatars = props.profiles.map(
		(profile, index) => (
			<Avatar 
				key={profile.userId}
				img={profile.img}
				width={index == props.currentIndex ? '16vw' : '8vw'}
			/>
		)
	);

	return (
		<div style={css}>
			<div style={rolodexCSS}>
				{avatars}
			</div>
			<div style={nameCSS}>
				{props.currentName}
			</div>
		</div>
	);
}


const mapDispatchToArrowProps = (dispatch, ownProps) => ({
	changePlayer: (e) => {
		e.preventDefault();
		if (ownProps.to == null) {
			return null;
		}
		dispatch(
			actions.changePlayer(ownProps.to)
		);
	},
})


class ArrowContainer extends Component {
	render() {
		return (
			<Arrow hide={this.props.to == null} onClick={this.props.changePlayer}>
				{this.props.children}
			</Arrow>
		);
	}
}
ArrowContainer = connect(null, mapDispatchToArrowProps)(ArrowContainer);


const Arrow = (props) => {

	const css = {
		width: '8vw',
		fontSize: '10vw',
		textAlign: 'center',
		opacity: props.hide ? '0' : '1',
		color: '#333',
	};

	return (
		<a style={css} onClick={props.onClick}>
			{props.children}
		</a>
	);
}











const Card = (props) => {

	const squares = Array.from(new Array(25), (val, index) => (
		<SquareContainer
			key={index} //is this ok?
			index={index}
		/>	
	));

	const css = {
		  display: 'grid',
		  gridGap: '1vw',
		  gridTemplateColumns: 'repeat(5, 16vw)',
		  gridTemplateRows: 'repeat(5, 16vw)',
	};

	return (
		<div style={css}>
			{squares}
		</div>
	);
}





const mapStateToSquareProps = (state, ownProps) => {

	const squareData = state.games.find(
		(game) => game.gameId == state.currentGame
	).squares[ownProps.index];

	return ({
		breed: squareData.breed,
		img: squareData.img,
		matched: state.matches[state.currentGame][state.currentPlayer].includes(ownProps.index),
		yourCard: state.currentPlayer == state.userId,
		gameId: state.currentGame,
		userId: state.userId,
	});
}

const mapDispatchToSquareProps = (dispatch, ownProps) => ({
	updateMatches: (gameId, userId, index) => {
		dispatch(
			actions.updateMatches(gameId, userId, index)
		);
	},
});

class SquareContainer extends Component {
	constructor(props) {
		super(props);

		this.handleSquareClick = this.handleSquareClick.bind(this);
		this.temp_handle_img_input_change = this.temp_handle_img_input_change.bind(this);
		this.temp_checkBreed = this.temp_checkBreed.bind(this);
	}

	handleSquareClick() {
		if (!this.props.yourCard) {
			return null;
		}
//temp
//		document.getElementById("tempSquareInput" + this.props.index).click();
//temp

//mobile
//		navigator.camera.getPicture(
//			(imgURI) => this.checkBreed(imgURI, breedName, index), 
//			() => alert("Didn't capture photo"),
//			{quality: 50, allowEdit: true, sourceType: 0} ///true allows zooming? quality? //1 for camera.
//		); 
//mobiile

		navigator.camera.getPicture(
			this.temp_checkBreed, 
			null, //?
			{quality: 50, allowEdit: true, sourceType: 0, destinationType: 0} ///true allows zooming? quality? //1 for camera, 0 for library
		); 
	}

	temp_handle_img_input_change(e) {
		if (e.target.files && e.target.files[0]) {
			const reader = new FileReader();
			const that = this;
	        reader.onload = (event) => {
	        	that.temp_checkBreed(event.target.result);
			};
	        reader.readAsDataURL(e.target.files[0]);
	    }
	}

	temp_checkBreed(imgData) { ////eventually checkBreed should match this. or just keep it.

		if (imgData.slice(0, 22) != "data:image/jpg;base64,") {
			imgData = "data:image/jpg;base64," + imgData;
		}

		const requestData = {};
		requestData.gameId = this.props.gameId;
		requestData.userId = this.props.userId;
		requestData.index = this.props.index;
		requestData.breed = this.props.breed;
		requestData.img = imgData;

		fetch(
			server_url + "/validate_breed", 
			{
				method: 'POST',
				body: JSON.stringify(requestData),
				headers: {
					'Content-Type': 'application/json',
				},
			}
		).then(
			(response) => (
				(response.status >= 200 && response.status < 300) ? response.json() : Promise.reject(new Error(response.statusText))
			)
		).then(
			(data) => {
				if (data.success) {
					this.props.updateMatches(this.props.gameId, this.props.userId, this.props.index);
				}
				else {
					alert(data.errorMsg);
				}
			}
		).catch(
			(error) => console.log("Network Error: " + error.message) //put in alert or errorMsg?
		);
	}
/*
	checkBreed(imgURI, breedName, index) {

		const options = new FileUploadOptions();
		options.params = {};
		options.params.breedName = breedName;
		options.params.index = index;
		options.params.game_id = this.props.game_data.game_id;
		const ft = new FileTransfer();
		ft.upload(imgURI, 
			server_url + "/validate_breed", 
			(responseObj) => {
				const result = JSON.parse(repsonseObj.response);
				if (result.isMatch) {
					const newPlayers = JSON.parse(JSON.stringify(that.state.players));
					newPlayers[0].matches.push(index);
					that.setState({
						players: newPlayers,
					});
				}
				else {
				}
			}, 
			(errorObj) => {
			},
			options
		);
//if data is a true, (first get index into this function), then set new state to include that in matches. pushes a notification to players aa well as some sort of signal that they should update and set their states (if do it this way, need to contain allMatches in state)
//if data is false, check for message key and notify the person with it (it's not a 'Beagel' (need to give function breed), couldnt detect a dog -- may be too big, too small, or at a difficult angle)
//create submission class, this contains breed name and img and index?. has a method called .validate() that sets its is_valid and error message. submission.validate(); if submission.isvalid(), this.punchhole(i) ? or get data from database again (will now have been updated, this way server is single source of data pull ins. one function that pulls in data and changes state and setsstate. then call this at first, --need way to know if reset the currentplayer-- and also when i get a match, and when i get a socket notice saying someone else made a change.;else alert(submission.errorMsg);
	}
*/
	render() {
		return (
			<div>
				<Square
					img={this.props.img}
					matched={this.props.matched}
					onClick={this.handleSquareClick}
					breed={this.props.breed} //temp
				/>
				<input id={"tempSquareInput" + this.props.index} style={{opacity: '0', position:'absolute', width: '0', border: 'none', padding: '0', margin: '0'}} name="img" type="file" accept="image/*" onChange={this.temp_handle_img_input_change} />
			</div>
		);
	}
}
SquareContainer = connect(mapStateToSquareProps, mapDispatchToSquareProps)(SquareContainer);


const Square = (props) => {

	const css = {
		width: '100%',
		height: '100%',
		position: 'relative',
	};

	const matchCSS = {
		display: props.matched ? 'block' : 'none',
		position: 'absolute',
		top: '0',
		left: '0',
		zIndex: '1',
		width: '100%',
		height: '100%',
	};

	const imgCSS = {
		width: '100%',
		height: '100%',
	};

	const tempCSS = { //temp
		width: '100%',
		height: '100%',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		textAlign: 'center',
		fontSize: '2vw',
		backgroundColor: 'grey',
		color: '#fff',
		borderRadius: '4px',
	};

	return (
		<div style={css}>
			{/*<img style={imgCSS} src={props.img} onClick={props.onClick} />*/}
			<div style={tempCSS} onClick={props.onClick}>
				{props.breed}
			</div>
			<img style={matchCSS} src="img/match.png" />
		</div>
	);

}

export default GamePage;
