import React from 'react'
import { storiesOf } from '@storybook/react'

import Header from './header'
import Logo from './logo'
import InlineNavButton from './inline-nav-button'
import Nav from './nav'

const DarkBackgroundDecorator = storyFn => (
	<div>
		<div style={{ backgroundColor: 'black' }}>{storyFn()}</div>
		<div>The dark background is added in storybook to contrast the inversion</div>
	</div>
)

const stories = () => {
	storiesOf('Header')
		.add('title and location', () => (
			<Header moduleTitle={'OBOJOBO EXAMPLE DOCUMENT'} location={'Example Content Page'} />
		))
		.add('left logoPosition', () => (
			<Header
				moduleTitle={'OBOJOBO EXAMPLE DOCUMENT'}
				location={'Example Content Page'}
				logoPosition={'left'}
			/>
		))

	storiesOf('Logo')
		.add('no props', () => <Logo />)
		.addDecorator(DarkBackgroundDecorator)
		.add('inverted', () => <Logo inverted />)

	storiesOf('Inline Nav Button')
		.add('title', () => <InlineNavButton title="Title" />)
		.add('prev', () => <InlineNavButton title="Title" type="prev" />)
		.add('next', () => <InlineNavButton title="Title" type="next" />)
		.add('disabled', () => <InlineNavButton disabled title="Title" />)

	const navState = {
		items: {
			type: 'heading',
			label: 'Obojobo Example Document',
			showChildren: true,
			children: [
				{
					type: 'link',
					label: 'Example Content Page',
					flags: {}
				},
				{
					type: 'sub-link',
					label: 'Projectile motion',
					flags: {}
				},
				{
					type: 'sub-link',
					label: 'Kinematic quantities of projectile motion',
					flags: {}
				}
			]
		},
		locked: false,
		disabled: false,
		open: true
	}

	storiesOf('Nav').add('link and sub-links', () => <Nav navState={navState} />)

	storiesOf('SVG')
		.add('arrow', () => (
			<div style={{ width: '200px', height: '140px', backgroundImage: `url('./arrow.svg')` }} />
		))
		.add('hamburger', () => (
			<div style={{ width: '20px', height: '12px', backgroundImage: `url('./hamburger.svg')` }} />
		))
		.add('lock-icon', () => (
			<div style={{ width: '8px', height: '12px', backgroundImage: `url('./lock-icon.svg')` }} />
		))
		.add('obojobo-logo', () => (
			<div
				style={{ width: '253px', height: '65px', backgroundImage: `url('./obojobo-logo.svg')` }}
			/>
		))
}

export default stories
