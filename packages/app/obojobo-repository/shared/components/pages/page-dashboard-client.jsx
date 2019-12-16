import { hydrateEl } from '../../react-utils'
import Dashboard from '../dashboard-hoc'
import DashboardReducer from '../../reducers/dashboard-reducer'

// include LayoutDefault so client side react has a copy of it
import LayoutDefault from '../layouts/default'

hydrateEl(Dashboard, DashboardReducer, "#react-hydrate-root")

