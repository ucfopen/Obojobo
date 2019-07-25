import React from 'react'

const navSubItem = ({ onClick, className, label }) => {
	return (
		<li onClick={onClick} className={className}>
			{label}
		</li>
	)
}

export default navSubItem
