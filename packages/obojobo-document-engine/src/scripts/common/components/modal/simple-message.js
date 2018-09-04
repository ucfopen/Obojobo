export default props => (
	<div>
		<p>{props.children}</p>
		<button onClick={props.modal.onButtonClick.bind(null, props.confirm)}>
			{props.buttonLabel || 'OK'}
		</button>
	</div>
)
