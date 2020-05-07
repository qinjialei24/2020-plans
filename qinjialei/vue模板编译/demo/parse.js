
// template to ast
// export function parse(template = '') {
// 	let tagStart = template.indexOf('<');
// 	console.log("parse -> tagStart", tagStart)

// }

const tagStartReg = /^<([a-zA-Z_][\w\-]*)/; //匹配标签的开头
const tagAttrReg = /^\s*([a-zA-Z_@:][\w\-\:]*)(?:(?:=)(?:(?:"([^"]*)")|(?:'([^']*)')))?/; //属性
const tagStartCloseReg = /^\s*(\/?)>/; //匹配起始标签的结束


function parse(template) {
	while (template) {
		let tagStart = template.indexOf('<');
		if (tagStart === 0) {
			let start = template.match(tagStartReg)
			console.log("test -> start", start)
			const ast = {
				type: 'tag',
				name: start[1],
				attrs: [],
				children: []
			}
			advance(start[0].length)

			let end, attr;
			while (!(end = template.match(tagStartCloseReg)) && (attr = template.match(tagAttrReg))) {
				const attrItem = {
					key: attr[1],
					value: attr[2] || attr[3] // 双引号时是attr[2]，单引号时是attr[3]
				}
				ast.attrs.push(attrItem)
				advance(attr[0].length)
			}

			if (end) {
				advance(end[0].length)
				console.log("test -> end", end)
			}


			
			console.log('template 的值是：', template);
			return ast
		}

		else {

		}

	}


	function advance(step = 0) {
		template = template.slice(step)
	}


}

const html = "<div id='root' v-if='true'> <h1>我是h1</h1> </div>"

const ast = parse(html)
console.log("ast", ast)
