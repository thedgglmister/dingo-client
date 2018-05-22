import React from 'react'

const Avatar = (props) => { //what if name overflows size?

	const css = {
		width: props.width,
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'stretch', //default?
		padding: '0.5vw',
	};

	const nameCSS = {
		textAlign: 'center',
		margin: '0',
	};

	const imgCSS = {
		width: props.width,
		height: props.width,
		borderRadius: '10px',
	};

	return (
		<div style={css}>
			<img 
				style={imgCSS} 
				src={props.img} 
			/>
			<p style={nameCSS}>
				{props.name}
			</p>
		</div>
	);
}

export default Avatar;
