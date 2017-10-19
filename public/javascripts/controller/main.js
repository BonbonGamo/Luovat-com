// //VUE COMPONENTS
// Vue.component('order-form',{
//     props:['formData','errorMsg','showErrors','date'],
//     created:function(){
//         this.formData = {
//             name:'',
//             company:'',
//             email:'',
//             phone:'',
//             message:'',
//             size:'',
//             add1:false,
//             add2:false,
//             add3:false
//         }
//         this.errorMsg = '';
//         this.showErrors = false;
//     },
//     methods:{
//         validForm:function(){
//             var o = this.formData;
//             var validate = true;
//             if(!o.name && o.name.length < 3 && !o.company && o.company.length < 3) validate = false;
//             if(!validateEmail(o.email) && !validatePhone(o.phone)) validate = false;
//             if(!o.message) validate = false;
//             return validate
//         },
//         packageImageSrc:function(){
//             return './images/luovat_'+this.formData.size+'.png'
//         },
//         addErrorMsg:function(msg){
//             this.errorMsg =  this.errorMsg + msg;
//         },
//         whyDisabled:function(){
//             var o = this.formData;
//             this.errorMsg  = "";
//             if(!o.name && o.name.length < 3 && !o.company && o.company.length < 3) this.addErrorMsg('Anna oma nimesi tai yrityksen nimi')
//             if(!o.message) this.addErrorMsg('Kerro viestissä, minkä laisen videon haluaisit tehdä')
//             if(!validateEmail(o.email) && !validatePhone(o.phone)) this.addErrorMsg('Lisää sähköposti tai puhelinumero yhteydenottoa varten')
//             if(this.errorMsg.length > 0){
//                 this.showErrors = true
//             }else{
//                 this.showErrors = false
//             }    
//         },
//         postOrder:function(){
//             if(this.formData.name.length > 2 && this.formData.email.length > 2){
//                 $.post('/orders/new',{
//                     name:this.formData.name,
//                     company:this.formData.company,
//                     email:this.formData.email,
//                     message:this.formData.message,
//                     city:this.formData.eventCity,
//                     date:this.formData.date,
//                     phone:this.formData.phone,
//                     size:this.formData.size,
//                     add1:this.formData.add1,
//                     add2:this.formData.add2,
//                     add3:this.formData.add3
//                 },function(response){
//                     this.formData.name = "";
//                     this.formData.company = "";
//                     this.formData.email = "";
//                     this.formData.message = "";
//                     this.formData.eventCity = "";
//                     this.formData.date = "";
//                     this.formData.phone = "";    
//                     this.formData.size = "";
//                     this.formData.add1 = "";
//                     this.formData.add2 = "";
//                     this.formData.add3 = "";
//                     $('#order-form').slideToggle('slow')
//                     $('#order-ready').slideToggle('slow')
//                 }.bind(this))
//             }
//         },
//         closeForm:function(){
//             $('#order-form').slideToggle('slow')
//             $('#choose-size').slideToggle('slow')
//         },
//         reopenForm:function(){
//             $('#order-ready').slideToggle('slow')
//             $('#choose-size').slideToggle('slow')
//         },
//         openForm:function(size){
//             this.formData.size = size;
//             $('#choose-size').slideToggle('slow')
//             $('#order-form').slideToggle('slow')
//         }
//     },
//     template:
//         '<div id="order">'+
//             '<div class="row r-m" id="choose-size">'+
//                 '<div class="col-md-12 text-center">'+
//                     '<h4 class="green" style="margin-top:40px;margin-bottom:0px">Vaivaton palvelu</h4>'+
//                     '<h2 class="gray" style="margin-top:0px;">Tilaa videotuotanto</h2>'+
//                 '</div>'+
//                 '<div class="col-md-8 col-md-offset-2 col-xs-12">'+
//                     '<div class="row">'+
//                         '<div class="col-md-4 text-center">'+
//                             '<div id="well1" class="well well-order">'+
//                                 '<center>'+
//                                     ' <img class="package-size-img" src="./images/luovat_s.png">'+
//                                 '</center>'+
//                                 '<h4>790€</h4>'+
//                                 '<p class="mini">Pienin pakettimme sisältää muutaman tunnin kuvauksen sekä yhden päivän jälkituotannon. Paketti soveltuu esimerkiksi haastatteluiden taltiontiin.</p>'+
//                                 '<order-button size="s"></order-button>'+
//                             '</div>'+
//                         '</div>'+
//                         '<div class="col-md-4 text-center">'+
//                             '<div id="well2" class="well well-order">'+
//                                 '<center>'+
//                                     '<img class="package-size-img" src="./images/luovat_m.png">'+
//                                 '</center>'+
//                                 '<h4>990€</h4>'+
//                                 '<p class="mini">Keskikokoinen pakettimme mahdollistaa puolen päivän kuvauksen sekä joustavamman jälkituotannon. Paketti soveltuu esimerkiksi tapahtumien taltiointiin.</p>'+
//                                 '<order-button size="m"></order-button>'+
//                             '</div>'+
//                         '</div>'+
//                         '<div class="col-md-4 text-center">'+
//                             '<div id="well3" class="well well-order">'+
//                                 '<center>'+
//                                     '<img class="package-size-img" src="./images/luovat_l.png">'+
//                                 '</center>'+
//                                 '<h4>1390€</h4>'+
//                                 '<p class="mini">Iso pakettimme tarjoaa esituotantoa, kokonaisen kuvauspäivän sekä laajemman jälkituotannon. Kyseinen tuotanto mahdollistaa mm. yritysvideon.</p>' +
//                                 '<order-button size="l"></order-button>'+
//                             '</div>'+
//                         '</div>'+
//                     '</div>'+
//                 '</div>'+
//             '</div>'+
//             '<div class="row r-m" id="order-form" style="display:none;">'+
//                 '<div class="col-md-8 col-md-offset-2 col-lg-6 col-lg-offset-3">'+
//                     '<center>'+
//                         '<h4 class="green" style="">Kerro minkälaisen videon haluaisit</h4>'+
//                         '<h1 class="gray" style="margin-top:0px;"><img height:40px v-bind:src="packageImageSrc()"/></h1><br>'+
//                     '</center>'+
//                     '<div class="row text-center">'+
//                         '<h4>Anna nimesi sekä sähköpostiosoitteesi ja kerro tarpeestasi</h4>'+
//                         '<div class="col-md-6">'+
//                             '<div class="text-center">'+
//                                 '<input class="form-control" type="text" placeholder="Nimesi" v-model="formData.name"></input><br>'+         
//                             '</div>'+
//                         '</div>'+
//                         '<div class="col-md-6">'+
//                             '<div class="text-center">'+
//                                 '<input class="form-control" type="email" placeholder="Sähköpostiosoite" v-model="formData.email"></input><br>'+      
//                             '</div>'+
//                         '</div>'+
//                         '<div class="col-md-12 p15" style="padding-top:0px;">'+
//                             '<textarea class="form-control" rows="5" type="text" placeholder="Kerro lyhyesti mitä tarvitset" v-model="formData.message"></textarea><br>'+
//                         '</div>'+
//                         '<h4>Voit myös antaa seuraavat lisätiedot</h4>'+
//                         '<div class="col-md-6">'+
//                             '<div class="text-center">'+
//                                 '<input class="form-control" type="text" placeholder="Kaupunki" v-model="formData.eventCity"></input><br>'+
//                                 '<input class="form-control" type="date" v-model="formData.date"></input><br>'+          
//                             '</div>'+
//                         '</div>'+
//                         '<div class="col-md-6">'+
//                             '<div class="text-center">'+
//                                 '<input class="form-control" type="text" placeholder="Yritys" v-model="formData.company"></input><br>'+
//                                 '<input class="form-control" type="email" placeholder="Puhelinnumero" v-model="formData.phone"></input><br>'+      
//                             '</div>'+
//                         '</div>'+
//                         '<div class="col-md-12" style="padding-top:0px;">'+
//                             '<label class="green m10" for="12" >  Tekstitys +50€</label>'+
//                             '<input type="checkbox" id="a1" v-model="formData.add1">'+
//                             '<label class="green m10" for="a2" >  Ilmakuvaus +100€</label>'+
//                             '<input type="checkbox" id="a2" v-model="formData.add2">'+
//                             '<label class="green m10" for="a3" >  Voice over +100 - 300€ </label>'+
//                             '<input type="checkbox" id="a3" v-model="formData.add3">'+
//                         '</div>'+
//                         '<div class="col-md-12">'+
//                             '<button v-on:mouseover="whyDisabled"  v-on:click="postOrder()" class="btn btn-xs btn-success-shallow">Lähetä tilaus</button>'+
//                             '<button v-on:click="closeForm()" class="btn btn-xs btn-danger-shallow">Peruta</button>'+   
//                         '</div>'+
//                         '<div class="col-md-12">'+
//                             '<div v-if="showErrors"class="btn-danger-shallow">'+
//                                 '<p>{{ errorMsg }}</p>'+
//                             '</div>'+ 
//                         '</div>'+
//                     '</div>'+
//                 '</div>'+
//             '</div>'+
//             '<div class="row" id="order-ready" style="display:none;">'+
//                 '<div class="col-md-6 col-md-offset-3">'+
//                     '<h3 class="green">Kiitos</h3>'+
//                     '<h1>Olemme vastaanottaneet tilauksesi</h1><br>'+
//                     '<p>Saat vahvistuksen sekä listan kuvaajista hetken kuluttua sähköpostiisi.</p>'+
//                     '<button v-on:click="reopenForm()" class="btn btn-success-shallow">Alkuun</button>'+
//                 '</div>'+
//             '</div>'+
//         '</div>'
// });

//VUE COMPONENTS
Vue.component('order-form',{
    props:['formData','errorMsg','showErrors','date'],
    created:function(){
        this.formData = {
            name:'',
            company:'',
            email:'',
            phone:'',
            message:'',
            size:'',
            add1:false,
            add2:false,
            add3:false
        }
        this.errorMsg = '';
        this.showErrors = false;
    },
    methods:{
        validForm:function(){
            var o = this.formData;
            var validate = true;
            if(!o.name && o.name.length < 3 && !o.company && o.company.length < 3) validate = false;
            if(!validateEmail(o.email) && !validatePhone(o.phone)) validate = false;
            if(!o.message) validate = false;
            return validate
        },
        packageImageSrc:function(){
            return './images/luovat_'+this.formData.size+'.png'
        },
        addErrorMsg:function(msg){
            this.errorMsg =  this.errorMsg + msg;
        },
        whyDisabled:function(){
            var o = this.formData;
            this.errorMsg  = "";
            if(!o.name && o.name.length < 3 && !o.company && o.company.length < 3) this.addErrorMsg('Anna oma nimesi tai yrityksen nimi. ')
            if(!o.message) this.addErrorMsg('Kerro viestissä, minkä laisen videon haluaisit tehdä. ')
            if(!validateEmail(o.email) && !validatePhone(o.phone)) this.addErrorMsg('Lisää sähköposti tai puhelinumero yhteydenottoa varten. ')
            if(this.errorMsg.length > 0){
                this.showErrors = true
            }else{
                this.showErrors = false
            }    
        },
        postOrder:function(){
            if(this.formData.name.length > 2 && this.formData.email.length > 2){
                $.post('/orders/new',{
                    name:this.formData.name,
                    company:this.formData.company,
                    email:this.formData.email,
                    message:this.formData.message,
                    city:this.formData.eventCity,
                    date:this.formData.date,
                    phone:this.formData.phone,
                    size:this.formData.size,
                    add1:this.formData.add1,
                    add2:this.formData.add2,
                    add3:this.formData.add3
                },function(response){
                    this.formData.name = "";
                    this.formData.company = "";
                    this.formData.email = "";
                    this.formData.message = "";
                    this.formData.eventCity = "";
                    this.formData.date = "";
                    this.formData.phone = "";    
                    this.formData.size = "";
                    this.formData.add1 = "";
                    this.formData.add2 = "";
                    this.formData.add3 = "";
                    $('#ask-additional').hide()
                    $('#ready').fadeIn()
                }.bind(this))
            }
        },
        newOrder:function(){
            $('#ready').hide()
            $('#select-size').fadeIn()
        },
        openForm:function(size){
            this.formData.size = size;
            $('#select-size').hide()
            $('#ask-name').fadeIn()
        },
        askEmail:function(){
            if(!this.formData.name || this.formData.name.length < 3){
                alert('Muista antaa oikea nimesi')
                return;
            }
            $('#ask-name').hide()
            $('#ask-email').fadeIn()
        },
        askMsg:function(){
            if(!this.formData.email || !validateEmail(this.formData.email)){
                alert('Sähköpostiosoitteessa on jotain kummaa!')
                return;
            }
            $('#ask-email').hide()
            $('#ask-message').fadeIn()
        },
        askAdditional:function(){
            if(!this.formData.message){
                alert('Kerro videotuotantotarpeestasi luoville')
                return;
            }
            $('#ask-message').hide()
            $('#ask-additional').fadeIn()
        },
    },
    template:

        '<div class="col-md-10 col-md-offset-1">'+
            '<div id="select-size">'+
                '<div class="col-md-12"><span><a class="btn btn-sm green btn-luovat">Miten tilaan</a> <a class="btn green btn-sm btn-luovat">Vertaile paketteja</a></span></div>'+
                '<order-size style="padding:5px" caption="PIENI" class="col-md-4" size="s" price="790" description="Pienin pakettimme sisältää muutaman tunnin kuvauksen sekä yhden päivän jälkituotannon. Paketti soveltuu esimerkiksi haastatteluiden taltiontiin."></order-size>'+
                '<order-size style="padding:5px" caption="MEDIUM" class="col-md-4" size="m" price="990" description="Keskikokoinen pakettimme mahdollistaa puolen päivän kuvauksen sekä joustavamman jälkituotannon. Paketti soveltuu esimerkiksi tapahtumien taltiointiin."></order-size>'+
                '<order-size style="padding:5px" caption="ISO" class="col-md-4" size="l" price="1390" description="Iso pakettimme tarjoaa esituotantoa, kokonaisen kuvauspäivän sekä laajemman jälkituotannon. Kyseinen tuotanto mahdollistaa mm. yritysvideon."></order-size>'+
            '</div>'+
            '<div id="ask-name" class="r-m"style="display:none;">'+
                '<center>'+
                    '<h3 class="opensans">Valitsit {{ formData.size }}-kokoisen paketin.</h3>'+
                    '<p>Tarvitsemme muutamia vielä tietoja tilauksen tekemiseen.</p>'+
                    '<input class="order-form-input" placeholder="Nimesi" v-model="formData.name"></input><button class="order-form-button" v-on:click="askEmail()">Seuraava</button>'+
                '</center>'+
            '</div>'+
            '<div id="ask-email" class="r-m"style="display:none;">'+
                '<center>'+
                    '<p>Saat sähköpostiisi yhteenvedon tilauksesta</p>'+
                    '<input class="order-form-input" placeholder="Sähköpostiosoitteesi" v-model="formData.email"></input><button class="order-form-button"  v-on:click="askMsg()">Seuraava</button>'+
                '</center>'+
            '</div>'+
            '<div id="ask-message" class="col-sm-8 col-sm-offset-2 r-m" style="display:none;">'+
                '<center>'+
                    '<p>Kerro viestissä lyhyesti, minkä laisesta työstä on kyse? Mitä kaikkea videotuotannossa tulisi olla?</p>'+
                    '<textarea rows="10" class="form-control order-form-input-area" placeholder="Viesti luoville" v-model="formData.message"></textarea>'+
                    '<button class="btn btn-sm m5 btn-luovat-green" v-on:click="askAdditional()">Seuraava</button>'+
                '</center>'+
            '</div>'+
            '<div id="ask-additional" class="col-sm-8 col-sm-offset-2 r-m" style="display:none;">'+
                '<center>'+
                    '<h3 class="opensans">Melkein valmista {{ formData.name }}!</h3>'+
                    '<p>Voit täyttää vielä valitsemasi lisätiedot tässä tai lähettää tilauksen.</p>'+
                    '<input class="form-control m5 order-form-input-area" placeholder="Yritys" v-model="formData.company"></input>'+
                    '<input class="form-control m5 order-form-input-area" placeholder="Puhelin" v-model="formData.phone"></input>'+
                    '<input class="form-control m5 order-form-input-area" placeholder="Kaupunki" v-model="formData.eventCity"></input>'+
                    '<input class="form-control m5 order-form-input-area" placeholder="Päivä" type="date" v-model="formData.date"></input><br>'+ 

                    '<label class="green m10" for="12" >  Tekstitys +50€</label>'+
                    '<input type="checkbox" id="a1" v-model="formData.add1">'+
                    '<label class="green m10" for="a2" >  Ilmakuvaus +100€</label>'+
                    '<input type="checkbox" id="a2" v-model="formData.add2">'+
                    '<label class="green m10" for="a3" >  Voice over +100 - 300€ </label>'+
                    '<input type="checkbox" id="a3" v-model="formData.add3">'+

                    '<button class="btn btn-lg btn-luovat" v-on:click="postOrder()">Lähetä tilaus</button>'+
                '</center>'+
            '</div>'+
            '<div id="ready" class="col-sm-8 col-sm-offset-2 r-m" style="display:none;">'+
                '<center>'+
                    '<h1 class="opensans">Olemme vastaanottaneet tilauksenne</h1>'+
                    '<button class="btn btn-lg btn-luovat" v-on:click="newOrder()">Tee uusi tilaus</button>'+
                '</center>'+
            '</div>'+
        '</div>'
});

Vue.component('order-size',{
    props:['size','img','description','price','caption'],
    created:function(){
        console.log(this.size)
        this.img = '../images/luovat_'+this.size+'.png'
    },
    methods:{
        openForm:function(size){
            this.$parent.openForm(size)
        }
    },
    template:
    '<div style="padding:5px;">'+
        '<div class="well-order" v-on:click="openForm(size)">'+
            '<center>'+
                '<p>Valitse</p>'+
                '<img class="package-size-img" v-bind:src="img">'+
                '<h2 class="opensans">{{ caption }}</h2>'+
            '</center>'+
            '<p class="white opensans mini">{{ description }}</p>'+
            '<center>'+
            '<h2 class="opensans">{{ price }}€</h2>'+
            '</center>'+
        '</div>'+
    '</div>'
})

Vue.component('order-button',{
    props:['size'],
    methods:{
        openForm:function(size){
            this.$parent.openForm(size)
        }
    },
    template:'<button class="btn btn-success-shallow m20 btn-sm" v-on:click="openForm(size)">Valitse</button>'
})

Vue.component('rekry-button',{
    props:['size'],
    template:'<button class="btn btn-success-shallow m20 btn-lg" v-on:click="openForm(size)">Hae paikkaa</button>'
})

Vue.component('rekry-form',{
    props:['form'],
    created:function(){
        this.form = {
            firstName:'',
            lastName:'',
            phone:'',
            email:'',
            message:''
        }
    },
    template:
        '<div>'+
            '<div class="col-md-3 col-md-offset-3">'+
                '<div class="form-group">'+
                    '<label for="firstName">Etunimi</label>'+
                    '<input class="form-control" type="text" id="firstName" v-model="form.firstName"></input>'+
                    '<label for="lastName" >Sukunimi</label>'+
                    '<input class="form-control" type="text" id="lastName" v-model="form.lastName"></input>'+
                '</div>'+
            '</div>'+
            '<div class="col-md-3">'+
                '<div class="form-group">'+
                    '<label for="phone" >Puhelin</label>'+
                    '<input class="form-control" type="text" id="phone" v-model="form.phone"></input>'+
                    '<label for="email" >Sähköposti</label>'+
                    '<input class="form-control" type="text" id="email" v-model="form.email"></input>'+
                '</div>'+
            '</div>'+
            '<div class="col-md-6 col-md-offset-3">'+
                '<div class="form-group">'+
                    '<label for="message" >Vapaa viesti luoville</label>'+
                    '<textarea rows="5" class="form-control" type="text" id="message" v-model="form.message"></textarea>'+
                '</div>'+
            '</div>'+
        '</div>'
})

new Vue({
    el:'#mainApp'
})