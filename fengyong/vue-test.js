var Event = {
    _event: {},
    on(name, fn) {
        this._event[name] = this._event[name] || [];
        this._event[name].push(fn);
    },
    emit(name, value) {
        if (this._event[name]) {
            this._event[name].forEach(fn => fn(value));
        }
    }
}
class Vue {
    constructor(options) {
        this._initState(options.data);
        //根据el返回outerHTML
        let html = this._$mount(options.el);
        //根据html返回AST
        let ast = this._compile(html.trim());
        console.log('AST:', ast);
        //根据AST返回render函数
        let render = new Function('with(this){return ' + this._generate(ast) + '}');
        console.log('render:', render);
        //执行render函数返回vnode
        let vNode = render.call(this, this._c);
        console.log('vNode:', vNode)
        //更新真实dom
        this._update(vNode);
        options.mounted.call(this);
        // Event.on('update', _ => {
        //     this._update(ast);
        // });
    }
    _initState(data) {
        this._data = data;
        Object.keys(data).forEach(key => {
            Object.defineProperty(this, key, {
                set(value) {
                    data[key] = value;
                    // Event.emit(key, value);
                    // Event.emit('update');
                },
                get() {
                    return data[key];
                }
            })
        });
    }
    _$mount(el) {
        this.$el = document.querySelector(el);
        return this.$el.outerHTML;
    }
    _compile(html) {
        let startReg = /^<([a-z]+)\s?([\s\S]*?)>([\s\S]*)/i;
        let endReg = /([\s\S]*?)<\/[a-z]+>([\s\S]*)/;
        let ast = new AST(), lastIndex = -1;
        while (html) {
            let start = html.match(startReg);
            // console.log(RegExp.$1, RegExp.$2, RegExp.$3, RegExp.$2.split(/\s+/))
            if (start && start.index == 0) {
                if (lastIndex == 0) ast.toChild();
                let tag = start[1], attrStr = start[2];
                //.reduce((a, b) => Object.assign(a, { [b.split('=')[0]]: b.split('=')[1] }), {})
                let attr = attrStr.match(/(.+?=".*?")/g) || [];
                // console.log(attr.map(v => v.trim()))
                ast.append(new Node(tag, attr.map(v => v.trim())));
                html = start[3].trim();
                if (['input', 'img', 'br', 'pr'].find(v => v == tag)) {
                    lastIndex = 1;
                } else {
                    lastIndex = 0;
                }
            } else {
                let end = html.match(endReg);
                ast.setText(end[1]);
                html = end[2].trim();
                if (lastIndex == 1) ast.toParent();
                lastIndex = 1;
            }
        }
        return ast.root;
    }
    _generate(ast) {
        var children = '[]';
        if (ast.children.length) {
            children = '[' + ast.children.map(v => this._generate(v)).join(',') + ']';
            //处理v-if产生的空白节点
            if (children.includes('"empty"')) children += '.filter(function(v){ return v != "empty";})';
            //处理v-for产生的数组
            if (children.includes('.map(')) children += '.flat()';
        }
        // let vNode = new VNode(ast.tag, ast.attr, ast.text, children);
        //文本节点
        let text = ast.text, textReg = /\{\{(.+?)\}\}/g;
        if (text && textReg.test(text)) {
            text = ast.text.replace(textReg, (match, key) => '"+' + key + '+"').slice(2, -2)
        }

        let attr = JSON.stringify(ast.attr);

        //v-if
        if (ast.attr['v-if']) {
            return `${ast.attr['v-if']} ? _c("${ast.tag}",${attr},${text || '""'},${children}) : "empty"`;
        }
        //v-for
        if (ast.attr['v-for']) {
            var forReg = ast.attr['v-for'].match(/^(\w+)\s+in\s+(\w+)$/);
            return `${forReg[2]}.map(function(${forReg[1]}, i){ return _c("${ast.tag}",${attr},${text || '""'},${children}); })`
        }
        //@事件(原生)
        // for (let [key, value] of Object.entries(ast.attr)) {
        //     if (!/^@/.test(key)) {

        //     }
        // }
        //2020/4/14 计划下一步更新视图

        return `_c("${ast.tag}",${attr},${text || '""'},${children})`;
    }
    _c(tag, attr, text, children) {
        return new VNode(tag, attr, text, children);
    }

    _update(ast) {
        this._patch(this.$el.parentNode, ast, this.$el);
        let node = this.$el.previousSibling;
        this.$el.parentNode.removeChild(this.$el);
        this.$el = node;
    }
    _patch(parentNode, vNode, refElm) {
        if (vNode) {
            vNode.elm = document.createElement(vNode.tag);
            vNode.elm.textContent = vNode.value || vNode.text;
            for (let [key, value] of Object.entries(vNode.data)) {
                if (!/^v-|:|@/.test(key)) {
                    vNode.elm.setAttribute(key, value);
                }
            }
            if (vNode.children.length) {
                vNode.children.forEach(v => this._patch(vNode.elm, v));
            }
            parentNode.insertBefore(vNode.elm, refElm);
        }
    }
}


class Node {
    constructor(tag, attr, text, children = []) {
        this.tag = tag;
        this.attr = attr && attr.reduce((a, b) => Object.assign(a, { [b.split('=')[0]]: b.split('=')[1].replace(/"/g, '') }), {});
        this.text = text;
        this.children = children;
    }
    push(Node) {
        this.children.push(Node);
    }
}

class AST {
    constructor() {
        this.root = null;
        this.head = null;
    }
    append(Node) {
        this.child = Node;
        if (!this.root) {
            this.root = this.head = Node;
        } else {
            Node.parent = this.head;
            this.head.push(Node);
        }
    }
    toChild() {
        this.head = this.child;
    }
    toParent() {
        this.head = this.head.parent;
    }
    setText(text) {
        if (text) {
            this.child.text = text;
        }
    }

}


class VNode {
    constructor(tag, data, text, children) {
        this.tag = tag;
        this.data = data;
        this.text = text;
        this.children = children;
    }
}

