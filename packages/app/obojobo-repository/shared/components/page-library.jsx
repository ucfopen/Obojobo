const React = require('react');
import DefaultLayout from './layouts/default'
import RepositoryNav from './repository-nav'
import RepositoryBanner from './repository-banner'
import Module from './module'
import Button from './button'

const title = 'Module Library'

const PageLibrary = (props) =>
	<DefaultLayout title={title} className="repository--library">
		<RepositoryNav
			userId={props.currentUser.id}
			avatarUrl={props.currentUser.avatarUrl}
			displayName={`${props.currentUser.firstName} ${props.currentUser.lastName}`}
			noticeCount={0}
			/>
		<RepositoryBanner className="default-bg" title={title} />

		<div className="repository--section-wrapper">
			<section className="repository--main-content">
				<p>Find modules for your course.</p>
				{props.collections.map(collection =>
					<span key={collection.id}>
						<div className="repository--main-content--title">{collection.title}</div>
						<div className="repository--item-list--collection">
							<div className="repository--item-list--collection--item-wrapper">
								<div className="repository--item-list--row">
									<div className="repository--item-list--collection--item--multi-wrapper">
										{collection.drafts.map(draft => <Module key={draft.draftId} {...draft}></Module> )}
										{
											props.page < props.pageCount ?
											<div className="repository--item-list--collection--item--newline-container">
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

	</DefaultLayout>

module.exports = PageLibrary;
