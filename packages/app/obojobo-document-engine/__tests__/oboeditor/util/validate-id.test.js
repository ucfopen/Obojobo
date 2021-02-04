import validateId from 'src/scripts/oboeditor/util/validate-id'

describe('Validate ID', () => {
	test.each`
		input          | output
		${'mock-id'}   | ${false}
		${'mock_id'}   | ${false}
		${'mock:id'}   | ${false}
		${'mock.id'}   | ${false}
		${'mock+id'}   | ${true}
		${'mock=id'}   | ${true}
		${'abc123'}    | ${false}
		${'ABC123'}    | ${false}
		${'"mock-id"'} | ${true}
		${'/mock-id/'} | ${true}
		${'[mock-id]'} | ${true}
	`('validateId("$input") = "$output"', ({ input, output }) => {
		expect(validateId(input)).toBe(output)
	})
})
