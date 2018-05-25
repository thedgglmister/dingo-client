import React, { Component } from 'react'
import { connect } from 'react-redux'

import * as actions from './redux-action-creators'

import Avatar from './dingo-redux-avatar'


const server_url = "https://dingo-test.herokuapp.com";

//need to test whether all invs to same game get deleted when an inv is accepted.
//deleted from database, but need to get all invIds from server to update view.

const InvitationsPage = (props) => {
	return (
		<div>
			<InvitationsHeaderContainer />
			<InvitationsListContainer />
		</div>
	);
}



const mapDispatchToInvitationsHeaderProps = (dispatch) => ({
	returnHome: (e) => {
		e.preventDefault();
		dispatch(
			actions.changePage("HOME")
		);
	}
})

class InvitationsHeaderContainer extends Component {
	render() {
		return (
			<InvitationsHeader 
				onClick={this.props.returnHome}
			/>
		);
	}
}
InvitationsHeaderContainer = connect(null, mapDispatchToInvitationsHeaderProps)(InvitationsHeaderContainer);

const InvitationsHeader = (props) => {

	const css = {
		height: '10vh',
		backgroundColor: 'steelblue',
		color: 'white',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		textAlign: 'center',
		position: 'relative',
		fontSize: '5vh',
		borderBottom: '1px solid #264662'
	};

	const closeCSS = {
		position: 'absolute',
		width: '15vw',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		textAlign: 'center',
		fontSize: '4vw',
	};

	return (
		<div style={css}>
			<a style={closeCSS} onClick={props.onClick}>
				&lang;
			</a>
			INVITATIONS
		</div>
	);
}





const mapStateToInvitationsListProps = (state) => ({
	invs: state.invs.map(
		(inv) => ({
			invId: inv.invId,
			firstName: state.profiles[inv.fromId].firstName,
			img: state.profiles[inv.fromId].img,
		})
	),
	userId: state.userId,
});

const mapDispatchToInvitationsListProps = (dispatch) => ({
	acceptInv: (data) => {
		dispatch(
			actions.acceptInv(data)
		);
	},
	declineInv: (invs) => {
		dispatch(
			actions.declineInv(invs)
		);
	}
});


class InvitationsListContainer extends Component {
	constructor(props) {
		super(props);

		this.handleAcceptInv = this.handleAcceptInv.bind(this);
		this.handleDeclineInv = this.handleDeclineInv.bind(this);
	}


	handleAcceptInv(e, invId) {
		e.preventDefault();

		fetch(
			server_url + "/accept_invite", 
			{
				method: 'POST',
				body: JSON.stringify({
					invId: invId, 
					userId: this.props.userId,
				}),
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
				this.props.acceptInv(data);
			}
		).catch(
			(error) => console.log("Network Error: " + error.message) //put in alert or errorMsg? 
		);		
	}

	handleDeclineInv(e, invId) {
		e.preventDefault();

		fetch(
			server_url + "/decline_invite", 
			{
				method: 'POST',
				body: JSON.stringify({invId: invId}),
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
				this.props.declineInv(data.invs);
			}
		).catch(
			(error) => console.log("Network Error: " + error.message) //put in alert or errorMsg? 
		);		
	}

	render() {
		const invitationItems = this.props.invs.map((inv) =>
			<InvitationItem
				key={inv.invId}				
				firstName={inv.firstName}
				img={inv.img}
				handleAcceptInv={(e) => this.handleAcceptInv(e, inv.invId)}
				handleDeclineInv={(e) => this.handleDeclineInv(e, inv.invId)}
			/>
		);

		return (
			this.props.invs.length > 0 ?
				<InvitationsList
					items={invitationItems}
				/>
			:
				<NoInvitations />
		);
	}
}
InvitationsListContainer = connect(mapStateToInvitationsListProps, mapDispatchToInvitationsListProps)(InvitationsListContainer);


const InvitationsList = (props) => {
//make enough empty slots to fit in screen, fill it top few with items...?

	const css = {
		height: '90vh',
		overflow: 'scroll',
	};

	return (
		<div style={css}>
			{props.items}
		</div>
	);
}

const InvitationItem = (props) => {
	const css = {
		display: 'flex',
		alignItems: 'flex-start',
		paddingLeft: '3vw',
		paddingTop: '3vw',
	};

	const messageCSS = {
		width: '85vw',
		textAlign: 'center',
		borderBottom: '1px solid lightgrey',
	}

	const pCSS = {
		margin: '0',
	}

	const buttonContainerCSS = {
		height: '4vh',
		display: 'flex',
		justifyContent: 'space-evenly',
		padding: '2vh 0 1vh 0', 
	}

	const buttonCSS = {
		backgroundColor: 'lightgrey',
		borderRadius: '3px',
		width: '24vw',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
	}

	return (
		<div style={css}>
			<Avatar 
				img={props.img}
				width='12vw'
			/>
			<div style={messageCSS}>
				<p style={pCSS}>
					{props.firstName} has invited you to join a game
				</p>
				<div style={buttonContainerCSS}>
					<a style={buttonCSS} onClick={props.handleAcceptInv}>
						Join
					</a>
					<a style={buttonCSS} onClick={props.handleDeclineInv}>
						No thanks
					</a>
				</div>
			</div>
		</div>
	);
}




const NoInvitations = (props) => {

	const css = {
		height: '80vh',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		fontSize: '10vw',
	};

	return (
		<div style={css}>
			No Invitations
		</div>
	);
}






export default InvitationsPage;