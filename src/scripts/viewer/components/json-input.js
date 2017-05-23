let JSONInput = React.createClass({
	getInitialState() {
		return {
			value: this.props.value,
			open: false
		};
	},

	componentWillReceiveProps(nextProps) {
		return this.setState({
			value: nextProps.value
		});
	},

	onClick(event) {
		return this.props.onChange(this.state.value);
	},

	onChange(event) {
		return this.setState({ value:event.target.value });
	},

	onToggle(event) {
		let newVal = !this.state.open;
		return this.setState({ open:newVal });
	},
		// @props.onToggle newVal

	render() {
		if(this.state.open) {
			return <div style={{position:'fixed',right:0,top:0,bottom:0,width:'300px',background:'gray',zIndex:9999}}>
				<button style={{position:'absolute',top:'0',left:0,display:'block',width:'300px'}} onClick={this.onToggle}>Close</button>
				<textarea style={{position:'absolute',left:0,top:'20px',right:0,bottom:'40px',width:'300px', fontFamily:'monospace', fontSize:'10pt',padding:0,margin:0,boxSizing:'border-box'}} value={this.state.value} onChange={this.onChange} />
				<button style={{position:'absolute',bottom:'10px',left:0,display:'block',width:'300px'}} onClick={this.onClick}>Update</button>
			</div>;
		}

		return <div style={{position:'fixed',right:0,top:'50px',zIndex:9999}}>
			<button onClick={this.onToggle}>Open</button>
		</div>;
	}
});


export default JSONInput;