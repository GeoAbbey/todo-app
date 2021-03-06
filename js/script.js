! function (t) {
    var e = ["January", "February", "Mach", "April", "May", "June", "July", "August", "September", "October", "November", "September"],
        o = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        s = {
            state: {
                items: []
            },
            newItem: function (t, e, o) {
                this.state.items.unshift({
                    text: t,
                    status: e,
                    label: o,
                    isEditing: !0
                })
            },
            load: function () {
                var t = window.localStorage.getItem("todo-list");
                return t && (this.state.items = JSON.parse(t)), !0
            },
            push: function () {
                window.localStorage.setItem("todo-list", JSON.stringify(this.state.items))
            }
        },
        n = Vue.extend({
            template: "#todo-header",
            data: function () {
                return {
                    date: "",
                    weekDay: "",
                    month: "",
                    year: ""
                }
            },
            ready: function () {
                var t = new Date;
                this.date = t.getDate(), this.weekDay = o[t.getDay()], this.month = e[t.getMonth()], this.year = t.getFullYear()
            },
            methods: {
                add: function (t) {
                    s.newItem("Type a new task and hit enter", "undone", "normal")
                }
            }
        }),
        i = Vue.extend({
            template: "#todo-report",
            data: function () {
                return {
                    listState: s.state
                }
            },
            computed: {
                taskDone: function () {
                    var t = 0;
                    if (this.listState.items.length > 0)
                        for (var e = 0; e < this.listState.items.length; e++) "done" == this.listState.items[e].status && t++;
                    return t
                },
                taskTotal: function () {
                    return this.listState.items.length
                }
            }
        }),
        a = Vue.extend({
            template: "#todo-item",
            props: ["model"],
            data: function () {
                return {
                    tempText: ""
                }
            },
            computed: {
                isDone: function () {
                    return "done" == this.model.status
                }
            },
            methods: {
                save: function () {
                    "" != this.tempText && (this.model.text = this.tempText, this.model.isEditing = !1, s.push())
                },
                markDone: function () {
                    this.model.status = "done", s.push()
                },
                edit: function () {
                    this.model.isEditing = !0, this.$nextTick(function () {
                        t(this.$el).find("input").focus()
                    }), this.tempText = this.model.text
                },
                "delete": function () {
                    this.$dispatch("item-deleted", this.model), this.$nextTick(function () {
                        s.push()
                    })
                },
                showAction: function (e) {
                    e.stopPropagation();
                    var o = t(e.currentTarget),
                        s = o.find(".action-list");
                    s.hasClass("show") ? s.removeClass("show") : (t(".action-list").removeClass("show"), s.addClass("show"))
                },
                showLabel: function (e) {
                    e.stopPropagation();
                    var o = t(e.currentTarget),
                        s = o.find(".action-popup");
                    s.hasClass("show") ? s.removeClass("show") : (t(".action-popup").removeClass("show"), s.addClass("show"))
                },
                saveLabel: function (t) {
                    this.model.label = t, s.push()
                }
            }
        }),
        d = Vue.extend({
            template: "#todo-list",
            props: ["collection"],
            components: {
                "todo-item": a
            },
            events: {
                "item-deleted": function (t) {
                    this.collection.$remove(t)
                }
            }
        });
    new Vue({
        el: "#app",
        data: function () {
            return {
                listState: s.state
            }
        },
        ready: function () {
            s.load()
        },
        created: function () {
            window.addEventListener("click", this.hideAction)
        },
        methods: {
            hideAction: function () {
                t(".action-popup").removeClass("show")
            }
        },
        components: {
            "todo-header": n,
            "todo-report": i,
            "todo-list": d
        }
    })
}(jQuery);
