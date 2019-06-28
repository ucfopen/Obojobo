const React = require('react');
import DefaultLayout from './layouts/default'
import RepositoryNav from './components/repository-nav'
import RepositoryBanner from './components/repository-banner'
import Module from './components/module'
import RepositoryListItemFeedback from './components/repository-list-item-feedback'
import RepositoryListItemScores from './components/repository-list-item-scores'
import RepositoryListItemEdited from './components/repository-list-item-edited'
import Button from './components/button'

const mapItemTypes = {
	'feedback': RepositoryListItemFeedback,
	'scores': RepositoryListItemScores,
	'edited': RepositoryListItemEdited
}

const Dashboard = (props) =>
	<DefaultLayout title={props.title} className="repository--dashboard">
		<RepositoryNav
			userId={props.currentUser.id}
			userAvatar={props.currentUser.avatar()}
			displayName={`${props.currentUser.firstName} ${props.currentUser.lastName}`}
			noticeCount={12}
			/>
		<RepositoryBanner title={props.title} facts={props.facts} />
		<div className="repository--section-wrapper">
			<section className="repository--main-content repository--column-layout">
				<div className="repository--item-list dashboard--notifications">
					<div className="repository--item-list--title">Updates and Activity</div>

					<div className="repository--item-list--group">
						<div className="repository--item-list--group--item-wrapper">
							{
								props.activityItems.map(item => {
									const Type = mapItemTypes[item.type]
									return <Type {...item} />
								})
							}
						</div>

						<div className="repository--item-list--group--item--newline-container">
							<Button>Load more Activity</Button>
						</div>

					</div>
				</div>

				<div className="repository--item-list dashboard--assignments">
					<div className="repository--item-list--title">Modules You're Learning</div>
					<div className="repository--item-list--group">
						<div className="repository--item-list--group--item-wrapper">
							<div className="repository--item-list--row">
								<div className="repository--item-list--group--item--multi-wrapper">
									{props.modulesImLearning.map(module => <Module {...module} /> )}
									<div className="repository--item-list--group--item--newline-container">
										<Button>See More View History</Button>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className="repository--item-list--title">Modules Your Creating</div>
					<div className="repository--item-list--group">
						<div className="repository--item-list--group--item-wrapper">
							<div className="repository--item-list--row">
								<div className="repository--item-list--group--item--multi-wrapper">

									{props.modulesImWriting.map(module => <Module {...module} /> )}

									<div className="repository--item-list--group--item--newline-container">
										<Button>View All Your Modules</Button>
									</div>

								</div>
							</div>
						</div>
					</div>

				</div>
			</section>
		</div>
		<script src="/static/dashboard.js"></script>
	</DefaultLayout>

module.exports = Dashboard;
