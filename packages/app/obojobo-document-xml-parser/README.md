# Obojobo XML (OboXML)

Obojobo XML is an XML document with an implied schema that can be used to generate the JSON structure of an Obojobo Draft Document. OboXML is sutible to create Obojobo Draft Documents by hand much like an HTML page. Note that OboXML is simply a readable format that Obojobo understands and no requirements are enforced to ensure that any OboXML document will result in a valid or fully functional Obojobo module.

## Definitions

*  **OboXML**: XML format describing an Obojobo Draft Document.
*  **OboXML document**: XML file following the OboXML format.
*  **Obojobo draft document**: JSON describing the configuration and relationship of multiple Obojobo components which is stored in Obojobo and used to render a module in the Obojobo system.
*  **Obojobo component**: An installed sub-module with code defining the logic and display of this module.
*  **Component identifier**: Obojobo components are indentified and registered by an identifier in the format of `[Component namespace].[Component name]`. Default components are prefixed with `ObojoboDraft`, for example `ObojoboDraft.Chunks.Text`.
*  **Component namespace**: The prefix in an Obojobo component identifier, for example `ObojoboDraft.Chunks`. May contain alphanumeric characters and periods. Namespaces allows Obojobo components with the same component name to be differentated and installed.
*  **Component name**: The ending term in an Obojobo component identifier, for example `Text` in `ObojoboDraft.Chunks.Text`.
*  **OboXML parser**: Code which parses OboXML to produce an Obojobo Draft Document.
*  **Component element**: An XML element in an OboXML document representing an Obojobo component. Uppercase.
*  **OboXML element**: An XML element in an OboXML document representing a content attribute of an Obojobo component. Lowercased. Additional parsers or extensions can parse these elements to construct a conformant content attribute for the resulting Obojobo draft document.
*  **HTML shorthand element**: An XML element which is convience shorthand representing a component element or a StyleRange in a TextGroup. 

## OboXML Format

OboXML documents should have a singular `<ObojoboDraftDoc>` element containing multiple Obojobo component elements. `<ObojoboDraftDoc>` can specify a `version` attribute defining the expected *OboXML Parser* version to parse it - if omitted then the latest version is assumed.

## Obojobo compoment element format

Obojobo component elements are uppercased and should be named after thier component identifier (or, optionally, the component name as shorthand).

If only the component name is used then the element's tag name will be resolved to the full component identifier by searching the installed Obojobo components on the system. If no matching Obojobo component is found an error will be produced.

Component elements can contain one or more attributes. `id` attributes represent the `id` of the resulting Obojobo component. Other attributes will comprise the `content` attribute of that component's JSON.

Component elements can contain other component elements as children - child component elements will comprise the `children` attribute of that component's JSON. Component elements can also contain OboXML elements.

## OboXML element

OboXML elements are lowercased and represent a content attribute of their parent. These elements have their own structure and are parsed diffrently. These elements are described below:

### textGroup

This element describes a **textGroup** content property. `<textGroup>` should contain one or more `<t>` elements representing a text item. `<t>` elements can contain attributes which will comprise the `data` attribute of the resulting JSON. The text content of `<t>` elements can contain a strict sub-set of HTML-like elements.

An example of this structure:

```
<Text>
	<textGroup>
		<t>A text item</t>
		<t align="right">Some <b>bold</b> text</t>
	</textGroup>
</Text>
```

This will result in

```
{
	"id": null,
	"type": "ObojoboDraft.Chunks.Text",
	"content": {
		"textGroup": [
			{
				"text": {
					"value": "A text item",
					"styleList": []
				},
				"data": {}
			},
			{
				"text": {
					"value": "Some bold text",
					"styleList": [
						{
							"type": "b",
							"data": {},
							"start": 5,
							"end": 9
						}
					]
				},
				"data": {
					"align": "right"
				}
			}
		]
	},
	"children": []
}
```

#### Allowed `<t>` HTML-like style tags

* `<b>`: Bold
* `<i>`: Italic
* `<latex>`: Latex math equation
* `<a href="address">`: Link
* `<sup>`: Superscript
* `<sub>`: Subscript
* `<q>`: Quote
* `<del>`: Strikethrough

### scoreActions

This element describes a **scoreActions** property. `<scoreActions>` should contain one or more `<scoreAction>` elements which must have a `from` and `to` attribute representing the score range for this score action. `<scoreAction>` elements should contain a `<Page>` element.

An example of this structure:

```
<Assessment id="assessment">
	<scoreActions>
		<scoreAction from="0" to="99">
			<Page>
				<h1>Try again...</h1>
			</Page>
		</scoreAction>
		<scoreAction from="100" to="100">
			<Page>
				<h1>Correct!</h1>
			</Page>
		</scoreAction>
	</scoreActions>
	<!-- Assessment children elements... -->
</Assessment>
```

This will result in

```
{
	"id": "assessment",
	"type": "ObojoboDraft.Sections.Assessment",
	"content": {
		"scoreActions": [
			{
				"from": "0",
				"to": "99",
				"page": {
					...
				}
			},
			{
				"from": "100",
				"to": "100",
				"page": {
					...
				}
			}
		]
	},
	"children": [...]
}
```

### triggers

This element describes a **triggers** property. `<triggers>` should contain one or more `<trigger>` elements which must have a `type` attribute representing the type of trigger. `<trigger>` elements should contain a singular `<actions>` element which should contain one or more `<action>` elements. `<action>` elements must contain a type attribute and optionally a `<value>` element. `<value>` elements must contain one or more attributes.

An example of this format is shown below:

```
<ActionButton label="Start attempt">
	<triggers>
		<trigger type="onClick">
			<actions>
				<action type="nav:lock" />
				<action type="assessment:startAttempt">
					<value id="assessment" />
				</action>
			</actions>
		</trigger>
	</triggers>
</ActionButton>
```

This will result in the JSON

```
{
	"id": null,
	"type": "ObojoboDraft.Chunks.ActionButton",
	"content": {
		"label": "Start attempt",
		"triggers": [
			{
				"type": "onClick",
				"actions": [
					{
						"type": "nav:lock"
					},
					{
						"type": "assessment:startAttempt",
						"value": {
							"id": "assessment"
						}
					}
				]
			}
		]
	},
	"children": []
}
```

### listStyles

This element describes a **listStyles** property for an **Obojobo.Chunks.List** component. `<listStyles>` should contain either or both a `<type>` and `<indents>` element.

`<type>` should contain either the text `ordered` or `unordered`. `<indents>` should contain one or more `<indent>` elements. `<indent>` elements should contain a `level` attribute and optionally `start`, `type` and/or `bulletStyle` attributes.

An example of this format is shown below:

```
<List>
	<listStyles>
		<type>ordered</type>
		<indents>
			<indent level="2" type="unordered" bulletStyle="square" />
			<indent level="4" type="ordered" start="10" bulletStyle="upper-alpha" />
		</indents>
	</listStyles>
	<textGroup>
		<t>One (indent=1)</t>
		<t align="right" indent="2">Two (indent=2, align=right)</t>
		<t indent="6">Three (indent=6)</t>
		<t indent="2">Four (indent=2)</t>
		<t indent="4">Five (indent=4)</t>
		<t indent="3">Six (indent=3)</t>
	</textGroup>
</List>
```

This will result in the following JSON:

```
{
	"id": null,
	"type": "ObojoboDraft.Chunks.List",
	"content": {
		"textGroup": [
			{
				"text": {
					"value": "One (indent=1)",
					"styleList": []
				},
				"data": null
			},
			{
				"text": {
					"value": "Two (indent=2, align=right)",
					"styleList": []
				},
				"data": {
					"align": "right",
					"indent": "2"
				}
			},
			{
				"text": {
					"value": "Three (indent=6)",
					"styleList": []
				},
				"data": {
					"indent": "6"
				}
			},
			{
				"text": {
					"value": "Four (indent=2)",
					"styleList": []
				},
				"data": {
					"indent": "2"
				}
			},
			{
				"text": {
					"value": "Five (indent=4)",
					"styleList": []
				},
				"data": {
					"indent": "4"
				}
			},
			{
				"text": {
					"value": "Six (indent=3)",
					"styleList": []
				},
				"data": {
					"indent": "3"
				}
			}
		],
		"listStyles": {
			"type": "ordered",
			"indents": {
				"2": {
					"type": "unordered",
					"bulletStyle": "square"
				},
				"4": {
					"type": "ordered",
					"start": "10",
					"bulletStyle": "upper-alpha"
				}
			}
		}
	},
	"children": []
}
```

## HTML-Like Shorthand

For convience a few HTML-like tags are allowed which represent different Obojobo elements. These are listed below as examples:

### `<p>`: Text

```
<p>Hello world</p>
```

becomes

```
<ObojoboDraft.Chunks.Text>
	<textGroup>
		<t>Hello world</t>
	</textGroup>
</ObojoboDraft.Chunks.Text>
```

### `<h1>`, `<h2>`: Heading

```
<h1>Main heading</h1>
```

becomes

```
<ObojoboDraft.Chunks.Heading headingLevel="1">
	<textGroup>
		<t>Main Heading</t>
	</textGroup>
</ObojoboDraft.Chunks.Heading>
```

h1 and h2 elements result in headingLevel values of 1 and 2 respectively.

### `<ol>`, `<ul>`: List

```
<ol>
	<li>First item</li>
	<li indent="2">Second item</li>
</ol>
```

becomes

```
<ObojoboDraft.Chunks.List type="ordered">
	<textGroup>
		<t>First item</t>
		<t indent="2">Second item</t>
	</textGroup>
</ObojoboDraft.Chunks.Heading>
```

Note that unlike HTML nested lists are not supported.


### `<pre>`: Code

```
<pre>function F(x) {
	return x + G(x);
}</pre>
```

becomes

```
<ObojoboDraft.Chunks.Code>
	<textGroup>
		<t>function F(x) {</t>
		<t indent="1">return x + G(x);</t>
		<t>}</pre></t>
	</textGroup>
</ObojoboDraft.Chunks.Code>
```

### `<hr>`: Break

```
<hr />
```

becomes

```
<ObojoboDraft.Chunks.Break />
```

### `<table>`: Table

An ObojoboDraft.Chunks.Table expects an un-nested textGroup of items equal to the number of rows times the number of columns. This HTML-like `<table>` syntax provides a more friendly way to construct a table.

```
<table>
	<tr>
		<th>Heading 1</th>
		<th>Heading 2</th>
	</tr>
	<tr>
		<td>One</td>
		<td>Two</td>
	</tr>
</table>
```

becomes

```
<ObojoboDraft.Chunks.Table numRows="2" numCols="2" header="true">
	<textGroup>
		<t>Heading 1</t>
		<t>Heading 2</t>
		<t>One</t>
		<t>Two</t>
	</textGroup>
</ObojoboDraft.Chunks.Table>
```

### `<figure>`: Figure/image with caption

Figure syntax allows you to quickly create a figure with a caption. Both `<img>` and `<figcaption>` tags must be included. This XML

```
<figure>
	<img src="http://lorempixel.com/640/480/city" size="small" />
	<figcaption>This is a small image</figcaption>
</figure>
```

becomes

```
{
	"id": null,
	"type": "ObojoboDraft.Chunks.Figure",
	"content": {
		"url": "http://lorempixel.com/640/480/city",
		"size": "small",
		"alt": "A city",
		"textGroup": [
			{
				"text": {
					"value": "This is a small image",
					"styleList": []
				},
				"data": {}
			}
		]
	},
	"children": []
}
```

Tag order is ingnored - captions are always displayed below an image.

### `<img>`: Figure/image without caption

If you don't want to specify a caption you can simply use an `<img>` tag:

```
<img src="http://lorempixel.com/640/480/city" size="small" />
```

becomes

```
{
	"id": null,
	"type": "ObojoboDraft.Chunks.Figure",
	"content": {
		"url": "http://lorempixel.com/640/480/city",
		"size": "small",
		"alt": "A city"
	},
	"children": []
}
```

In both examples above the `<img>` tag may contain a `size` attribute or a `width`, `height` or both `width` and `height` attributes. If `size` is omitted then the size will be set to `custom`. For example:

```
<img src="http://lorempixel.com/640/480/city" width="500" />
```

becomes

```
{
	"id": null,
	"type": "ObojoboDraft.Chunks.Figure",
	"content": {
		"url": "http://lorempixel.com/640/480/city",
		"size": "custom",
		"alt": "A city",
		"width": 500
	},
	"children": []
}
```

The complete example document at the end of this readme contains several sizing examples for images.

## Examples

### Minimal document

```
<ObojoboDraftDoc>
	<ObojoboDraft.Modules.Module>
		<ObojoboDraft.Sections.Content>
			<ObojoboDraft.Pages.Page>
				<textGroup>
					<t>Hello, world!</t>
				</textGroup>
			</ObojoboDraft.Pages.Page>
		</ObojoboDraft.Sections.Content>
	</ObojoboDraft.Modules.Module>
</ObojoboDraftDoc>
```

With namespace-less tags and HTML shorthand:

```
<ObojoboDraftDoc>
	<Module>
		<Content>
			<Page>
				<p>Hello, world!</p>
			</Page>
		</Content>
	</Module>
</ObojoboDraftDoc>
```

Both examples above produce the following JSON:

```
{
	"id": null,
	"content": {},
	"type": "ObojoboDraft.Modules.Module",
	"children": [
		{
			"id": null,
			"content": {},
			"type": "ObojoboDraft.Sections.Content",
			"children": [
				{
					"id": null,
					"content": {},
					"type": "ObojoboDraft.Pages.Page",
					"children": [
						{
							"id": null,
							"content": {
								"textGroup": [
									{
										"text": {
											"value": "Hello, World",
											"styleList": []
										}
										"data": {}
									}
								]
							},
							"type": "ObojoboDraft.Chunks.Text",
							"children": []
						}
					]
				}
			]
		}
	]
}
```

### More examples

More examples are available in the examples directory.