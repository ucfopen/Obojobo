require('./hybrid-input-select.scss')

const React = require('react')
const { useState } = require('react')

const HybridInputSelect = ({ placeholder = 'Enter text', list = [], onChange }) => {
	const [text, setText] = useState('')
	const [filteredList, setFilteredList] = useState(list)
	const [dropdownOpen, setDropdownOpen] = useState(false)

	const handleInputChange = event => {
		const value = event.target.value
		setText(value)
		setDropdownOpen(true)

		if (onChange) onChange({ target: { value } })

		// Filters a given list based on the input text
		const newList = list.filter(el => el && el.toLowerCase().match(value.toLowerCase()))
		setFilteredList(newList)
	}

	const handleElementClick = el => {
		setText(el)
		setDropdownOpen(false)
	}

	const formatElement = el => {
		if (el && el.length > 18) el += '...'
		return el
	}

	let elementsClassName = 'elements '
	elementsClassName += text && dropdownOpen ? 'open' : 'closed'

	let elements = filteredList.map((el, ix) => (
		<div className="element" key={ix} onClick={() => handleElementClick(el)}>
			{formatElement(el)}
		</div>
	))

	if (elements.length === 0)
		elements = [
			<div className="element no-matches" key={0}>
				No matches found
			</div>
		]

	return (
		<div className="hybrid-input-select">
			<input type="text" value={text} onChange={handleInputChange} placeholder={placeholder} />
			<div className={elementsClassName}>{elements}</div>
		</div>
	)
}

module.exports = HybridInputSelect
