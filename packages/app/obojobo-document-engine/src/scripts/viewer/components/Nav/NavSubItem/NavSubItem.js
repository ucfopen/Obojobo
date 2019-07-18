import React from 'react';

const navSubItem = ({ onClick, className, label }) => {
    return (
        <li onClick={onClick} className={className}>
            {/* {this.renderLinkButton(item.label, ariaLabel, isItemDisabled)}
            {lockEl} */}
            {label}
        </li>
    )
}

export default navSubItem
