'use strict'

/*
 * A random fetch.
 * `forEach` isn't async-aware. This results in the data being added in an unpredictable order, which depends on the
 * data from which URL has been successfully fetched first.
*/
urls.forEach(url => {
  fetchData(url).then(data => {
    addToPage(data)
  })
})

/*
 * A sequential fetch.
 * `Promise.resolve()` creates a `Promise` that resolves to whatever value you give it.
 * If you pass it an instance of `Promise` it'll simply return it. If you pass it something `Promise`-like (has a
 * `then()` method), it creates a genuine `Promise` that fulfills/rejects in the same way. If you pass in any other
 * value, it creates a `Promise` that fulfills with that value. If you call it with no value, it fulfills with
 * `undefined`.
 * There's also `Promise.reject()`, which rejects in the similar way
 */
let sequence = Promise.resolve()
urls.forEach(url => {
  sequence = sequence.then(() => {
    return fetchData(url)
  }).then(data => {
    addToPage(data)
  })
})

// The more elegant sequential fetch version.
urls.reduce((sequence, url) => {
  return equence.then(() => {
    return fetchData(url)
  }).then(data => {
    addToPage(data)
  })
}, Promise.resolve())

// The parallel fetch version, which won't break the order.
Promise.all(() => {
  urls.map(fetchData(url))
}).then(arrayOfData => {
  arrayOfData.forEach(data => {
    addToPage(data)
  })
})

/*
 * The parallel fetch and sequential rendering version.
 * From the UX perspective, it'd be better if we can fetch all data in parallel yet be able to render each portion of
 * data (in the right order) as song as them arrive.
 */
// `map()` fires up all fetches, since each fetch is a `Promise`, they become parallel and returned as an array of
// `Promise`s.
urls.map(fetchData(url))
  // We then `reduce()` the `Promise`s array and chain their rendering sequentially.
  .reduce((sequence, promiseOfFetch) => {
    return sequence.then(() => promiseOfFetch)
      .then((data) => { // After `promiseOfFetch` resolved.
        addToPage(data)
      })
  }, Promise.resolve())
