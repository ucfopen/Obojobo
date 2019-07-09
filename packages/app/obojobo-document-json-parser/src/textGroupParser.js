const StyleableText = require('obojobo-document-engine/src/scripts/common/text/styleable-text')
const StyleableTextRenderer = require('obojobo-document-engine/src/scripts/common/text/styleable-text-renderer')

const textGroupParser = (textGroup) => {
    if (!textGroup) return ''

    // Parse textGroup
    let textGroupBodyXML = ''
    textGroup.forEach(group => {
        let dataXML = ''
        for (const d in group.data) {
            dataXML += ` ${d}="${group.data[d]}"`
        }

        // Parse text value
        const value = textParser(group.text)

        textGroupBodyXML += `<t${dataXML}>${value}</t>`
    })

    return (
        `<textGroup>` +
        textGroupBodyXML +
        `</textGroup>`
    )
}

const textParser = text => {
    const s = StyleableText.createFromObject(text)
    s.normalizeStyles()

    const mockElement = StyleableTextRenderer(s)

    return mockTextNodeParser(mockElement)
}

const mockTextNodeParser = mockTextNode => {
    if (mockTextNode.nodeType == 'text') {
        const text = (
            mockTextNode.text ?
            mockTextNode.text :
            ''
        )

        return mockElementParser(text, mockTextNode.parent)
    }

    let mockElementChildrenStr = ''
    if (mockTextNode.children) {
        mockTextNode.children.forEach(child => {
            mockElementChildrenStr += mockTextNodeParser(child)
        })
    }

    return mockElementChildrenStr
}

const mockElementParser = (text, mockElement) => {
    if (!mockElement) return text

    const type = mockElement.type
    let attrs = ''
    for (const attr in mockElement.attrs) {
        attrs += ` ${[attr]}="${mockElement.attrs[attr]}"`

        if ([attr] == "class" && mockElement.attrs[attr] == 'latex')
            return mockElementParser(`<latex>${text}</latex>`, mockElement.parent)
    }

    text = (
        type != 'span' ?
        `<${type}${attrs}>${text}</${type}>` :
        text
    )

    return mockElementParser(text, mockElement.parent)
}

module.exports = textGroupParser