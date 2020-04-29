import { parse } from "./parse.js"

export default class Vue {
  constructor({ el, data }) {
    this.el = document.querySelector(el)
    this.data = data
    this.ast = parse(this.el.outerHTML)
    console.log("Vue -> constructor -> this.ast", this.ast)
  }

}