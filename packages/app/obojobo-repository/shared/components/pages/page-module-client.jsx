import { hydrateEl } from '../../react-utils'
import PageModule from '../module-hoc'
import DashboardReducer from '../../reducers/dashboard-reducer'
hydrateEl(PageModule, DashboardReducer, "#react-hydrate-root")
