import { combineReducers } from 'redux'

const currentPage = (state = "SIGNUP", action) => {
	switch (action.type) {
		case "CHANGE_PAGE":
			return action.pageName;
		case "GO_TO_GAME":
			return "GAME";
		default:
			return state;
	}
}

const currentGame = (state = null, action) => {
	switch (action.type) {
		case "GO_TO_GAME":
			return action.gameId;
		default:
			return state;
	}
}

const currentPlayer = (state = null, action) => {
	switch (action.type) {
		case "CHANGE_PLAYER":
		case "UPDATE_USER_ID":
			return action.userId;
		default:
			return state;
	}
}

const userId = (state = null, action) => {
	switch (action.type) {
		case "UPDATE_USER_ID":
			return action.userId;
		default:
			return state;
	}
}

const profiles = (state = {}, action) => {
	switch (action.type) {
		case "ADD_ALL_DATA":
		case "ACCEPT_INV":
			return Object.assign({}, state, action.profiles);
		case "UPDATE_PROFILES":
			return Object.assign({}, state, action.newProfiles);
		default:
			return state;
	}
}

const invs = (state = [], action) => {
	switch (action.type) {
		case "ADD_ALL_DATA":
			return state.concat(action.invs);
		case "ACCEPT_INV":
		case "DECLINE_INV":
			return action.invs;
		default:
			return state;
	}	
}

const games = (state = [], action) => {
	switch (action.type) {
		case "ADD_ALL_DATA":
		case "ACCEPT_INV":
		case "NEW_GAME":
			return state.concat(action.games);
		case "LEAVE_GAME":
			return state.filter(
				(game) => (game.gameId != action.gameId)
			);
		default:
			return state;
	}	
}

const matches = (state = {}, action) => {
	switch (action.type) {
		case "ADD_ALL_DATA":
		case "ACCEPT_INV":
		case "NEW_GAME":
			return Object.assign({}, state, action.matches);
		case "LEAVE_GAME":
			const copy = Object.assign({}, state);
			delete copy[action.gameId];
			return copy;
		case "UPDATE_MATCHES":
			const myUpdatedMatches = {};
			const updatedGameMatches = {};
			myUpdatedMatches[action.userId] = state[action.gameId][action.userId].concat([action.index]);
			updatedGameMatches[action.gameId] = Object.assign({}, state[action.gameId], myUpdatedMatches);
			return Object.assign({}, state, updatedGameMatches);
		default:
			return state;
	}	
}

const players = (state = {}, action) => {
	switch (action.type) {
		case "ADD_ALL_DATA":
		case "ACCEPT_INV":
		case "NEW_GAME":
			return Object.assign({}, state, action.players);
		case "LEAVE_GAME":
			const copy = Object.assign({}, state);
			delete copy[action.gameId];
			return copy;
		default:
			return state;
	}	
}

const nots = (state = {}, action) => {
	switch (action.type) {
		case "ADD_ALL_DATA":
		case "ACCEPT_INV":
		case "NEW_GAME":
			return Object.assign({}, state, action.nots);
		case "LEAVE_GAME":
			const copy = Object.assign({}, state);
			delete copy[action.gameId];
			return copy;
		case "MARK_NOTS_READ":
			const gameNots = state[action.gameId];
			const updatedNots = {}
			updatedNots[action.gameId] = state[action.gameId].map(
				(not) => Object.assign({}, not, {read: true})
			);
			return Object.assign({}, state, updatedNots);
		default:
			return state;
	}	
}

const topPlayers = (state = [], action) => {
	switch (action.type) {
		case "ADD_ALL_DATA":
		case "ACCEPT_INV":
			return action.topPlayers;
		default:
			return state;
	}	
}

const otherPlayers = (state = null, action) => {
	switch (action.type) {
		case "UPDATE_OTHER_PLAYERS":
			return action.otherPlayers;
		case "UPDATE_PATTERN":
		case "TOGGLE_ADD_PLAYERS":
			return null;
		default:
			return state;
	}
}

const notsMenuOpen = (state = false, action) => {
	switch (action.type) {
		case "TOGGLE_NOTS":
			return !state;
		default:
			return state;
	}
}

const addPlayerMenuOpen = (state = false, action) => {
	switch (action.type) {
		case "TOGGLE_ADD_PLAYERS":
			return !state;
		default:
			return state;
	}
}

const pattern = (state = "", action) => {
	switch (action.type) {
		case "UPDATE_PATTERN":
			return action.pattern;
		case "TOGGLE_ADD_PLAYERS":
			return "";
		default:
			return state;
	}	
}

const appReducer = combineReducers({
	currentPage,
	currentGame,
	currentPlayer,
	userId,
	profiles,
	invs,
	games,
	matches,
	players,
	nots,
	topPlayers,
	otherPlayers,
	pattern,
	notsMenuOpen,
	addPlayerMenuOpen
});

export default appReducer;





/*
actions

{
	type: "CHANGE_PAGE",
	page: <string>
}




state = {

	currentPage = enum['HOME', 'INVITATIONS', 'PROFILE', 'GAME', 'SIGN_UP', 'LOG_IN', 'SPLASH']

	addPlayersMenuOpen = false

	notificationsMenuOpen = false

	games = [gameData1, ]

	invitations = [invitationData1, ]

	profile = {}





	top_players?

	other players?
}




*/