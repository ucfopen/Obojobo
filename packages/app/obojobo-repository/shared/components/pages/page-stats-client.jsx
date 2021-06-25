import { hydrateEl } from '../../react-utils'
import Stats from '../stats-hoc'
import StatsReducer from '../../reducers/stats-reducer'

// include LayoutDefault so client side react has a copy of it
import LayoutDefault from '../layouts/default' //eslint-disable-line no-unused-vars

hydrateEl(Stats, StatsReducer, '#react-hydrate-root')
