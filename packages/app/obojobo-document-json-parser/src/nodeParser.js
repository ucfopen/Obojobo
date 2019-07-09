const actionButtonNodeParser = require('./actionButtonNodeParser/actionButtonNodeParser')
const assessmentNodeParser = require('./assessmentNodeParser/assessmentNodeParser')
const breakNodeParser = require('./breakNodeParser/breakNodeParser')
const codeNodeParser = require('./codeNodeParser/codeNodeParser')
const contentNodeParser = require('./contentNodeParser/contentNodeParser')
const figureNodeParser = require('./figureNodeParser/figureNodeParser')
const headingNodeParser = require('./headingNodeParser/headingNodeParser')
const htmlNodeParser = require('./htmlNodeParser/htmlNodeParser')
const iFrameNodeParser = require('./iFrameNodeParser/iFrameNodeParser')
const listNodeParser = require('./listNodeParser/listNodeParser')
const mathEquationNodeParser = require('./mathEquationNodeParser/mathEquationNodeParser')
const mcAnswerNodeParser = require('./mcAnswerNodeParser/mcAnswerNodeParser')
const mcAssessmentNodeParser = require('./mcAssessmentNodeParser/mcAssessmentNodeParser')
const mcChoiceNodeParser = require('./mcChoiceNodeParser/mcChoiceNodeParser')
const mcFeedbackNodeParser = require('./mcFeedbackNodeParser/mcFeedbackNodeparser')
const moduleNodeParser = require('./moduleNodeParser/moduleNodeParser')
const pageNodeParser = require('./pageNodeParser/pageNodeParser')
const questionBankNodeParser = require('./questionBankNodeParser/questionBankNodeParser')
const questionNodeParser = require('./questionNodeParser/questionNodeParser')
const tableNodeParser = require('./tableNodeParser/tableNodeParser')
const textNodeParser = require('./textNodeParser/textNodeParser')
const youTubeNodeParser = require('./youTubeNodeParser/youTubeNodeParser')


const parsers = {
    "ObojoboDraft.Chunks.ActionButton": actionButtonNodeParser,
    "ObojoboDraft.Sections.Assessment": assessmentNodeParser,
    "ObojoboDraft.Chunks.Break": breakNodeParser,
    "ObojoboDraft.Chunks.Code": codeNodeParser,
    "ObojoboDraft.Sections.Content": contentNodeParser,
    "ObojoboDraft.Chunks.Figure": figureNodeParser,
    "ObojoboDraft.Chunks.Heading": headingNodeParser,
    "ObojoboDraft.Chunks.HTML": htmlNodeParser,
    "ObojoboDraft.Chunks.IFrame": iFrameNodeParser,
    "ObojoboDraft.Chunks.List": listNodeParser,
    "ObojoboDraft.Chunks.MathEquation": mathEquationNodeParser,
    "ObojoboDraft.Chunks.MCAssessment.MCAnswer": mcAnswerNodeParser,
    "ObojoboDraft.Chunks.MCAssessment": mcAssessmentNodeParser,
    "ObojoboDraft.Chunks.MCAssessment.MCChoice": mcChoiceNodeParser,
    "ObojoboDraft.Chunks.MCAssessment.MCFeedback": mcFeedbackNodeParser,
    "ObojoboDraft.Modules.Module": moduleNodeParser,
    "ObojoboDraft.Pages.Page": pageNodeParser,
    "ObojoboDraft.Chunks.QuestionBank": questionBankNodeParser,
    "ObojoboDraft.Chunks.Question": questionNodeParser,
    "ObojoboDraft.Chunks.Table": tableNodeParser,
    "ObojoboDraft.Chunks.Text": textNodeParser,
    "ObojoboDraft.Chunks.YouTube": youTubeNodeParser
}

const childrenParser = (children) => {
    if (!children || !Array.isArray(children)) {
        return ''
    }

    let result = '';
    children.forEach(child => {
        const parser = parsers[child.type];
        if (parser != undefined) {
            const id = (child.id) ?
                ` id="${child.id}"` :
                ''
            result += parser(child, id, childrenParser)
        }
    })

    return result
}

const nodeParser = node => {
    if (!node) return ''

    const parser = parsers[node.type];
    let result = ''

    if (parser != undefined) {
        const id = (node.id) ?
            ` id="${node.id}"` :
            ''
        result += parser(node, id, childrenParser)
    }

    return result
}


module.exports = nodeParser