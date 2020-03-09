import '../../viewer-component.scss'

import React, { memo } from 'react'

const Caption = props => <caption>{props.children}</caption>

export default memo(Caption)
