export const changePage = (to) => ({
	type: "CHANGE_PAGE",
	pageName: to
});

export const updateUserId = (userId) => ({
	type: "UPDATE_USER_ID",
	userId: userId
});

export const addAllData = (data) => ({
	type: "ADD_ALL_DATA",
	games: data.games,
	invs: data.invs,
	nots: data.nots,
	players: data.players,
	matches: data.matches,
	topPlayers: data.topPlayers,
	profiles: data.allProfs
});

export const newGame = (games, players, matches, nots) => ({
	type: "NEW_GAME",
	games: games,
	players: players,
	matches: matches,
	nots: nots,
});

export const leaveGame = (gameId) => ({
	type: "LEAVE_GAME",
	gameId: gameId
});

export const goToGame = (gameId) => ({
	type: "GO_TO_GAME",
	gameId: gameId
});

export const toggleNots = () => ({
	type: "TOGGLE_NOTS"
});

export const toggleAddPlayer = ()  => ({
	type: "TOGGLE_ADD_PLAYERS"
});

export const updateProfiles = (newProfiles) => ({
	type: "UPDATE_PROFILES",
	newProfiles: newProfiles
});

export const acceptInv = (invId, data) => ({
	type: "ACCEPT_INV",
	invId: invId,
	games: data.games,
	matches: data.matches,
	players: data.players,
	topPlayers: data.topPlayers,
	nots: data.nots,
	profiles: data.profs
});

export const declineInv = (invId) => ({
	type: "DECLINE_INV",
	invId: invId,
});

export const updatePattern = (pattern) => ({
	type: "UPDATE_PATTERN",
	pattern: pattern
});

export const updateOtherPlayers = (otherProfiles) => ({
	type: "UPDATE_OTHER_PLAYERS",
	otherPlayers: otherProfiles
});

export const markNotsRead = (gameId) => ({
	type: "MARK_NOTS_READ",
	gameId: gameId
});

export const changePlayer = (userId) => ({
	type: "CHANGE_PLAYER",
	userId: userId
});

export const updateMatches = (gameId, userId, index) => ({
	type: "UPDATE_MATCHES",
	gameId: gameId,
	userId: userId,
	index: index,
})

