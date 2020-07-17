const fs = require('fs')
const path = require('path')

const fileData = fs.readFileSync(path.resolve(__dirname, './.eslintrc'))
const jsonData = JSON.parse(fileData)

module.exports = jsonData
