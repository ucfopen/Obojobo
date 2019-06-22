const React = require('react');
import DefaultLayout from './layouts/default'
import RepositoryNav from './components/repository-nav'
import RepositoryFactBanner from './components/repository-fact-banner'
import Module from './components/module'
import { format } from 'timeago.js'
// import RepositoryListItemFeedback from './components/repository-list-item-feedback'
// import RepositoryListItemScores from './components/repository-list-item-scores'
// import RepositoryListItemEdited from './components/repository-list-item-edited'
import Button from './components/button'

const ModulePage = (props) =>
	<DefaultLayout title={`${props.module.title} - an Obojobo Module by ${props.user.name}`} className="repository--module">
		<RepositoryNav/>
		<RepositoryFactBanner title={props.module.title} facts={props.facts}  />

		<div><b>Updated:</b> {format(props.module.updatedAt)}</div>
		<div><b>Created:</b> {format(props.module.createdAt)}</div>

		<div>
			<h2>Guests:</h2>
			<Button>Preview</Button>
			<Button>Use in a Course</Button>
			<Button>Create a Derivitave</Button>
			<Button>Request Access</Button>
		</div>

		<div>
			<h2>Authors:</h2>
			<Button>Preview</Button>
			<Button>Edit</Button>
			<Button>Use in a Course</Button>
			<Button>Create a Derivitave</Button>
			<Button>Manage Collaborators</Button>
			<Button>Delete</Button>
		</div>
	</DefaultLayout>

module.exports = ModulePage;
