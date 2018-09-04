let originalConsole = console

describe('oboGlobals', () => {

	beforeEach(() => {})
	afterEach(() => {})
	beforeAll(() => {})
	afterAll(() => {})

	it('should allow me to set valid variables', () => {
		let OboGlobals = oboRequire('obo_globals');
		let og = new OboGlobals();

		expect(og.set('t_number', 5)).toBe(true)
		expect(og.set('t_boolean', false)).toBe(true)
		expect(og.set('t_boolean', false)).toBe(true)
		expect(og.set('t_string', 'whatever')).toBe(true)
		expect(og.set('t_object', {test:true})).toBe(true)
	})

	it('should allow not allow me to set functions or objects', () => {
		let OboGlobals = oboRequire('obo_globals');
		let og = new OboGlobals();
		let SomeClass = class SomeClass{};
		expect(og.set('t_class', SomeClass)).toBe(false)
		expect(og.set('t_function', () => {})).toBe(false)
	})

	it('should render correct output', () =>{
		let OboGlobals = oboRequire('obo_globals');
		let og = new OboGlobals();
		let SomeClass = class SomeClass{};

		og.set('t_class', SomeClass);
		og.set('t_function', () => {});
		og.set('t_number', 5);
		og.set('t_boolean', false);
		og.set('t_boolean', false);
		og.set('t_string', 'whatever');
		og.set('t_object', {test:true});

		let expectedString =
`if(!window["__oboGlobals"]) window["__oboGlobals"] = {};
window["__oboGlobals"]["t_number"]=5;
window["__oboGlobals"]["t_boolean"]=false;
window["__oboGlobals"]["t_string"]="whatever";
window["__oboGlobals"]["t_object"]={"test":true};
`

		expect(og.renderScriptContent()).toBe(expectedString)
	})

})
