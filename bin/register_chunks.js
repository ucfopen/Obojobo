#!/usr/bin/env node

var glob = require('glob');
var fs = require('fs');
var path = require('path')


let isDev = false;
process.argv.forEach(function (val, index, array) {
  if(val == '--dev') isDev = true;
});

let searchPaths = ["./node_modules/*/package.json"];

if(isDev)
{
  searchPaths.push("./devsrc/*/package.json");
}

let allChunks = new Map();

searchPaths.forEach((search) => {
  console.log(search)
  files = glob.sync(search)
  files.forEach((file) => {
    let content = fs.readFileSync(file)
    let json = JSON.parse(content)
    if(json.hasOwnProperty('obojobo-chunks')){
      console.log(path.dirname(file), 'has chunks');
      let prepend = path.dirname(file) + '/build/'
      json['obojobo-chunks'].forEach( chunk => {
        allChunks.set(chunk, prepend+chunk)
      })
    }
  })
})

console.log(allChunks.size + ' chunks found')
console.log(allChunks)
let object = {};
allChunks.forEach((val, key) => {
  object[key] = val;
})
fs.writeFileSync('./config/installed_chunks.json', JSON.stringify(object));

