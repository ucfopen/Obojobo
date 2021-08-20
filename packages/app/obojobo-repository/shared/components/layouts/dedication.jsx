require('./dedication.scss')

const React = require('react')

const Dedication = () => {
	return (
		<React.Fragment>
			<script
				dangerouslySetInnerHTML={{
					__html: `(()=>{const e=[38,38,40,40,37,39,37,39,66,65,13];let d=0;document.addEventListener("keyup",o=>{if(!(d+1>e.length)&&(o.keyCode===e[d]?d++:d=0,d+1>e.length)){document.body.classList.add("is-showing-dedication");let e=document.createElement("div");e.id="dedication",e.innerHTML='<img src="/images/dedication.jpg" /><span className="text">Obojobo Next is dedicated to <b>Barbara Truman</b> and <b>Francisca Yonekura</b>. Obojobo wouldn&apos;t be possible without their hard work and support.</span>',e.onclick=(()=>{e.parentElement.removeChild(e),document.body.classList.remove("is-showing-dedication"),d=0}),document.body.appendChild(e)}})})();`
				}}
			/>
		</React.Fragment>
	)
}

module.exports = Dedication
