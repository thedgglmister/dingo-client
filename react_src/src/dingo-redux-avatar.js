import React from 'react'

const Avatar = (props) => { //what if name overflows size?

	const css = {
		width: props.width,
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'stretch', //default?
	};

	const nameCSS = {
		textAlign: 'center',
		margin: '0',
	};

	const imgCSS = {
		width: props.width,
		height: props.width,
		borderRadius: '100%',
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
