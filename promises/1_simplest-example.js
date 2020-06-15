'use strict'

/*
 * Initialise a `Promise`.
 * `resolve` and `reject` are acting like wrapper methods, which resolve/reject (wrap) the given result (provided as
 * their only parameter) to a predefined interface.
 */
const myPromise = new Promise((resolve, reject) => {
  const someOperationOutcome = Math.random()

  if (someOperationOutcome >= 0.5) {
    resolve('`myPromise` worked.')
  } else {
    reject(Error('`myPromise` broke!'))
  }
})

const optionalOnfulfilled = (result) => console.log(result)
const optionalOnrejected = (result) => console.log(`${result.name}: ${result.message}`)

// Use the `Promise`.
myPromise.then(optionalOnfulfilled, optionalOnrejected)

console.log('`myPromise` has not started execution yet.')
