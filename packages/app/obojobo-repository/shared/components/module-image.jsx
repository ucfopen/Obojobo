require('./module-image.scss')

const React = require('react')

const ModuleImage = props => (
	<div className="repository--module-icon--image">
		<svg viewBox="0 0 130 150" version="1.1" xmlns="http://www.w3.org/2000/svg">
			<defs>
				<pattern
					id={`module-img-id-${props.id}`}
					patternUnits="userSpaceOnUse"
					width="150"
					height="150"
					dangerouslySetInnerHTML={{
						__html: `<image href="/library/module-icon/${props.id}" width="150" height="150" />`
					}}
				></pattern>
			</defs>
			<path
				fill={`url(#module-img-id-${props.id})`}
				d="M56.29165124598851 4.999999999999999Q64.9519052838329 0 73.61215932167728 4.999999999999999L121.24355652982142 32.5Q129.9038105676658 37.5 129.9038105676658 47.5L129.9038105676658 102.5Q129.9038105676658 112.5 121.24355652982142 117.5L73.61215932167728 145Q64.9519052838329 150 56.29165124598851 145L8.660254037844387 117.5Q0 112.5 0 102.5L0 47.5Q0 37.5 8.660254037844387 32.5Z"
			/>
		</svg>
	</div>
)

module.exports = ModuleImage
