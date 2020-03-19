require('./module-search-dialog.scss')

const React = require('react')
const { useEffect } = require('react')
const Button = require('./button')
const Search = require('./search')
const CollectionModuleListItem = require('./collection-module-list-item')

const ModuleSearchDialog = props => {
	// clear results on initial render
	useEffect(() => {
		props.clearModuleSearchResults()
	}, [])

	const onSelectModule = module => {
		props.onSelectModule(module.draftId)
	}

	const handleSearchChange = searchString => {
		props.onSearchChange(searchString, props.collectionId)
	}

	const renderModuleList = () => {
		return props.searchModules.map(module => (
			<CollectionModuleListItem key={module.draftId} {...module}>
				<Button className="select-button" onClick={() => onSelectModule(module)}>
					Select
				</Button>
			</CollectionModuleListItem>
		))
	}

	return (
		<div className="module-search-dialog">
			<div className="wrapper">
				<Button className="close-button" ariaLabel="Close" onClick={props.onClose}>
					×
				</Button>
				<h1 className="title">Find Modules to Add</h1>
				<Search onChange={handleSearchChange} focusOnMount={true} placeholder="Search..." />
			</div>
			<div className="module-list-wrapper">
				<ul className="module-list">{renderModuleList()}</ul>
			</div>
		</div>
	)
}

module.exports = ModuleSearchDialog
