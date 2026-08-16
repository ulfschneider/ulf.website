function debounce(func, wait = 100, immediate = false) {
  let timeout

  return function (...args) {
    const context = this

    return new Promise((resolve, reject) => {
      const later = async () => {
        timeout = null

        if (!immediate) {
          try {
            resolve(await func.apply(context, args))
          } catch (error) {
            reject(error)
          }
        }
      }

      const callNow = immediate && !timeout

      clearTimeout(timeout)
      timeout = setTimeout(later, wait)

      if (callNow) {
        Promise.resolve()
          .then(() => func.apply(context, args))
          .then(resolve, reject)
      }
    })
  }
}

function throttle(func, wait = 100) {
  let timeout = null
  let lastArgs
  let lastThis
  let pending = []

  return function (...args) {
    lastArgs = args
    lastThis = this

    const promise = new Promise((resolve, reject) => {
      pending.push({ resolve, reject })
    })

    if (timeout) {
      return promise
    }

    execute()

    return promise
  }

  async function execute() {
    const args = lastArgs
    const context = lastThis
    const calls = pending

    lastArgs = null
    lastThis = null
    pending = []

    try {
      const result = await func.apply(context, args)

      calls.forEach(({ resolve }) => resolve(result))
    } catch (error) {
      calls.forEach(({ reject }) => reject(error))
    }

    timeout = setTimeout(() => {
      timeout = null

      if (lastArgs) {
        execute()
      }
    }, wait)
  }
}

//back to top
function maintainBackToTop() {
  let backToTop = document.querySelector("#back-to-top")
  if (backToTop) {
    let windowHeight = window.innerHeight
    let documentHeight = document.body.scrollHeight
    let scrollY = window.scrollY

    if (windowHeight * 1.5 < documentHeight && scrollY >= 0.5 * windowHeight) {
      backToTop.style.display = "flex"
    } else {
      backToTop.style.display = "none"
    }
  }
}

addEventListener("DOMContentLoaded", throttle(maintainBackToTop))
addEventListener("scroll", throttle(maintainBackToTop))
addEventListener("resize", throttle(maintainBackToTop))

//keyboard navigation

function registerKeyAction(key, callback) {
  registerKeyNav(key, "", callback)
}

function registerKeyNav(key, path, callback) {
  if (key && (path || callback)) {
    addEventListener("keydown", (event) => {
      let focus = document.querySelector(":focus")
      if (
        focus &&
        "INPUT" == focus.tagName &&
        "submit" != focus.type &&
        "button" != focus.type &&
        "image" != focus.type &&
        "reset" != focus.type &&
        "hidden" != focus.type
      ) {
        return
      } else if (focus && "TEXTAREA" == focus.tagName) {
        return
      }

      if (event.key == key) {
        if (
          !(event.altKey || event.ctrlKey || event.metaKey || event.shiftKey)
        ) {
          if (callback) {
            event.preventDefault()
            event.stopPropagation()
            if (callback(event) !== false) {
              return
            }
          }

          if (path) {
            if (path == location.pathname && path == site.nav.search.path) {
              return
            }
            event.preventDefault()
            event.stopPropagation()
            location.href = path
          }
        }
      }
    })
  }
}
