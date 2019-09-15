import focus from '../page/focus'
import React from 'react'

function withPageFocus(BaseComponent){

	return class extends React.Component{
		render(){
			return <BaseComponent {...this.props} focus={focus} withPageFocus={true} />
		}
	}
}

export default withPageFocus
