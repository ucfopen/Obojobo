require('./page-split-run-preview.scss')

const React = require('react')
import LayoutDefault from '../layouts/default'
import ModuleImage from '../module-image'
import RepositoryNav from '../repository-nav'
import RepositoryBanner from '../repository-banner'

const renderAllModuleOptions = moduleOptions => {
	return moduleOptions.map(option => (
		<div key={option.draftId} className="module-option">
			<a href={`/preview/${option.draftId}`} rel="noreferrer" target="_blank">
				<ModuleImage id={option.draftId} />
				{option.title}
			</a>
		</div>
	))
}

const PageSplitRunPreview = props => (
	<LayoutDefault title={props.title} className="repository--library" appCSSUrl={props.appCSSUrl}>
		<RepositoryNav
			userId={props.currentUser.id}
			userPerms={props.currentUser.perms}
			avatarUrl={props.currentUser.avatarUrl}
			displayName={`${props.currentUser.firstName} ${props.currentUser.lastName}`}
			noticeCount={0}
		/>
		<RepositoryBanner className="default-bg" title={props.title} />

		<div className="repository--section-wrapper">
			<section className="repository--main-content">
				<p>
					You are trying to preview a split-run embed. Students will be automatically directed to
					one of the {props.moduleOptions.length} modules shown below.
				</p>
				<p>Click one of the modules to preview it.</p>
				<div className="module-options-container">
					{renderAllModuleOptions(props.moduleOptions)}
				</div>
			</section>
		</div>
	</LayoutDefault>
)

module.exports = PageSplitRunPreview
