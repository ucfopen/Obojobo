import React from 'react'
import PageLibrary from './page-library'
import { shallow } from 'enzyme'

const Module = require('../module')
const Search = require('../search')

describe('PageLibrary', () => {
	const mockCurrentUser = {
		id: 99,
		avatarUrl: '/path/to/avatar/img',
		firstName: 'firstName',
		lastName: 'lastName',
		perms: []
	}

	test('renders correctly when props does not contain collections', () => {
		const component = shallow(<PageLibrary currentUser={mockCurrentUser} />)

		const mainContentChild = component.find('.repository--main-content')
		expect(
			mainContentChild.find('.repository--main-content--item-list--collection-wrapper').length
		).toBe(0)
		expect(mainContentChild.find('.repository--main-content--no-filter-results-text').length).toBe(
			1
		)
	})

	test('renders correctly when collections are provided but contain no drafts', () => {
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

		const mainContentChild = component.find('.repository--main-content')
		const mainContentSpans = component.find('.repository--main-content > span')
		expect(mainContentSpans.length).toBe(1)
		expect(
			mainContentChild.find('.repository--main-content--item-list--collection-wrapper').length
		).toBe(0)
		expect(mainContentChild.find('.repository--main-content--no-filter-results-text').length).toBe(
			1
		)
	})

	test('renders correctly when collections are provided and contain drafts', () => {
		const mockCollections = [
			{
				id: 'mockCollectionId',
				title: 'mockCollectionTitle',
				drafts: [{ draftId: 'mockDraftId', title: 'mockDraft' }]
			},
			{
				id: 'mockCollectionId2',
				title: 'mockCollectionTitle2',
				drafts: [{ draftId: 'mockDraftId2', title: 'mockDraft2' }]
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
					{ draftId: 'mockDraftId', title: 'mockDraft' },
					{ draftId: 'mockDraftId2', title: 'mockDraft2' },
					{ draftId: 'mockDraftId3', title: 'mockDraft3' }
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

	test('renders collections and drafts correctly based on applied filters', () => {
		const mockCollections = [
			{
				id: 'mockCollectionId',
				title: 'mockCollectionTitle',
				drafts: [{ draftId: 'mockDraftId', title: 'mockDraft1' }]
			},
			{
				id: 'mockCollectionId2',
				title: 'mockCollectionTitle2',
				drafts: [{ draftId: 'mockDraftId2', title: 'mockDraft2' }]
			}
		]

		const component = shallow(
			<PageLibrary currentUser={mockCurrentUser} collections={mockCollections} />
		)

		// everything should be visible by default
		let mainContentSpans = component.find('.repository--main-content > span')
		expect(mainContentSpans.length).toBe(2)
		expect(mainContentSpans.at(0).key()).toBe('mockCollectionId')
		expect(mainContentSpans.at(1).key()).toBe('mockCollectionId2')

		let firstCollectionModules = mainContentSpans.at(0).find(Module)
		expect(firstCollectionModules.at(0).key()).toBe('mockDraftId')

		const secondCollectionModules = mainContentSpans.at(1).find(Module)
		expect(secondCollectionModules.at(0).key()).toBe('mockDraftId2')

		// change the filter string to '2'
		const searchComponent = component.find(Search)
		searchComponent.props().onChange('2')
		// since none of the modules in the first collection have '2' in the title, it should not render
		mainContentSpans = component.find('.repository--main-content > span')
		expect(mainContentSpans.length).toBe(1)
		expect(mainContentSpans.at(0).key()).toBe('mockCollectionId2')

		firstCollectionModules = mainContentSpans.at(0).find(Module)
		expect(firstCollectionModules.at(0).key()).toBe('mockDraftId2')
	})
})
