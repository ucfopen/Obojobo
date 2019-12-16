import { hydrateEl } from '../../react-utils'
import PageModule from './page-module-hoc'

const emptyReducer = state => state;
hydrateEl(PageModule, emptyReducer, "#react-hydrate-root")
