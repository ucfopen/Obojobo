const React = require('react');
import DefaultLayout from './layouts/default'
import RepositoryNav from './components/repository-nav'
import RepositoryFactBanner from './components/repository-fact-banner'
import Module from './components/module'
import Button from './components/button'

const title = 'Library'

const Library = (props) =>
	<DefaultLayout title={title} className="repository--library">
		<RepositoryNav/>
		<RepositoryFactBanner title={title} facts={props.facts} />

		<div className="repository--section-wrapper">
			<section className="repository--main-content">
				{props.groups.map(group =>
					<span key={group.id}>
						<div className="repository--main-content--title">{group.title}</div>
						<div className="repository--item-list--group">
							<div className="repository--item-list--group--item-wrapper">
								<div className="repository--item-list--row">
									<div className="repository--item-list--group--item--multi-wrapper">
										{group.drafts.map(draft => <Module key={draft.id} {...draft}></Module> )}
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
					</span>
				)}
			</section>
		</div>

		<script src="/static/dashboard.js"></script>

	</DefaultLayout>

module.exports = Library;
