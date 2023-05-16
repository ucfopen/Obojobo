import { hydrateEl, hydrateElWithoutStore } from '../../react-utils'
import Dashboard from '../dashboard-hoc'
import DashboardReducer from '../../reducers/dashboard-reducer'
import Notification from '../notification.jsx'

// include LayoutDefault so client side react has a copy of it
import LayoutDefault from '../layouts/default' //eslint-disable-line no-unused-vars

hydrateEl(Dashboard, DashboardReducer, '#react-hydrate-root')
hydrateElWithoutStore(Notification, '#repository-notifications')
