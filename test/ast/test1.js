const fs = require('fs')
const esprima = require('esprima')

const uri="../source/base.js"

var code=fs.readFileSync(uri).toString()
var ast = esprima.parse(code);

console.log(ast)