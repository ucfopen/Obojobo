const React = require('react')

const Button = (props) => <button onClick={props.onClick} className={`repository--button ${props.className || ''}`}>{props.children}</button>

module.exports = Button
