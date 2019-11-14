
// getSortByVal and GetUpdated handles are util functions copied from react-compound-slider
// They allow the custom mode function to work
const getSortByVal = (reversed) => {
  return (a, b) => {
    if (a.val > b.val) {
      return reversed ? -1 : 1
    }

    if (b.val > a.val) {
      return reversed ? 1 : -1
    }

    return 0
  }
}

const getUpdatedHandles = (handles, updateKey, updateValue, reversed) => {
  const index = handles.findIndex(v => v.key === updateKey)

  if (index !== -1) {
    const { key, val } = handles[index]

    if (val === updateValue) {
      return handles
    }

    return [
      ...handles.slice(0, index),
      { key, val: updateValue },
      ...handles.slice(index + 1),
    ].sort(getSortByVal(reversed))
  }

  return handles
}


// The custom mode4 function is adapted from the mode3 function from react-compound-slider,
// with adjustments to allow for overlapping values
const mode4 = (curr, next, step, reversed, getValue) => {
	let indexForMovingHandle = -1
	let handleMoveIsPositive = true

	for (let i = 0; i < curr.length; i++) {
		const c = curr[i]
		const n = next[i]

		// make sure keys are in same order if not return curr
		if (!n || n.key !== c.key) {
			return curr
		// Identify which handle is being moved by finding the value that is different
		} else if (n.val !== c.val) {
			indexForMovingHandle = i
			handleMoveIsPositive = n.val - c.val > 0
		}
	}

	// nothing has changed (shouldn't happen but just in case).
	if (indexForMovingHandle === -1) {
		return curr
	} else {
		const increment = handleMoveIsPositive ? step : -step

		for (let i = 0; i < next.length; i++) {
			const n0 = next[i]
			const n1 = next[i + 1]

			// If what should be the smaller value is greater than
			// what should be the larger value, adjust the second handle
			if (n1 && n0.val > n1.val) {
				if (i === indexForMovingHandle) {
					const newStep = n1.val + increment
					if (getValue(newStep) === newStep) {
						const clone = getUpdatedHandles(
							next,
							n1.key,
							n1.val + increment,
							reversed,
						)
						const check = mode4(next, clone, step, reversed, getValue)

						if (check === next) {
							return curr
						} else {
							return check
						}
					} else {
						return curr
					}
				// Otherwise, only the first handle needs to be adjusted
				} else {
					const newStep = n0.val + increment
					if (getValue(newStep) === newStep) {
						const clone = getUpdatedHandles(
							next,
							n0.key,
							n0.val + increment,
							reversed,
						)
						const check = mode4(next, clone, step, reversed, getValue)

						if (check === next) {
							return curr
						} else {
							return check
						}
					} else {
						return curr
					}
				}
			}
		}
	}
	return next
}

export default mode4