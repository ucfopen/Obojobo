import React from 'react'
import LayoutDefault from './default'
import { shallow } from 'enzyme'

describe('LayoutDefault', () => {
	test('renders correctly with default props', () => {
		const component = shallow(<LayoutDefault />)

		const links = component.find('link')
		// if 'appCSSUrl' is not in props, only the default stylesheet link will render
		expect(links).toHaveLength(1)
		expect(links.at(0).prop('href')).toContain('//fonts.googleapis.com')
		// if both 'headerJS' and 'appScriptUrl' are not in props, no script tags should render
		const scripts = component.find('script')
		expect(scripts).toHaveLength(0)
	})

	test('renders correctly with appCSSUrl props provided', () => {
		const component = shallow(<LayoutDefault appCSSUrl="./styles.css" />)

		const links = component.find('link')
		// if 'appCSSUrl' is not in props, only the default stylesheet link will render
		expect(links).toHaveLength(2)
		expect(links.at(0).prop('href')).toBe('./styles.css')
		expect(links.at(1).prop('href')).toContain('//fonts.googleapis.com')
		// if both 'headerJs' and 'appScriptUrl' are not in props, no script tags should render
		const scripts = component.find('script')
		expect(scripts).toHaveLength(0)
	})

	test('renders correctly with appCSSUrl props provided', () => {
		const headerJsPropValue = ['./script1.js', './script2.js']

		const component = shallow(<LayoutDefault headerJs={headerJsPropValue} />)

		const links = component.find('link')
		// if 'appCSSUrl' is not in props, only the default stylesheet link will render
		expect(links).toHaveLength(1)
		expect(links.at(0).prop('href')).toContain('//fonts.googleapis.com')
		// script tags should render for each entry in 'headerJs'
		const scripts = component.find('script')
		expect(scripts).toHaveLength(2)
		expect(scripts.at(0).prop('src')).toBe('./script1.js')
		expect(scripts.at(1).prop('src')).toBe('./script2.js')
	})

	test('renders correctly with appScriptUrl prop provided and default isDev', () => {
		const component = shallow(<LayoutDefault appScriptUrl={'./script.js'} />)

		const links = component.find('link')
		// if 'appCSSUrl' is not in props, only the default stylesheet link will render
		expect(links).toHaveLength(1)
		expect(links.at(0).prop('href')).toContain('//fonts.googleapis.com')
		// if 'appScriptUrl' is not in props, standard script tags should render
		const scripts = component.find('script')
		expect(scripts).toHaveLength(3)
		expect(scripts.at(0).prop('crossOrigin')).toBe(false)
		expect(scripts.at(1).prop('crossOrigin')).toBe(false)
		expect(scripts.at(1).prop('src')).toBe('//unpkg.com/react-dom@16.13.1/umd/react-dom.production.min.js')
		// only the third tag has a variable location - the first two are hard-coded
		expect(scripts.at(2).prop('src')).toBe('./script.js')
	})

	test('renders correctly with appScriptUrl prop provided and isDev is true', () => {
		const component = shallow(<LayoutDefault appScriptUrl={'./script.js'} isDev={true}/>)

		const links = component.find('link')
		// if 'appCSSUrl' is not in props, only the default stylesheet link will render
		expect(links).toHaveLength(1)
		expect(links.at(0).prop('href')).toContain('//fonts.googleapis.com')
		// if 'appScriptUrl' is not in props, standard script tags should render
		const scripts = component.find('script')
		expect(scripts).toHaveLength(3)
		expect(scripts.at(0).prop('crossOrigin')).toBe('true')
		expect(scripts.at(1).prop('crossOrigin')).toBe('true')
		expect(scripts.at(1).prop('src')).toBe('//unpkg.com/react-dom@16.13.1/umd/react-dom.development.js')
		// only the third tag has a variable location - the first two are hard-coded
		expect(scripts.at(2).prop('src')).toBe('./script.js')
	})
})
