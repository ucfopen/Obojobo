import React from 'react'
import renderer from 'react-test-renderer'

import ModalContainer from '../../../src/scripts/common/components/modal-container'

test('ModalContainer', () => {
	const component = renderer.create(<ModalContainer />)
	let tree = component.toJSON()

	expect(tree).toMatchSnapshot()
})
