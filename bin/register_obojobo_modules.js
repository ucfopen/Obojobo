#!/usr/bin/env node

var glob = require('glob');
var fs = require('fs');
var path = require('path')


let isDev = false;
process.argv.forEach(function (val, index, array) {
  if(val == '--dev') isDev = true;
});

let searchPaths = ["./node_modules/*/obojobo.json"];

if(isDev)
{
  searchPaths.push("./devsrc/*/obojobo.json");
}

let allModules = new Map();

searchPaths.forEach((search) => {
  console.log(search)
  files = glob.sync(search)
  files.forEach((file) => {
    let content = fs.readFileSync(file)
    let json = JSON.parse(content)
    if(json.hasOwnProperty('modules')){
      let libDir = path.dirname(file)
      console.log(libDir, 'has modules');

      json['modules'].forEach( module => {

        let name = module.name
        delete module.name

        // verify the files exist
        for(let i in module){
          module[i] = `${libDir}/${module[i]}`
          if(!fs.existsSync(module[i])){
            throw new Error(`Registered file "${path.basename(module[i])}" is missing for "${name}" in ${libDir}/obojobo.json`);
          }
        }
        // register
        allModules.set(name, module)
      })
    }
  })
})

// Store the modules to our config
console.log(allModules.size + ' modules found')
let moduleStorage = {};
allModules.forEach((val, key) => {
  moduleStorage[key] = val;
})

fs.writeFileSync('./config/installed_modules.json', JSON.stringify(moduleStorage));
