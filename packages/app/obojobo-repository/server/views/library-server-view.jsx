const React = require('react');
import DefaultLayout from '../../shared/components/layouts/default'
import RepositoryNav from '../../shared/components/repository-nav'
import RepositoryBanner from '../../shared/components/repository-banner'
import Module from '../../shared/components/module'
import Button from '../../shared/components/button'

const title = 'Module Library'

const Library = (props) =>
	<DefaultLayout title={title} className="repository--library">
		<RepositoryNav
			userId={props.currentUser.id}
			avatarUrl={props.currentUser.avatarUrl}
			displayName={`${props.currentUser.firstName} ${props.currentUser.lastName}`}
			noticeCount={3}
			/>
		<RepositoryBanner className="default-bg" title={title} />

		<div className="repository--section-wrapper">
			<section className="repository--main-content">
				{props.groups.map(group =>
					<span key={group.id}>
						<div className="repository--main-content--title">{group.title}</div>
						<div className="repository--item-list--group">
							<div className="repository--item-list--group--item-wrapper">
								<div className="repository--item-list--row">
									<div className="repository--item-list--group--item--multi-wrapper">
										{group.drafts.map(draft => <Module key={draft.draftId} {...draft}></Module> )}
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

	</DefaultLayout>

module.exports = Library;
