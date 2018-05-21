import React from 'react'

import { SignUpPage } from './dingo-redux-signup'
import SplashContainer from './dingo-redux-splash'
import LoginPage from './dingo-redux-login'
import { HomePage } from './dingo-redux-home'
import ProfilePage from './dingo-redux-profile'
import InvitationsPage from './dingo-redux-invitations'
import GamePage from './dingo-redux-game'



//presentational
const CurrentPage = (props) => {
	switch (props.pageName) {
		case "HOME": 
			return <HomePage />;
		case "INVITATIONS":
			return <InvitationsPage />;
		case "PROFILE":
			return <ProfilePage />;
		case "GAME":
			return <GamePage />;
		case "SIGNUP":
			return <SignUpPage />;
		case "LOGIN":
			return <LoginPage />;
		case "SPLASH":
			return <SplashContainer />;
		default:
			return "DEFAULT";
	}
}

export default CurrentPage;