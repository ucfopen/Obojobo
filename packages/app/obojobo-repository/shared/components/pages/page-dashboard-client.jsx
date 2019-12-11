import { hydrateEl } from '../../react-utils'
import Dashboard from '../dashboard-hoc'
import DashboardReducer from '../../reducers/dashboard-reducer'
const LayoutDefault = require('../layouts/default')
hydrateEl(Dashboard, DashboardReducer, "#react-hydrate-root")

