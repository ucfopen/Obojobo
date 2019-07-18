import React from 'react'

const navItem = (props) => {
    return (
        <li className={props.className} onClick={props.onClick}>
            {/* {this.renderLinkButton(item.label, ariaLabel, isItemDisabled, item.id)}
            {lockEl} */}
            {props.label}
        </li>
    )
}

export default navItem
