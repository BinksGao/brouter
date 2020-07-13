// 路由入口
let Vue
class BRouter {
    static install(_Vue) {
        Vue = _Vue
        Vue.mixin({
            beforeCreate() {
                if (this.$options.router) {
                    this.$options.router.init()
                }
            }
        })
    }

    constructor(options) {
        this.$options = options
        this.routeMap = {}

        // 使用Vue的响应式机制,路由切换的时候 做一些响应
        this.app = new Vue({
            data: {
                // 默认根目录
                current: '/'
            }
        })
    }

    // 启动整个路由
    init() {
        /**
         * 1、监听hashchange事件
         * 2、处理路由表
         * 3、初始化组件router-view router-link
         */
        // 1、监听hashchange事件
        this.bindEvents()

        // 2、处理路由表
        this.createRouterMap()
        console.log(this.routeMap)
            // 3、初始化router-view
        this.initComponent()
    }

    bindEvents() {
        window.addEventListener('hashchange', this.onHashChange.bind(this), false)
        window.addEventListener('load', this.onHashChange.bind(this), false)
    }
    getHash() {
        return window.location.hash.slice(1) || '/'
    }
    getForm(e) {
        // eslint-disable-next-line no-unused-vars
        let from = ''

        // eslint-disable-next-line no-unused-vars
        let to = ''
        if (e.newURL) {
            from = e.oldURL.split('#')[1]
            to = e.newURL.split('#')[1]
        } else {
            from = ''
            to = this.getHash
        }
        return { from, to }
    }
    onHashChange(e) {
        let hash = this.getHash()

        let router = this.routeMap[hash]
        let { from, to } = this.getForm(e)
        if (router.beforeEnter) {
            router.beforeEnter(from, to, () => {
                this.app.current = hash
            })
        } else {
            this.app.current = hash
        }

    }

    createRouterMap() {
        this.$options.routes.forEach(item => {
            this.routeMap[item.path] = item
        })
    }

    // 使用渲染函数
    initComponent() {
        Vue.component('router-view', {
            render: h => {
                const component = this.routeMap[this.app.current].component
                return h(component)
            },
        })
        Vue.component('router-link', {
            props: {
                to: String
            },
            render(h) {
                return h('a', {
                    attrs: {
                        href: '#' + this.to
                    }
                }, [this.$slots.default])
            }
        })
    }


}

export default BRouter