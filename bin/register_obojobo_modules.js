#!/usr/bin/env node

var glob = require('glob');
var fs = require('fs');
var path = require('path')


let isDev = false;
process.argv.forEach(function (val, index, array) {
  if(val == '--dev') isDev = true;
});

// let searchPaths = ["./node_modules/*/obojobo.json"];
let searchPaths = [];

if(isDev)
{
  searchPaths.push("./devsrc/*/obojobo.json");
}

let allModules = new Map();
let allApps = new Set();

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
          module[i] = path.resolve(libDir, module[i])
          if(!fs.existsSync(module[i])){
            throw new Error(`Registered file "${path.basename(module[i])}" is missing for "${name}" in ${libDir}/obojobo.json`);
          }
        }
        // register
        allModules.set(name, module)
      })
    }

    if(json.hasOwnProperty('express')){
      let libDir = path.dirname(file)
      console.log(libDir, 'has Express Apps')
      json['express'].forEach( appFile => {
        let resolved = path.resolve(libDir, appFile)
        if(!fs.existsSync(resolved)){
          throw new Error(`Registered express app "${path.basename(resolved)}" is missing in ${libDir}/obojobo.json`);
        }
        // register
        allApps.add(resolved)
      })
    }
  })
})

// Store the modules to our config
console.log(allModules.size + ' modules found')
let moduleStorage = {
  expressApps: Array.from(allApps)
};

allModules.forEach((val, key) => {
  moduleStorage[key] = val;
})

fs.writeFileSync('./config/installed_modules.json', JSON.stringify(moduleStorage));
