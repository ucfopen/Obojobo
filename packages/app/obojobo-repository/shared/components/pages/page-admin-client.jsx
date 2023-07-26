import { hydrateEl } from '../../react-utils'
import Admin from '../admin-hoc'
import AdminReducer from '../../reducers/admin-reducer'

// include LayoutDefault so client side react has a copy of it
import LayoutDefault from '../layouts/default' //eslint-disable-line no-unused-vars

hydrateEl(Admin, AdminReducer, '#react-hydrate-root')
