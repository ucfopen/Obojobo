let createTextGroup = (els) => {
	return (
		[{
			type: "element",
			name: "textGroup",
			elements: [
				{
					type: "element",
					name: "t",
					elements: els
				}
			]
		}]
	);
}

module.exports = createTextGroup;