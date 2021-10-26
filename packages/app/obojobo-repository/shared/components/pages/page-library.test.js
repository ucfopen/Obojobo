import React from 'react'
import PageLibrary from './page-library'
import { shallow } from 'enzyme'

const Module = require('../module')

describe('PageLibrary', () => {
	const mockCurrentUser = {
		id: 99,
		avatarUrl: '/path/to/avatar/img',
		firstName: 'firstName',
		lastName: 'lastName'
	}

	test('renders correctly when props does not contain collections', () => {
		const component = shallow(<PageLibrary currentUser={mockCurrentUser} />)

		const mainContentChild = component.find('.repository--main-content')
		expect(mainContentChild.find('span').length).toBe(0)
	})

	test('renders collections correctly based on props', () => {
		const mockCollections = [
			{
				id: 'mockCollectionId',
				title: 'mockCollectionTitle',
				drafts: []
			},
			{
				id: 'mockCollectionId2',
				title: 'mockCollectionTitle2',
				drafts: []
			}
		]

		const component = shallow(
			<PageLibrary currentUser={mockCurrentUser} collections={mockCollections} />
		)

		const mainContentSpans = component.find('.repository--main-content > span')
		expect(mainContentSpans.length).toBe(2)
		expect(mainContentSpans.at(0).key()).toBe('mockCollectionId')
		expect(mainContentSpans.at(1).key()).toBe('mockCollectionId2')
	})

	test('renders collection drafts correctly based on props', () => {
		const mockCollections = [
			{
				id: 'mockCollectionId',
				title: 'mockCollectionTitle',
				drafts: [
					{ draftId: 'mockDraftId' },
					{ draftId: 'mockDraftId2' },
					{ draftId: 'mockDraftId3' }
				]
			}
		]

		const component = shallow(
			<PageLibrary currentUser={mockCurrentUser} collections={mockCollections} />
		)

		const mainContentSpans = component.find('.repository--main-content > span')
		expect(mainContentSpans.length).toBe(1)
		expect(mainContentSpans.at(0).key()).toBe('mockCollectionId')

		const moduleComponents = component.find(Module)
		expect(moduleComponents.length).toBe(3)
		expect(moduleComponents.at(0).key()).toBe('mockDraftId')
		expect(moduleComponents.at(1).key()).toBe('mockDraftId2')
		expect(moduleComponents.at(2).key()).toBe('mockDraftId3')
	})
})
