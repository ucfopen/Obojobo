import React from 'react'

const DialogSettings = ({config, settings, onChange}) => {

	return (

		<div className="obojobo-draft-settings--container">
			{config.map(item =>
				<>
					<label htmlFor={`obojobo-draft-seetings--item-${item.prop}`}>
						{item.label}:
					</label>
					<div>
						<input
								type={item.type || 'text'}
								id={`obojobo-draft-seetings--item-${item.prop}`}
								disabled={item.editable === false}
								value={settings[item.prop] || ''}
								placeholder={(item.placeholder || `${item.label} not set`) }
								onChange={event => { onChange(item.prop, event) }}
						/>
						{item.units
							? <span className="obojobo-draft-settings--units">{item.units}</span>
							: null
						}
					</div>
				</>
			)}
		</div>
	)

}

export default DialogSettings
