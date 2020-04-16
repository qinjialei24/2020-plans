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
        this._initState(options);
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
        let timer = null;
        Event.on('update', _ => {
            if (timer) clearTimeout(timer);
            timer = setTimeout(_ => {
                let newVNode = render.call(this);
                console.log(newVNode)
                this._update(vNode, newVNode);
                vNode = newVNode;
            });
            // this._update(ast);
        });
    }
    _initState({ data, methods = {} }) {
        this._data = data;
        this._observe(data, (key, value) => {
            if (value != data[key]) {
                data[key] = value;
                Event.emit('update');
            }
        });
        this._observe(methods, (key, value) => { })
    }
    _observe(obj, cb) {
        Object.keys(obj).forEach(key => {
            Object.defineProperty(this, key, {
                set: value => {
                    cb(key, value);
                },
                get() {
                    return obj[key];
                }
            });
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
            if (start && start.index == 0) {
                if (lastIndex == 0) ast.toChild();
                let tag = start[1], attrStr = start[2];
                let attr = attrStr.match(/(.+?=".*?")/g) || [];
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
        var _children = '[]';
        let { tag, attr, text, children, key } = ast;
        if (children.length) {
            _children = '[' + children.map(v => this._generate(v)).join(',') + ']';
            //处理v-if产生的空白节点
            if (_children.includes('"empty"')) _children += '.filter(function(v){ return v != "empty";})';
            //处理v-for产生的数组
            if (_children.includes('.map(')) _children += '.flat()';
        }
        // let vNode = new VNode(ast.tag, ast.attr, ast.text, children);
        //文本节点
        let _text = text, textReg = /\{\{(.+?)\}\}/g;
        if (text && textReg.test(text)) {
            _text = text.replace(textReg, (match, key) => '"+' + key + '+"').slice(2, -2)
        } else {
            _text = `"${text || ''}"`
        }
        // console.log(_text)
        let _attr = JSON.stringify(attr).slice(1, -1);
        // _attr = `key: "${key}",${_attr}`;
        //v-model
        if (attr['v-model']) {
            _attr += `,value: ${attr['v-model']}, "_@input": function(e){ ${attr['v-model']} = e.target.value; }`
        }
        //@事件(原生)
        for (let [key, value] of Object.entries(attr)) {
            if (/^@/.test(key)) {
                let eventReg = /^\w+?\(.*\)/;
                //判断是否有()
                _attr += eventReg.test(value) ? `,"${key}": function($event){${value}}` : `,"${key}": function(){${value}()}`
            } else if (key == ':key') {
                _attr += `,key:${value}`
            }
        }
        //v-if
        if (attr['v-if']) {
            return `${attr['v-if']} ? _c("${tag}",{${_attr}},${_text || '""'},${_children},"${key}") : "empty"`;
        }
        //v-for
        if (attr['v-for']) {
            let forReg = attr['v-for'].match(/^(\w+)\s+in\s+(\w+)$/);
            return `${forReg[2]}.map(function(${forReg[1]}, i){ return _c("${tag}",{${_attr}},${_text || '""'},${_children},"${key}"); })`
        }
        //2020/4/14 计划下一步更新视图

        return `_c("${tag}",{${_attr}},${_text || '""'},${_children},"${key}")`;
    }
    _c(tag, attr, text, children, key) {
        return new VNode(tag, attr, text, children, key);
    }

    _update(oldVNode, newVNode) {
        // console.log('update:', oldVNode, newVNode)
        if (newVNode) {
            //diff算法
            this._patch_attr(oldVNode, newVNode);
            if (oldVNode.children.length) {
                let res = this._diff(oldVNode.children, newVNode.children);
                console.log('diff:', res)
                let children = this._patch_children(oldVNode, res);
                children.forEach((vNode, i) => this._update(vNode, newVNode.children[i]));
            }
        } else {
            this._patch_create(this.$el.parentNode, oldVNode, this.$el);
            let node = this.$el.previousSibling;
            this.$el.parentNode.removeChild(this.$el);
            this.$el = node;
        }
    }
    _equal(oldVNode, newVNode) {
        return oldVNode.tag == newVNode.tag && oldVNode.key == newVNode.key;
    }
    _diff(oldVNode = [], newVNode = [], res = [], index = 0) {
        let length = oldVNode.length, res1, res2, res3;
        for (var i = 0; i < length; i++) {
            let start = oldVNode[i], end = newVNode[i];
            if (start && end && !this._equal(start, end)) {
                index += i;
                //交换
                let endIndex = length - 1;
                while (endIndex > i) {
                    if (oldVNode[endIndex] == end) {
                        let temp = oldVNode[endIndex], _oldVNode = oldVNode.map(v => v);
                        _oldVNode[endIndex] = _oldVNode[i];
                        _oldVNode[i] = temp;
                        res1 = this._diff(_oldVNode.slice(i + 1), newVNode.slice(i + 1), res.concat({ type: 'change', index, endIndex: endIndex + index }), index + 1);
                        break;
                    }
                    endIndex--;
                }
                // console.log(oldVNode.slice(i), newVNode.slice(i + 1))
                //新增
                res2 = this._diff(oldVNode.slice(i), newVNode.slice(i + 1), res.concat({ type: 'add', index, value: end }), index + 1);
                // //删除
                res3 = this._diff(oldVNode.slice(i + 1), newVNode.slice(i), res.concat({ type: 'delete', index, value: start }), index);
                break;
            }

        }
        if (i == length) {
            if (newVNode.length < length) {
                return res.concat(oldVNode.slice(newVNode.length).map((value, j) => ({ type: 'delete', index: index + j + newVNode.length, value })));
            } else if (newVNode.length > length) {
                return res.concat(newVNode.slice(length).map((value, j) => ({ type: 'add', index: index + j + length, value })));
            }
        }
        let result = [res1, res2, res3].filter(v => v);
        if (result.length) {
            return result.sort((a, b) => a.length - b.length).shift();
        } else {
            return res;
        }
    }
    _patch_create(parentNode, vNode, refElm) {
        if (vNode) {
            this._create_element(vNode);
            if (vNode.children.length) {
                vNode.children.forEach(v => this._patch_create(vNode.elm, v));
            }
            parentNode.insertBefore(vNode.elm, refElm);
        }
    }
    _create_element(vNode) {
        vNode.elm = document.createElement(vNode.tag);
        vNode.elm.textContent = vNode.value || vNode.text;
        for (let [key, value] of Object.entries(vNode.data)) {
            if (!/v-|:|@/.test(key)) { //设置基础attr
                vNode.elm.setAttribute(key, value);
            } else if (/@/.test(key)) {//绑定原生方法
                let fnReg = key.match(/@(\w+)/);
                vNode.elm.removeEventListener(fnReg[1], value)
                vNode.elm.addEventListener(fnReg[1], value);
            }
        }
        return vNode;
    }
    _patch_attr(oldVNode, newVNode) {
        let elm = oldVNode.elm;
        newVNode.elm = elm;
        if (this._equal(oldVNode, newVNode)) {
            if (oldVNode.text != newVNode.text) {
                elm.textContent = newVNode.text;
            }
            if (JSON.stringify(oldVNode.data) != JSON.stringify(newVNode.data)) {
                for (let [key, value] of Object.entries(newVNode.data)) {
                    if (typeof value != 'function' && value != oldVNode.data[key]) {
                        if (key == 'value') elm.value = value;
                        else {
                            elm.setAttribute(key, value);
                        }
                    }
                }
                for (let [key, value] of Object.entries(oldVNode.data)) {
                    if (!newVNode.data[key]) {
                        console.log('删除', key)
                        elm.removeAttribute(key);
                    }
                }
            }
        }
    }
    _patch_children(oldVNode, res) {
        if (res.length) {
            res.forEach(operate => {
                if (operate.type == 'add') {
                    oldVNode.elm.insertBefore(this._create_element(operate.value).elm, oldVNode.elm.children[operate.index])
                    oldVNode.children.splice(operate.index, 0, operate.value);
                }
            })
        }
        return oldVNode.children;



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
        this.key = 0;
    }
    append(Node) {
        Node.key = `_${++this.key}`;
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
    constructor(tag, data, text, children, key) {
        this.tag = tag;
        this.data = data;
        this.text = text;
        this.children = children;
        this.key = data.key || key;
    }
}

