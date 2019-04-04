// used to apply ' is-label' or ' is-not-label' styles
const isOrNot = (flag, label) => ' is-' + (flag ? '' : 'not-') + label
export default isOrNot
