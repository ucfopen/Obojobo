import './settings-dialog-form.scss'

import React, {useMemo} from 'react'

const SettingsForm = ({config, settings, onChange}) => {
	// memoize onChange callback functions
	// a parallel array to config (index will match config index)
	const memoizedOnChanges = useMemo(
		() => {
			return config.map(c => {
				return event => { onChange(c.prop, event)
			}})
		}, [config, onChange]
	)

	return (
		<div className="obojobo-draft-settings--form">
			{config.map((item, index) =>
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
								onChange={memoizedOnChanges[index]}
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

export default SettingsForm