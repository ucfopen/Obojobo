import React from 'react'
import RevealableContainer from '../../../src/scripts/common/components/revealable-container'
import TestRenderer from 'react-test-renderer'

describe('RevealableContainer', () => {
	test('RevealableContainer renders correctly', () => {
		const testRenderer = TestRenderer.create(
			<RevealableContainer
				className="class-name"
				onClick={jest.fn()}
				onDeleteButtonClick={jest.fn()}
				onDeleteButtonKeyDown={jest.fn()}
				maxWidth={100}
				isSelected={true}
			/>
		)
		const tree = testRenderer.toJSON()
		expect(tree).toMatchSnapshot()
	})

	test('RevealableContainer renders correctly without className', () => {
		const testRenderer = TestRenderer.create(
			<RevealableContainer
				onClick={jest.fn()}
				onDeleteButtonClick={jest.fn()}
				onDeleteButtonKeyDown={jest.fn()}
				maxWidth={100}
				isSelected={false}
			/>
		)
		const tree = testRenderer.toJSON()
		expect(tree).toMatchSnapshot()
	})

	test('All methods are called as expected', () => {
		const onDeleteButtonClick = jest.fn()
		const onDeleteButtonKeyDown = jest.fn()
		const onClick = jest.fn()

		const testRenderer = TestRenderer.create(
			<RevealableContainer
				className="class-name"
				onClick={onClick}
				onDeleteButtonClick={onDeleteButtonClick}
				onDeleteButtonKeyDown={onDeleteButtonKeyDown}
				maxWidth={100}
				isSelected={true}
			/>
		)

		expect(onDeleteButtonClick).not.toBeCalled()
		expect(onDeleteButtonKeyDown).not.toBeCalled()
		expect(onClick).not.toBeCalled()

		testRenderer.root
			.findByProps({ className: 'obojobo-draft--components--revealable-container class-name' })
			.props.onClick()

		expect(onDeleteButtonClick).not.toBeCalled()
		expect(onDeleteButtonKeyDown).not.toBeCalled()
		expect(onClick).toBeCalledTimes(1)

		testRenderer.root.findByType('button').props.onClick()

		expect(onDeleteButtonClick).toBeCalledTimes(1)
		expect(onDeleteButtonKeyDown).not.toBeCalled()
		expect(onClick).toBeCalledTimes(1)

		testRenderer.root.findByType('button').props.onKeyDown()

		expect(onDeleteButtonClick).toBeCalledTimes(1)
		expect(onDeleteButtonKeyDown).toBeCalledTimes(1)
		expect(onClick).toBeCalledTimes(1)
	})
})
