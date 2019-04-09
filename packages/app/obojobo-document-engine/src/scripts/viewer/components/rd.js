import './rd.scss'

const rd = () => {
	const el = document.createElement('div')
	el.onclick = () => {
		el.classList.add('clicked')
	}
	el.classList.add('viewer--components--rd')
	document.body.appendChild(el)
	el.style.left = '-300px'
	el.style.top = Math.floor(window.outerHeight * Math.random()) + 'px'
	setTimeout(() => {
		el.style.left = 'calc(100vw + 400px)'
		el.style.top = Math.floor(window.outerHeight * Math.random()) + 'px'
	})
	setTimeout(() => {
		document.body.removeChild(el)
	}, 5000)
}

export default rd
