import '../../viewer-component.scss'

import React, { memo } from 'react'

const Row = props => <tr>{props.children}</tr>

export default memo(Row)
