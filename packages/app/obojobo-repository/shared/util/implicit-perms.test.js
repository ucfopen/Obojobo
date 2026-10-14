const mockStructureAsObject = {
	mockPerm1: [
		'Role1',
		'Role2',
		'urn:lti:role:standard/lis/Role1',
		'urn:lti:role:standard/lis/Role2'
	],
	mockPerm2: ['Role1', 'Role2', 'urn:lti:role:standard/lis/Role1'],
	mockPerm3: ['Role1', 'urn:lti:role:standard/lis/Role1'],
	mockPerm4: ['Role1']
}

const { POSSIBLE_PERMS, PERMS_PER_ROLE } = require('./implicit-perms')

jest.mock('obojobo-express/server/config/permission_groups.json', () => ({
	default: mockStructureAsObject
}))

describe('implicit permission collation shortcut', () => {
	test('POSSIBLE_PERMS and PERMS_PER_ROLE are generated correctly based on default role/perm associations', () => {
		const expectedPossiblePerms = ['mockPerm1', 'mockPerm2', 'mockPerm3', 'mockPerm4']
		const expectedPermsPerRole = {
			Role1: ['mockPerm1', 'mockPerm2', 'mockPerm3', 'mockPerm4'],
			Role2: ['mockPerm1', 'mockPerm2'],
			'urn:lti:role:standard/lis/Role1': ['mockPerm1', 'mockPerm2', 'mockPerm3'],
			'urn:lti:role:standard/lis/Role2': ['mockPerm1']
		}
		expect(POSSIBLE_PERMS).toEqual(expectedPossiblePerms)
		expect(PERMS_PER_ROLE).toEqual(expectedPermsPerRole)
	})
})
