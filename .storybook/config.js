import { configure } from '@storybook/react'

import viewerComponentStories from '../src/scripts/viewer/components/stories'

function loadStories() {
	viewerComponentStories()
}

configure(loadStories, module)
