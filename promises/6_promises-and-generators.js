'use strict'

// @see `5_parallelism-and-sequencing.js` - The parallel fetch and sequential rendering version.
// However, here we re-factor it utilising a generator.
function spawn (getPromiseGenerator) {
  // Initialise the given promiseGenerator.
  const promiseGenerator = getPromiseGenerator()
  /*
   * Create new functions which derive from `continuer()`.
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Function/bind.
   * It's like the `Adaptor` pattern. A call to `onFulfilled(result)` acts the same as a call to
   * `continuer('next', result)`; and `onRejected(error)` acts the same as `continuer('throw', error)`.
   */
  const onFulfilled = continuer.bind(continuer, 'next')
  const onRejected = continuer.bind(continuer, 'throw')

  function continuer (verb, arg) {
    let result

    try {
      /*
       * The below syntax is the equivalent to `promiseGenerator.next(arg)` when `verb === 'next'`; and
       * `promiseGenerator.throw(arg)` when `verb === 'throw'`.
       * The `Generator.next()` mechanism will then return `arg` as the result of the previous `yield`.
       */
      result = promiseGenerator[verb](arg)
    } catch (err) {
      return Promise.reject(err)
    }

    if (result.done) {
      return result.value
    } else {
      return Promise.resolve(result.value)
        .then(onFulfilled, onRejected)
    }
  }

  return onFulfilled()
}

/*
 * Scenario #1 - When nothing goes wrong:
 * 1. `onFulfilled()` called at the end of `spawn()`.
 * 2. It's the equivalent as calling `continuer('next', undefined)`.
 * 3. Inside `continuer()`, it reaches `result = promiseGenerator['next'](undefined)`.
 * 3.1. Inside the below anonymous generator, it reaches the first (but only on the right hand side of the equation)
 *      `const data = yield promiseOfFetch`.
 * 3.2. Inside `continuer()`, `result` becomes something like `{ done: false, value: promiseOfFetch }`.
 * 4. Inside `continuer()`, `promiseOfFetch` will be chained with further `continuer()`s by `Promise.resolve().then()`.
 * 5. After the first `promiseOfFetch` has been resolved, `onFulfilled(result)` will be called.
 * 6. Similar to #2, it's the equivalent as calling `continuer('next', result)`.
 * 7. Similar to #3, it reaches `result = promiseGenerator['next'](result)`.
 * 7.1. This time, the anonymous generator resumes back to the left hand side of #3.1.
 * 7.2. Then the generator proceeds to `addToPage(data)`.
 * 7.3. Then the generator yields a new promise as requested in #7.
 * 8. The code repeats #3-#7 till the last #7.2 - `addToPage(data)`.
 * 9. With no more promise to yield, the last `Generator.next()` returns something like
 *    `{ done: done, value: undefined }`.
 * 10. `spawn()` finally returns `result.value`, which should be `undefined`.
 *
 * Scenario #2 - When something goes wrong (the below steps all happen inside `onRejected()`/`continuer()`):
 * 1. Rejected `promiseOfFetch` causes a call similar to `promiseGenerator['throw'](error)`.
 * 2. The thrown `error` will be caught inside `try...catch`.
 * 3. `continuer()` then returns a promise which only contains a rejection.
 * 4. And `spawn()` finally forwards/returns the same promise.
 */
spawn(
  function * () {
    const promisesOfFetch = urls.map(fetchData)
    for (const promiseOfFetch of promisesOfFetch) {
      const data = yield promiseOfFetch
      addToPage(data)
    }
  },
)
