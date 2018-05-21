//I SHOULD SAVE THE PHOTOS AND FILL OUT THE CARD WITH THEM ON MATCHES, I CAN CLICK ON YOUR CARD AND SEE YOUR PHOTO. I CAN DRAW ON THEM AND SEND THEM BACK TO YOU SOMEHOW (OR OTHER THINGS, THINK OF ACTUAL FUN THINGS, NOT JUST WHATS APPY). THE ONLY THING IS, THE CARDS MIGHT GET UGLY... MAYBE IT ONLY ZOOMS INTO REAL PICK, OTHERWISE IT IS TINTED WITH THE COLOR OF THE CROSSOUT DIV.

//MAKE AVATARS HAVE A BORDER THAT HAS A COLOR MATCHING THE COLOR OF THAT PLAYERS CARD, CLICK ARROWS OR SWIPE ANYWHERE CAUSES ROLODEX TO ANIMATE (FIGURE OUT ANIMATION MECHANICS THEN CSS), HAVE AVATARS MOVE BACKWARDS IN SCREEN USING CSS 3D OR SOMETHING. GET RID OF CLICK ON ARROWS, JUST SWIPE ANYWHERE, MAKE ARROWS LIKE REALLY WIDE THEN TWO SOLID LIGHTGREY LINES, OR LINES ARE IN SAME SHADE/HUE/WHATEVER AS BACKGROUND, BUT THEN THEY GET DARKER FROM FIRST LINE TO SECOND TO WIDE ARROW.
//WHAT HAPPENS ON SWIPE TO ROTATE THROUGH PLAYERS TO THE COLLOR OF THE CARD, CAN COLORS JUST ROTATE, WITH BLACK AND WHITE BEHIND IT, SO ITS LIKE THE ORANGE BACKGROUND RECTANGLE MOVES RIGHT AND A GREEN ONE SLIDES IN, BUT EVERYTHING ELSE IS STATIONARY IN FRONT OF IT.
//MAKE THE IMAGE JUST THE CSS BACKGROUND OF SQAURE DIVS, GET RID OF IMG TAGS.

//https://www.joshmorony.com/hybrid-app-developers-dont-store-your-users-passwords/
//how to prevent someone from seding a post request with username and get all their info?

//sync view from changes made by other people only after a notification is received... 
//need way of signing in if localstorage is erased...

//dont update sate of things like invitations until confirmed success from server, or re-pull from server even?

//need cors headers if not from localhost?

//need to figure out how to alert pople in all the different ways that a server error occurs. Network error: failed to join game., etc

//if someone leaves game while im viewing it, my currentplayer index will be off...

//should i just get complete data from server anytime i change something??

//always block user input, in game, or signup, when fetching, with a spinner.

//need email at all? just do username? 



//const server_url = "http://0.0.0.0:5000";
const server_url = "https://dingo-test.herokuapp.com";
const local_storage = {};
//local_storage.user_id = 16;




//make an App component that holds all data and renders Home VS Game?

import React from 'react';
import ReactDOM from 'react-dom';


class Home extends React.Component {
	constructor(props) {
		super(props);

		this.state = {}; //get state for whole thing. everything. appData = {games = [{my_gpid, game_id, players, breeds, notifications}], invitations}
		this.state.games = []; 
		this.state.invitations = []; 
		this.state.myProfile = {};
		this.state.currentGame = null;
		this.state.profileMenuOpen = false;
		this.state.invitationsMenuOpen = false;		
		this.state.loading = true;

		this.handleNewGameClick = this.handleNewGameClick.bind(this);
		this.handleGameListItemClick = this.handleGameListItemClick.bind(this);
		this.handleJoinGame = this.handleJoinGame.bind(this);
		this.handleLeaveGame = this.handleLeaveGame.bind(this);
		this.handleDeleteInvitation = this.handleDeleteInvitation.bind(this);
		this.handleReturnHome = this.handleReturnHome.bind(this);
		this.handleUpdateGame = this.handleUpdateGame.bind(this);
		this.handleToggleProfileMenu = this.handleToggleProfileMenu.bind(this);
		this.handleToggleInvitationsMenu = this.handleToggleInvitationsMenu.bind(this);
		this.handleUpdateProfile = this.handleUpdateProfile.bind(this);
	}

	componentDidMount() {

		const startTime = Date.now();

		fetch(server_url + "/homedata", {
			method: 'POST',
			body: JSON.stringify({user_id: this.props.user_id}),
			headers: {
				'Content-Type': 'application/json',
			},
		})
		.then((response) => 
			(response.status >= 200 && response.status < 300) ? response.json() : Promise.reject(new Error(response.statusText))
		)
		.then((data) => 
			{
				const that = this
				const timeElapsed = Date.now() - startTime
				console.log(timeElapsed);
				setTimeout(function() {
					data.loading = false;
					that.setState(data);
				}, 1000 - timeElapsed);
			}
		)
		.catch((error) => 
			{console.log("Network Error: " + error.message);} //put in alert or errorMsg?
		);
	}

	handleUpdateProfile(changes) {
		var newProfile = JSON.parse(JSON.stringify(this.state.myProfile));
		newProfile = Object.assign(newProfile, changes);
		this.setState({myProfile: newProfile, profileMenuOpen: false});
	}
	
	handleToggleProfileMenu(e) {
		if (e) {
			e.preventDefault();
		}
		this.setState({profileMenuOpen: !this.state.profileMenuOpen});
	}

	handleToggleInvitationsMenu(e) {
		e.preventDefault();
		this.setState({invitationsMenuOpen: !this.state.invitationsMenuOpen});		
	}

	handleUpdateGame(game_data) {
		const newGames = this.state.games.map((game) =>
			{
				if (game.game_id == game_data.game_id) {
					return (game_data);
				}
				else {
					return (game);
				}
			}
		);
		this.setState({games: newGames});
	}

	handleReturnHome(e) {
		e.preventDefault();

		this.setState({currentGame: null});
	}

	handleLeaveGame(gpid, game_id, e) {
		e.stopPropagation();
		e.preventDefault();

		fetch(server_url + "/leave_game", {
			method: 'POST',
			body: JSON.stringify({gpid: gpid, game_id: game_id}),
			headers: {
				'Content-Type': 'application/json',
			},
		})
		.then((response) => 
			(response.status >= 200 && response.status < 300) ? response : Promise.reject(new Error(response.statusText))
		)
		.then((data) => 
			{
				let gamesCopy = JSON.parse(JSON.stringify(this.state.games)); //why filter needs let?
				gamesCopy = gamesCopy.filter((game_data) =>
					game_data.players[0].gpid != gpid 
				);
				this.setState({games: gamesCopy});
			}
		)
		.catch((error) => 
			{console.log("Network Error: " + error.message);} //put in alert or errorMsg? 
		);		



	}

	handleJoinGame(invitation_id, e) {
		e.preventDefault();

		fetch(server_url + "/accept_invite", {
			method: 'POST',
			body: JSON.stringify({invitation_id: invitation_id}),
			headers: {
				'Content-Type': 'application/json',
			},
		})
		.then((response) => 
			(response.status >= 200 && response.status < 300) ? response.json() : Promise.reject(new Error(response.statusText))
		)
		.then((data) => 
			{
				const gamesCopy = JSON.parse(JSON.stringify(this.state.games));
				let invitationsCopy = JSON.parse(JSON.stringify(this.state.invitations)); //why filter requres let?
				gamesCopy.push(data);
				invitationsCopy = invitationsCopy.filter((invitation) =>
					invitation.invitation_id != invitation_id
				);
				this.setState({games: gamesCopy, invitations: invitationsCopy});
			}
		)
		.catch((error) => 
			{console.log("Network Error: " + error.message);} //put in alert or errorMsg? 
		);		
	}

	handleDeleteInvitation(invitation_id, e) {
		e.preventDefault();

		fetch(server_url + "/delete_invite", {
			method: 'POST',
			body: JSON.stringify({invitation_id: invitation_id}),
			headers: {
				'Content-Type': 'application/json',
			},
		})
		.then((response) => 
			(response.status >= 200 && response.status < 300) ? response : Promise.reject(new Error(response.statusText))
		)
		.then((data) => 
			{
				let invitationsCopy = JSON.parse(JSON.stringify(this.state.invitations));
				invitationsCopy = invitationsCopy.filter((invitation) =>
					invitation.invitation_id != invitation_id
				);
				this.setState({invitations: invitationsCopy});
			}
		)
		.catch((error) => 
			{console.log("Network Error: " + error.message);} //put in alert or errorMsg? 
		);		
	}

	handleGameListItemClick(game_index, e) {
		//prevent default?
		this.setState({currentGame: game_index});
	}

	handleNewGameClick(e) {
		e.preventDefault();
		fetch(server_url + "/newgame", {
			method: 'POST',
			body: JSON.stringify({user_id: this.props.user_id}),
			headers: {
				'Content-Type': 'application/json',
			},
		})
		.then((response) => 
			(response.status >= 200 && response.status < 300) ? response.json() : Promise.reject(new Error(response.statusText))
		)
		.then((data) => 
			{
				const gamesCopy = JSON.parse(JSON.stringify(this.state.games));
				gamesCopy.push(data);
				this.setState({games: gamesCopy});
			}
		)
		.catch((error) => 
			{console.log("Network Error: " + error.message);} //put in alert or errorMsg?
		);
	}



	render() {
		if (this.state.loading) {
			return (
				<SplashScreen />
			);
		}
		else if (this.state.currentGame != null) { //no conditionals, just pass in state and return null there?
			return (
				<Game 
					game_data={this.state.games[this.state.currentGame]} 
					user_id={this.props.user_id} 
					handleReturnHome={this.handleReturnHome} 
					handleUpdateGame={this.handleUpdateGame} />
			);
		}
		else if (this.state.profileMenuOpen) {
			return (
				<ProfileMenu 
					handleToggleProfileMenu={this.handleToggleProfileMenu} 
					handleUpdateProfile={this.handleUpdateProfile}
					myProfile={this.state.myProfile} />
			);
		}
		else if (this.state.invitationsMenuOpen) {
			return (
				<InvitationsMenu 
					invitations={this.state.invitations} 
					handleJoinGame={this.handleJoinGame}
					handleDeleteInvitation={this.handleDeleteInvitation}
					handleToggleInvitationsMenu={this.handleToggleInvitationsMenu} />
			);
		}
		else {
			return (
				<div>

					<HomeHeader 
						handleToggleProfileMenu={this.handleToggleProfileMenu} 
						handleToggleInvitationsMenu={this.handleToggleInvitationsMenu}	 
						invitations_count = {this.state.invitations.length} />

					<GamesMenu 
						games={this.state.games}
						handleNewGameClick={this.handleNewGameClick} 
						handleGameListItemClick={this.handleGameListItemClick} 
						handleLeaveGame={this.handleLeaveGame} />
				</div>
			);
		}
	}
}

class GamesMenu extends React.Component {
	render() {

		return (
			<div>
				<NewGameButton handleNewGameClick={this.props.handleNewGameClick} />
				<GameList 
					games={this.props.games}
					handleGameListItemClick={this.props.handleGameListItemClick} 
					handleLeaveGame={this.props.handleLeaveGame} />
			</div>
		);
	}
}


class GameList extends React.Component { //gets all game data and pass it to Game, or just get number of notifications and player names ??
	render() {
		const games = this.props.games.map((game_data, index) =>
			<GameListItem  
				key={game_data.game_id}
				index={index}
				game_data={game_data} //players and notifications separately instead?
				handleGameListItemClick={this.props.handleGameListItemClick} 
				handleLeaveGame={this.props.handleLeaveGame} />
		);

		return (
			<div>
				{games}
			</div>
		);
	}
}

class GameListItem extends React.Component { //divide into separate components!

	render() {

		const container_css = {
			borderBottom: '1px solid grey',
			display: 'flex',
			height: '15vh',
		};
		const leave_button_css = {
			display: 'flex',
			width: '10vw',
			flexDirection: 'column',
			justifyContent: 'center',
			textAlign: 'center',
		};
		const avatars_css = {
			display: 'flex',
			width: '70vw',
			borderRight: '1px solid grey', //temp
			borderLeft: '1px solid grey', //temp
			overflow: 'scroll',
		};
		const notifications_button_css = {
			display: 'flex',
			width: '20vw',
			flexDirection: 'column',
			justifyContent: 'center',
			textAlign: 'center',
		};
		const justYou_css = {
			display: 'flex',
			width: '100%',
			height: '100%',	
			flexDirection: 'column',
			justifyContent: 'center',
			textAlign: 'center',	
		};

		const avatars = this.props.game_data.players.map((player) =>
			<Avatar 
				key={player.gpid}
				width='18vw'
				src={player.img} 
				name={player.first_name} />
		).slice(1);

		const justYou =
			<div style={justYou_css}>
				Just You
			</div>;

		const leave_button = 
			<div style={leave_button_css} onClick={(e) => this.props.handleLeaveGame(this.props.game_data.players[0].gpid, this.props.game_data.game_id, e)}>
				X
			</div>;

		const avatar_container =
			<div style={avatars_css} onClick={(e) => this.props.handleGameListItemClick(this.props.index, e)}>
				{avatars.length > 0 ? avatars : justYou} 
			</div>;

		const notifications_button =
			<div style={notifications_button_css}>
				{this.props.game_data.notifications.reduce((total, notification) => total + (notification.read ? 0 : 1), 0)}
			</div>;

		return (
			<div style={container_css}>
				{leave_button}
				{avatar_container}
				{notifications_button}
			</div>
		);
	}
}

class NewGameButton extends React.Component {

	render() {

		const css = {
			height: '10vh',
			backgroundColor: 'lightgrey',
			borderBottom: '1px solid grey',
			borderTop: '1px solid grey',
			lineHeight: '10vh',
			textAlign: 'center',
		}
		return (
			<div style={css} onClick={this.props.handleNewGameClick}>
				NEW GAME
			</div>
		);
	}
}














class SplashScreen extends React.Component {
	render() {

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
				<img style={img_css} src={"splash" + randint + ".png"} />
			</div>
		);
	}
}















class Avatar extends React.Component { //what if name overflows size?
	render() {

		const container_css = {
			width: this.props.width,
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			alignItems: 'stretch',
			backgroundColor: 'pink',
		};
		const name_css = {
			textAlign: 'center',
			margin: '0',
			backgroundColor: 'purple',
		};
		const img_css = {
			width: this.props.width,
			height: this.props.width,
			borderRadius: '100%',
		};


		const name = this.props.you ? 'You' : this.props.name;
		const name_elem = this.props.name ?  <p style={name_css}>{name}</p> : '';


		return (
			<div style={container_css}>
				<img 
					style={img_css} 
					src={this.props.src} />
				{name_elem}
			</div>
		);

	}
}


class HomeHeader extends React.Component {
	render() {

		const container_css = {
			display: 'flex',
			justifyContent: 'space-between',
			backgroundColor: 'steelblue',
			height: '15vw',
		};

		const button_css = {
			width: '10vw',
		};

		const invitations_count_css = {
			backgroundColor: 'red',
			borderRadius: '100%',
			width: '5vw',
			height: '5vw',
			fontSize: '4vw',
			display: 'flex',
			flexDireaction: 'column',
			justifyContent: 'center',
			textAlign: 'center',
		};

		return (
			<div style={container_css}>
				<div style={button_css} onClick={this.props.handleToggleProfileMenu}>
					P
				</div>
				<div>
					DINGO
				</div>	
				<div style={button_css} onClick={this.props.handleToggleInvitationsMenu}>
						{this.props.invitations_count > 0 ? <div style={invitations_count_css}>{this.props.invitations_count}</div> : 'I'}
				</div>
			</div>
		);	



	}
}







//lookk at venmo, have a cancel and a save that highlioghts when i make a change.
class ProfileMenu extends React.Component { //need to get my data even if im not in a game...
	constructor(props) {
		super(props);
		
		this.state = {};
		this.state.img = {diff: false, value: this.props.myProfile.img};
		this.state.first_name = {diff: false, value: this.props.myProfile.first_name};
		this.state.last_name = {diff: false, value: this.props.myProfile.last_name};
		this.state.email = {diff: false, value: this.props.myProfile.email};
		this.state.diff = this.check_diff();
		this.state.error_msg = "";

		this.handleInputChange = this.handleInputChange.bind(this);
		this.temp_handle_img_change = this.temp_handle_img_change.bind(this);
		this.handleSaveProfile = this.handleSaveProfile.bind(this);
		this.check_diff = this.check_diff.bind(this);
	}

	check_diff(except) {
		if (this.state.img.diff && except != 'img') {
			return (true);
		}
		if (this.state.first_name.diff && except != 'first_name') {
			return (true);
		} 
		if (this.state.last_name.diff && except != 'last_name') {
			return (true);
		}
		if (this.state.email.diff && except != 'email') {
			return (true);
		}
		return (false);
	}


	handleInputChange(e) {
		this.setState({
			[e.target.name]: {diff: e.target.value != this.props.myProfile[e.target.name], value: e.target.value},
			diff: (e.target.value != this.props.myProfile[e.target.name] || this.check_diff(e.target.name)),
		});
	}

	temp_handle_img_change(e) {
		if (e.target.files[0]) {
			var reader = new FileReader();
			var that = this;
	        reader.onload = function (event) {
	        		that.setState({img: {diff: true, value: event.target.result}, diff: true});
				};

	        reader.readAsDataURL(e.target.files[0]);
	    }
	}

	handleSaveProfile(e) {  //validate valid email address??
		e.preventDefault();

		if (!this.state.diff) {
			return (false);
		}

		const changes = {user_id: this.props.myProfile.user_id};

		if (this.state.img.diff) {
			changes.img = this.state.img.value;
		}
		if (this.state.first_name.diff) {
			changes.first_name = this.state.first_name.value;
		}
		if (this.state.last_name.diff) {
			changes.last_name = this.state.last_name.value;
		}
		if (this.state.email.diff) {
			changes.email = this.state.email.value;
		}

		fetch(server_url + "/update_profile", {
			method: 'POST',
			body: JSON.stringify(changes),
			headers: {
				'Content-Type': 'application/json',
			},
		})
		.then((response) => 
			(response.status >= 200 && response.status < 300) ? response.json() : Promise.reject(new Error(response.statusText))
		)
		.then((data) => 
			{	
				if (!data.error_msg) {
					this.props.handleUpdateProfile(changes);
				}
				else {
					this.setState({error_msg: data.error_msg});
				}
			}
		)
		.catch((error) => 
			{console.log("Network Error: " + error.message);} //put in alert or errorMsg? 
		);		


	}



	render() {

		const img_css = {
			borderRadius: '100%',
			width: '40vw',
			height: '40vw',
		}

		const save_button_css = {
			backgroundColor: (this.state.diff ? 'blue' : 'white'),
		};
		

		return (
			<div>
				<div>
					<button onClick={this.props.handleToggleProfileMenu}>
						Cancel
					</button>
					EDIT Profile
					<button style={save_button_css} onClick={this.handleSaveProfile}>
						Save
					</button>
				</div>
				<img style={img_css} src={this.state.img.value} onClick={function(e) {document.getElementById("testt").click();}} />
				<input id="testt" style={{opacity: '0'}} name="file" type="file" accept="image/*" onChange={this.temp_handle_img_change} />
				<form>
					<p>{this.state.error_msg}</p>
					<label>
						First Name
						<input onChange={this.handleInputChange} type="text" name="first_name" value={this.state.first_name.value} />
					</label>
					<br />
					<label>
						Last Name
						<input onChange={this.handleInputChange} type="text" name="last_name" value={this.state.last_name.value} />
					</label>
					<br />
					<label>
						Email
						<input onChange={this.handleInputChange} type="text" name="email" value={this.state.email.value} />
					</label>
				{/*}<br />
					<label>
						Current Password
						<input type="text" />
					</label>
					<br />
					<label>
						New Password
						<input type="text" />
					</label>
					<br />
					<label>
						Re-type New Password
						<input type="text" />
					</label>*/}
				</form>
			</div>
		);
	}
}




class InvitationsMenu extends React.Component {
	render() {

		const invitationItems = this.props.invitations.map((invitation) =>
			<InvitationItem 
				key={invitation.invitation_id}
				inviter_name={invitation.inviter_name}
				invitation_id={invitation.invitation_id}
				handleJoinGame={this.props.handleJoinGame} 
				handleDeleteInvitation={this.props.handleDeleteInvitation} />
		);

		return (
			<div>
				<div>
					Invitations
				</div>
				<button onClick={this.props.handleToggleInvitationsMenu}>
					Close
				</button>
				{invitationItems.length > 0 ? <ul>{invitationItems}</ul> : "No Invitations"}
			</div>
		);
	}
}

class InvitationItem extends React.Component {
	render() {
		return (
			<div>
				{this.props.inviter_name} has invited you to join a game
				<button onClick={(e) => this.props.handleJoinGame(this.props.invitation_id, e)}>
					Join Game
				</button>
				<button onClick={(e) => this.props.handleDeleteInvitation(this.props.invitation_id, e)}>
					Delete
				</button>
			</div>
		);
	}
}








class Game extends React.Component {
	constructor(props) {
		super(props);

		this.state = {};
		this.state.currentPlayer = 0; //issue if players leave...?
		this.state.addingPlayer = false;
		this.state.notificationsMenuOpen = false;

		this.handleChangePlayer = this.handleChangePlayer.bind(this);
		this.handleSquareClick = this.handleSquareClick.bind(this);
		this.handleToggleAddPlayer = this.handleToggleAddPlayer.bind(this);
		this.handleToggleNotificationsMenu = this.handleToggleNotificationsMenu.bind(this);
		this.handleReadNotifications = this.handleReadNotifications.bind(this);
		this.temp_checkBreed = this.temp_checkBreed.bind(this); //temp!!!
	}

	handleReadNotifications(e) {
		const gameCopy = JSON.parse(JSON.stringify(this.props.game_data));
		for (var i = 0; i < gameCopy.notifications.length; i++) {
			gameCopy.notifications[i].read = true;
		}
		this.props.handleUpdateGame(gameCopy);
	}

	handleToggleNotificationsMenu(e) {
		this.setState({notificationsMenuOpen: !this.state.notificationsMenuOpen})
	}

	handleToggleAddPlayer(e) {
		if (e) {
			e.preventDefault();
		}
		this.setState({addingPlayer: !this.state.addingPlayer});
	}

	handleChangePlayer(increment, e) {
		this.setState({currentPlayer: this.state.currentPlayer + increment});
	}


	handleSquareClick(index, breedName, e) { 	//camera.cleanup?
		if (this.state.currentPlayer != 0 || this.props.game_data.players[0].matches.includes(index)) { ///just only have onclick for when the squares have a certain prop based o these?
			return (null);
		}

//REAL
//		navigator.camera.getPicture(
//			(imgURI) => this.checkBreed(imgURI, breedName, index), 
//			() => alert("Didn't capture photo"),
//			{quality: 50, allowEdit: true, sourceType: 0} ///true allows zooming? quality? //1 for camera.
//		); 

		document.getElementById('breedName').value = breedName; //temp
		document.getElementById('index').value = index; //temp
		document.getElementById('gpid').value = this.props.game_data.players[0].gpid; //temp
		document.getElementById('game_id').value = this.props.game_data.game_id; //temp
		document.getElementById("input").click(); //temp
	}

	///TEMP
	temp_checkBreed(e) { ////eventually checkBreed should match this.
		var form = document.getElementById("form");
		var formData = new FormData(form);
		formData.game_id = this.props.game_data.game_id;

		fetch(server_url + "/validate_breed", {
			method: 'POST',
			body: formData,
		})
		.then((response) => 
			(response.status >= 200 && response.status < 300) ? response.json() : Promise.reject(new Error(response.statusText))
		)
		.then((data) => 
			{
				console.log(data.match); ////
				if (data.match) {
					const gameCopy = JSON.parse(JSON.stringify(this.props.game_data));
					gameCopy.players[0].matches.push(parseInt(document.getElementById('index').value));
					//this.setState({players: gameCopy.players});
					this.props.handleUpdateGame(gameCopy);
				}
				else {
					const gameCopy = JSON.parse(JSON.stringify(this.props.game_data));
					gameCopy.players[0].matches.push(parseInt(document.getElementById('index').value));
					//this.setState({players: gameCopy.players});
					this.props.handleUpdateGame(gameCopy);
				}
			}
		)
		.catch((error) => 
			{console.log("Network Error: " + error.message);} //put in alert or errorMsg?
		);
	}////

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







	
	render() {
		if (this.state.addingPlayer) {
			return (
				<AddPlayerMenu 
					handleToggleAddPlayer={this.handleToggleAddPlayer} 
					user_id={this.props.user_id}
					game_id={this.props.game_data.game_id} />
			);
		}
		else if (this.state.notificationsMenuOpen) {
			return (
				<NotificationsMenu 
					notifications={this.props.game_data.notifications}
					handleReadNotifications={this.handleReadNotifications}
					handleToggleNotificationsMenu={this.handleToggleNotificationsMenu} />
			);
		}
		else {
			const currentPlayer = this.state.currentPlayer;
			const matches = this.props.game_data.players[currentPlayer].matches; 
			const newNotificationCount = this.props.game_data.notifications.reduce((total, notification) => total + (notification.read ? 0 : 1), 0);
			return (
				<div>
					<GameHeader 
						newNotificationCount={newNotificationCount}
						handleToggleAddPlayer={this.handleToggleAddPlayer} 
						handleToggleNotificationsMenu={this.handleToggleNotificationsMenu} />
					<Rolodex 
						players={this.props.game_data.players}
						currentPlayer={currentPlayer} />
					<Card 
						currentPlayer={currentPlayer} //get rid of after geting rid of side buttons
						totalPlayers={this.props.game_data.players.length} //this too
						matches={matches}
						squares={this.props.game_data.squares} 
						handleChangePlayer={this.handleChangePlayer}
						handleSquareClick={this.handleSquareClick} />
					<Footer handleReturnHome={this.props.handleReturnHome} />
					<form id="form" style={{opacity: 0}}>
						<input id="input" name="file" type="file" accept="image/*" onChange={this.temp_checkBreed} />
						<input id="index" name="index" />
						<input id="breedName" name="breedName" />	
						<input id="gpid" name="gpid" />		
						<input id="game_id" name="game_id" />				
					</form>
				</div>
			);
		}
	}
}







class GameHeader extends React.Component {  //it makes more sense at the top since it controls the whole screen. like at home, so home can render game or addplayermenu or invitations.
	render() {
		const cont_css = {
			display: 'flex',
			justifyContent: 'flex-end',
			backgroundColor:'steelblue',
			height: '10vh',
		}

		const button_css = {
			display: 'flex',
			flexDirection: 'column',
			textAlign: 'center',
			justifyContent: 'center',
			alignnItems: 'center',
			width: '17vw',
			color: 'white',
			fontSize: '8vw',
		}

		const circle_css = {
			display: 'flex',
			flexDirection: 'column',
			textAlign: 'center',
			justifyContent: 'center',
			borderRadius: '100%',
			width: '7vw',
			height: '7vw',
			backgroundColor: (this.props.newNotificationCount == 0 ? 'lightblue' : 'red'),
			fontSize: '4vw',
		}



		return (
			<div style={cont_css}> 
				<div style={button_css} onClick={this.props.handleToggleAddPlayer}>
					+
				</div>
				<div style={button_css} onClick={this.props.handleToggleNotificationsMenu}>
					<div style={circle_css}>
						{this.props.newNotificationCount}
					</div>
				</div>
			</div>
		);
	}
}



class NotificationsButton extends React.Component {
	render() {
		const css = {
			float: 'right',
			fontSize: '6vw',
			background: '#4a90e2',
			height: '10vw',
			width: '10vw',
			color: '#fff',
			backgroundColor: 'red',
			borderRadius: '100%',
			fontWeight: '300',
			border: '0',
			marginRight: '1.5vw',
		};
		return (
			<div style={css} onClick={this.props.handleToggleNotificationsMenu}>
			</div>
		);
	}
}






class Card extends React.Component {  //JUST NEED TO CHANGE STATE FROM VALIDATING AND NOT TO CONTROL THE DOT DOT DOTS, ON MOUNT AND DISMOUNT IT CALLS UP TO CHECKBREED??? I LIKE IT, THINK OF VIEW CHANGES, THEN JUST DO THINGS AS THESE CHANGE. A CROSSOUT SQUARE, FOR EXAMPLE, WHEN IT SHOWS UP, a function is called to alert a match? (if its mine)



	render() {
		const cssWrapper = {
			display: 'flex',
			backgroundColor: 'indianred',
			height: '65vh',
			alignItems: 'center',
		};
		const cssSide = {
			backgroundColor: 'grey',
			width: '10vw',
			textAlign: 'center',
		};

		return (
			<div style={cssWrapper}>
				<div style={cssSide}>
					<ChangePlayerButton 
						currentPlayer={this.props.currentPlayer}
						increment={-1} 
						disable={this.props.currentPlayer === 0}
						handleChangePlayer={this.props.handleChangePlayer} />
				</div>
				<DingoCard				
					squares={this.props.squares}
					matches={this.props.matches} 
					handleSquareClick={this.props.handleSquareClick} />
				<div style={cssSide}>
					<ChangePlayerButton 
						currentPlayer={this.props.currentPlayer}
						increment={1}
						disable={this.props.currentPlayer === this.props.totalPlayers - 1} 
						handleChangePlayer={this.props.handleChangePlayer} />
				</div>
			</div>
		);
	}
}

class Rolodex extends React.Component {
	render() {
		const players = this.props.players;
		const rolodexItems = players.map((player, index) => 
			<RolodexItem 
				key={player.gpid}
				first_name={player.first_name}
				img={player.img}
				index={index}
				currentPlayer={this.props.currentPlayer} />
		);
		const css = {
			textAlign: 'center',
			backgroundColor: 'lightblue',
			height: '16vh',
		};
		return (
			<div style={css}>
				{rolodexItems}
			</div>
		);
	}
}

class RolodexItem extends React.Component { //need to put in div and give that div an active class or like a -2, -1, 0, 1, 2 to use for z-values
	render() {
		const bgColor = this.props.index === this.props.currentPlayer ? 'yellow' : 'coral';
		const cssDiv = {
			display: 'inline-block',
			backgroundColor: bgColor,
		};
		const cssP = {
			fontSize: '1em',
			textAlign: 'center',
		};
		return (
			<div style={cssDiv}>
				<Avatar 
					width='18vw'
					src={this.props.img} 
					name={this.props.first_name}
					you={this.props.index == 0} />
			</div>
		);
	}
}


class ChangePlayerButton extends React.Component {
	render() {
		const css = {
			backgroundColor: 'purple',
			width: '10vw',
			height: '10vw',
			textAlign: 'center',
			fontSize: '9vw',
			border: '0',
		};
		if (this.props.disable) {
			return (null);
		}
		return (
			<button 
				style={css}
				onClick={(e) => this.props.handleChangePlayer(this.props.increment, e)}>
					{this.props.increment == -1 ? '<' : '>'}
			</button>
		);
	}
}

class DingoCard extends React.Component { //if currentplayer is 0, allow for clicking...
	render() {
		const matches = this.props.matches;
		const squares = this.props.squares.map((square, index) =>
			<DingoSquare
				key={index} //is this ok?
				index={index}
				breed={square.breed_name}
				img={square.img}
				matched={matches.includes(index)} 
				handleSquareClick={this.props.handleSquareClick} />
		);
		const css = {
			  display: 'grid',
			  gridGap: '1vw',
			  gridTemplateColumns: 'repeat(5, 15vw)',
			  gridTemplateRows: 'repeat(5, 15vw)',
		};
		return (
			<div style={css}>
				{squares}
			</div>
		);
	}
}


class DingoSquare extends React.Component { //keep state for matched or not, since will change rendering...?
	render() {
		var xbox;
		if (this.props.matched) {
			const cssXbox = {
				opacity: '0.7',
				backgroundColor: 'blue',
				textAlign: 'center',
				width:'100%', 
				height: '100%',
				position: 'absolute',
				top: '0',
				left: '0',
				fontSize: '10vw',
				color: 'white',
			};
			xbox = <div style={cssXbox}>X</div>;
		}
		else {
			xbox = '';
		}

		const cssImg = {
			width:'100%', 
			height: '100%',
		};
		const cssWrapper = {
			position: 'relative',
		}

		return (
			<div 
				style={cssWrapper}
				onClick={(e) => this.props.handleSquareClick(this.props.index, this.props.breed, e)} >
				<img style={cssImg} src={this.props.img} />
				{xbox}
			</div>
		);
	}
}




class Footer extends React.Component {
	render() {
		const css = {
			height: '10vh',
			backgroundColor: 'steelblue',
			textAlign: 'center',
		};
		return (
			<div style={css}>
				<HomeButton handleReturnHome={this.props.handleReturnHome} />
			</div>
		);
	}
}

class HomeButton extends React.Component {
	render() {
		const css = {
			fontSize: '6vw',
			background: '#4a90e2',
			padding: '2vw 3vw',
			color: '#fff',
			borderRadius: '1vw',
			fontWeight: '300',
			border: '0',
		};
		return (
			<button style={css} onClick={this.props.handleReturnHome} >
				HOME
			</button>
		);
	}
}



class NotificationsMenu extends React.Component {

	componentDidMount() {

		const readNotificationIds = this.props.notifications.reduce(function(filtered, notification) {
				if (!notification.read) {
					filtered.push(notification.notification_id);
				}
				return (filtered);
			}, 
			[]
		);

		fetch(server_url + "/read_notifications", {
			method: 'POST',
			body: JSON.stringify({read_notifications: readNotificationIds}),
			headers: {
      			"Content-Type": "application/json",
    		},
		})
		.then((response) => 
			(response.status >= 200 && response.status < 300) ? response : Promise.reject(new Error(response.statusText))
		)
		.catch((error) => 
			{console.log("Network Error: " + error.message);} //put in alert or errorMsg?
		);
	}

	componentWillUnmount() {
		this.props.handleReadNotifications();
  	}

	render() {

		const header_css = {
			height: '10vh',
			backgroundColor: 'steelblue',
			textAlign: 'center',
			padding: '20px',
		};
		
		return (
			<div>
				<div style={header_css}>
					Notifications
				</div>
				<div onClick={this.props.handleToggleNotificationsMenu}>
					Close
				</div>
				<NotificationsList 
					notifications={this.props.notifications} />
			</div>
		);
	}
}

class NotificationsList extends React.Component {
	render() {
		const notifications = this.props.notifications.map((notification) =>
			<NotificationsListItem  
				key={notification.notification_id} 
				msg={notification.msg}
				notifier={notification.notifier} 
				read = {notification.read} />
		);

		return (
			<div>
				{notifications}
			</div>
		);

	}
}

class NotificationsListItem extends React.Component {
	render() {

		const item_css = {
			height: '10vh',
			display: 'flex',
			justifyContent: 'space-between',
			alignItems: 'center', 
		};
		if (this.props.read) {
			item_css.backgroundColor = 'lightgrey';
		}

		const msg_css = {
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			textAlign: 'center',
			width: '90vw',
			height: '100%',
			borderBottom: '1px solid grey',
			fontSize: '6vw',
		};

		return (
			<div style={item_css}>
				<Avatar 
					src={this.props.notifier.img}
					width={'10vw'} />
				<div style={msg_css}>
					{this.props.msg}
				</div>
			</div>
		);
	}
}














//get rid of searchplayerlist component, it isnt separate enough from input...
class AddPlayerMenu extends React.Component { //what if theve already been invited to the game? by me or someone else? 
	constructor(props) {
		super(props);

		this.state= {};
		this.state.pattern = "";
		this.state.allTopPlayers = [];
		this.state.topPlayers = []; //could just map to an array of indices in allTopPlayers...
		this.state.otherPlayers = [];
		this.state.formSubmitted = true;

		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleSearch = this.handleSearch.bind(this);
		this.handleSendInvite = this.handleSendInvite.bind(this);
	}

	componentDidMount() { 
		fetch(server_url + "/get_top_players", {
			method: 'POST',
			body: JSON.stringify({user_id: this.props.user_id}),
			headers: {
      			"Content-Type": "application/json",
    		},
		})
		.then((response) => 
			(response.status >= 200 && response.status < 300) ? response.json() : Promise.reject(new Error(response.statusText))
		)
		.then((data) => 
			{
				this.setState({allTopPlayers: data, topPlayers: data});
			}
		)
		.catch((error) => 
			{console.log("Network Error: " + error.message);} //put in alert or errorMsg?
		);

	}

	handleSendInvite(invitee_id, e) { //put this in playersearchlistitem?
		e.preventDefault();

		const request_data = {}
		request_data.invitee_id = invitee_id;
		request_data.inviter_id = this.props.user_id;
		request_data.game_id = this.props.game_id;

		fetch(server_url + "/invite", {
			method: 'POST',
			body: JSON.stringify(request_data),
			headers: {
      			"Content-Type": "application/json",
    		},
		})
		.then((response) => 
			(response.status >= 200 && response.status < 300) ? response : Promise.reject(new Error(response.statusText))
		)
		.then((data) => 
			{
				alert("Invitation Sent!");
				this.props.handleToggleAddPlayer();
			}
		)
		.catch((error) => 
			{console.log("Network Error: " + error.message);} //put in alert or errorMsg?
		);

	}

	handleSearch(e) {
		e.preventDefault();

		if (this.state.pattern == "") {
			return (false);
		}

		fetch(server_url + "/search_players", {
			method: 'POST',
			body: JSON.stringify({pattern: this.state.pattern}),
			headers: {
      			"Content-Type": "application/json",
    		},
		})
		.then((response) => 
			(response.status >= 200 && response.status < 300) ? response.json() : Promise.reject(new Error(response.statusText))
		)
		.then((data) => 
			{
				this.setState({otherPlayers: data, formSubmitted: true});
			}
		)
		.catch((error) => 
			{console.log("Network Error: " + error.message);} //put in alert or errorMsg?
		);

	}

	handleInputChange(e) {
		const pattern = e.target.value.replace(/\s\s+/g, ' ');
		const splitPattern = pattern.trim().split(' ');
		const firstPattern = splitPattern[0];
		const lastPattern = splitPattern.length > 1 ? splitPattern[1] : '';
		let newTopPlayers = this.state.allTopPlayers.filter((player) => //why let on filter?
			(player.first_name.startsWith(firstPattern) && player.last_name.startsWith(lastPattern)) ||
			(player.first_name.startsWith(lastPattern) && player.last_name.startsWith(firstPattern))
		);
		this.setState({
			[e.target.name]: (/^\s+$/.test(pattern) ? "" : pattern),
			topPlayers: newTopPlayers,
			otherPlayers: [],
			formSubmitted: /^\s*$/.test(pattern)

		});
	}


	render() {
		return (
			<div>
				<button onClick={this.props.handleToggleAddPlayer}>
					Cancel
				</button>
				<form onSubmit={this.handleSearch}>
					<input //try onsubmit in form, or keyup on this. //may need to try on mobile(e) => this.props.handleSearch(e.target.value, e)
						type="text" 
						name="pattern"
						value={this.state.pattern}
						placeholder="Search People"
						onChange={this.handleInputChange} />
				</form>
				<PlayerSearchList 
					formSubmitted={this.state.formSubmitted}
					pattern={this.state.pattern}
					topPlayers={this.state.topPlayers}
					otherPlayers={this.state.otherPlayers}  //need to change to see other results... when typing... on change input... and make that a clickable that calls search.
					handleSearch = {this.handleSearch}
					handleSendInvite={this.handleSendInvite} />
			</div>
		);
	}
}


class PlayerSearchList extends React.Component {
	render() {
		const topPlayers = this.props.topPlayers.map((player) =>
			<PlayerSearchListItem 
				key={player.user_id}
				user_id={player.user_id}
				img={player.img}
				first_name={player.first_name}
				last_name={player.last_name}
				handleSendInvite={this.props.handleSendInvite} />
		);
		let otherPlayers = this.props.otherPlayers.filter((player) =>
			{
				for (let i = 0; i < this.props.topPlayers.length; i++) {
					if (player.user_id == this.props.topPlayers[i].user_id)
						return (false);
				}
				return (true);
			}
		);
		otherPlayers = otherPlayers.map((player) => //filter so they dont contain topplaeyrs!!!
			<PlayerSearchListItem 
				key={player.user_id}
				user_id={player.user_id}
				img={player.img}
				first_name={player.first_name}
				last_name={player.last_name}
				handleSendInvite={this.props.handleSendInvite} />
		);

		const seeMoreButton = <a onClick={this.props.handleSearch}>See more results...</a>; //pass param into search...
		return (
			<div>
				{topPlayers.length > 0 && 'Top People'}  {/*put multiple jsx elements in an array and just do one condition.*/}
				{topPlayers.length > 0 && topPlayers}
				{!this.props.formSubmitted && seeMoreButton}
				{this.props.formSubmitted && otherPlayers.length > 0 && 'Other people on Dingo'}				
				{this.props.formSubmitted && otherPlayers.length > 0 && otherPlayers}
			</div>
		);
	}
}

class PlayerSearchListItem extends React.Component {
	render() {
		return (
			<div onClick={(e) => this.props.handleSendInvite(this.props.user_id, e)}>
				<Avatar src={this.props.img} />
				{this.props.first_name} 
				{this.props.last_name}
			</div>
		);
	}
}









export default Home;
















