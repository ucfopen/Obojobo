require('./page-library.scss')

const React = require('react')
import LayoutDefault from '../layouts/default'
import RepositoryNav from '../repository-nav'
import RepositoryBanner from '../repository-banner'
import Module from '../module'

const Search = require('../search')

const { filterModules } = require('../../util/filter-functions')

const title = 'Module Library'

const PageLibrary = props => {
	const [filterString, setFilterString] = React.useState('')

	let filteredDisplay = props.collections
		.map(collection => {
			const visibleModulesInCollection = filterModules(collection.drafts, filterString, false)
			const modulesInCollectionRender = visibleModulesInCollection.map(draft => (
				<Module key={draft.draftId} {...draft}></Module>
			))

			if (visibleModulesInCollection.length) {
				return (
					<span
						key={collection.id}
						className="repository--main-content--item-list--collection-wrapper"
					>
						<div className="repository--main-content--title">
							<span>{collection.title}</span>
						</div>
						<div className="repository--item-list--collection">
							<div className="repository--item-list--collection--item-wrapper">
								<div className="repository--item-list--row">
									<div className="repository--item-list--collection--item--multi-wrapper">
										{modulesInCollectionRender}
									</div>
								</div>
							</div>
						</div>
					</span>
				)
			}
			return null
		})
		.filter(c => c !== null)

	if (!filteredDisplay.length) {
		filteredDisplay = (
			<span className="repository--main-content--no-filter-results-text">
				No modules found matching provided filter!
			</span>
		)
	}

	return (
		<LayoutDefault
			title={title}
			className="repository--library"
			appCSSUrl={props.appCSSUrl /* provided by resp.render() */}
		>
			<RepositoryNav
				userId={props.currentUser.id}
				userPerms={props.currentUser.perms}
				avatarUrl={props.currentUser.avatarUrl}
				displayName={`${props.currentUser.firstName} ${props.currentUser.lastName}`}
				noticeCount={0}
			/>
			<RepositoryBanner className="default-bg" title={title} />

			<div className="repository--section-wrapper">
				<section className="repository--main-content">
					<p>Find modules for your course.</p>
					<Search value={filterString} placeholder="Filter Modules..." onChange={setFilterString} />
					{filteredDisplay}
				</section>
			</div>
		</LayoutDefault>
	)
}

PageLibrary.defaultProps = {
	collections: []
}

// module.exports = PageLibrary
export default PageLibrary
