#!/usr/bin/env node
/*
Parse Obojobo json files and embed images into them for uploading
EX: embedFigureBinary.js ../chen-obojobo-modules/*.json
You can pass it a single file, several files, or a wild card that your shell expands into multiple files
The script will look in the directory and any child directories that the .json file is in for images with the same filename
The script will write out the the same file name with .embedded.json added to the end

*/
const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

function traverse(o, func) {
	for (let i in o) {
		func.apply(this, [i, o[i], o]);
		if (o[i] !== null && typeof (o[i]) === "object" ) {
			//going one step down in the object tree!!
			traverse(o[i], func);
		}
	}
}

const embedBinaryDataIntoFigures = (draftJson, searchInDir, fileName) => {
	traverse(draftJson, (key, val, obj) => {
		if(key === 'type' && val ==='ObojoboDraft.Chunks.Figure'){
			if(obj.content.filename){
				const output = execSync(`find . -name "${obj.content.filename}"`, {cwd: searchInDir})
				const filePath = output.toString().split(/\r?\n/)[0]
				if(!filePath){
					console.error(`Error: unable to find file '${obj.content.filename}' used in chunk: '${obj.id}' in ${path.basename(fileName)}`)
					if(obj?.content?.url?.startsWith('http')) console.error(` ^ though this figure uses a url ${obj.content.url}`)
					return
				}
				const combinedPath = searchInDir + filePath.substring(1)
				const imageBinary = fs.readFileSync(combinedPath, {encoding: 'base64'});
				obj.content.imageBinary = imageBinary
			} else if (obj?.content?.url?.startsWith('http') ){
				// @TODO: maybe we should download the file and embed it?
			}
		}
	})
	return draftJson
}


const args = process.argv.slice(2);

args.forEach((filePath) => {
	const rawJSON = fs.readFileSync(filePath)
	const data = JSON.parse(rawJSON)
	const searchInDir = path.dirname(filePath);
	const updatedJSON = embedBinaryDataIntoFigures(data, searchInDir, filePath)
	fs.writeFileSync(filePath+'.embedded.json', JSON.stringify(updatedJSON, null, 4))
})

