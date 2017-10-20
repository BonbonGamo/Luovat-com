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
    props:['formData','errorMsg','showErrors','date','tip'],
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
        this.tip = ''
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
                    this.tip = 'Olemme nyt vastaanottaneet tilauksen ja voitte poistua sivulta. Jos sinulle kuitenkin jäi vielä kysyttävää voit olla yhteydessä meihin osoitteessa info@luovat.com'
                    $('.hide-order-form').hide()
                    $('#ready').fadeIn()
                }.bind(this))
            }
        },
        newOrder:function(){
            this.tip = ''
            $('.hide-order-form').hide()
            $('#select-size').fadeIn()
        },
        openForm:function(size){
            this.formData.size = size;
            this.tip = 'Valitsit '+this.formData.size.toUpperCase() + '-kokoisen paketin. Tarvitsemme hieman tietoja tilausta varten'
            $('.hide-order-form').hide()
            $('#askFirst').fadeIn()
        },
        askAdditional:function(){
            if(!this.formData.message || !this.formData.name || this.formData.name.length < 3 || !this.formData.email || !validateEmail(this.formData.email)){
                alert('Täyty tilaajan tiedot oikein')
                return;
            }
            this.tip = 'Hienoa '+ this.formData.name+'! Voit täyttää vielä valitsemasi lisätiedot tästä tai lähettää tilauksen sellaisenaan. Olet valinnut ' + this.formData.size.toUpperCase() + '-kokoisen paketin. Olemme ensisijaisesti yhteydessä sähköpostiosoitteeseen ' + this.formData.email
            $('.hide-order-form').hide()
            $('#ask-additional').fadeIn()
        },
    },
    template:
        '<div class="col-md-10 col-md-offset-1">'+
            '<div class="col-sm-6 col-sm-offset-3">'+
                '<center>'+
                    '<h2 class="opensans">'+
                        'TILAA VIDEOTUOTANTO'+
                    '</h2>'+
                    '<p class="opensans">'+
                        '{{ tip }}'+
                    '</p>'+
                '</center>'+
            '</div>'+
            '<div id="select-size" class="hide-order-form">'+
                '<div class="col-md-12 text-center m10"><span><a class="btn btn-xs green btn-luovat">Miten tilaan</a> <a class="btn green btn-xs btn-luovat">Vertaile paketteja</a></span></div>'+
                '<order-size small="Valitse" caption="SMALL" class="col-md-4" size="s" price="790" description="Pienin pakettimme sisältää muutaman tunnin kuvauksen sekä yhden päivän jälkituotannon. Paketti soveltuu esimerkiksi haastatteluiden taltiontiin."></order-size>'+
                '<order-size small="Valitse" caption="MEDIUM" class="col-md-4" size="m" price="990" description="Keskikokoinen pakettimme mahdollistaa puolen päivän kuvauksen sekä joustavamman jälkituotannon. Paketti soveltuu esimerkiksi tapahtumien taltiointiin."></order-size>'+
                '<order-size small="Valitse" caption="LARGE" class="col-md-4" size="l" price="1390" description="Iso pakettimme tarjoaa esituotantoa, kokonaisen kuvauspäivän sekä laajemman jälkituotannon. Kyseinen tuotanto mahdollistaa mm. yritysvideon."></order-size>'+
            '</div>'+
            '<div id="askFirst" class="hide-order-form green col-sm-6 col-sm-offset-3"style="display:none;">'+
                '<center>'+
                    '<h3 class="opensans">1/2 Tilaajan tiedot </h3>'+
                '</center>'+
                '<input class="form-control m5 order-form-input" placeholder="Nimesi" v-model="formData.name"></input>'+
                '<input class="form-control m5 order-form-input" placeholder="Sähköpostiosoitteesi" type="email" v-model="formData.email">'+
                '<textarea rows="10" class="form-control m5 order-form-input-area" placeholder="Kerro meille videotarpeestasi" v-model="formData.message"></textarea>'+
                '<center>'+
                    '<button class="btn btn-sm btn-luovat" v-on:click="newOrder()">Peruuta</button><button class="btn btn-sm btn-luovat" v-on:click="askAdditional()">Seuraava</button>'+
                '</center>'+
            '</div>'+
            '<div id="ask-additional" class="hide-order-form green col-sm-6 col-sm-offset-3" style="display:none;">'+
                '<center>'+
                    '<h3 class="opensans">2/2 Lisätiedot ja tilauksen lähetys </h3>'+
                '</center>'+
                '<input class="form-control m5 order-form-input-area" placeholder="Yritys" v-model="formData.company"></input>'+
                '<input class="form-control m5 order-form-input-area" placeholder="Puhelin" v-model="formData.phone"></input>'+
                '<input class="form-control m5 order-form-input-area" placeholder="Kaupunki" v-model="formData.eventCity"></input>'+
                '<input class="form-control m5 order-form-input-area" placeholder="Päivä" type="date" v-model="formData.date"></input>'+ 
                '<label class="green m10" for="12" >  Tekstitys +50€</label>'+
                '<input type="checkbox" id="a1" v-model="formData.add1"><br>'+
                '<label class="green m10" for="a2" >  Ilmakuvaus +100€</label>'+
                '<input type="checkbox" id="a2" v-model="formData.add2"><br>'+
                '<label class="green m10" for="a3" >  Voice over +100 - 300€ </label>'+
                '<input type="checkbox" id="a3" v-model="formData.add3"><br><br>'+
                '<center>'+
                    '<button class="btn btn-sm btn-luovat" v-on:click="newOrder()">Peruuta</button><button class="btn btn-sm btn-luovat" v-on:click="postOrder()">Lähetä tilaus</button>'+
                '</center>'+
            '</div>'+
            '<div id="ready" class="bg-white hide-order-form col-sm-8 col-sm-offset-2 r-m" style="display:none;">'+
                '<center>'+
                    '<button class="btn btn-lg r-m btn-luovat" v-on:click="newOrder()">Tee uusi tilaus</button>'+
                '</center>'+
            '</div>'+
            '<div class="col-xs-12" style="margin-top:30px;">'+
                '<center>'+
                    '<p>Tilaus	ei	ole	sitova	ja sen	lähettäminen on maksutonta.	Olemme	sinuun	yhteydessä vahvistaaksemme	tilauksen.</p>'+
                '</center>'+
            '</div>'+
        '</div>'
});

Vue.component('order-size',{
    props:['size','img','description','price','caption','small','bgId'],
    mounted:function(){
        console.log(this.size)
        this.img = '../images/luovat_'+this.size+'.png';
        this.bgId = 'well-'+this.size;
    },
    updated:function(){
        console.log(this.size)
        this.img = '../images/luovat_'+this.size+'.png';
        this.bgId = 'well-'+this.size;
    },
    methods:{
        openForm:function(size){
            this.$parent.openForm(size)
        }
    },
    template:
    '<div>'+
        '<div class="well-order" v-on:click="openForm(size)">'+
            '<div v-bind:id="bgId" class="well-order-inner">'+
            '</div>'+
             '<div class="well-order-content">'+
                '<p class="white" style="font-size:10px;transform:translateY(40px)">{{ small }}</p>'+
                '<h2 style="line-height:50px;" class="white opensans">{{ caption }}</h2>'+
                '<p class="white opensans" style="font-size:20px;">{{ description }}</p>'+
                '<p class="white" style="font-size:10px;transform:translateY(25px)">Hinta alv 0%</p>'+
                '<h3 class="white opensans">{{ price }}€</h3>'+
            '</div>'+
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
        '<div class="row">'+
            '<div class="col-md-6">'+
                '<div class="form-group">'+
                    '<input class="order-form-input-area form-control" type="text" placeholder="Etunimi" id="firstName" v-model="form.firstName"></input><br>'+
                    '<input class="order-form-input-area form-control" type="text" placeholder="Sukunimi" id="lastName" v-model="form.lastName"></input>'+
                '</div>'+
            '</div>'+
            '<div class="col-md-6">'+
                '<div class="form-group">'+
                    '<input class="order-form-input-area form-control" placeholder="Puhelinnumero" type="text" id="phone" v-model="form.phone"></input><br>'+
                    '<input class="order-form-input-area form-control" placeholder="Sähköposti" type="text" id="email" v-model="form.email"></input>'+
                '</div>'+
            '</div>'+
            '<div class="col-md-12">'+
                '<div class="form-group">'+
                    '<label class="green" for="message" >Vapaa viesti luoville</label>'+
                    '<textarea rows="5" class="order-form-input-area form-control" placeholder="Kerro itsestäsi. Miksi sinut pitäisi rekrytoida luoviin?" type="text" id="message" v-model="form.message"></textarea>'+
                '</div>'+
            '</div>'+
            '<div class="col-md-12 text-center">'+
                '<button class="btn-luovat btn btn-sm">Lähetä</button><button class="btn-luovat btn btn-sm" data-dismiss="modal">Sulje</button>'+
            '</div>'+
        '</div>'
})

new Vue({
    el:'#mainApp'
})