import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actions from './redux-action-creators'

class Route extends Component {
	render() {
		return (
			React.cloneElement(this.props.children, { handleClick: (e) => this.props.handleClick(e, this.props.to) })
		);
	}
}


const mapDispatchToRouteProps = (dispatch) => ({
	handleClick: (e, to) => {
		e.preventDefault();
		dispatch(actions.changePage(to));
	}
});

Route = connect(null, mapDispatchToRouteProps)(Route);

export default Route;

