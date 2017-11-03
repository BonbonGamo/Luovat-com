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
                '<h3 class="white price">{{ price }}€</h3>'+
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

$(document).ready(function(){
    $('#video-modal').on('hidden', function () {
        document.getElementById("videoPlayer").get(0).stop();
    })

    $('#play-sample-video').click(function(){
        console.log('sample')
        $('#videoSource').attr('src','./video/order.mp4');
        $("#video-modal").modal(function(){
            document.getElementById("videoPlayer").get(0).play();
        });
    })

    $('#play-rekry-video').click(function(){
        console.log('rekry')
        $('#videoSource').attr('src','./video/rekry.mp4');
        $("#video-modal").modal(function(){
            document.getElementById("videoPlayer").get(0).play();
        });
    })
})



//SMOOTH SCROLL
// Select all links with hashes
$('a[href*="#"]')
  // Remove links that don't actually link to anything
  .not('[href="#"]')
  .not('[href="#0"]')
  .click(function(event) {
    // On-page links
    if (
      location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') 
      && 
      location.hostname == this.hostname
    ) {
      // Figure out element to scroll to
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      // Does a scroll target exist?
      if (target.length) {
        // Only prevent default if animation is actually gonna happen
        event.preventDefault();
        $('html, body').animate({
          scrollTop: target.offset().top
        }, 1000, function() {
          // Callback after animation
          // Must change focus!
          var $target = $(target);
          $target.focus();
          if ($target.is(":focus")) { // Checking if the target was focused
            return false;
          } else {
            $target.attr('tabindex','-1'); // Adding tabindex for elements not focusable
            $target.focus(); // Set focus again
          };
        });
      }
    }
  });