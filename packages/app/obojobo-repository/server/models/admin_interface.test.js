describe('AdminInterface Model', () => {
    jest.mock('obojobo-express/server/db')
	jest.mock('obojobo-express/server/logger')
	let db
	let logger
	let AdminInterface

    beforeEach(() => {
		jest.resetModules()
		jest.resetAllMocks()
		db = require('obojobo-express/server/db')
		logger = require('obojobo-express/server/logger')

		AdminInterface = require('./admin_interface')
	})
	afterEach(() => {})

    test('addPermission correctly fetches id and adds new permission (if any)', () => {
        db.one.mockResolvedValueOnce({
			id: 5,
			created_at: 'mocked-date',
			email: 'guest@obojobo.ucf.edu',
			first_name: 'Guest',
			last_name: 'Guest',
			roles: [],
			username: 'guest'
		})

        db.oneOrNone.mockResolvedValueOnce({})
        
        return AdminInterface.addPermission(5, 'canViewAdminPage')
        .then(ret => expect(ret).toBe(5))
    })

    test('addPermission catches error when fetching user with invalid id', () => {
        logger.logError = jest.fn()

        db.one.mockRejectedValueOnce('mock-error')

        return AdminInterface.addPermission(123456, 'canViewAdminPage')
        .then(ret => {
            console.log("ret:")
            console.log(ret)
        })
        .catch(() => {
            console.log("here")
            expect(logger.logError).toHaveBeenCalledWith('AdminInterface error finding user with id 123456')
        })
    })

    test('removePermission correctly fetches id and removes permission', () => {
        db.one.mockResolvedValueOnce({
			id: 5,
			created_at: 'mocked-date',
			email: 'guest@obojobo.ucf.edu',
			first_name: 'Guest',
			last_name: 'Guest',
			perms: ['canViewAdminPage'],
			username: 'guest'
		})

        db.oneOrNone.mockResolvedValueOnce({})
        
        return AdminInterface.removePermission(5, 'canViewAdminPage')
        .then(ret => expect(ret).toBe(5))
    })
})