import './excerpt-edit-controls.scss'

import React, { useState } from 'react'

import iconFontSizeSmall from '../images/icon-font-size-small.svg'
import iconFontSizeMedium from '../images/icon-font-size-medium.svg'
import iconFontSizeLarge from '../images/icon-font-size-large.svg'

import iconLineHeightCompact from '../images/icon-line-height-compact.svg'
import iconLineHeightModerate from '../images/icon-line-height-moderate.svg'
import iconLineHeightGenerous from '../images/icon-line-height-generous.svg'
import iconWidthLarge from '../images/icon-width-large.svg'
import iconWidthMedium from '../images/icon-width-medium.svg'
import iconWidthSmall from '../images/icon-width-small.svg'
import iconWidthTiny from '../images/icon-width-tiny.svg'
import Button from 'obojobo-document-engine/src/scripts/common/components/button'
import RadioIcons from './radio-icons'

const NO_EFFECT_DESCRIPTION = '(No effect available)'

const presets = [
	{
		label: 'Minimal',
		value: 'minimal'
	},
	{
		label: 'Excerpt',
		value: 'excerpt'
	},
	{
		label: 'Simple Filled',
		value: 'simple-filled'
	},
	{
		label: 'Simple Bordered',
		value: 'simple-bordered'
	},
	{
		label: 'Card',
		value: 'card'
	},
	{
		label: 'Fiction',
		value: 'fiction'
	},
	{
		label: 'Non-Fiction',
		value: 'non-fiction'
	},
	{
		label: 'Historical',
		value: 'historical'
	},
	{
		label: 'Very Historical',
		value: 'very-historical'
	},
	{
		label: 'White Paper',
		value: 'white-paper'
	},
	{
		label: 'Inst. Manual',
		value: 'instruction-manual'
	},
	{
		label: 'Typewritten',
		value: 'typewritten'
	},
	{
		label: 'Receipt',
		value: 'receipt'
	},
	{
		label: 'Site / Doc',
		value: 'modern-text-file'
	},
	{
		label: 'Retro Text File',
		value: 'retro-text-file'
	},
	{
		label: 'Command Line',
		value: 'computer-modern'
	},
	{
		label: 'Hacker Green',
		value: 'computer-hacker-green'
	},
	{
		label: 'Hacker Orange',
		value: 'computer-hacker-orange'
	}
]

const isEffectAvailable = bodyStyle => {
	return getEffectDescription(bodyStyle) !== NO_EFFECT_DESCRIPTION
}

const getEffectDescription = bodyStyle => {
	switch (bodyStyle) {
		case 'white-paper':
		case 'modern-paper':
		case 'light-yellow-paper':
		case 'dark-yellow-paper':
		case 'aged-paper':
			return 'Paper background'

		case 'term-white':
		case 'term-orange':
		case 'term-green':
			return 'Screen / glow effects'

		case 'modern-text-file':
		case 'retro-text-file':
			return 'Drop shadow'

		default:
			return NO_EFFECT_DESCRIPTION
	}
}

const ExcerptEditControls = ({ content, onChangeProp, onChangePreset }) => {
	const [isShowingMoreOptions, setIsShowingMoreOptions] = useState(false)

	const effectAvailable = isEffectAvailable(content.bodyStyle)

	return (
		<div
			contentEditable={false}
			className={`excerpt--excerpt-edit-controls ${
				isShowingMoreOptions ? 'extra-width' : ''
			}`}
			onMouseDown={event => {
				// prevent mouse down behavior except when coming from a dropdown or checkbox
				switch (event.target.tagName) {
					case 'INPUT':
					case 'SELECT':
						return

					default:
						event.preventDefault()
				}
			}}
		>
			<div className="attributes-list">
				{isShowingMoreOptions ? null : (
					<ul className="preset-list">
						{presets.map(p => {
							return (
								<li
									key={p.value}
									className={content.preset === p.value ? 'is-selected' : 'is-not-selected'}
								>
									<button onClick={() => onChangePreset(p.value)}>
										<div className={`icon icon-${p.value}`}></div>
										<span>{p.label}</span>
									</button>
								</li>
							)
						})}
					</ul>
				)}

				{isShowingMoreOptions ? (
					<div className="more-options">
						<section className="more-options-group">
							<div>
								<label className="attribute-label">
									<span>Style</span>
								</label>
								<select
									value={content.bodyStyle}
									onChange={event => onChangeProp('bodyStyle', event.target.value)}
								>
									<optgroup label="Simple">
										<option value="none">None</option>
										<option value="filled-box">Filled Box</option>
										<option value="bordered-box">Bordered Box</option>
										<option value="card">Card</option>
									</optgroup>
									<optgroup label="Paper">
										<option value="white-paper">White Paper</option>
										<option value="modern-paper">Gray Paper</option>
										<option value="light-yellow-paper">Light Yellow Paper</option>
										<option value="dark-yellow-paper">Dark Yellow Paper</option>
										<option value="aged-paper">Aged Paper</option>
									</optgroup>
									<optgroup label="Computer">
										<option value="modern-text-file">Browser</option>
										<option value="retro-text-file">Retro Text File</option>
										<option value="command-line">Command Line</option>
										<option value="term-white">CRT Terminal (White)</option>
										<option value="term-green">CRT Terminal (Green)</option>
										<option value="term-orange">CRT Terminal (Orange)</option>
										<option value="term-c64">Commodore 64 Screen</option>
									</optgroup>
									<optgroup label="Callout">
										<option value="callout-try-it">Try It!</option>
										<option value="callout-practice">Practice!</option>
										<option value="callout-do-this">Do This:</option>
										<option value="callout-example">Example</option>
										<option value="callout-hint">Hint</option>
									</optgroup>
								</select>
							</div>

							<div>
								<label className="attribute-label">
									<span>Font</span>
								</label>
								<select
									value={content.font}
									onChange={event => onChangeProp('font', event.target.value)}
								>
									<optgroup label="Obojobo Default Fonts">
										<option value="serif">Serif</option>
										<option value="sans">Sans-Serif</option>
										<option value="monospace">Monospace</option>
									</optgroup>
									<optgroup label="System Fonts">
										<option value="times-new-roman">Times New Roman</option>
										<option value="georgia">Georgia</option>
										<option value="helvetica">Helvetica</option>
										<option value="courier">Courier</option>
										<option value="palatino">Palatino</option>
									</optgroup>
								</select>
							</div>
							<div>
								<label
									className={`effect-settings ${effectAvailable ? 'is-enabled' : 'is-not-enabled'}`}
								>
									<input
										disabled={!effectAvailable}
										type="checkbox"
										checked={content.effect}
										onChange={event => {
											onChangeProp('effect', event.target.checked)
										}}
									/>
									<span>{getEffectDescription(content.bodyStyle)}</span>
								</label>
							</div>
						</section>

						<section className="more-options-group">
							<div>
								<label className="attribute-label">
									<span>Width</span>
								</label>
								<RadioIcons
									name="width"
									ariaLabel="width"
									options={[
										{ label: 'large', icon: iconWidthLarge },
										{ label: 'medium', icon: iconWidthMedium },
										{ label: 'small', icon: iconWidthSmall },
										{ label: 'tiny', icon: iconWidthTiny }
									]}
									selectedOption={content.width}
									onChangeOption={value => onChangeProp('width', value)}
								/>
							</div>

							<div>
								<label className="attribute-label">
									<span>Font Size</span>
								</label>
								<RadioIcons
									name="font-size"
									ariaLabel="font size"
									options={[
										{ label: 'smaller', icon: iconFontSizeSmall },
										{ label: 'regular', icon: iconFontSizeMedium },
										{ label: 'larger', icon: iconFontSizeLarge }
									]}
									selectedOption={content.fontSize}
									onChangeOption={value => onChangeProp('fontSize', value)}
								/>
							</div>
							<div>
								<label className="attribute-label">
									<span>Line Height</span>
								</label>
								<RadioIcons
									name="line-height"
									ariaLabel="line height"
									options={[
										{ label: 'compact', icon: iconLineHeightCompact },
										{ label: 'moderate', icon: iconLineHeightModerate },
										{ label: 'generous', icon: iconLineHeightGenerous }
									]}
									selectedOption={content.lineHeight}
									onChangeOption={value => onChangeProp('lineHeight', value)}
								/>
							</div>
						</section>
					</div>
				) : null}
			</div>
			<Button
				altAction
				onClick={() => {
					setIsShowingMoreOptions(!isShowingMoreOptions)
				}}
			>
				{isShowingMoreOptions ? 'Exit advanced options' : 'Advanced options...'}
			</Button>
		</div>
	)
}

export default ExcerptEditControls
