require('./dedication.scss')

const React = require('react')

const Dedication = () => {
	return (
		<React.Fragment>
			<div id="dedication">
				<img src="/images/dedication.jpg" />
				<span className="text">
					Obojobo Next is dedicated to <b>Barbra Truman</b> and <b>Francisca Yonekura</b>. Obojobo
					wouldn&apos;t be possible without their hard work and support.
				</span>
			</div>

			<script
				dangerouslySetInnerHTML={{
					__html: `(()=>{const e=[38,38,40,40,37,39,37,39,66,65,13];let d=0;document.addEventListener("keyup",t=>{d+1>e.length||(t.keyCode===e[d]?d++:d=0,d+1>e.length&&(document.body.classList.add("is-showing-dedication"),document.getElementById("dedication").onclick=(()=>{document.body.classList.remove("is-showing-dedication"),d=0})))})})()`
				}}
			/>
		</React.Fragment>
	)
}

module.exports = Dedication
