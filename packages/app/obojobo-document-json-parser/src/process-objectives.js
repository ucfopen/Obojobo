
const objectiveParser = objectives => {
    if(!objectives) return ''
    let objectivesBodyXML = ''
    objectives.forEach(objective =>{
        if(objective.objectiveId === null || objective.objectiveId === 'undefined') return
        if(objective.objectiveLabel === null && objective.description === null){
            objectivesBodyXML += `<objective id = "${objective.objectiveId}"/>`
        }else{
            objectivesBodyXML += `<objective id = "${objective.objectiveId}" label = "${objective.objectiveLabel}">${objective.description}</objective>`
        }
    })
    const objectivesXML = objectivesBodyXML !== '' ? `<objectives>`+ objectivesBodyXML + `</objectives>`: ''
    return objectivesXML

}
module.exports = objectiveParser