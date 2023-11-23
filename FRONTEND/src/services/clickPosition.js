// Some resources got from: https://www.kirupa.com/html5/getting_mouse_click_position.htm

let fireCounter = 1
var dict = []
function getClickPosition(e, type) {
  if (fireCounter === 11) fireCounter = 1
  var name =
    type === "home"
      ? "fire" + fireCounter.toString()
      : "fired" + fireCounter.toString()
  var fireIcon = document.getElementById(name)
  var parent = getPosition(e.currentTarget)
  var x = e.clientX - parent.x - fireIcon.clientWidth / 2
  var y = e.clientY - parent.y - fireIcon.clientHeight / 2

  //console.log(x, y)

  fireIcon.style.left = x + "px"
  fireIcon.style.top = y + "px"
  fireIcon.style.visibility = "visible"

  if (dict.length < 10) {
    dict.push({
      name: name.replace("d", ""),
      left: fireIcon.style.left,
      top: fireIcon.style.top,
    })
  } else {
    dict[fireCounter - 1] = {
      name: name.replace("d", ""),
      left: fireIcon.style.left,
      top: fireIcon.style.top,
    }
  }

  fireCounter += 1
  //console.log(dict)

  const returnedObject = {
    name: name.replace("d", ""),
    left: x,
    top: y,
  }

  return returnedObject
}

function getPosition(element) {
  var x = 0
  var y = 0

  while (element) {
    if (element.tagName === "BODY") {
      // deal with browser quirks with body/window/document and page scroll
      var xScroll = element.scrollLeft || document.documentElement.scrollLeft
      var yScroll = element.scrollTop || document.documentElement.scrollTop

      x += element.offsetLeft - xScroll + element.clientLeft
      y += element.offsetTop - yScroll + element.clientTop
    } else {
      // for all other non-BODY elements
      x += element.offsetLeft - element.scrollLeft + element.clientLeft
      y += element.offsetTop - element.scrollTop + element.clientTop
    }

    element = element.offsetParent
  }
  return {
    x: x,
    y: y,
  }
}

const exportedObject = {
  getClickPosition,
}

export default exportedObject
