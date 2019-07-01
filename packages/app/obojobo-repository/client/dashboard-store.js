import { createStore } from 'redux'
// ===== STORE ======
// Create a Redux store holding the state of your app.
// Its API is { subscribe, dispatch, getState }.
const store = createStore(counter)

module.exports = store
