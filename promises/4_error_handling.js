'use strict'

let timeoutCount = 1

function generatePromise () {
  return new Promise((resolve) => {
    resolve('The `Promise` worked.')
  })
}

const onfulfilled = (result) => {
  console.log(result)

  return new Promise((resolve, reject) => {
    reject(Error('`someOtherOperation` broke!'))
  })
}
const onrejected = (result) => console.log(`${result.name}: ${result.message}`)

/**
 * The `.catch()` sugar layer.
 *
 * The below code is the equivalent of
 * ```
 * myPromise.then(onfulfilled).then(undefined, onrejected)
 * ```
 * but not
 * ```
 * myPromise.then(onfulfilled, onrejected)
 * ```
 * The former catches rejections in `onfulfilled`; and the latter doesn't.
 */
generatePromise().then(onfulfilled)
  .catch(onrejected)

setTimeout(() => {
  console.log()
  // This form causes a `UnhandledPromiseRejectionWarning` and `onrejected` won't be called.
  generatePromise().then(onfulfilled, onrejected)
}, timeoutCount++ * 1000)

function doSomething (name) {
  throw new Error(`${name} is not right.`)
}

function generatePromiseWithImplicitRejection () {
  return new Promise(resolve => {
    const result = doSomething('Promise constructor')

    resolve(result)
  })
}

// Implicit rejection in `Promise` constructor.
setTimeout(() => {
  console.log()
  // The `Error` in the `Promise` constructor will cause an implicit rejection, and it'll be properly handled by
  // `onrejected`.
  generatePromiseWithImplicitRejection().then(onfulfilled, onrejected)
}, timeoutCount++ * 1000)

// Implicit rejection in `onfulfilled` callback.
setTimeout(() => {
  console.log()
  const onfulfilledWithImplicitRejection = result => {
    const myResult = doSomething('`onfulfilled`')

    // Go on if nothing went wrong.
  }

  // The `Error` in `onfulfilledWithImplicitRejection` will cause an implicit rejection, and it'll be properly handled
  // by `onrejected`.
  generatePromise().then(onfulfilledWithImplicitRejection)
    .catch(onrejected)
}, timeoutCount++ * 1000)

// Implicit rejection in `onrejected` callback.
setTimeout(() => {
  console.log()
  const onrejectedWithImplicitRejection = result => {
    const myResult = doSomething('`onrejected`')

    // Go on if nothing went wrong.
  }

  // The `Error` in `onrejectedWithImplicitRejection` will cause an implicit rejection, and it'll be properly handled
  // by `onrejected`.
  generatePromiseWithImplicitRejection().then(onfulfilled, onrejectedWithImplicitRejection)
    .catch(onrejected)
}, timeoutCount++ * 1000)

/**
 * Chaining with error handling.
 * Note: If to return/re-thrown anything or not; if to return a `Promise` or a value, etc., are totally optional to
 * `.then()` and `.catch()`.
*/
// asyncThing1().then(function() {
//   return asyncThing2();
// }).then(function() {
//   doSomething();
// }).then(function() {
//   return asyncThing3();
// }).then(function() {
//   return 123;
// }).then(function(result) {
//   doSomeOtherThing(result);
// }).catch(function(err) {
//   return asyncRecovery1();
// }).then(function() {
//   return asyncThing4();
// }, function(err) {
//   return asyncRecovery2();
// }).catch(function(err) {
//   console.log("Don't worry about it");
// }).then(function() {
//   console.log("All done!");
// })
