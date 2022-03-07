import { hydrateEl } from '../../react-utils'
import PageModule from './page-module-hoc'
import AboutModuleReducer from '../../reducers/about-module-reducer'

hydrateEl(PageModule, AboutModuleReducer, '#react-hydrate-root')
