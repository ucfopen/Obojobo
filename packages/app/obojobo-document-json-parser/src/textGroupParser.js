const textGroupParser = (textGroup, tabs) => {
    // Parser textGroup
    let textGroupBodyXML = ''
    textGroup.forEach(group => {
        let dataXML = ''
        for(const d in group.data){
            dataXML += ` ${d}="${group.data[d]}"`
        }

        // Parser string value with styleList
        const value = textParser(group.text.value, group.text.styleList)

        textGroupBodyXML += `${tabs+'\t'}<t${dataXML}>${value}</t>\n`
    })

    return (
        `${tabs}<textGroup>\n` +
            textGroupBodyXML +
        `${tabs}</textGroup>\n`
    )
}

const mapStyleTypeToTag = {
    "a": "a",
    "b": "b",
    "i": "i",
    "monospace": "code",
    "del": "del",
    "q": "q",
    "_latex": "latex",
    "sup": "sup"
}

const textParser = (text, styleList) => {
    const len = text.length
    let arr = []
    for(let i = 0; i <= len; i++){
        arr.push(0)
    }

    styleList.forEach(style => {
        let start = style.start
        let end = style.end
        const element = mapStyleTypeToTag[style.type]

        // Invalid
        if(start < 0 || start > len || end < 0 || end > len) return


        // Get beginning tag
        let tag = `<${element}>`
        if(element === 'a'){
            let attrs = ''
            for(const attr in style.data){
                attrs += ` ${[attr]}="${style.data[attr]}"`
            }
            tag = `<${element}${attrs}>`
        } else if(element === 'sup'){
            tag = ''
            if(style.data >= 0){
                for(let j = 0; j < style.data; j++){
                    tag += '<sup>'
                }
            } else {
                for(let j = 0; j > style.data; j--){
                    tag += '<sub>'
                }
            }
        }

        text = text.slice(0, start + arr[start]) + tag + text.slice(start + arr[start])
        for(let i = start+1; i <= len; i++){
            arr[i] += tag.length
        }

        // Get ending tag
        tag = `</${element}>`
        if(element === 'sup'){
            tag = ''
            if(style.data >= 0){
                for(let j = 0; j < style.data; j++){
                    tag += '</sup>'
                }
            } else {
                for(let j = 0; j > style.data; j--){
                    tag += '</sub>'
                }
            }
        }
        // Merge ending tag into string
        text = text.slice(0, end + arr[end]) + tag + text.slice(end + arr[end])
        for(let i = end; i <= len; i++){
            arr[i] += tag.length
        }
    })

    return text
}

module.exports = textGroupParser