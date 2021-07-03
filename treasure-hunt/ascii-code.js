/**
 * A script that takes a JSON file of clues and produces a treasure hunt out of it.
 * See one of the JSON files for example.
 *
 * You should also print ascii table for the hunter, as this is essentially ascii encoding of
 * the text with a simple arithmetic modifier.
 *
 * JSON file contains an array of objects that should contain:
 *    "spot" - instruction for the parent where to put the next clue.
 *    "clue" - clue for the treasure hunter
 *    "op" - operation. Currently supported: "none", -, +, /, *
 *    "key" - number that is used by the operation.
 */
const path = require('path')
const fs = require('fs')

function encode(text, op, modifier) {
  let codes = []
  for (index in text) {
    let code = text.charCodeAt(index)
    let ch = text[index]
    switch (op) {
      case '/':
        code = code * modifier
        break
      case '*':
        code = code / modifier
        break
      case '+':
        code = code - modifier
        break
      case '-':
        code = code + modifier
        break
    }
    codes.push(code)
  }

  return codes.reduce((v, c) => v + ', ' + c)
}

let input = process.argv[2]
let hunt = JSON.parse(fs.readFileSync(input))

console.log('Instructions for parent:')
console.log(`  - clue 0 is given to the hunter.`)
hunt.forEach((step, index) => {
  if (index == hunt.length - 1) {
    console.log(`  - final step is at: ${step.spot}`)
  } else {
    console.log(`  - clue ${index + 1} goes to: ${step.spot}`)
  }
})
console.log('\n\n-------------------------------\n')

console.log('Clues for the treasure hunter:\n')
hunt.forEach((step, index) => {
  console.log(`Clue ${index}`)
  let code = encode(step.clue, step.op, step.key)

  if (step.op != 'none') {
    console.log(`  - operation: ${step.op}`)
    console.log(`  - key: ${step.key}`)
  }
  console.log(`  - secret code: ${code}`)
  console.log('\n')
})
