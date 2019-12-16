const React = require('react')
import LayoutDefault from '../layouts/default'
import RepositoryNav from '../repository-nav'
import RepositoryBanner from '../repository-banner'
import ModuleImage from '../module-image'
import moment from 'moment'

const PageModule = props => (
	<LayoutDefault
		title={`${props.module.title} - an Obojobo Module`}
		className="repository--module"
		appCSSUrl={props.appCSSUrl /* provided by resp.render() */}
	>
		<RepositoryNav
			userId={props.currentUser.id}
			avatarUrl={props.currentUser.avatarUrl}
			displayName={`${props.currentUser.firstName} ${props.currentUser.lastName}`}
			noticeCount={0}
		/>

		<RepositoryBanner title={props.module.title}>
			<ModuleImage id={props.module.draftId} />
		</RepositoryBanner>

		<section className="repository--main-content">
			<div>
				Module created by{' '}
				<b>
					{props.owner.firstName} {props.owner.lastName}
				</b>{' '}
				on <b>{moment(props.module.createdAt).format('ll')}</b> and updated{' '}
				{moment(props.module.updatedAt).fromNow()}.
			</div>

			<h2>Use this Module in your Canvas Course</h2>
			<p>
				This module can be used inside your course as an <b>assignment</b> or <b>module</b>.
			</p>

			<figure>
				<img
					src="/images/obojobo-assignment.gif"
					alt="Animated gif showing how to create an Obojobo Assignment in canvas"
				/>
				<figcaption>Creating an Assignment in Canvas</figcaption>
			</figure>

			<h3>Create an Assignment in Canvas</h3>
			<ol>
				<li>Click Assignments in your course&apos;s menu.</li>
				<li>Create a new Assignment</li>
				<li>
					Set the:
					<ul>
						<li>Assignment Name</li>
						<li>Points (do not use 0)</li>
						<li>any other relevant settings</li>
					</ul>
				</li>
				<li>Set Submission Type to &quot;External Tool&quot;</li>
				<li>
					Follow the <a href="#selecting-this-module">Choosing a Obojobo Module</a> instructions
					below
				</li>
				<li>Click Select</li>
				<li>Save & Publish</li>
			</ol>

			<h3>Create an Ungraded Module in Canvas</h3>
			<ol>
				<li>Click Modules in your course&apos;s menu.</li>
				<li>Click the &quot;+&quot; in a module</li>
				<li>
					Set the:
					<ul>
						<li>Assignment Name</li>
						<li>Points (do not use 0)</li>
						<li>any other relevant settings</li>
					</ul>
				</li>
				<li>Change the top drop down from &quot;Assignment&quot; to &quot;External Tool&quot;.</li>
				<li>
					Follow the <a href="#selecting-this-module">Choosing a Obojobo Module</a> instructions
					below
				</li>
				<li>Click Add Item</li>
				<li>
					You new module will be named &quot;{props.module.title} (doesn&apos;t send scores to grade
					book)&quot;
				</li>
				<li>
					Be sure to <b>Publish</b> within Canvas when ready
				</li>
			</ol>

			<h3 id="selecting-this-module">Choosing a Obojobo Module</h3>
			<ol>
				<li>Follow one of the sets of instructions above.</li>
				<li>
					Click &quot;FIND&quot; next to the input labeled &quot;Enter or find an External Tool
					URL&quot;
				</li>
				<li>
					In the popup that appears, scroll down and select &quot;ObojoboNext Module (gradebook
					synced)&quot;
				</li>
				<li>Choose Community Collection</li>
				<li>
					Search for the module by its title (<code>{props.module.title}</code>) or its id (
					<code>{props.module.draftId}</code>)
				</li>
				<li>Click Embed next to your chosen module</li>
			</ol>
		</section>
	</LayoutDefault>
)

module.exports = PageModule
