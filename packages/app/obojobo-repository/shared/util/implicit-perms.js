// translate all possible perm options from a list and collate them per role
const defaultPermissions = require('obojobo-express/server/config/permission_groups.json').default

const POSSIBLE_PERMS = Object.keys(defaultPermissions)
const PERMS_PER_ROLE = {}
POSSIBLE_PERMS.forEach(p => {
	const roles = defaultPermissions[p]
	roles.forEach(r => {
		if (!PERMS_PER_ROLE[r]) PERMS_PER_ROLE[r] = []
		PERMS_PER_ROLE[r].push(p)
	})
})

module.exports = {
	POSSIBLE_PERMS,
	PERMS_PER_ROLE
}
