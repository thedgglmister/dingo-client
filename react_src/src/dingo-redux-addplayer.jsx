import React, { Component } from 'react';
import { connect } from 'react-redux'
import * as actions from './redux-action-creators'

import Avatar from './dingo-redux-avatar'

const server_url = "https://dingo-test.herokuapp.com";

//wanted local storage of topplayers so if i invite someone, or interact with them they get added...
//right now inviting someone doesnt add them to top players and they can be invited again... could alert from server that theyve already been invited...?


///use state for form, then on change setstate and dispatch to GET TOP PLAYERS, which filters profiles based on searchbar. 
//then on submit dispatch to get other players.

//reset pattern, otherplayers when close or open addplayermenu






class AddPlayerMenu extends Component {

	componentWillUnmount() {
		
	}
	
	render() {
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
				<AddPlayerHeader />
				<SearchContainer />
				<TopPlayersContainer />
				<OtherPlayersContainer />
			</div>
		);
	}
}


const AddPlayerHeader = (props) => {

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
			ADD PLAYERS
		</div>
	);
}


const mapDispatchToCancelButtonProps = (dispatch) => ({
	closeMenu: (e) => {
		e.preventDefault();
		dispatch(
			actions.toggleAddPlayer()
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




const mapStateToSearchProps = (state) => ({
	searchPattern: state.pattern
});

const mapDispatchToSearchProps = (dispatch) => ({
	updatePattern: (e) => {
		dispatch(
			actions.updatePattern(e.target.value.replace(/\s\s+/g, ' '))
		);
	},
	updateOtherPlayers: (otherProfiles) => {
		dispatch(
			actions.updateOtherPlayers(otherProfiles)
		);
	}
});


class SearchContainer extends Component {
	constructor(props) {
		super(props);

		this.getOtherPlayers = this.getOtherPlayers.bind(this);
	}

	getOtherPlayers(e) {
		e.preventDefault();

		if (this.props.searchPattern == "") {
			return null;
		}

		this.props.updateOtherPlayers([]);

		fetch(
			server_url + "/search_players", 
			{
				method: 'POST',
				body: JSON.stringify({searchPattern: this.props.searchPattern}),
				headers: {
	      			"Content-Type": "application/json",
	    		},
			}
		).then(
			(response) => (
				(response.status >= 200 && response.status < 300) ? response.json() : Promise.reject(new Error(response.statusText))
			)
		).then(
			(data) => {
				this.props.updateOtherPlayers(data);
			}
		).catch(
			(error) => console.log("Network Error: " + error.message) //put in alert or errorMsg?
		);
	}

	render() {
		return (
			<Search 
				searchPattern={this.props.searchPattern}
				onChange={this.props.updatePattern}
				onSubmit={this.getOtherPlayers}
			/>
		);
	}
}
SearchContainer = connect(mapStateToSearchProps, mapDispatchToSearchProps)(SearchContainer);



const Search = (props) => {

	const css = {
		borderBottom: '1px solid lightgrey',
		padding: '10px',
	};

	const inputCSS = {
		width: '75vw',
		marginLeft: '5px',
	}

	return (
		<form style={css} onSubmit={props.onSubmit}>
			<label>
				Search:
				<input //try onsubmit in form, or keyup on this. //may need to try on mobile(e) => this.props.handleSearch(e.target.value, e)
					style={inputCSS}
					type="text" 
					name="searchPattern"
					value={props.searchPattern}
					placeholder="Name"
					onChange={props.onChange} />
			</label>
		</form>
	);
}


const mapStateToTopPlayersProps = (state) => {
	const splitPattern = state.pattern.trim().split(' ');
	const firstPattern = splitPattern[0].toLowerCase();
	const lastPattern = splitPattern.length > 1 ? splitPattern[1].toLowerCase() : '';
	const isMatch = (firstName, lastName, firstPattern, lastpattern) => (
		(firstName.startsWith(firstPattern) && lastName.startsWith(lastPattern)) ||
		(firstName.startsWith(lastPattern) && lastName.startsWith(firstPattern))
	);
	const inGame = (userId) => (
		state.players[state.currentGame].includes(userId)
	);
	return ({
		topProfiles: state.topPlayers.reduce(
			(topProfiles, userId) => {
				const profile = state.profiles[userId]
				const firstName = profile.firstName.toLowerCase();
				const lastName = profile.lastName.toLowerCase();	
				if (isMatch(firstName, lastName, firstPattern, lastPattern) && !inGame(userId)) {
					topProfiles.push(profile);
				}
				return topProfiles;
			}, 
			[]
		)
	});
};


class TopPlayersContainer extends Component {
	render() {
		if (this.props.topProfiles.length == 0) {
			return null;
		}

		const searchItems = this.props.topProfiles.map(
			(profile) => (
				<SearchItemContainer
					key={profile.userId}
					inviteeId={profile.userId}
					name={profile.firstName + " " + profile.lastName}
					img={profile.img}
				/>
			)
		);

		return (
			<div>
				<SearchPlayersHeader 
					title="Top People"
				/>
				{searchItems}
			</div>
			
		);
	}
}
TopPlayersContainer = connect(mapStateToTopPlayersProps, null)(TopPlayersContainer);





const SearchPlayersHeader = (props) => {

	const css = {
		backgroundColor: 'lightgrey',
		padding: '10px',
	};

	return (
		<div style={css}>
			{props.title}
		</div>
	);
}



const mapDispatchToSearchItemProps = (dispatch, ownProps) => ({
	closeMenu: () => {
		dispatch(
			actions.toggleAddPlayer()
		);
	}
});

const mapStateToSearchItemProps = (state) => ({
	userId: state.userId,
	currentGame: state.currentGame
});


class SearchItemContainer extends Component {

	handleSendInvite(e, toId) {
		e.preventDefault();

		const request_data = {};
		request_data.toId = toId;
		request_data.fromId = this.props.userId;
		request_data.gameId = this.props.currentGame;

		fetch(
			server_url + "/invite", 
			{
				method: 'POST',
				body: JSON.stringify(request_data),
				headers: {
	      			"Content-Type": "application/json",
	    		},
			}
		).then(
			(response) => (
				(response.status >= 200 && response.status < 300) ? response : Promise.reject(new Error(response.statusText))
			)
		).then(
			(repsonse) => {
				alert("Invitation Sent!");
				this.props.closeMenu();
			}
		).catch(
			(error) => console.log("Network Error: " + error.message) //put in alert or errorMsg?
		);
	}

	render() {
		return (
			<SearchItem
				name={this.props.name}
				img={this.props.img}
				onClick={(e) => this.handleSendInvite(e, this.props.inviteeId)}
			/>
		);
	}
}
SearchItemContainer = connect(mapStateToSearchItemProps, mapDispatchToSearchItemProps)(SearchItemContainer);


const SearchItem = (props) => {

	const css = {
		display: 'flex',
		justifyContent: 'flex-start',
		marginLeft: '5vw',
		width: '95vw',
		borderBottom: '1px solid lightgrey',
		padding: '10px 0 10px 0',
	};

	const nameCSS = {
		display: 'flex',
		alignItems: 'center',
		marginLeft: '30px',
	};

	return (
		<div style={css} onClick={props.onClick}>
			<Avatar
				img={props.img}
				width='10vw'
			/>
			<div style={nameCSS}>
				{props.name}
			</div>
		</div>
	);
}


const mapDispatchToOtherPLayersProps = (dispatch) => ({
	updateOtherPlayers: (otherProfiles) => {
		dispatch(
			actions.updateOtherPlayers(otherProfiles)
		);
	}
});


const mapStateToOtherPlayersProps = (state) => ({
	otherPlayers: (
		state.otherPlayers ?
		state.otherPlayers.filter(
			(profile) => !state.topPlayers.includes(profile.userId) && profile.userId != state.userId
		) :
		null
	),
	searchPattern: state.pattern.trim(),
});

class OtherPlayersContainer extends Component {
	constructor(props) {
		super(props);

		this.getOtherPlayers = this.getOtherPlayers.bind(this);
	}

	getOtherPlayers(e) {
		e.preventDefault();
		
		if (this.props.searchPattern == "") {
			return null;
		}

		this.props.updateOtherPlayers([]);

		fetch(
			server_url + "/search_players", 
			{
				method: 'POST',
				body: JSON.stringify({searchPattern: this.props.searchPattern}),
				headers: {
	      			"Content-Type": "application/json",
	    		},
			}
		).then(
			(response) => (
				(response.status >= 200 && response.status < 300) ? response.json() : Promise.reject(new Error(response.statusText))
			)
		).then(
			(data) => {
				this.props.updateOtherPlayers(data);
			}
		).catch(
			(error) => console.log("Network Error: " + error.message) //put in alert or errorMsg?
		);
	}

	render() {
		if (this.props.searchPattern == "" || (this.props.otherPlayers && this.props.otherPlayers.length == 0)) {
			return null;
		}
		else if (this.props.otherPlayers == null) {
			return <SeeMoreResults onClick={this.getOtherPlayers} />;
		}


		const searchItems = this.props.otherPlayers.map(
			(profile) => (
				<SearchItemContainer
					key={profile.userId}
					inviteeId={profile.userId}
					name={profile.firstName + " " + profile.lastName}
					img={profile.img}
				/>
			)
		);

		return (
			<div>
				<SearchPlayersHeader 
					title="Other People"
				/>
				{searchItems}
			</div>
		);
	}
}
OtherPlayersContainer = connect(mapStateToOtherPlayersProps, mapDispatchToOtherPLayersProps)(OtherPlayersContainer);




const SeeMoreResults = (props) => {

	const css = {
		display: 'block',
		margin: '10px 0 0 5vw',
		color: '#00E'
	};

	return (
		<a style={css} onClick={props.onClick}>
			See more results...
		</a>
	);
}







export { AddPlayerMenu };

