'use strict'

const resultLogger = result => console.log(result)

// Transform values.
// Example 1: Transforming the result.
const promiseValueTransforming = new Promise(resolve => resolve(1))

// 3.
promiseValueTransforming.then(result => result + 2)
  .then(resultLogger)

// Example 2: Transforming the result with a pre-defined function.
const promiseJsonParsing = new Promise(resolve => resolve('{"name":"John"}'))

// Note: The first `.then()` call is a shorthand version of `.then(result => JSON.parse(result))`.
// { name: 'John' }.
promiseJsonParsing.then(JSON.parse)
  .then(resultLogger)

// Queue asynchronous operations.
const promiseDummyOne = new Promise(resolve => {
  // Do something async.

  resolve('Result: 1')
})

// Each `.then()` returns a `Promise`. The next `.then()` will only be called when the previous `Promise` has been
// fulfilled.
promiseDummyOne.then(result => {
  // noinspection UnnecessaryLocalVariableJS
  const promiseDummyTwo = new Promise(resolve => {
    // Do some other things async (which usually will use the result from the previous `Promise`).

    resolve(result + '; Result: 2')
  })

  return promiseDummyTwo
})
  .then(result => {
    // noinspection UnnecessaryLocalVariableJS
    const promiseDummyThree = new Promise(resolve => {
      // Do even more things async (which usually will use the result from the previous `Promise`).

      resolve(result + '; Result: 3')
    })

    return promiseDummyThree
  })
  .then(result => console.log(result)) // Result: 1; Result: 2; Result: 3.
