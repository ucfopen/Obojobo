const React = require('react');
import DefaultLayout from './layouts/default'
import RepositoryNav from './components/repository-nav'
import RepositoryFactBanner from './components/repository-fact-banner'
import Module from './components/module'
import Button from './components/button'

const title = 'Library'

const Dashboard = (props) =>
	<DefaultLayout title={title} className="repository--library">
		<RepositoryNav/>
		<RepositoryFactBanner title={title} facts={props.facts} />

		<div class="repository--section-wrapper">
			<section class="repository--main-content">

				<div class="repository--main-content--title">Most Popular Modules</div>

				<div class="repository--item-list--group">
					<div class="repository--item-list--group--item-wrapper">
						<div class="repository--item-list--row">
							<div class="repository--item-list--group--item--multi-wrapper">
								{props.popularModules.map(module => <Module {...module} /> )}
								<div class="repository--item-list--group--item--newline-container">
									<Button>Load more..</Button>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div class="repository--main-content--title">Newly Created Modules</div>

				<div class="repository--item-list--group">
					<div class="repository--item-list--group--item-wrapper">
						<div class="repository--item-list--row">
							<div class="repository--item-list--group--item--multi-wrapper">
								{props.newModules.map(module => <Module {...module} /> )}

							</div>
						</div>
					</div>
				</div>

				<div class="repository--main-content--title">Recently Updated Modules</div>

				<div class="repository--item-list--group">
					<div class="repository--item-list--group--item-wrapper">
						<div class="repository--item-list--row">
							<div class="repository--item-list--group--item--multi-wrapper">
								{props.updatedModules.map(module => <Module {...module} /> )}
							</div>
						</div>
					</div>
				</div>

			</section>
		</div>

		<script src="/static/dashboard.js"></script>

	</DefaultLayout>

module.exports = Dashboard;
