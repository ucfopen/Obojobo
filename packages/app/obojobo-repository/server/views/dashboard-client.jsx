const React = require('react');
const RepositoryNav = require('./components/repository-nav')
const RepositoryBanner = require('./components/repository-banner')
const Module = require('./components/module')
const ModuleMenu = require('./components/module-menu')
const RepositoryListItemFeedback = require('./components/repository-list-item-feedback')
const RepositoryListItemScores = require('./components/repository-list-item-scores')
const RepositoryListItemEdited = require('./components/repository-list-item-edited')
const Button = require('./components/button')
const Search = require('./components/search')

const DashboardClient = (props) =>
	<span>
		<RepositoryNav
			userId={props.currentUser.id}
			avatarUrl={props.currentUser.avatarUrl}
			displayName={`${props.currentUser.firstName} ${props.currentUser.lastName}`}
			noticeCount={12}
			/>
		<RepositoryBanner title={props.title} className="default-bg" facts={props.facts} />
		<div className="repository--section-wrapper">
			<section className="repository--main-content">
				<div className="repository--main-content--title">My Modules</div>
				<div className="repository--item-list--group">
					<div className="repository--item-list--group--item-wrapper">
						<div className="repository--item-list--row">
						<Search />
							<div className="repository--item-list--group--item--multi-wrapper">
								{props.myModules.map(draft => <Module key={draft.draftId} {...draft}><ModuleMenu {...draft}/></Module> )}
								{
									props.page < props.pageCount ?
									<div className="repository--item-list--group--item--newline-container">
										<Button>Load more..</Button>
									</div>
									:
									null
								}

							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	</span>

module.exports = DashboardClient;
