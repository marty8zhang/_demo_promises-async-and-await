'use strict'

/*
 * Initialise a `Promise`.
 * `resolve` and `reject` are acting like wrapper methods, which resolve/reject (wrap) the given result (provided as
 * their only parameter) to a predefined interface.
 */
const myPromise = new Promise(function (resolve, reject) {
  // Some operation.
  const operationOutcome = Math.random()

  if (operationOutcome >= 0.5) {
    resolve('`myPromise` worked!')
  } else {
    reject(Error('`myPromise` broke!'))
  }
})

const optionalSuccessCallback = (result) => console.log(result)
const optionalFailureCallback = (result) => console.log(result)

// Use the `Promise`.
myPromise.then(optionalSuccessCallback, optionalFailureCallback)

console.log('`myPromise` has not started execution yet.')
