jest.mock('../module-image', () => props => {
	return <mock-MultiButton>{props.children}</mock-MultiButton>
})

import React from 'react'
import renderer from 'react-test-renderer'
import ModuleImage from '../module-image'

// require used to make sure it's loaded after mock date
const PageSplitRunPreview = require('./page-split-run-preview')

describe('PageSplitRunPreview', () => {
	test('renders when given props', () => {
		expect.hasAssertions()

		const mockCurrentUser = {
			id: 99,
			avatarUrl: '/path/to/avatar/img',
			firstName: 'firstName',
			lastName: 'lastName',
			perms: []
		}

		const mockModuleOptions = [
			{
				draftId: 'mockDraftId1',
				title: 'Mock Module 1'
			},
			{
				draftId: 'mockDraftId2',
				title: 'Mock Module 2'
			}
		]

		const component = renderer.create(
			<PageSplitRunPreview currentUser={mockCurrentUser} moduleOptions={mockModuleOptions} />
		)

		// Make sure the module options are rendered correctly
		const moduleOptionElements = component.root.findAllByProps({ className: 'module-option' })
		expect(moduleOptionElements.length).toBe(mockModuleOptions.length)

		mockModuleOptions.forEach((option, index) => {
			const targetEl = moduleOptionElements[index]
			// Seems like we should be able to get this more conveniently, but this'll do
			expect(targetEl._fiber.key).toBe(option.draftId)
			const imageComponent = targetEl.findByType(ModuleImage)
			expect(imageComponent.props.id).toBe(option.draftId)

			expect(targetEl.children.length).toBe(1)
			const anchorTag = targetEl.findByType('a')
			expect(targetEl.children[0]).toBe(anchorTag)
			expect(anchorTag.children[0]).toBe(imageComponent)
			expect(anchorTag.children[1]).toBe(option.title)
			expect(anchorTag.props.href).toBe(`/preview/${option.draftId}`)
		})
	})
})
