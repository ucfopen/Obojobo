const adminReducer = require('./admin-reducer')

describe('Admin Reducer', () => {
    test('Admin actions in reducer return the original state', () => {
        const initialState = {}
    
        const action = {
            type: 'test-admin-action'
        }
    
        expect(adminReducer(initialState, action)).toBe(initialState)
    })
})