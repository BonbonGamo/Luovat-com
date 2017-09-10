//VUE COMPONENTS



Vue.component('order-form',{
    props:['formData'],
    created:function(){
        this.formData = {
            name:'',
            email:'',
            phone:'',
            message:'',
            size:'',
            add1:false,
            add2:false,
            add3:false
        }
    },
    methods:{
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
                    $('#order-form').slideToggle('slow')
                    $('#order-ready').slideToggle('slow')
                }.bind(this))
            }
        },
        closeForm:function(){
            $('#order-form').slideToggle('slow')
            $('#choose-size').slideToggle('slow')
        },
        reopenForm:function(){
            $('#order-ready').slideToggle('slow')
            $('#choose-size').slideToggle('slow')
        },
        openForm:function(size){
            this.formData.size = size;
            $('#choose-size').slideToggle('slow')
            $('#order-form').slideToggle('slow')
        }
    },
    template:
        '<div>'+
            '<div class="row" id="choose-size">'+
                '<div class="col-md-12 text-center">'+
                    '<h4 class="green" style="margin-top:40px;margin-bottom:0px">Vaivaton palvelu</h4>'+
                    '<h1 class="gray" style="margin-top:0px;">Tilaa videotuotanto</h1>'+
                '</div>'+
                '<div class="col-md-8 col-md-offset-2">'+
                    '<div class="col-md-4 p30 text-center">'+
                    '<center>'+
                    ' <img class="package-size-img" src="./images/luovat_s.png">'+
                    '</center>'+
                    '<h4>790€</h4>'+
                    '<p class="mini">Pienin pakettimme sisältää muutaman tunnin kuvauksen sekä yhden päivän jälkituotannon. Paketti soveltuu esimerkiksi haastatteluiden taltiontiin.</p>'+
                    '<order-button size="s"></order-button>'+
                    '</div>'+
                    '<div class="col-md-4 p30 text-center">'+
                    '<center>'+
                        '<img class="package-size-img" src="./images/luovat_m.png">'+
                    '</center>'+
                    '<h4>990€</h4>'+
                    '<p class="mini">Keskikokoinen pakettimme mahdollistaa puolen päivän kuvauksen sekä joustavamman jälkituotannon. Paketti soveltuu esimerkiksi tapahtumien taltiointiin.</p>'+
                    '<order-button size="m"></order-button>'+
                    '</div>'+
                    '<div class="col-md-4 p30 text-center">'+
                    '<center>'+
                        '<img class="package-size-img" src="./images/luovat_l.png">'+
                    '</center>'+
                    '<h4>1390€</h4>'+
                    '<p class="mini">Iso pakettimme tarjoaa esituotantoa, kokonaisen kuvauspäivän sekä laajemman jälkituotannon. Kyseinen tuotanto mahdollistaa mm. yritysvideon.</p>' +
                    '<order-button size="l"></order-button>'+
                    '</div>'+
                '</div>'+
            '</div>'+
            '<div class="row" id="order-form" style="display:none;">'+
                '<div class="col-md-8 col-md-offset-2 text-center">'+
                    '<h2>Kerro minkälaisen videon haluaisit</h2><br>'+
                '</div>'+
                '<div class="col-md-6 col-md-offset-3 col-lg-4 col-lg-offset-4">'+
                    '<div class="row">'+
                        '<div class="col-md-6">'+
                            '<div class="text-center">'+
                                '<input class="form-control" type="text" placeholder="Nimesi" v-model="formData.name"></input><br>'+
                                '<input class="form-control" type="email" placeholder="Sähköpostiosoite" v-model="formData.email"></input><br>'+
                                '<input class="form-control" type="text" placeholder="Kaupunki" v-model="formData.eventCity"></input><br>'+           
                            '</div>'+
                        '</div>'+
                        '<div class="col-md-6">'+
                            '<div class="text-center">'+
                                '<input class="form-control" type="text" placeholder="Yritys" v-model="formData.company"></input><br>'+
                                '<input class="form-control" type="email" placeholder="Puhelinnumero" v-model="formData.phone"></input><br>'+
                                '<input class="form-control" type="date" v-model="formData.date"></input><br>'+      
                            '</div>'+
                        '</div>'+
                        '<div class="col-md-12 p15" style="padding-top:0px;">'+
                            '<textarea class="form-control" rows="5" type="text" placeholder="Kerro lyhyesti mitä tarvitset" v-model="formData.message"></textarea><br>'+
                            '<label class="green m10" for="12" >  Tekstitys +50€</label>'+
                            '<input type="checkbox" id="a1" v-model="formData.add1">'+
                            '<label class="green m10" for="a2" >  Ilmakuvaus +100€</label>'+
                            '<input type="checkbox" id="a2" v-model="formData.add2">'+
                            '<label class="green m10" for="a3" >  Voice over +100 - 300€ </label>'+
                            '<input type="checkbox" id="a3" v-model="formData.add3">'+
                            '<button v-on:click="postOrder()" class="btn btn-xs btn-success-shallow">Lähetä tilaus</button>'+
                            '<button v-on:click="closeForm()" class="btn btn-xs btn-danger-shallow">Peruta</button>'+
                        '</div>'+
                    '</div>'+
                '</div>'+
                '<div class="col-md-3 col-lg-2">'+
                    '<div class="well well-md">'+
                        '<h3 class="green">Ehdot ja ohjeet</h3>'+
                        '<p>Tilauksen tekeminen ei aiheuta kustannuksia eikä tilaus ole sitova. Saat tilauskoosteen ja voit valita yhden tarjoamistamme kuvaajista.<br></br>Voit sopia yksityiskohdista kuvaajan kanssa yhdessä, ja kun kaikki on sovittu laskutamme 20% tuotannon kokonaishinnasta.<br><br>Video kuvataan sovittuna ajankohtana, jonka jälkeen video leikataan ja korjataan vastaamaan toiveitasi. Lopuksi saat huikean videon sekä loppulaskun, jossa on huomioitu.</p>'+
                    '</div>'+
                '</div>'+
                '<div class="col-md-10 col-md-offset-1">'+
                    '<center>'+
                        
                    '</center>'+
                '</div>'+
            '</div>'+
            '<div class="row" id="order-ready" style="display:none;">'+
                '<div class="col-md-6 col-md-offset-3">'+
                    '<h3 class="green">Kiitos</h3>'+
                    '<h1>Olemme vastaanottaneet tilauksesi</h1><br>'+
                    '<p>Saat vahvistuksen sekä listan kuvaajista hetken kuluttua sähköpostiisi.</p>'+
                    '<button v-on:click="reopenForm()" class="btn btn-success-shallow">Alkuun</button>'+
                '</div>'+
            '</div>'+
        '</div>'
});

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

new Vue({
    el:'#mainApp'
})