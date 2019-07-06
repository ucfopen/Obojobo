const React = require('react');
import DefaultLayout from '../../shared/components/layouts/default'
import RepositoryNav from '../../shared/components/repository-nav'
import RepositoryBanner from '../../shared/components/repository-banner'
import ModuleImage from '../../shared/components/module-image'
import Button from '../../shared/components/button'

const ModulePage = (props) =>
	<DefaultLayout title={`${props.module.title} - an Obojobo Module by ${props.user.name}`} className="repository--module">
		<RepositoryNav
			userId={props.currentUser.id}
			avatarUrl={props.currentUser.avatarUrl}
			displayName={`${props.currentUser.firstName} ${props.currentUser.lastName}`}
			noticeCount={12}
			/>

		<RepositoryBanner title={props.module.title}>
			<ModuleImage id={props.module.draftId} />
		</RepositoryBanner>

		<section className="repository--module--content">
			{/*}
			<div><b>Updated:</b> {props.module.updatedAt.toString()}</div>
			<div><b>Created:</b> {props.module.createdAt.toString()}</div>
			*/}

			<h2>Use this Module in your Canvas Course</h2>
			<p>This module can be used inside your course as an <b>assignment</b> or <b>module</b>.</p>

			<figure>
				<img src="/images/obojobo-assignment.gif" alt="Animated gif showing how to create an Obojobo Assignment in canvas"/>
				<figcaption>Creating an Assignment in Canvas</figcaption>
			</figure>


			<h3>Create an Assignment in Canvas</h3>
			<ol>
				<li>Click Assignments in your course's menu.</li>
				<li>Create a new Assignment</li>
				<li>Set the:
					<ul>
						<li>Assignment Name</li>
						<li>Points (do not use 0)</li>
						<li>any other relevant settings</li>
					</ul>
				</li>
				<li>Set Submission Type to "External Tool"</li>
				<li>Follow the <a href="#selecting-this-module">Choosing a Obojobo Module</a> instructions below</li>
				<li>Click Select</li>
				<li>Save & Publish</li>
			</ol>

			<h3>Create an Ungraded Module in Canvas</h3>
			<ol>
				<li>Click Modules in your course's menu.</li>
				<li>Click the "+" in a module</li>
				<li>Set the:
					<ul>
						<li>Assignment Name</li>
						<li>Points (do not use 0)</li>
						<li>any other relevant settings</li>
					</ul>
				</li>
				<li>Change the top drop down from "Assignment" to "External Tool".</li>
				<li>Follow the <a href="#selecting-this-module">Choosing a Obojobo Module</a> instructions below</li>
				<li>Click Add Item</li>
				<li>You new module will be named "{props.module.title} (doesn't send scores to grade book)"</li>
				<li>Be sure to <b>Publish</b> within Canvas when ready</li>
			</ol>

			<h3 id="selecting-this-module">Choosing a Obojobo Module</h3>
			<ol>
				<li>Follow one of the sets of instructions above.</li>
				<li>Click "FIND" next to the input labeled "Enter or find an External Tool URL"</li>
				<li>In the popup that appears, scroll down and select "ObojoboNext Module (gradebook synced)"</li>
				<li>Choose Community Collection</li>
				<li>Search for <code>{props.module.title}</code> or use this module's id: <code>{props.module.draftId}</code></li>
				<li>Click Embed next to your chosen module</li>
			</ol>

		</section>
	</DefaultLayout>

module.exports = ModulePage;
