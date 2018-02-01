Vue.component("add-order", {
    props: ["name", "email", "message", "phone", "size", "add1", "add2", "add3"],
    created: function() {
        this.add1 = !1, this.add2 = !1, this.add3 = !1
    },
    methods: {
        postNewOrder: function() {
            this.name.length > 2 && this.email.length > 2 && $.post("/orders/new", {
                name: this.name,
                email: this.email,
                message: this.message,
                phone: this.phone,
                size: this.size,
                add1: this.add1,
                add2: this.add2,
                add3: this.add3
            }, function(e) {
                this.name = "", this.email = "", this.message = "", this.phone = "", this.size = "", this.add1 = "", this.add2 = "", this.add3 = "", toastr.success("Tilaus lisätty"), this.$parent.updateOrders()
            }.bind(this))
        }
    },
    computed: {
        validPhone: function() {
            return validatePhone(this.phone)
        },
        validEmail: function() {
            return validateEmail(this.email)
        }
    },
    template: '<div class="panel panel-default"><div class="panel-heading">Tee tilaus</div><div class="panel-body"><label for="nm">Tilaajan nimi: <span class="isOk" v-if="name && name.length > 2"> OK! </span></label><input class="form-control" id="nm" type="text" v-model="name"><label for="em" >Sähköpostiosoite <span class="isOk" v-if="validEmail"> OK! </span></label><input class="form-control" id="em" type="text" v-model="email"><label for="ph" >Puhelinnumero <span class="isOk" v-if="validPhone"> OK! </span></label><input class="form-control" id="ph" type="text" v-model="phone"><label for="ms" >Viesti Luoville </label><textarea class="form-control" id="ms" type="text" v-model="message" rows="5"></textarea><br><br><p>Paketti:</p><label for="ss" >S</label><input type="radio" id="ss" v-model="size" value="s"><label for="sm" >M</label><input type="radio" id="sm" v-model="size" value="m"><label for="sl" >L</label><input type="radio" id="sl" v-model="size" value="l"><br><br><p>Lisävalinnat:</p><label for="a1" >S  </label><input type="checkbox" id="a1" v-model="add1"><label for="a2" >M  </label><input type="checkbox" id="a2" v-model="add2"><label for="a3" >L  </label><input type="checkbox" id="a3" v-model="add3"><br><br><br><button class="btn btn-success" v-on:click="postNewOrder()">Luo tilaus</button></div></div>'
}), Vue.component("order", {
    props: ["order", "userList", "artistSelection", "aSDisabled"],
    beforeMount: function() {
        this.order.selectedByUser = !1, this.order.newSize = this.order.size, this.userList = this.$parent.userList, this.aSDisabled = !1, this.artistSelection = null, this.order.artistSelection && $.each(this.userList, function(e, t) {
            t.id == this.order.artistSelection && (this.artistSelection = t.id, this.aSDisabled = !0)
        }.bind(this));
        var e = (new Date).getTime();
        $.each(this.order.users, function(t, i) {
            i.collapseId = i.id + "collapse" + e, i.hashId = "#" + i.id + "collapse" + e
        }), this.order.artistSelection && (this.order.selectedByUser = !0)
    },
    methods: {
        postForm: function() {
            var e = {
                id: this.order.id,
                campaignCode: this.order.campaignCode,
                clientName: this.order.clientName,
                clientCompany: this.order.clientCompany,
                clientEmail: this.order.clientEmail,
                clientMessage: this.order.clientMessage,
                clientPhone: this.order.clientPhone,
                eventCity: this.order.eventCity,
                eventDate: this.order.eventDate,
                eventSize: this.order.eventSize,
                eventDescription: this.order.eventDescription,
                extraHours: this.order.extraHours || 0,
                additional1: this.order.additional1,
                additional2: this.order.additional2,
                additional3: this.order.additional3,
                discountPercent: this.order.discountPercent || 0
            };
            e.eagerMax || (e.eagerMax = 3), e.extraHours || (e.extraHours = 0), e.discountPercent || (e.discountPercent = 0), $.post("/orders/admin-edit-order", e).then(function(e) {
                console.log("EDIT:", e), this.$parent.updateOrders(), toastr.success("Tilauksen tiedot muutettu")
            }.bind(this))
        },
        boolean: function(e) {
            this.order[e] ? this.order[e] = !1 : this.order[e] = !0
        },
        changeOrderSize: function() {
            (this.order.newSize = "") || $.post("/orders/change-order-size/" + this.order.id + "/" + this.order.size).then(function(e) {
                console.log(e), this.$parent.updateOrders()
            }.bind(this))
        },
        freePending: function() {
            $.post("/orders/free-pending/" + this.order.id).then(function() {
                toastr.success("Tilaus vapautettu"), this.$parent.updateOrders()
            }.bind(this))
        },
        didInvoice20: function() {
            this.order.invoice20Number ? confirm("Oletko varmasti tehnyt ja lähettänyt laskun?") ? $.post("/orders/invoice20/" + this.order.id + "/" + this.order.invoice20Number).then(function(e) {
                toastr.success("Laskutuksen status muutettu"), this.$parent.updateOrders()
            }.bind(this)) : toastr.info("Laskutuksen statusta ei muutettu") : toastr.warning("Anna laskulle numero")
        },
        didInvoice100: function() {
            this.order.invoice100Number ? confirm("Oletko varmasti tehnyt ja lähettänyt laskun?") ? $.post("/orders/invoice100/" + this.order.id + "/" + this.order.invoice100Number).then(function(e) {
                toastr.success("Laskutuksen status muutettu"), this.$parent.updateOrders()
            }.bind(this)) : toastr.info("Laskutuksen statusta ei muutettu") : toastr.warning("Anna laskulle numero")
        },
        closeOrder: function() {
            confirm("Varmista, että asiaks on maksanut koko tilauksen ja kuvaajalle on maksettu palkkio kokonaisuudessaan") ? $.post("/close-order/" + this.order.id).then(function(e) {
                toastr.success("Tilaus suljettu"), this.$parent.updateOrders()
            }.bind(this)) : toastr.warn("Tilausta ei suljettu")
        },
        deleteOrder: function() {
            $.post("/orders/delete/" + this.order.id).then(function(e) {
                this.$parent.updateOrders(), toastr.success("Tilaus poistettu")
            }.bind(this))
        }
    },
    template: '<div class="panel-body"><div class="form-group"><h2>Tilaajan tiedot:</h2><label for="clientName">Asiakas</label><input class="form-control" id="clientName" v-model="order.clientName"></input><label for="clientCompany">Yritys</label><input class="form-control" id="clientCompany" v-model="order.clientCompany"></input><label for="clientEmail">Sähköpostiosoite</label><input class="form-control" id="clientEmail" v-model="order.clientEmail"></input><label for="clientPhone">Puhelinnumero</label><input class="form-control" id="clientPhone" v-model="order.clientPhone"></input><br><h2>Tilauksen tiedot:</h2><label for="eventCity">Paikka</label><input class="form-control" id="eventCity" v-model="order.eventCity"></input><label for="eventDate">Aika</label><input class="form-control" id="eventDate" v-model="order.eventDate"></input><label for="clientMessage">Viesti</label><textarea rows="5" class="form-control" id="clientMessage" v-model="order.clientMessage"></textarea><label>Tilauksen koko</label><select v-bind:value="order.eventSize" v-model="order.eventSize" class="form-control"><option value="s">S</option><option value="m">M</option><option value="l">L</option></select><br><label for="additional1">Tekstitys</label><button id="additional1" class="btn btn-checkbox" style="float:right" v-on:click="boolean(\'additional1\')"><i v-if="order.additional1" class="fa fa-check" aria-hidden="true"></i></button><br><label for="additional2">Ilmakuvaus</label><button id="additional2" class="btn btn-checkbox" style="float:right" v-on:click="boolean(\'additional2\')"><i v-if="order.additional2" class="fa fa-check" aria-hidden="true"></i></button><br><label for="additional3">Voice Over</label><button id="additional3" class="btn btn-checkbox" style="float:right" v-on:click="boolean(\'additional3\')"><i v-if="order.additional3" class="fa fa-check" aria-hidden="true"></i></button><br><br><h2>Kuvaajan tiedot:</h2><br><p class="m5 montserrat fw400" style="width:100%">Halukkaita tekijöitä  <span class="badge">{{ order.users.length }}</span></p><div class="well blue-bg" v-for="user in order.users" data-toggle="collapse" v-bind:data-target="user.hashId"><p class="m5 monstserrat fw400"><span class="montserrat fw400 blue" style="font-size:13px;margin-bottom:5px;" v-if="user.id == order.artistSelection" >VALINTA: </span>{{ user.firstName }} {{ user.lastName}} <remove-user v-bind:orderid="order.id" v-bind:userid="user.id" style="float:right"></remove-user></p><div class="collapse" v-bind:id="user.collapseId"><p class="montserrat m10" >PHONE: {{ user.phone }}</p><p class="montserrat m10" >EMAIL: {{ user.email }}</p></div></div><label >Määrää kuvaaja tilaukselle</label><select v-bind:disabled="aSDisabled" v-model="artistSelection" class="form-control"><option v-for="user in userList" v-bind:value="user.id">{{user.id}} {{user.email}}</option></select><br><h2>Myynti:</h2><label for="campaignCode">Kampanjakoodi</label><input class="form-control" id="campaignCode" placeholder="Kampanjakoodi" v-model="order.campaignCode"/><label for="discountPercent">Alennus</label><p id="discountPercent">{{ order.discountPercent }} %</p><p style="width:100%">Lisätyöt: <strong><span style="float:right">{{ order.extraHours || 0 }} tuntia</span></strong></p><p style="width:100%">Tilauksen arvo <strong><span style="float:right">{{ order.showTotal || 0 }} €</span></strong></p><p style="width:100%">Laskutettu: <strong><span style="float:right">{{ order.showCharged || 0 }} €</span></strong></p><p style="width:100%">Komissio <strong><span style="float:right">{{ order.showComission || 0 }} €</span></strong></p><p style="width:100%">Kuvaajalle <strong><span style="float:right">{{ order.showArtistsCut || 0 }} €</span></strong></p><br><h2>Hallinta:</h2><button class="btn btn-success m5  w100" v-on:click="postForm()">Tallenna tilauksen tiedot</button><br><button class="btn btn-success m5  w100" v-if="order.pending" v-on:click="freePending()">Vapauta kuvaajille</button><br><br><label for="invoice20Number">20% laskun numero</label><input v-bind:disabled="this.order.invoice20" class="form-control m5" id="invoice20Number" v-model="order.invoice20Number"></input><button class="btn btn-primary m5  w100" v-bind:disabled="this.order.invoice20 || !this.order.selectedByUser" v-on:click="didInvoice20()" type="text"><strong v-if="this.order.selectedByUser">Laskuta 20%</strong><strong v-if="!this.order.selectedByUser">Ei saa laskuttaa 20%</strong></button><p class="m5">Alkulaskutus voidaan tehdä kun tilaukselle on valittu kuvaaja</p><label for="invoice100Number">100% laskun numero:</label><input v-bind:disabled="this.order.invoice100" class="form-control m5" id="invoice100Number" v-model="order.invoice100Number"></input><button class="btn btn-primary m5  w100" v-bind:disabled="this.order.invoice100 || !this.order.ready" v-on:click="didInvoice100()" type="text"><strong v-if="this.order.ready">Laskuta 100%</strong><strong v-if="!this.order.ready">Ei saa laskuttaa 100%</strong></button><p class="m5">Loppulaskutus voidaan tehdä kun kuvaaja on tehnyt työn loppuun! {{ this.order.ready }}</p><br><button class="btn btn-primary m5   w100" v-on:click="closeOrder()" type="text">Tilaus maksettu kuvaajalle</button><button class="btn btn-danger m5   w100" v-on:click="deleteOrder()" type="text">Poista</button><br><a v-bind:href="order.pickArtistLink">Kuvaajan valinta -sivulle</a></div></div>'
}), Vue.component("orders-filter", {
    props: ["filter", "sorted"],
    mounted: function() {
        console.log(this.sorted)
    },
    methods: {
        toggleFilter: function(e) {
            this.$parent.updateList(e)
        }
    },
    template: '<div id="filterOptions" class="collapse well bg-blue white"><div class="row"><div class="col-xs-12" style="padding-left:5px;"><ul style="padding-left:2px"><li style="padding:3px;"><button style="text-align:left;margin:0px"class="btn form-control"v-on:click="toggleFilter(\'pending\')"><i v-if="this.filter.pending" class="fa fa-check" aria-hidden="true"></i> Uudet tilaukset<span class="badge pull-right">{{ sorted.pending.length }}</span></button></li><li style="padding:3px;"><button style="text-align:left;margin:0px"class="btn form-control"v-on:click="toggleFilter(\'freed\')"><i v-if="this.filter.freed" class="fa fa-check" aria-hidden="true"></i> Vapautettu kuvaajille<span class="badge pull-right">{{ sorted.freed.length }}</span></button></li><li style="padding:3px;"><button style="text-align:left;margin:0px"class="btn form-control"v-on:click="toggleFilter(\'inProduction\')"><i v-if="this.filter.inProduction" class="fa fa-check" aria-hidden="true"></i> Saa laskuttaa 20%<span class="badge pull-right">{{ sorted.inProduction.length }}</span></button></li><li style="padding:3px;"><button style="text-align:left;margin:0px"class="btn form-control"v-on:click="toggleFilter(\'invoice20\')"><i v-if="this.filter.invoice20" class="fa fa-check" aria-hidden="true"></i> Tuotannossa<span class="badge pull-right">{{ sorted.invoice20.length }}</span></button></li><li style="padding:3px;"><button style="text-align:left;margin:0px"class="btn form-control"v-on:click="toggleFilter(\'invoice100\')"><i v-if="this.filter.invoice100" class="fa fa-check" aria-hidden="true"></i> Saa laskuttaa 100%<span class="badge pull-right">{{ sorted.invoice100.length }}</span></button></li><li style="padding:3px;"><button style="text-align:left;margin:0px"class="btn form-control"v-on:click="toggleFilter(\'invoiceMade\')"><i v-if="this.filter.invoiceMade" class="fa fa-check" aria-hidden="true"></i> 100% laskutettu<span class="badge pull-right">{{ sorted.invoiceMade.length }}</span></button></li><li style="padding:3px;"><button style="text-align:left;margin:0px"class="btn form-control"v-on:click="toggleFilter(\'closed\')"><i v-if="this.filter.closed" class="fa fa-check" aria-hidden="true"></i> Suljettu</button></li></ul></div></div></div>'
}), Vue.component("orders", {
    props: ["orders", "order", "length", "filter", "filteredList", "newOrders", "userList"],
    methods: {
        updateOrders: function() {
            var e = 0;
            $.get("/orders").then(function(t) {
                this.length = t.length;
                var i = {
                    pending: [],
                    freed: [],
                    invoice20: [],
                    inProduction: [],
                    invoice100: [],
                    invoiceMade: [],
                    closed: []
                };
                $.each(t, function(t, s) {
                    return s.pending && e++, s.hashId = "#order" + s.id, s.orderId = "order" + s.id, s.pickArtistLink = configUrl() + "/orders/artist-options/" + s.id + "/" + s.clientToken, s.showPrice = s.price ? parseInt(s.price) / 100 : "ERR", s.showTotal = s.total ? parseInt(s.total) / 100 : "ERR", s.showComission = s.revenue ? parseInt(s.revenue) / 100 : "ERR", s.showArtistsCut = s.artistsCut ? s.artistsCut / 100 : "ERR", s.showCharged = s.charged ? s.charged / 100 : 0, s.closed ? (s.status = "Suljettu", void i.closed.push(s)) : s.invoice100 ? (s.status = "Laskutettu", void i.invoiceMade.push(s)) : s.ready ? (s.status = "Laskuta 100%", void i.invoice100.push(s)) : s.invoice20 ? (s.status = "Tuotannossa", void i.inProduction.push(s)) : null != s.artistSelection ? (s.status = "Laskuta 20%", void i.invoice20.push(s)) : s.pending ? (s.status = "Uusi tilaus", void i.pending.push(s)) : (s.status = "Vapautettu kuvaajille", void i.freed.push(s))
                }), this.orders = i, this.newOrders = 0 == e ? "Ei uusia" : 1 == e ? e + " uusi" : e + " uutta", this.showFiltered()
            }.bind(this))
        },
        updateList: function(e) {
            this.filter[e] ? this.filter[e] = !1 : this.filter[e] = !0, this.showFiltered()
        },
        showFiltered: function() {
            this.filteredList = [];
            var e = [];
            $.each(["pending", "freed", "inProduction", "invoice20", "invoiceMade", "invoice100", "closed"], function(t, i) {
                this.filter[i] && $.each(this.orders[i], function(t, i) {
                    e.push(i)
                })
            }.bind(this)), this.filteredList = e
        },
        getUserList: function() {
            $.get("/artists/all").then(function(e) {
                var t = [];
                $.each(e, function(e, i) {
                    i.activeUser && t.push({
                        id: i.id,
                        email: i.email
                    })
                }), this.userList = t
            }.bind(this))
        }
    },
    beforeMount: function() {
        this.getUserList(), this.filter = {
            pending: !0,
            freed: !1,
            inProduction: !1,
            invoice20: !1,
            invoiceMade: !1,
            invoice100: !1,
            closed: !1
        }, this.fileteredList = [], this.updateOrders()
    },
    template: '<div class="row"><div class="col-md-6"><div class="panel panel-default"><div class="panel-heading"><button class="btn btn-xs btn-success" data-toggle="collapse" href="#filterOptions">Näytä valinnat</button><span class="panel-heading-pull-right"><p class="montserrat fw200 white" style="font-size:14px    ">{{ newOrders }} {{ orders.length }} tilauksesta</p></span></div><div class="panel-body  panel700"><div><orders-filter v-bind:filter="filter" v-bind:sorted="orders"></orders-filter></div><div class="panel-group" v-for="order in filteredList"><div class="panel panel-primary"><div class="panel-heading pp-pointer" data-toggle="collapse" v-bind:data-target="order.hashId">{{ order.clientName }}<i v-bind:class="order.statusClass" aria-hidden="true"></i>  <i class="pull-right" style="font-size:10px;"> {{ order.status }}</i></div><div v-bind:id="order.orderId" class="collapse"><order v-bind:userlist="userList" v-bind:order="order"></order></div></div></div></div></div></div><div class="col-md-6"><add-order></add-order></div></div>'
});
