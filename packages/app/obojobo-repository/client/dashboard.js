import './css/main.scss'

// import 'whatwg-fetch'
import { hydrateEl } from '../shared/react-utils'
import Dashboard from '../shared/components/dashboard-hoc'
import DashboardReducer from '../shared/reducers/dashboard-reducer'

hydrateEl(Dashboard, DashboardReducer, "#react-hydrate-root")
