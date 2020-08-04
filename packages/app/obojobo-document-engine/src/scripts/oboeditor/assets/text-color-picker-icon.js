import React, { useState } from 'react'

import ColorPicker from './color-picker'

const TextColorPickerIcon = props => {
	const [isSelected, setIsSelected] = useState(false)

	return (
		<div className="text-color-icon">
			<img
				style={{ width: '22px', height: '22px', margin: '5px' }}
				onClick={() => {
					setIsSelected(!isSelected)
					props.editor.toggleEditable(false)
				}}
				src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAABjUlEQVRoge2ZPU7DMBSAP0qHXgFVFQxcAIkdCRZ+Jq6AYKdMLHAlYOgBulfiAgyoggWmbEitVIYSCSVO4ufY2KXvk95iyc/PjT+/RgFFURQP3ACfwAcwjFyLM0fAohCHUSty5InyRh6jVuTAFjCjvJEZ0A+xYCdEUuAK6BrGu8BFoDW90wFeKT+NPKbAZqziJJxRvYk8TqNVJ8Ak+cpJXyV5cOl9y35JWfLpT/wmaemrJL8D7g3jyUpvkjw/QlVHLknpmzr5SnR6m1+87oklg40DdQ4lgaTApKWXHJmkpZdKHET6jZbz+yyPVbEJPgMvFXN2gb3C2BzYAd5b1uOM6cy7RjTpm/6uS6OV9KaXH1tOgO3C2Bx4sJx/Xlh/ABwDoxY1OdFW2iQ6vY9rNIlO76OxRe/0Pgvw1uklsveAA2CfsuSw7AE94EuQ780wPgBugQkwFuSzZkTzFSq5cXznsyazWDiLmM+aYcPiGXAdMZ+iKOuA5MVqEayKeqxqDPV95M/RjaTGv9mIoihrwjdEnSlPQwzPyAAAAABJRU5ErkJggg=="
			/>
			{isSelected ? (
				<ColorPicker editor={props.editor} onClose={() => setIsSelected(false)} />
			) : null}
		</div>
	)
}

export default TextColorPickerIcon
