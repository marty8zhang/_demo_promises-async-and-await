'use strict'

function httpGet (url) {
  return new Promise(function (resolve, reject) {
    const request = new XMLHttpRequest()

    request.open('GET', url)
    request.responseType = 'blob'

    request.onload = function () {
      // `onload()` is called even on 404 errors etc, so check the status.
      if (request.status === 200) {
        // Resolve the `Promise` with the response text.
        resolve(request.response)
      } else {
        // Otherwise reject with the status text.
        reject(Error(request.statusText))
      }
    }

    // Handle network errors.
    request.onerror = function () {
      reject(Error('Network Error'))
    }

    request.send()
  })
}

const imageBlobHandler = (imageBlob) => {
  const divMain = document.getElementById('main')
  const image = document.createElement('img')

  const blob = new Blob([imageBlob], { type: 'image/jpeg' })
  const fileReader = new FileReader()

  fileReader.onload = () => {
    image.src = fileReader.result.toString()
  }

  fileReader.readAsDataURL(blob)

  console.log('Attaching image...')
  divMain.appendChild(image)
}

const errorHandler = (result) => console.log(result)

// Note: The results won't always be shown in the same order as the requests, which is the characteristic
// while working with promises.
// `Attaching image...`. An image should be displayed on the webpage too.
httpGet('https://i.picsum.photos/id/689/200/200.jpg').then(imageBlobHandler, errorHandler)

// `Error: "Not Found"`.
httpGet('https://i.picsum.photos/no-existing-image.jpg').then(imageBlobHandler, errorHandler)

// `Error: "Network Error"`. It should be caused by "Cross-Origin Request Blocked".
httpGet('https://www.example.com').then(imageBlobHandler, errorHandler)
