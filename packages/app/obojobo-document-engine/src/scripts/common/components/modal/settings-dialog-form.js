import './settings-dialog-form.scss'
import React, { useEffect, useMemo, useRef } from 'react'
import Switch from '../switch'
import 'obojobo-document-engine/src/scripts/common/components/switch.scss'

const renderInput = (item, value, onChange, ref) => {
	const id = `obojobo-draft--settings--item-${item.prop}`
	switch (item.type) {
		case 'switch':
			return <Switch id={id} checked={value === true} onChange={onChange} ref={ref} />

		case 'select':
			return (
				<select id={id} value={value} onChange={onChange} ref={ref}>
					{item.options.map(o => (
						<option key={o.value} value={o.value}>
							{o.label}
						</option>
					))}
				</select>
			)

		case 'number':
			return (
				<input
					type={item.type}
					id={id}
					min={item.min || Number.NEGATIVE_INFINITY}
					max={item.max || Number.POSITIVE_INFINITY}
					step="1"
					disabled={item.editable === false}
					value={value || ''}
					placeholder={item.placeholder || `${item.label} not set`}
					onChange={onChange}
					ref={ref}
				/>
			)

		default:
			return (
				<input
					type={item.type || 'text'}
					id={id}
					disabled={item.editable === false}
					value={value || ''}
					placeholder={item.placeholder || `${item.label} not set`}
					onChange={onChange}
					ref={ref}
				/>
			)
	}
}

const SettingsFormCore = ({ config, settings, onChange, forwardedRef }) => {
	// memoize onChange callback functions
	// a parallel array to config (index will match config index)
	const memoizedOnChanges = useMemo(() => {
		return config.map(configItem => {
			return event => {
				onChange(configItem, event)
			}
		})
	}, [config, onChange])

	let refs = []

	console.log('sfc', config, settings)

	// const memoizedRefs = useMemo(() => {
	// 	config.forEach(input => {
	// 		refs.push(useRef(null))
	// 	})
	// }, [config])

	config.forEach(input => {
		refs.push(useRef(null))
	})

	console.log('sfc2', refs)

	useEffect(() => {
		config.forEach((configItem, index) => {
			const ref = refs[index]
			const el = ref.current

			console.log('el be all', el, configItem.validity)
			if (typeof configItem.validity !== 'undefined' && el && el.setCustomValidity) {
				el.setCustomValidity(configItem.validity)
			}
		})
	}, [settings])

	return (
		<div className="obojobo-draft--settings--form">
			{config.map((item, index) => {
				// lazily assign fowardedRef only to the first input
				const ref = refs[index] //index === 0 ? forwardedRef : null
				return item.type === 'heading' ? (
					<h2 key={index}>{item.text}</h2>
				) : (
					<React.Fragment key={index}>
						<label htmlFor={`obojobo-draft--settings--item-${item.prop}`}>{item.label}:</label>
						<div>
							{renderInput(item, settings[item.prop], memoizedOnChanges[index], ref)}
							{item.units ? (
								<span className="obojobo-draft--settings--units">{item.units}</span>
							) : null}
						</div>
					</React.Fragment>
				)
			})}
		</div>
	)
}

// Add ability to forward refs for the purpose of focusing inputs
const SettingsForm = React.forwardRef((props, ref) => (
	<SettingsFormCore {...props} forwardedRef={ref} />
))
export default SettingsForm
