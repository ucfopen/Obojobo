import React from 'react'

const navItem = ({ className, onClick, label, lockEl }) => {
	return (
		<li className={className} onClick={onClick}>
			{label}
			{lockEl}
		</li>
	)
}

export default navItem
