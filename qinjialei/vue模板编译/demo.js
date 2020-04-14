const ncname = '[a-zA-Z_][\\w\\-\\.]*'
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
const startTagOpen = new RegExp(`^<${qnameCapture}`)
const startTagClose = /^\s*(\/?)>/
let html = `<div :id="3"></div>`
let index = 0
const start = html.match(startTagOpen)

const match = {
  tagName: start[1],
  attrs: [],
  start: 0
}

html = html.substring(start[0].length)
index += start[0].length
let end, attr
while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
  html = html.substring(attr[0].length)
  index += attr[0].length
  match.attrs.push(attr)
}
if (end) {
  match.unarySlash = end[1]
  html = html.substring(end[0].length)
  index += end[0].length
  match.end = index
}
console.log(match)