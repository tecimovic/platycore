/**
 * A script that takes a JSON file of clues and produces a treasure hunt out of it.
 * See one of the JSON files for example.
 *
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

if (!input) {
  console.log(`Usage: node treasure-hunt.js <JSON FILE>

JSON file should contain an array of "step" objects, each step object
needs to contain following data:
  "spot" - instruction for the parent where to put the next clue.
  "clue" - clue for the treasure hunter
  "op" - operation. Currently supported: "none", -, +, /, *
  "key" - number that is used by the operation.

See JSON files along with it for examples.

This program will print out the instructions for the parent where
to put the clues and the clues themselves. You should probably
copy these into google doc or something and decorate them a bit...

You should also print ascii table for the hunter, as this is essentially
an ASCII encoding of the text with a simple arithmetic modifier.

The goal is:
  - hunter learns what ASCII codes are
  - hunter does decent amount of math to get to the goal
  - hunter is hopefully not frustrated to the point of crying.... :)
`)
  process.exit(0)
}

let hunt = JSON.parse(fs.readFileSync(input))

console.log('Instructions for parent:')

console.log(`  - clue 0 is given to the hunter along with ASCII table`)
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
