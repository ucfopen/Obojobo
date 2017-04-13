#!/usr/bin/env node

var fs = require('fs');

var db = require('../db');
var oboPath = require('../obo-path')

const sampleKey = '00000000-0000-0000-0000-000000000000';
const sampleDoc = oboPath.expandDraftPath('test-object.json');

db.query('SELECT * FROM drafts where id = $1', [sampleKey])
.then( result => {
  if(result.length != 1){
    console.log('ADDING DRAFT')
    return db.query('INSERT INTO drafts (id, user_id) VALUES($1, 0)', [sampleKey])
  }
  return 0
})
.then( (result) => {
  console.log(`Seeding sample draft content from ${sampleDoc}`)
  console.log(`Sample draft id is: ${sampleKey}`)
  let content = fs.readFileSync(sampleDoc)
  let json = JSON.parse(content)
  return db.query('INSERT INTO drafts_content (draft_id, content) VALUES($1, $2)', [sampleKey, json])
})
.then( x => {
  process.exit();
})
.catch( error => {
  console.log('error', error)
  process.exit(-1);
})
