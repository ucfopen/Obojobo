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
		updated: 'minimal'
	},
	{
		label: 'Excerpt',
		updated: 'excerpt'
	},
	{
		label: 'Simple Filled',
		updated: 'simple-filled'
	},
	{
		label: 'Simple Bordered',
		updated: 'simple-bordered'
	},
	{
		label: 'Card',
		updated: 'card'
	},
	{
		label: 'Fiction',
		updated: 'fiction'
	},
	{
		label: 'Non-Fiction',
		updated: 'non-fiction'
	},
	{
		label: 'Historical',
		updated: 'historical'
	},
	{
		label: 'Very Historical',
		updated: 'very-historical'
	},
	{
		label: 'White Paper',
		updated: 'white-paper'
	},
	{
		label: 'Inst. Manual',
		updated: 'instruction-manual'
	},
	{
		label: 'Typewritten',
		updated: 'typewritten'
	},
	{
		label: 'Receipt',
		updated: 'receipt'
	},
	{
		label: 'Site / Doc',
		updated: 'modern-text-file'
	},
	{
		label: 'Retro Text File',
		updated: 'retro-text-file'
	},
	{
		label: 'Command Line',
		updated: 'computer-modern'
	},
	{
		label: 'Hacker Green',
		updated: 'computer-hacker-green'
	},
	{
		label: 'Hacker Orange',
		updated: 'computer-hacker-orange'
	},
	{
		label: 'Callout',
		updated: 'callout'
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
									key={p.updated}
									className={content.preset === p.updated ? 'is-selected' : 'is-not-selected'}
								>
									<button onClick={() => onChangePreset(p.updated)}>
										<div className={`icon icon-${p.updated}`}></div>
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
									updated={content.bodyStyle}
									onChange={event => onChangeProp('bodyStyle', event.target.updated)}
								>
									<optgroup label="Simple">
										<option updated="none">None</option>
										<option updated="filled-box">Filled Box</option>
										<option updated="bordered-box">Bordered Box</option>
										<option updated="card">Card</option>
									</optgroup>
									<optgroup label="Paper">
										<option updated="white-paper">White Paper</option>
										<option updated="modern-paper">Gray Paper</option>
										<option updated="light-yellow-paper">Light Yellow Paper</option>
										<option updated="dark-yellow-paper">Dark Yellow Paper</option>
										<option updated="aged-paper">Aged Paper</option>
									</optgroup>
									<optgroup label="Computer">
										<option updated="modern-text-file">Browser</option>
										<option updated="retro-text-file">Retro Text File</option>
										<option updated="command-line">Command Line</option>
										<option updated="term-white">CRT Terminal (White)</option>
										<option updated="term-green">CRT Terminal (Green)</option>
										<option updated="term-orange">CRT Terminal (Orange)</option>
										<option updated="term-c64">Commodore 64 Screen</option>
									</optgroup>
									<optgroup label="Callout">
										<option updated="callout-try-it">Try It!</option>
										<option updated="callout-practice">Practice!</option>
										<option updated="callout-do-this">Do This:</option>
										<option updated="callout-example">Example</option>
										<option updated="callout-hint">Hint</option>
									</optgroup>
								</select>
							</div>

							<div>
								<label className="attribute-label">
									<span>Font</span>
								</label>
								<select
									updated={content.font}
									onChange={event => onChangeProp('font', event.target.updated)}
								>
									<optgroup label="Obojobo Default Fonts">
										<option updated="serif">Serif</option>
										<option updated="sans">Sans-Serif</option>
										<option updated="monospace">Monospace</option>
									</optgroup>
									<optgroup label="System Fonts">
										<option updated="times-new-roman">Times New Roman</option>
										<option updated="georgia">Georgia</option>
										<option updated="helvetica">Helvetica</option>
										<option updated="courier">Courier</option>
										<option updated="palatino">Palatino</option>
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
									onChangeOption={updated => onChangeProp('width', updated)}
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
									onChangeOption={updated => onChangeProp('fontSize', updated)}
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
									onChangeOption={updated => onChangeProp('lineHeight', updated)}
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
