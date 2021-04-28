// This function is very basic, but helpful in order to be able to mock-out
// when testing <NumericOption>

export default (event, ref) => {
	return event.relatedTarget === ref.current
}
