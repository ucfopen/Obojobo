import Common from 'obojobo-document-engine/src/scripts/common'

const { TextGroupAdapter } = Common.chunk.textChunk
const { TextGroup } = Common.textGroup

const Adapter = {

    construct(model, attrs) {

        model.setStateProp('font', 'sans', p => p.toLowerCase(),
            'serif',
            'sans',
            'monospace',
            'times-new-roman',
            'georgia',
            'helvetica',
            'courier',
            'palatino'
        )

        model.setStateProp('bodyStyle', 'filled-box', p => p.toLowerCase(),
            'none',
            'filled-box',
            'bordered-box',
            'card',
            'white-paper',
            'modern-paper',
            'light-yellow-paper',
            'dark-yellow-paper',
            'aged-paper',
            'modern-text-file',
            'retro-text-file',
            'command-line',
            'term-white',
            'term-green',
            'term-orange',
            'term-c64'
        )

        model.setStateProp('width', 'medium', p => p.toLowerCase(),
            'large',
            'medium',
            'small',
            'tiny'
        )

        model.setStateProp('fontSize', 'smaller', p => p.toLowerCase(),
            'smaller',
            'regular',
            'larger'
        )

        model.setStateProp('lineHeight', 'moderate', p => p.toLowerCase(),
            'compact',
            'moderate',
            'generous'
        )

        model.setStateProp('effect', false)

        if (attrs && attrs.content) {

            if (attrs.content.citation) {
                model.modelState.citation = TextGroup.fromDescriptor(attrs.content.citation, 1, {})
                // model.modelState.citation.isBlank = false;
            } else {
                model.modelState.citation = TextGroup.create(1, {})
            }

            if (attrs.content.font) {
                model.modelState.font = attrs.content.font
            }

            if (attrs.content.bodyStyle) {
                model.modelState.bodyStyle = attrs.content.bodyStyle
            }

            if (attrs.content.width) {
                model.modelState.width = attrs.content.width
            }

            if (attrs.content.fontSize) {
                model.modelState.fontSize = attrs.content.fontSize
            }

            if (attrs.content.lineHeight) {
                model.modelState.lineHeight = attrs.content.lineHeight
            }

            if (attrs.content.effect) {
                model.modelState.effect = attrs.content.effect
            }

        }

    },

    clone(model, clone) {
        TextGroupAdapter.clone(model, clone)
        clone.modelState.font = model.modelState.font
        clone.modelState.bodyStyle = model.modelState.bodyStyle
        clone.modelState.width = model.modelState.width
        clone.modelState.fontSize = model.modelState.fontSize
        clone.modelState.lineHeight = model.modelState.lineHeight
        clone.modelState.effect = model.modelState.effect
    },

    toJson(model, json) {
        TextGroupAdapter.toJSON(model, json)
        json.modelState.font = model.modelState.font
        json.modelState.bodyStyle = model.modelState.bodyStyle
        json.modelState.width = model.modelState.width
        json.modelState.fontSize = model.modelState.fontSize
        json.modelState.lineHeight = model.modelState.lineHeight
        json.modelState.effect = model.modelState.effect
    }

}

export default Adapter
