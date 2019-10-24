import React from 'react'
import { mount } from 'enzyme'
import renderer from 'react-test-renderer'
import Mod from './mod'

describe('Mod', () => {
	test('Mod component', () => {
		const component = renderer.create(<Mod />)
		const tree = component.toJSON()

		expect(tree).toMatchInlineSnapshot(`
						<div
						  className="mod pad"
						>
						  <div
						    className="obojobo-draft--components--button is-not-dangerous align-center delete-button"
						  >
						    <button
						      className="button"
						      onClick={[Function]}
						    >
						      ×
						    </button>
						  </div>
						</div>
			`)
	})

	test('Mod component deletes self', () => {
		const editor = {
			removeNodeByKey: jest.fn(),
			value: {
				document: {
					getDescendant: jest.fn().mockReturnValueOnce({
						nodes: {
							get: jest.fn().mockReturnValueOnce(true)
						}
					})
				}
			}
		}

		const component = mount(
			<Mod
				node={{
					data: {
						get: () => {
							return {}
						}
					}
				}}
				editor={editor}
				parent={{ key: 'mockParent' }}
			/>
		)
		const tree = component.html()

		component.find('button').simulate('click')

		expect(editor.removeNodeByKey).toHaveBeenCalled()

		expect(tree).toMatchInlineSnapshot(
			`"<div class=\\"mod pad\\"><div class=\\"obojobo-draft--components--button is-not-dangerous align-center delete-button\\"><button class=\\"button\\">×</button></div></div>"`
		)
	})

	test('Mod component deletes self and parent', () => {
		const editor = {
			removeNodeByKey: jest.fn(),
			value: {
				document: {
					getDescendant: jest.fn().mockReturnValueOnce({
						nodes: {
							get: jest.fn() // No sibling
						}
					})
				}
			}
		}

		const component = mount(
			<Mod
				node={{
					data: {
						get: () => {
							return {}
						}
					}
				}}
				editor={editor}
				parent={{ key: 'mockParent' }}
			/>
		)
		const tree = component.html()

		component.find('button').simulate('click')

		expect(editor.removeNodeByKey).toHaveBeenCalled()

		expect(tree).toMatchInlineSnapshot(
			`"<div class=\\"mod pad\\"><div class=\\"obojobo-draft--components--button is-not-dangerous align-center delete-button\\"><button class=\\"button\\">×</button></div></div>"`
		)
	})
})
