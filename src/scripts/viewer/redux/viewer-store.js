import { createStore, combineReducers} from 'redux'

import navReducer from './nav-reducer'

const reducer = combineReducers({
  nav: navReducer
})

const ViewerStore = createStore(reducer)
export default ViewerStore
