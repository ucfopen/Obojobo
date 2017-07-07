import { shallow } from 'enzyme'
import React from 'react'
import Question from '../../../../src/scripts/common/components/modal/question'
import renderer from 'react-test-renderer'

test('Question', () => {
	const component = renderer.create(
		<Question
			cancel="cancel"
			reject="reject"
			confirm="confirm"
			rejectButtonLabel="Reject Label"
			confirmButtonLabel="Confirm Label"
			cancelOnReject={true}
			modal={{
				onButtonClick: jest.fn()
			}}
		>
			Content
		</Question>
	)
	let tree = component.toJSON()

	expect(tree).toMatchSnapshot()
})

test('Question confirm click', () => {
	let onClick = jest.fn()

	const component = shallow(
		<Question
			cancel="cancel"
			reject="reject"
			confirm="confirm"
			rejectButtonLabel="Reject Label"
			confirmButtonLabel="Confirm Label"
			cancelOnReject={true}
			modal={{
				onButtonClick: onClick
			}}
		>
			Content
		</Question>
	)

	let rejectButton = component.find('button').at(0)
	let confirmButton = component.find('button').at(1)

	confirmButton.simulate('click')

	expect(onClick).toHaveBeenCalledWith('confirm')
})

test('Question cancel click', () => {
	let onClick = jest.fn()

	const component = shallow(
		<Question
			cancel="cancel"
			reject="reject"
			confirm="confirm"
			rejectButtonLabel="Reject Label"
			confirmButtonLabel="Confirm Label"
			cancelOnReject={true}
			modal={{
				onButtonClick: onClick
			}}
		>
			Content
		</Question>
	)

	let rejectButton = component.find('button').at(0)
	let confirmButton = component.find('button').at(1)

	rejectButton.simulate('click')

	expect(onClick).toHaveBeenCalledWith('cancel')
})

test('Question reject click', () => {
	let onClick = jest.fn()

	const component = shallow(
		<Question
			cancel="cancel"
			reject="reject"
			confirm="confirm"
			rejectButtonLabel="Reject Label"
			confirmButtonLabel="Confirm Label"
			cancelOnReject={false}
			modal={{
				onButtonClick: onClick
			}}
		>
			Content
		</Question>
	)

	let rejectButton = component.find('button').at(0)
	let confirmButton = component.find('button').at(1)

	rejectButton.simulate('click')

	expect(onClick).toHaveBeenCalledWith('reject')
})
