'use strict'

// An `async` function always returns a `Promise`. Other values are wrapped in a resolved `Promise` automatically.
async function asyncFunction () {
  // Underlyingly, the below line is the same as `return Promise.resolve(1)`.
  return 1
}

asyncFunction().then(console.log) // 1.

// `await` cannot be used in the top level.
// await asyncFunction() // SyntaxError: await is only valid in async function.

/*
 * `await` is compatible with thenable objects - objects which have the same `.then()` as of a `Promise` -.
 * If `await` gets a non-`Promise` object which has `.then()`, it calls that method with the built-in functions
 * `resolve` and `reject` as arguments (just as it does for a regular `Promise` object). `await` then waits until one
 * of the functions is called then proceeds with the result.
 */
class Thenable {
  constructor (number) {
    this._number = number
  }

  then (resolve, reject) {
    setTimeout(() => resolve(this._number * 2), 1000)
  }
}

async function awaitThenable () {
  const result = await new Thenable(1)

  console.log(result)
}

awaitThenable() // 2.

// Error handling.
async function autoRejectWithError () {
  // The below line is the same as `throw new Error('Please catch me with `Promise.catch().')`.
  await Promise.reject(new Error('Please catch me with `Promise.catch().'))
}

autoRejectWithError().catch(
  error => console.log(`${error.name}: ${error.message}`), // Error: Please catch me with `Promise.catch().
)

// `await Promise.all()`.
async function awaitPromiseAll () {
  await Promise.all([
    new Promise(resolve => setTimeout(() => resolve('Promise one resolved.'), 3000)),
    new Promise(resolve => setTimeout(() => resolve('Promise two resolved.'), 2000)),
    // ...
  ])
}

awaitPromiseAll().then(() => console.log('All `Promise`s have been resolved after 3 seconds.'))

// `await` snippet #1 - Pause execution in an `async` function.
async function pauseExecution () {
  console.log('You\'ll see this message immediately.')

  await new Promise(resolve => setTimeout(resolve, 2000))

  console.log('You\'ll see this message after 2 seconds.')
}

pauseExecution()
