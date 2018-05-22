import React, { Component } from 'react';
import { render } from 'react-dom';
import { createStore } from 'redux';
import { Provider, connect } from 'react-redux'

import dingoReducer from './redux-reducer'

import CurrentPage from './dingo-redux-currentpage'

import * as actions from './redux-action-creators'

localStorage.removeItem('userId'); //temp

//statusBar.hide(); figure out how to use this plugin

//persistedState from local storage can go as second arg to createStore! but need to check server still... if offline?

//make sure in search players  a player already in game doesnt show up.. dont wantt o invite to game if already in.

class App extends Component { 

	componentDidMount() {
		const storedId = localStorage.getItem('userId');
		if (storedId != null) {
			this.props.goToSplash();
			this.props.updateUserId(parseInt(storedId));
		}
	}

	render() {
		return (
			<CurrentPage 
				pageName={this.props.currentPage} 
			/>
		);
	}
}

const mapStateToAppProps = (state) => ({
	currentPage: state.currentPage,
});

const mapDispatchToAppProps = (dispatch) => ({
	goToSplash: () => {
		dispatch(
			actions.changePage("SPLASH")
		);
	},
	updateUserId: (userId) => {
		dispatch(
			actions.updateUserId(userId)
		);
	},
});

App = connect(mapStateToAppProps, mapDispatchToAppProps)(App);











//main

render( 
	<Provider store={createStore(dingoReducer)}>
		<App />
	</Provider>,
	document.getElementById('root')
);

