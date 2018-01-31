Vue.component("order-form", {
    props: ["formData", "errorMsg", "showErrors", "date", "tip", "validateName", "validateEmail", "validateMessage"],
    created: function() {
        this.formData = {
            name: "",
            company: "",
            email: "",
            phone: "",
            message: "",
            size: "",
            add1: !1,
            add2: !1,
            add3: !1
        }, this.errorMsg = {
            name: !1,
            email: !1,
            message: !1
        }, this.validateName = !1, this.validateEmail = !1, this.validateMessage = !1
    },
    methods: {
        validForm: function() {
            var t = this.formData,
                e = !0;
            return !t.name && t.name.length < 3 && !t.company && t.company.length < 3 && (e = !1), validateEmail(t.email) || validatePhone(t.phone) || (e = !1), t.message || (e = !1), e
        },
        packageImageSrc: function() {
            return "./images/luovat_" + this.formData.size + ".png"
        },
        handleOrder: function() {
            this.formData.campaignCode && this.formData.campaignCode.length > 0 ? $.get("/campaigns/check/" + this.formData.campaignCode).then(function(t) {
                console.log(t), "OK" != t ? toastr.error("Kampanjakoodi", "Tarkasta kampanja koodi tai tyhjennä kenttä ennen tilaamista") : this.postOrder()
            }.bind(this)) : this.postOrder()
        },
        postOrder: function() {
            this.formData.name.length > 2 && this.formData.email.length > 2 && $.post("/orders/new", {
                name: this.formData.name,
                company: this.formData.company,
                email: this.formData.email,
                message: this.formData.message,
                city: this.formData.eventCity,
                date: this.formData.date,
                phone: this.formData.phone,
                size: this.formData.size,
                add1: this.formData.add1,
                add2: this.formData.add2,
                add3: this.formData.add3,
                campaignCode: this.formData.campaignCode
            }, function(t) {
                this.formData.name = "", this.formData.company = "", this.formData.email = "", this.formData.message = "", this.formData.eventCity = "", this.formData.date = "", this.formData.phone = "", this.formData.size = "", this.formData.add1 = "", this.formData.add2 = "", this.formData.add3 = "", this.formData.campaignCode = "", this.tip = "Olemme nyt vastaanottaneet tilauksen ja voitte poistua sivulta. Jos sinulle kuitenkin jäi vielä kysyttävää voit olla yhteydessä meihin osoitteessa info@luovat.com", $(".hide-order-form").hide(), $("#ready").fadeIn()
            }.bind(this)), toastr.success("Olemme nyt vastaanottaneet tilauksen ja voitte poistua sivulta. Jos sinulle kuitenkin jäi vielä kysyttävää voit olla yhteydessä meihin osoitteessa info@luovat.com")
        },
        newOrder: function() {
            this.tip = "", $(".hide-order-form").hide(), $("#select-size").fadeIn()
        },
        openForm: function(t) {
            this.formData.size = t, this.tip = "Valitsit " + this.formData.size.toUpperCase() + "-kokoisen paketin. Tarvitsemme hieman tietoja tilausta varten", $(".hide-order-form").hide(), $("#askFirst").fadeIn()
        },
        askAdditional: function() {
            this.formData.name.length < 3 ? this.validateName = !0 : (this.validateName = !1, validateEmail(this.formData.email) ? (this.validateEmail = !1, this.formData.message.length < 10 ? this.validateMessage = !0 : (this.validateMessage = !1, this.tip = "Hienoa " + this.formData.name + "! Voit täyttää vielä valitsemasi lisätiedot tästä tai lähettää tilauksen sellaisenaan. Olet valinnut " + this.formData.size.toUpperCase() + "-kokoisen paketin. Olemme ensisijaisesti yhteydessä sähköpostiosoitteeseen " + this.formData.email, $(".hide-order-form").hide(), $("#ask-additional").fadeIn())) : this.validateEmail = !0)
        }
    },
    template:
    '<div class="col-md-10 col-md-offset-1 col-lg-10 col-lg-offset-1">'+
        '<div class="row">'+
            '<div class="col-sm-6 col-sm-offset-3">'+
                '<center>'+
                    '<h2 class="montserrat fw700">TILAA VIDEOTUOTANTO</h2>'+
                    '<p>Tilaus\tei\tole\tsitova\tja sen\tlähettäminen on maksutonta.</p>'+
                    '<p class="montserrat">{{ tip }}</p>'+
                '</center>'+
            '</div>'+
        '</div>'+
        '<div class="row">'+
        '<div id="select-size" class="hide-order-form">'+
            '<div class="col-md-12 text-center m10">'+
                '<span>'+
                    '<a id="play-sample-video" class="btn btn-xs m5 w100 green btn-white">Näin tilaat</a> '+
                    '<a data-toggle="modal" data-target="#compare" class="btn green btn-xs m5 w100 btn-white">Vertaile paketteja</a>'+
                    '<a href="https://www.luovat.com/videotuotanto" class="btn green btn-xs m5 w100 btn-white">Tilausohjeet</a>'+
                '</span>'+
            '</div>'+
        '</div>'+
        '<order-size link="https://player.vimeo.com/video/223740472?autoplay=1&loop=1&autopause=0" small="S" caption="SMALL" class="col-md-4" size="s" price="690" description="Pienin pakettimme sisältää muutaman tunnin kuvauksen sekä yhden päivän jälkituotannon. Paketti soveltuu esimerkiksi haastatteluiden taltiontiin."></order-size><order-size link="https://player.vimeo.com/video/223740472?autoplay=1&loop=1&autopause=0" small="M" caption="MEDIUM" class="col-md-4" size="m" price="990" description="Keskikokoinen pakettimme mahdollistaa puolen päivän kuvauksen sekä joustavamman jälkituotannon. Paketti soveltuu esimerkiksi tapahtumien taltiointiin."></order-size><order-size link="https://player.vimeo.com/video/223740472?autoplay=1&loop=1&autopause=0" small="L" caption="LARGE" class="col-md-4" size="l" price="1390" description="Iso pakettimme tarjoaa esituotantoa, kokonaisen kuvauspäivän sekä laajemman jälkituotannon. Kyseinen tuotanto mahdollistaa mm. yritysvideon."></order-size></div><div id="askFirst" class="hide-order-form col-sm-6 col-sm-offset-3"style="display:none;"><center><h3 class="montserrat fw700 white">1/2 Tilaajan tiedot </h3></center><transition name="bounce" class="text-center"><p class="white" style="margin-bottom:0px;" v-if="validateName">Anna oikea nimesi</p></transition><div class="asteriks"><input id="inpName" class="form-control m20 order-form-input darkblue" placeholder="Nimesi" v-model="formData.name"></input></div><transition name="bounce" class="text-center"><p class="white" style="margin-bottom:0px;" v-if="validateEmail">Kirjoita sähköpostiosoite oikein</p></transition><div class="asteriks"><input id="inpEmail" class="form-control m20 order-form-input darkblue" placeholder="Sähköpostiosoitteesi" type="email" v-model="formData.email"></div><transition name="bounce" class="text-center"><p class="white" style="margin-bottom:0px;" v-if="validateMessage">Viesti voisi olla hieman pidempi</p></transition><div class="asteriks"><textarea id="inpMsg" rows="10" class="form-control m20 order-form-input-area darkblue" placeholder="Kerro meille videotarpeestasi" v-model="formData.message"></textarea></div><center><button class="btn btn-sm btn-white" v-on:click="newOrder()">Peruuta</button><button class="btn btn-sm btn-white" v-on:click="askAdditional()">Seuraava</button></center></div><div id="ask-additional" class="hide-order-form blue col-sm-6 col-sm-offset-3" style="display:none;"><center><h3 class="montserrat fw700 white">2/2 Lisätiedot ja tilauksen lähetys </h3></center><input class="form-control m20 order-form-input-area darkblue" placeholder="Yritys" v-model="formData.company"></input><input class="form-control m20 order-form-input-area darkblue" placeholder="Puhelin" v-model="formData.phone"></input><input class="form-control m20 order-form-input-area darkblue" placeholder="Kaupunki" v-model="formData.eventCity"></input><input class="form-control m20 order-form-input-area darkblue" placeholder="Päivä" type="date" v-model="formData.date"></input><label class="white m10" for="12" >  Tekstitys +50€</label><input type="checkbox" id="a1" v-model="formData.add1"><br><label class="white m10" for="a2" >  Ilmakuvaus +100€</label><input type="checkbox" id="a2" v-model="formData.add2"><br><label class="white m10" for="a3" >  Voice over +100 - 300€ </label><input type="checkbox" id="a3" v-model="formData.add3"><br><br><input class="form-control m20 order-form-input-area darkblue" placeholder="Kampanjakoodi" type="text" v-model="formData.campaignCode"></input><center><button class="btn btn-sm btn-white" v-on:click="newOrder()">Peruuta</button><button class="btn btn-sm btn-white" v-on:click="handleOrder()">Lähetä tilaus</button></center></div><div id="ready" class=" hide-order-form col-sm-8 col-sm-offset-2 r-m" style="display:none;"><center><a class="btn btn-lg r-m btn-white" v-on:click="newOrder()">Tee uusi tilaus</a></center></div></div>'
}), Vue.component("order-size", {
    props: ["size", "img", "description", "price", "caption", "small", "bgId", "link"],
    mounted: function() {
        this.img = "../images/luovat_" + this.size + ".png", this.bgId = "well-" + this.size
    },
    updated: function() {
        this.img = "../images/luovat_" + this.size + ".png", this.bgId = "well-" + this.size
    },
    methods: {
        openForm: function(t) {
            this.$parent.openForm(t)
        },
        showVideo: function() {
            $("#video-source").attr("src", this.link), $("#video-modal").modal()
        }
    },
    template: '<div><center><div class="well-order" ><div class="" v-on:click="openForm(size)"><center><h1 style="font-size:150px;text-transform:uppercase;margin-top:0px;" class="darkblue plaster">{{ size }}</h1><h3 class="blue fw400 style="">Valitse <span class="fw900">{{ small }}</span> paketti</h3><p class="black p-well">{{ description }}</p><p class="black" style="font-size:10px;transform:translateY(25px)">Hinta alv 0%</p><h3 class="blue fw700 price">{{ price }}€</h3></center></div><center><button class="btn btn-sm btn-luovat green" style="margin-top:15px" v-bind:link="link" v-on:click="showVideo()">Katso esimerkki {{ size }} paketista</button></center></div><br></center></div>'
}), Vue.component("order-button", {
    props: ["size"],
    methods: {
        openForm: function(t) {
            this.$parent.openForm(t)
        }
    },
    template: '<button class="btn btn-success-shallow m20 btn-sm" v-on:click="openForm(size)">Valitse</button>'
}), Vue.component("rekry-button", {
    props: ["size"],
    template: '<button class="btn btn-success-shallow m20 btn-lg" v-on:click="openForm(size)">Hae paikkaa</button>'
}), Vue.component("rekry-form", {
    props: ["form", "errMsgEmail", "errMsgPhone"],
    created: function() {
        this.resetForm(), this.errMsgEmail = {
            show: !1,
            text: ""
        }, this.errMsgPhone = {
            show: !1,
            text: ""
        }, this.errMsgNames = {
            show: !1,
            text: ""
        }
    },
    methods: {
        resetForm: function() {
            this.form = {
                firstName: "",
                lastName: "",
                phone: "",
                email: "",
                rekryMessage: ""
            }
        },
        postForm: function() {
            (!this.form.firstName || !this.form.lastName || this.form.firstName.length < 3 || this.form.lastName.length < 3) && (console.log("names", this.form), this.errMsgNames.show = !1, this.errMsgNames.text = "Anna etunimi ja sukunimi", this.errMsgNames.show = !0), validatePhone(this.form.phone) || (this.errMsgPhone.show = !1, this.errMsgPhone.text = "Puhelinnumero ei kelpaa", this.errMsgPhone.show = !0), validateEmail(this.form.email) || (this.errMsgEmail.show = !1, this.errMsgEmail.text = "Sähköpostiosoite ei kelpaa", this.errMsgEmail.show = !0), this.errMsgNames.show || this.errMsgEmail.show || this.errMsgPhone.show || $.post("/artists/new", this.form).then(function(t) {
                console.log(t), this.resetForm(), toastr.success("Kiitos! Olemme vastaanottaneet hakemuksenne."), $("#rekryModal").modal("hide")
            }.bind(this)).fail(function(t) {
                console.log("ERR", t), t.responseJSON && -1 != t.responseJSON.detail.indexOf("already exists") && (this.errMsgEmail.show = !1, this.errMsgEmail.text = "Valitettavasti sähköposti on jo käytössä. Käytä toista sähköpostiosoitetta", this.errMsgEmail.show = !0)
            }.bind(this))
        }
    },
    template: '<div class="row"><div class="col-md-12"><div class="form-group"><transition name="bounce" class="text-center"><p v-if="errMsgNames.show">{{ errMsgNames.text }}</p></transition><input class="order-form-input-area form-control" type="text" placeholder="Etunimi" id="firstName" v-model="form.firstName"></input><br><input class="order-form-input-area form-control" type="text" placeholder="Sukunimi" id="lastName" v-model="form.lastName"></input></div></div><div class="col-md-12"><div class="form-group"><transition name="bounce" class="text-center"><p v-if="errMsgPhone.show">{{ errMsgPhone.text }}</p></transition><input class="order-form-input-area form-control" placeholder="Puhelinnumero" type="text" id="phone" v-model="form.phone"></input><br><transition name="bounce" class="text-center"><p v-if="errMsgEmail.show">{{ errMsgEmail.text }}</p></transition><input class="order-form-input-area form-control" placeholder="Sähköposti" type="text" id="email" v-model="form.email"></input></div></div><div class="col-md-12"><div class="form-group"><textarea rows="5" class="order-form-input-area form-control" placeholder="Kerro itsestäsi. Miksi sinut pitäisi rekrytoida luoviin?" type="text" id="message" v-model="form.rekryMessage"></textarea></div></div><div class="col-md-12 text-center"><button class="btn-luovat btn btn-sm" v-on:click="postForm()">Lähetä</button><button class="btn-luovat btn btn-sm" data-dismiss="modal">Sulje</button></div></div>'
}), new Vue({
    el: "#mainApp"
}), $(document).on("click", "#play-sample-video", function() {
    console.log("as"), $("#video-source").attr("src", "https://player.vimeo.com/video/223754130?autoplay=1&loop=1&autopause=0"), $("#video-modal").modal()
}), $(document).ready(function() {
    $("#play-rekry-video").click(function() {
        console.log(" asd"), $("#video-source").attr("src", "https://player.vimeo.com/video/223740472?autoplay=1&loop=1&autopause=0"), $("#video-modal").modal()
    }), $("#video-modal").on("hidden.bs.modal", function() {
        $("#video-source").attr("src", "")
    })
}), $('a[href*="#"]').not('[href="#"]').not('[href="#0"]').click(function(t) {
    if (location.pathname.replace(/^\//, "") == this.pathname.replace(/^\//, "") && location.hostname == this.hostname) {
        var e = $(this.hash);
        (e = e.length ? e : $("[name=" + this.hash.slice(1) + "]")).length && (t.preventDefault(), $("html, body").animate({
            scrollTop: e.offset().top
        }, 1e3, function() {
            var t = $(e);
            if (t.focus(), t.is(":focus")) return !1;
            t.attr("tabindex", "-1"), t.focus()
        }))
    }
});
