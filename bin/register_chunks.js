#!/usr/bin/env node

/**
 * Module dependencies.
 */

var glob = require('glob');
var fs = require('fs');
var path = require('path')

glob("./node_modules/*/package.json", {}, (er, files) => {
  let allChunks = [];
  files.forEach((file) => {
    let content = fs.readFileSync(file)
    let json = JSON.parse(content)
    if(json.hasOwnProperty('obojobo-chunks')){
      console.log(path.dirname(file), 'has chunks');
      let prepend = path.dirname(file) + '/build/'
      let chunkPaths = json['obojobo-chunks'].map((chunk) => {
        return prepend + chunk
      })
      allChunks = allChunks.concat(chunkPaths)
    }
  })
  console.log(allChunks.length + ' chunks found')
  console.log(allChunks)
  fs.writeFileSync('./config/installed_chunks.json', JSON.stringify(allChunks));
})
