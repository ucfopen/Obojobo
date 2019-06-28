import './css/dashboard.scss'
import 'whatwg-fetch'
import DashboardClient from '../server/views/dashboard-client'

const hydrateDomEl = document.querySelector("#react-hydrate-root")
const props = JSON.parse(hydrateDomEl.dataset.reactProps)
ReactDOM.hydrate(<DashboardClient {...props} />, hydrateDomEl)
