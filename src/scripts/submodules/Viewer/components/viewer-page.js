import './viewer-page.scss';

let ViewerPage = React.createClass({

	render() {
		let { props } = this;

		let chunks = props.page.chunks.models.map(function(chunk, index) {
			let Component = chunk.getComponent();

			return (<div
				className='component'
				data-component-type={chunk.get('type')}
				data-component-index={index}
				data-oboid={chunk.cid}
				data-id={chunk.get('id')}
				data-server-index={chunk.get('index')}
				data-server-id={chunk.get('id')}
				data-server-derived-from={chunk.get('derivedFrom')}
				data-changed={chunk.dirty}
				data-todo={chunk.get('index') + ':' + chunk.get('id')}
				key={index}
			>
				<Component
					chunk={chunk}
					page={props.page}
					module={props.module}
				/>
			</div>);
		});

		return <div
			className={'viewer--components--viewer-page'}
			ref="viewer"
		>
			{chunks}
		</div>;
	}
});



export default ViewerPage;