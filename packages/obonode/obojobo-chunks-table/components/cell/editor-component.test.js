import React from 'react'
import renderer from 'react-test-renderer'
import { mount } from 'enzyme'

import Cell from './editor-component'

describe('Cell Editor Node', () => {
	test('Cell component', () => {
		const component = renderer.create(
			<Cell
				node={{
					data: {
						get: () => {
							return { header: false }
						}
					}
				}}
			/>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Cell component as header', () => {
		const component = renderer.create(
			<Cell
				node={{
					data: {
						get: () => {
							return { header: true }
						}
					}
				}}
			/>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Cell component selected', () => {
		const component = renderer.create(
			<Cell
				node={{
					data: {
						get: () => {
							return { header: false }
						}
					}
				}}
				isSelected={true}
			/>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Cell component as selected header', () => {
		const component = renderer.create(
			<Cell
				node={{
					data: {
						get: () => {
							return { header: true }
						}
					}
				}}
				isSelected={true}
			/>
		)
		const tree = component.toJSON()

		expect(tree).toMatchSnapshot()
	})

	test('Cell component opens drop down', () => {
		const component = mount(
			<table>
				<thead>
					<tr>
						<Cell
							node={{
								data: {
									get: () => {
										return { header: true }
									}
								}
							}}
							isSelected={true}
						/>
					</tr>
				</thead>
			</table>
		)

		component
			.find('button')
			.at(0)
			.simulate('click')

		const tree = component.html()
		expect(tree).toMatchSnapshot()
	})

	test('Cell component adds row above', () => {
		const editor = {
			insertNodeByKey: jest.fn(),
			value: {
				document: {
					getClosest: (key, fn) => {
						fn({ type: 'mock-node' })
						return {
							getPath: () => ({ get: () => 1 }),
							data: { get: () => ({ numCols: 1 }) }
						}
					}
				}
			}
		}
		const component = mount(
			<table>
				<tbody>
					<tr>
						<Cell
							node={{
								data: {
									get: () => {
										return { header: false }
									}
								}
							}}
							editor={editor}
							parent={{
								data: { get: () => ({ header: false }) }
							}}
							isSelected={true}
						/>
					</tr>
				</tbody>
			</table>
		)

		component
			.find('button')
			.at(1)
			.simulate('click')

		expect(editor.insertNodeByKey).toHaveBeenCalled()
	})

	test('Cell component adds header row above', () => {
		const editor = {
			insertNodeByKey: jest.fn(),
			setNodeByKey: jest.fn(),
			value: {
				document: {
					getClosest: (key, fn) => {
						fn({ type: 'mock-node' })
						return {
							getPath: () => ({ get: () => 0 }),
							data: { get: () => ({ numCols: 1 }) }
						}
					}
				}
			}
		}
		const component = mount(
			<table>
				<thead>
					<tr>
						<Cell
							node={{
								data: {
									get: () => {
										return { header: true }
									}
								}
							}}
							editor={editor}
							parent={{
								data: { get: () => ({ header: true }) },
								nodes: [
									{
										key: 'mock-key',
										type: 'ObojoboDraft.Chunks.Table.Caption',
										data: { get: () => ({}) }
									},
									{
										key: 'mock-key',
										data: { get: () => ({}) }
									}
								]
							}}
							isSelected={true}
						/>
					</tr>
				</thead>
			</table>
		)

		component
			.find('button')
			.at(1)
			.simulate('click')

		expect(editor.insertNodeByKey).toHaveBeenCalled()
		expect(editor.setNodeByKey).toHaveBeenCalled()
	})

	test('Cell component adds row below', () => {
		const editor = {
			insertNodeByKey: jest.fn(),
			value: {
				document: {
					getClosest: (key, fn) => {
						fn({ type: 'mock-node' })
						return {
							getPath: () => ({ get: () => 0 }),
							data: { get: () => ({ numCols: 1 }) }
						}
					}
				}
			}
		}
		const component = mount(
			<table>
				<tbody>
					<tr>
						<Cell
							node={{
								data: {
									get: () => {
										return { header: false }
									}
								}
							}}
							editor={editor}
							parent={{
								data: { get: () => ({ header: false }) }
							}}
							isSelected={true}
						/>
					</tr>
				</tbody>
			</table>
		)

		component
			.find('button')
			.at(2)
			.simulate('click')

		expect(editor.insertNodeByKey).toHaveBeenCalled()
	})

	test('Cell component adds col left', () => {
		const editor = {
			insertNodeByKey: jest.fn(),
			setNodeByKey: jest.fn(),
			value: {
				document: {
					getClosest: (key, fn) => {
						fn({ type: 'mock-node' })
						return {
							getPath: () => ({ get: () => 0 }),
							data: { get: () => ({ numCols: 1 }) },
							nodes: [
								{
									type: 'ObojoboDraft.Chunks.Table.Caption',
									data: { get: () => ({}) }
								},
								{
									data: { get: () => ({}) }
								}
							]
						}
					}
				}
			}
		}
		editor.withoutNormalizing = fn => fn(editor)
		const component = mount(
			<table>
				<tbody>
					<tr>
						<Cell
							node={{
								data: {
									get: () => {
										return { header: false }
									}
								}
							}}
							editor={editor}
							parent={{
								data: { get: () => ({ header: false }) },
								getPath: () => ({ get: () => 0 })
							}}
							isSelected={true}
						/>
					</tr>
				</tbody>
			</table>
		)

		component
			.find('button')
			.at(3)
			.simulate('click')

		expect(editor.insertNodeByKey).toHaveBeenCalled()
	})

	test('Cell component adds col right', () => {
		const editor = {
			insertNodeByKey: jest.fn(),
			setNodeByKey: jest.fn(),
			value: {
				document: {
					getClosest: (key, fn) => {
						fn({ type: 'mock-node' })
						return {
							getPath: () => ({ get: () => 0 }),
							data: { get: () => ({ numCols: 1 }) },
							nodes: [
								{
									type: 'ObojoboDraft.Chunks.Table.Caption',
									data: { get: () => ({}) }
								},
								{
									data: { get: () => ({}) }
								}
							]
						}
					}
				}
			}
		}
		editor.withoutNormalizing = fn => fn(editor)
		const component = mount(
			<table>
				<tbody>
					<tr>
						<Cell
							node={{
								data: {
									get: () => {
										return { header: false }
									}
								}
							}}
							editor={editor}
							parent={{
								data: { get: () => ({ header: false }) },
								getPath: () => ({ get: () => 0 })
							}}
							isSelected={true}
						/>
					</tr>
				</tbody>
			</table>
		)

		component
			.find('button')
			.at(4)
			.simulate('click')

		expect(editor.insertNodeByKey).toHaveBeenCalled()
	})

	test('Cell component deletes only row', () => {
		const editor = {
			removeNodeByKey: jest.fn(),
			setNodeByKey: jest.fn(),
			value: {
				document: {
					getClosest: (key, fn) => {
						fn({ type: 'mock-node' })
						return {
							getPath: () => ({ get: () => 0 }),
							data: { get: () => ({ numCols: 1 }) },
							nodes: {
								get: () => false
							}
						}
					}
				}
			}
		}
		const component = mount(
			<table>
				<tbody>
					<tr>
						<Cell
							node={{
								data: {
									get: () => {
										return { header: false }
									}
								}
							}}
							editor={editor}
							parent={{
								data: { get: () => ({ header: false }) },
								getPath: () => ({ get: () => 0 })
							}}
							isSelected={true}
						/>
					</tr>
				</tbody>
			</table>
		)

		component
			.find('button')
			.at(5)
			.simulate('click')

		expect(editor.removeNodeByKey).toHaveBeenCalled()
	})

	test('Cell component deletes first row', () => {
		const editor = {
			removeNodeByKey: jest.fn(),
			setNodeByKey: jest.fn(),
			value: {
				document: {
					getClosest: (key, fn) => {
						fn({ type: 'mock-node' })
						return {
							getPath: () => ({ get: () => 1 }),
							data: { get: () => ({ numCols: 1 }) },
							nodes: {
								get: () => ({
									data: { get: () => ({}) },
									nodes: [
										{
											data: { get: () => ({}) }
										}
									]
								})
							}
						}
					}
				}
			}
		}
		const component = mount(
			<table>
				<tbody>
					<tr>
						<Cell
							node={{
								data: {
									get: () => {
										return { header: false }
									}
								}
							}}
							editor={editor}
							parent={{
								data: { get: () => ({ header: false }) },
								getPath: () => ({ get: () => 0 })
							}}
							isSelected={true}
						/>
					</tr>
				</tbody>
			</table>
		)

		component
			.find('button')
			.at(5)
			.simulate('click')

		expect(editor.removeNodeByKey).toHaveBeenCalled()
		expect(editor.setNodeByKey).toHaveBeenCalled()
	})

	test('Cell component deletes last row', () => {
		const editor = {
			removeNodeByKey: jest.fn(),
			setNodeByKey: jest.fn(),
			value: {
				document: {
					getClosest: (key, fn) => {
						fn({ type: 'mock-node' })
						return {
							getPath: () => ({ get: () => 1 }),
							data: { get: () => ({ numCols: 1 }) },
							nodes: {
								get: () => null
							}
						}
					}
				}
			}
		}
		const component = mount(
			<table>
				<tbody>
					<tr>
						<Cell
							node={{
								data: {
									get: () => {
										return { header: false }
									}
								}
							}}
							editor={editor}
							parent={{
								data: { get: () => ({ header: false }) },
								getPath: () => ({ get: () => 0 })
							}}
							isSelected={true}
						/>
					</tr>
				</tbody>
			</table>
		)

		component
			.find('button')
			.at(5)
			.simulate('click')

		expect(editor.removeNodeByKey).not.toHaveBeenCalled()
		expect(editor.setNodeByKey).not.toHaveBeenCalled()
	})

	test('Cell component deletes non-first row', () => {
		const editor = {
			removeNodeByKey: jest.fn(),
			setNodeByKey: jest.fn(),
			value: {
				document: {
					getClosest: (key, fn) => {
						fn({ type: 'mock-node' })
						return {
							getPath: () => ({ get: () => 2 }),
							data: { get: () => ({ numCols: 1 }) }
						}
					}
				}
			}
		}
		const component = mount(
			<table>
				<tbody>
					<tr>
						<Cell
							node={{
								data: {
									get: () => {
										return { header: false }
									}
								}
							}}
							editor={editor}
							parent={{
								data: { get: () => ({ header: false }) },
								getPath: () => ({ get: () => 0 })
							}}
							isSelected={true}
						/>
					</tr>
				</tbody>
			</table>
		)

		component
			.find('button')
			.at(5)
			.simulate('click')

		expect(editor.removeNodeByKey).toHaveBeenCalled()
	})

	test('Cell component cannot delete the last col', () => {
		const editor = {
			removeNodeByKey: jest.fn(),
			setNodeByKey: jest.fn(),
			value: {
				document: {
					getClosest: (key, fn) => {
						fn({ type: 'mock-node' })
						return {
							getPath: () => ({ get: () => 1 }),
							data: { get: () => ({ numCols: 1 }) }
						}
					}
				}
			}
		}
		const component = mount(
			<table>
				<tbody>
					<tr>
						<Cell
							node={{
								data: {
									get: () => {
										return { header: false }
									}
								}
							}}
							editor={editor}
							parent={{
								data: { get: () => ({ header: false }) },
								getPath: () => ({ get: () => 0 }),
								nodes: { size: 1 }
							}}
							isSelected={true}
						/>
					</tr>
				</tbody>
			</table>
		)

		component
			.find('button')
			.at(6)
			.simulate('click')

		expect(editor.removeNodeByKey).not.toHaveBeenCalled()
	})

	test('Cell component deletes col', () => {
		const editor = {
			removeNodeByKey: jest.fn(),
			setNodeByKey: jest.fn(),
			value: {
				document: {
					getClosest: (key, fn) => {
						fn({ type: 'mock-node' })
						return {
							getPath: () => ({ get: () => 1 }),
							data: { get: () => ({ numCols: 1 }) },
							nodes: [
								{
									type: 'ObojoboDraft.Chunks.Table.Caption'
								},
								{
									nodes: { get: () => ({}) },
									data: { get: () => ({}) }
								}
							]
						}
					}
				}
			}
		}
		editor.withoutNormalizing = fn => fn(editor)
		const component = mount(
			<table>
				<tbody>
					<tr>
						<Cell
							node={{
								data: {
									get: () => {
										return { header: false }
									}
								}
							}}
							editor={editor}
							parent={{
								data: { get: () => ({ header: false }) },
								getPath: () => ({ get: () => 0 }),
								nodes: { size: 2 }
							}}
							isSelected={true}
						/>
					</tr>
				</tbody>
			</table>
		)

		component
			.find('button')
			.at(6)
			.simulate('click')

		expect(editor.removeNodeByKey).toHaveBeenCalled()
		expect(editor.setNodeByKey).toHaveBeenCalled()
	})
})
