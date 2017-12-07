//TODO : freePending
//       invoice20
//       invoice100
//       close

Vue.component('add-user',{
    props:['firstName','lastName','message'],
    methods:{
        postNewUser:function(){
            if(this.firstName.length > 2 && this.lastName.length > 2){
                $.post('/artists/new',{firstName:this.firstName,lastName:this.lastName},function(response){
                    alert('Käyttäjä lisätty')
                }.bind(this))
            }
        }
    },
    template:'<div class="panel panel-default">'+
                '<div class="panel-heading">Lisää käyttäjä</div>'+
                '<div class="panel-body">'+
                    '<label for="fn">Etunimi: <span v-if="firstName && firstName.length > 2"> OK! </span></label>'+
                    '<input class="form-control" id="fn" type="text" v-model="firstName">'+
                    '<label for="ln" >Sukunimi: <span v-if="lastName && lastName.length > 2"> OK! </span></label>'+
                    '<input class="form-control" id="ln" type="text" v-model="lastName">'+
                    '<br>'+
                    '<button class="btn btn-success" v-on:click="postNewUser()">Luo käyttäjä</button>'+
                '</div>'+
            '</div>'
})

Vue.component('add-order',{
    props:['name','email','message','phone','size','add1','add2','add3'],
    created:function(){
        this.add1 = false;
        this.add2 = false;
        this.add3 = false;
    },
    methods:{
        postNewOrder:function(){
            if(this.name.length > 2 && this.email.length > 2){
                $.post('/orders/new',{
                    name:this.name,
                    email:this.email,
                    message:this.message,
                    phone:this.phone,
                    size:this.size,
                    add1:this.add1,
                    add2:this.add2,
                    add3:this.add3
                },function(response){
                    this.name = ""
                    this.email = ""
                    this.message = ""
                    this.phone = ""
                    this.size = ""
                    this.add1 = ""
                    this.add2 = ""
                    this.add3 = ""
                    alert('Tilaus lisätty')
                    this.$parent.updateOrders();
                }.bind(this))
            }
        }
    },
    computed:{
        validPhone:function(){
            return validatePhone(this.phone);
        },
        validEmail:function(){
            return validateEmail(this.email);
        }
    },
    template:'<div class="panel panel-default">'+
                '<div class="panel-heading">Tee tilaus</div>'+
                '<div class="panel-body">'+
                    '<label for="nm">Tilaajan nimi: <span class="isOk" v-if="name && name.length > 2"> OK! </span></label>'+
                    '<input class="form-control" id="nm" type="text" v-model="name">'+
                    '<label for="em" >Sähköpostiosoite <span class="isOk" v-if="validEmail"> OK! </span></label>'+
                    '<input class="form-control" id="em" type="text" v-model="email">'+
                    '<label for="ph" >Puhelinnumero <span class="isOk" v-if="validPhone"> OK! </span></label>'+
                    '<input class="form-control" id="ph" type="text" v-model="phone">'+
                    '<label for="ms" >Viesti Luoville </label>'+
                    '<textarea class="form-control" id="ms" type="text" v-model="message" rows="5"></textarea>'+
                    '<br>'+
                    '<br>'+
                    '<p>Paketti:</p>'+
                    '<label for="ss" >S</label>'+
                    '<input type="radio" id="ss" v-model="size" value="s">'+
                    '<label for="sm" >M</label>'+
                    '<input type="radio" id="sm" v-model="size" value="m">'+
                    '<label for="sl" >L</label>'+
                    '<input type="radio" id="sl" v-model="size" value="l">'+
                    '<br>'+
                    '<br>'+
                    '<p>Lisävalinnat:</p>'+
                    '<label for="a1" >S  </label>'+
                    '<input type="checkbox" id="a1" v-model="add1">'+
                    '<label for="a2" >M  </label>'+
                    '<input type="checkbox" id="a2" v-model="add2">'+
                    '<label for="a3" >L  </label>'+
                    '<input type="checkbox" id="a3" v-model="add3">'+
                    '<br>'+
                    '<br>'+
                    '<br>'+
                    '<button class="btn btn-success" v-on:click="postNewOrder()">Luo tilaus</button>'+
                '</div>'+
            '</div>'
})


Vue.component('rekry-button',{
    props:['userid'],
    methods:{
        activateUser:function(){
            $.post('/artists/activate-user/'+this.userid)
            .then(function(response){
                this.$parent.updateUsers(); 
            }.bind(this))
        },
    },
    template:'<button class="btn btn-success m5 w100" v-on:click="activateUser()">Rekrytoi</button>'
})

Vue.component('rekry',{
    props:['users','length'],
    created:function(){
        this.loadUsers();
    },
    methods:{
        loadUsers:function(){
            $.get('/artists/rekry')
            .then(function(response){
                $.each(response,function(key,object){
                    object.hashId = '#' + object.id     //MAKE "#id" + "" for bootstrap
                    if(object.activeUser){
                        users.push(object)
                    }
                    return;
                })
                this.length = response.length;
                this.users = response;
            }.bind(this))
        }
    },
    template:
    '<div class="panel panel-default">'+
        '<div class="panel-heading">Rekry<span class="panel-heading-pull-right"><i class="fa fa-user-o" aria-hidden="true"></i> {{ length }}  <a class="btn btn-xs btn-success" v-on:click="loadUsers()">Päivitä</a></span></div><div class="panel-body  panel700">'+
            '<div class="panel-group" v-for="user in users">'+
                '<div class="panel panel-primary">'+
                    '<div class="panel-heading pp-pointer" data-toggle="collapse" v-bind:data-target="user.hashId">'+
                        '{{ user.firstName }}  {{ user.lastName }}'+
                    '</div>'+
                    '<div v-bind:id="user.id" class="collapse">'+       
                        '<div class="panel-body">'+
                            '<div>'+
                                '<p type="hidden" name="id" v-bind:value="user.id"                  ></p>'+
                                '<label>Etunimi</label>'+
                                '<p class="pp-form-control m5" > {{ user.firstName }}</p>'+
                                '<label>Sukunimi</label>'+
                                '<p class="pp-form-control m5" > {{ user.lastName  }}</p>'+
                                '<label>Sähköposti</label>'+
                                '<p class="pp-form-control m5" > {{ user.email     }}</p>'+
                                '<label>Puhelin</label>'+
                                '<p class="pp-form-control m5" > {{ user.phone     }}</p>'+
                                '<label>Viesti</label>'+
                                '<p class="pp-form-control m5" > {{ user.rekryMessage     }}</p>'+
                                '<br>'+
                                '<rekry-button v-bind:userid="user.id"></rekry-button>'+
                            '</div>'+
                        '</div>'+
                    '</div>'+
                '</div>'+
            '<div>'+              
        '</div>'+
    '</div>'
})

Vue.component('user',{
    props:['user'],
    created:function(){
        this.user.changePasswordLink = configUrl() + '/artists/send-password-change-link/' + this.user.id;
    },
    methods:{
        postForm:function(){
            var data = {
                id:this.user.id,
                firstName:this.user.firstName,   
                lastName:this.user.lastName, 
                email:this.user.email,     
                phone:this.user.phone,       
                street:this.user.street,      
                city:this.user.city,        
                zipCode:this.user.zipCode,     
                reelLink:this.user.reelLink,    
                reelPassword:this.user.reelPassword
            }
            $.post('/artists/edit',data) 
            .then(function(response){
                this.$parent.updateUsers()
            })
        },
        requestPass:function(){
            $.get(this.user.changePasswordLink)
            .then(function(response){
                console.log(response)
                alert('Salasana lähetetty')
                this.user.passwordSent = true;
            })
        },
        deleteUser:function(){
            $.post('/artists/delete/'+this.user.id,function(response){
            })
        }
    },
    template:
        '<div class="panel-body">'+
            '<div>'+
                '<input type="hidden" name="id" v-bind:value="user.id"                  >'+
                '<label>Etunimi</label>'+
                '<input class="pp-form-control m5" type="text" v-model="user.firstName"    >'+
                '<label>Sukunimi</label>'+
                '<input class="pp-form-control m5" type="text" v-model="user.lastName"     >'+
                '<label>Aktiivinen</label>'+
                '<p class="pp-form-control m5"><span v-if="user.activeUser">Kyllä</span><span v-if="!user.activeUser">Ei</span></p>'+
                '<br>'+
                '<label>Sähköposti</label>'+
                '<input class="pp-form-control m5" type="text" v-model="user.email"        >'+
                '<label>Puhelin</label>'+
                '<input class="pp-form-control m5" type="text" v-model="user.phone"        >'+
                '<br>'+
                '<label>Katuosoite</label>'+
                '<input class="pp-form-control m5" type="text" v-model="user.street"       >'+
                '<label>Postitoimipaikka</label>'+
                '<input class="pp-form-control m5" type="text" v-model="user.city"         >'+
                '<label>Postinumero</label>'+
                '<input class="pp-form-control m5" type="text" v-model="user.zipCode"      >'+
                '<br>'+
                '<label>Maksutapa</label>'+
                '<input class="pp-form-control m5" type="text" v-model="user.payment"     >'+
                '<br>'+
                '<label>Esittelyvideon Vimeo osoite</label>'+
                '<input class="pp-form-control m5" type="text" v-model="user.reelLink"     >'+
                '<label>Esittelyvideon salasana</label>'+
                '<input class="pp-form-control m5" type="text" v-model="user.reelPassword" >'+
                '<br>'+
                '<button class="btn btn-success m5 w100" v-on:click="postForm()">Tallenna</button>'+
                '<button v-on:click="requestPass()" class="btn btn-primary m5 w100" type="text">Lähetä salasana <span class="montsrerrat fw100" style="font-size:12px" v-if="user.passwordSent">Lähetetty</span></button>'+
                '<button class="btn btn-primary m5 w100" type="text">Lähetä tiedot</button>'+
                '<button class="btn btn-danger m5  w100" v-on:click="deleteUser()" type="text">Poista</button>'+
            '</div>'+
        '</div>'
})

Vue.component('remove-user',{
    props:['userid','orderid'],
    methods:{
        removeUser:function(){
            var userId = this.userid;
            var orderId = this.orderid;
            var self = this;
            if(confirm('Oletko varma, että haluat hylätä käyttäjän ilmoittautumisen?')){
                $.ajax({
                    url: '/orders/admin-remove-pickup/'+ userId + '/' + orderId,
                    type: 'PUT',
                    success: function(response) {
                      console.log(response)
                      self.$parent.$parent.updateOrders()
                    }
                 });
            }
        }
    },
    template:'<a class="btn btn-xs btn-danger" v-on:click="removeUser()">Hylkää</a>'
});


Vue.component('order',{
    props:['order'],
    beforeMount:function(){
        this.order.selectedByUser = false;
        
        var d = new Date();
        var n = d.getTime();

        $.each(this.order.users,function(key,user){
            console.log(key)
            user.collapseId = user.id + 'collapse' + n;
            user.hashId = '#' + user.id + 'collapse' + n;
        });
        console.log(this.order.users[0])
        if(this.order.artistSelection) this.order.selectedByUser = true;
    },
    methods:{
        postForm:function(){
            var data = {
                id:               this.order.id,
                clientName:       this.order.clientName,
                clientCompany:    this.order.clientCompany,
                clientEmail:      this.order.clientEmail,
                clientMessage:    this.order.clientMessage,
                clientPhone:      this.order.clientPhone,
                eventCity:        this.order.eventCity,
                eventDate:        this.order.eventDate,
                eventSize:        this.order.eventSize,
                eventDescription: this.order.eventDescription,
                extraHours:       this.order.extraHours || 0,
                additional1:      this.order.additional1,
                additional2:      this.order.additional2,
                additional3:      this.order.additional3,
                discountPercent:  this.order.discountPercent || 0,
            }

            if(!data.eagerMax) data.eagerMax = 3;
            if(!data.extraHours) data.extraHours = 0;
            if(!data.discountPercent) data.discountPercent = 0;


            $.post('/orders/admin-edit-order',data).then(function(){
                this.$parent.updateOrders();
            }.bind(this))
        },
        boolean:function(t){
            if(!this.order[t]){
                this.order[t] = true
            }else{
                this.order[t] = false
            }
        },
        freePending:function(){
            $.post('/orders/free-pending/'+this.order.id).then(function(){
                alert('Tilaus vapautettu')
            })
            this.$parent.updateOrders() 
        },
        didInvoice20:function(){
            if(!this.order.invoice20Number){
                alert('Anna laskulle numero')
                return;
            }
            if(confirm('Oletko varmasti tehnyt ja lähettänyt laskun?')){
                 $.post('/orders/invoice20/'+this.order.id+'/'+this.order.invoice20Number).then(function(response){
                    alert('Laskutuksen status muutettu')
                })
            }else{
                alert('Laskutuksen statusta ei muutettu')
            }
            this.$parent.updateOrders();
        },
        didInvoice100:function(){
            if(!this.order.invoice100Number){
                alert('Anna laskulle numero')
                return;
            }
            if(confirm('Oletko varmasti tehnyt ja lähettänyt laskun?')){
                $.post('/orders/invoice100/'+this.order.id+'/'+this.order.invoice100Number).then(function(response){
                    alert('Laskutuksen status muutettu')
                })
            }else{
                alert('Laskutuksen statusta ei muutettu')
            }
            this.$parent.updateOrders();
        },
        closeOrder:function(){
            if(confirm('Varmista, että asiaks on maksanut koko tilauksen ja kuvaajalle on maksettu palkkio kokonaisuudessaan')){
                $.post('/close-order/'+this.order.id,function(response){
 
                })
            }else{
                alert('Tilausta ei suljettu')
            }
        },
        deleteOrder:function(){
            $.post('/orders/delete/'+this.order.id,function(response){
                this.$parent.updateOrders();
            })
        }
    },
    template:
        '<div class="panel-body">'+
            '<div class="form-group">'+
                '<label for="clientName">Asiakas</label>'+
                '<input class="form-control" id="clientName" v-model="order.clientName"></input>'+
                '<label for="clientCompany">Yritys</label>'+
                '<input class="form-control" id="clientCompany" v-model="order.clientCompany"></input>'+
                '<br>'+
                '<p class="m5 montserrat fw400" style="width:100%">Halukkaita tekijöitä  <span class="badge">{{ order.users.length }}</span></p>'+
                '<div class="well blue-bg" v-for="user in order.users" data-toggle="collapse" v-bind:data-target="user.hashId">'+
                    '<p class="m5 monstserrat fw400"><span class="montserrat fw400 blue" style="font-size:13px;margin-bottom:5px;" v-if="user.id == order.artistSelection" >VALINTA: </span>{{ user.firstName }} {{ user.lastName}} <remove-user v-bind:orderid="order.id" v-bind:userid="user.id" style="float:right"></remove-user></p>'+
                    '<div class="collapse" v-bind:id="user.collapseId">'+
                        '<p class="montserrat m10" >PHONE: {{ user.phone }}</p>'+
                        '<p class="montserrat m10" >EMAIL: {{ user.email }}</p>'+
                    '</div>'+
                '</div>'+
                '<br>'+
                '<label for="clientEmail">Sähköpostiosoite</label>'+
                '<input class="form-control" id="clientEmail" v-model="order.clientEmail"></input>'+
                '<label for="clientPhone">Puhelinnumero</label>'+
                '<input class="form-control" id="clientPhone" v-model="order.clientPhone"></input>'+
                '<label for="eventCity">Paikka</label>'+
                '<input class="form-control" id="eventCity" v-model="order.eventCity"></input>'+
                '<label for="eventDate">Aika</label>'+
                '<input class="form-control" id="eventDate" v-model="order.eventDate"></input>'+
                '<label for="clientMessage">Viesti</label>'+
                '<textarea rows="5" class="form-control" id="clientMessage" v-model="order.clientMessage"></textarea>'+
                '<br>'+
                '<label for="additional1">Tekstitys</label>'+
                '<button id="additional1" class="btn btn-checkbox" style="float:right" v-on:click="boolean('+"'additional1'"+')">'+
                    '<i v-if="order.additional1" class="fa fa-check" aria-hidden="true"></i>'+
                '</button><br>'+
                '<label for="additional2">Ilmakuvaus</label>'+
                '<button id="additional2" class="btn btn-checkbox" style="float:right" v-on:click="boolean('+"'additional2'"+')">'+
                    '<i v-if="order.additional2" class="fa fa-check" aria-hidden="true"></i>'+
                '</button><br>'+
                '<label for="additional3">Voice Over</label>'+
                '<button id="additional3" class="btn btn-checkbox" style="float:right" v-on:click="boolean('+"'additional3'"+')">'+
                    '<i v-if="order.additional3" class="fa fa-check" aria-hidden="true"></i>'+
                '</button><br>'+
                '<br>'+
                '<p style="width:100%">Lisätyöt: <strong><span style="float:right">{{ order.extraHours || 0 }} tuntia</span></strong></p>'+
                '<p style="width:100%">Tilauksen arvo <strong><span style="float:right">{{ order.showTotal || 0 }} €</span></strong></p>'+
                '<p style="width:100%">Laskutettu: <strong><span style="float:right">{{ order.showRevenue || 0 }} €</span></strong></p>'+
                '<p style="width:100%">Komissio <strong><span style="float:right">{{ order.showComission || 0 }} €</span></strong></p>'+
                '<button class="btn btn-success m5  w100" v-on:click="postForm()">Tallenna tilauksen tiedot</button>'+
                '<br>'+
                '<button class="btn btn-success m5  w100" v-if="order.pending" v-on:click="freePending()">Vapauta kuvaajille</button><br><br>'+
                '<label for="invoice20Number">20% laskun numero</label>'+
                '<input v-bind:disabled="this.order.invoice20" class="form-control m5" id="invoice20Number" v-model="order.invoice20Number"></input>'+
                '<button class="btn btn-primary m5  w100" v-bind:disabled="this.order.invoice20 || !this.order.selectedByUser" v-on:click="didInvoice20()" type="text"><strong v-if="this.order.selectedByUser">Laskuta 20%</strong><strong v-if="!this.order.selectedByUser">Ei saa laskuttaa 20%</strong></button>'+
                '<p class="m5">Alkulaskutus voidaan tehdä kun tilaukselle on valittu kuvaaja</p>'+
                '<label for="invoice100Number">100% laskun numero:</label>'+
                '<input v-bind:disabled="this.order.invoice100" class="form-control m5" id="invoice100Number" v-model="order.invoice100Number"></input>'+
                '<button class="btn btn-primary m5  w100" v-bind:disabled="this.order.invoice100 || !this.order.ready" v-on:click="didInvoice100()" type="text"><strong v-if="this.order.ready">Laskuta 100%</strong><strong v-if="!this.order.ready">Ei saa laskuttaa 100%</strong></button>'+
                '<p class="m5">Loppulaskutus voidaan tehdä kun kuvaaja on tehnyt työn loppuun! {{ this.order.ready }}</p>'+
                '<br>'+
                '<button class="btn btn-primary m5   w100" v-on:click="closeOrder()" type="text">Tilaus maksettu kuvaajalle</button>'+
                '<button class="btn btn-danger m5   w100" v-on:click="deleteOrder()" type="text">Poista</button>'+
                '<br>'+
                '<a v-bind:href="order.pickArtistLink">Kuvaajan valinta -sivulle</a>'+
            '</div>'+
        '</div>'
})

Vue.component('users',{
    props:['users','user','rekry','length'],
    beforeMount:function(){
        this.updateUsers()
    },
    methods:{
        updateUsers:function(){
            $.get('/artists/all').then(function(response){
                var users = [];
                $.each(response,function(key,object){
                    object.hashId = '#' + object.id     //MAKE "#id" + "" for bootstrap
                    if(object.activeUser){
                        users.push(object)
                    }
                    return;
                })
                this.users = users;
                this.length = 0
                if(this.users && this.users.length > 0) this.length = this.users.length;
            }.bind(this))
        }
    },
    template:
        '<div>'+
            '<div class="panel panel-default"><div class="panel-heading">Käyttäjät <span class="panel-heading-pull-right"><i class="fa fa-user-o" aria-hidden="true"></i> {{ length }}  <a class="btn btn-xs btn-success" v-on:click="updateUsers()">Päivitä</a></span></div><div class="panel-body  panel700">'+
                    '<div class="panel-group" v-for="user in users">'+
                        '<div class="panel panel-primary">'+
                            '<div class="panel-heading pp-pointer" data-toggle="collapse" v-bind:data-target="user.hashId">'+
                                '<span class="montserrat blue fw200" v-if=" user.isNew ">Uusi</span> {{ user.firstName }}  {{ user.lastName }}'+
                            '</div>'+
                            '<div v-bind:id="user.id" class="collapse">'+
                                '<user v-bind:user="user"></user>'+
                            '</div>'+
                        '</div>'+
                    '<div>'+              
            '</div></div>'+
        '</div>'
});

// Vue.component('orders-dropdown',{
//     props:['filter'],
//     updated:function(){
//     },
//     methods:{
//         toggleFilter:function(target){
//             this.$parent.updateList(target)
//         }
//     },
//     template:
//     '<div class="dropdown">'+
//         'Tilaukset  <button class="btn btn-default btn-primary btn-xs dropdown-toggle" type="button" data-toggle="dropdown">Näytä '+
//         '<span class="caret"></span></button>'+
//         '<ul class="dropdown-menu">'+
//             '<li class="dropdown-header">Näytä:</li>'+
//             '<li><button style="text-align:left" class="btn btn-link form-control" v-on:click="toggleFilter('+"'"+'newOrder'+"'"+')"    ><i v-if="this.filter.newOrder" class="fa fa-check" aria-hidden="true"></i> Uudet tilaukset</button></li>'+
//             '<li><button style="text-align:left" class="btn btn-link form-control" v-on:click="toggleFilter('+"'"+'pickups'+"'"+')"     ><i v-if="this.filter.pickups" class="fa fa-check" aria-hidden="true"></i> Vapautettu kuvaajille</button></li>'+
//             '<li><button style="text-align:left" class="btn btn-link form-control" v-on:click="toggleFilter('+"'"+'production'+"'"+')"  ><i v-if="this.filter.production" class="fa fa-check" aria-hidden="true"></i> Saa laskuttaa 20% </button></li>'+
//             '<li><button style="text-align:left" class="btn btn-link form-control" v-on:click="toggleFilter('+"'"+'invoice20'+"'"+')"   ><i v-if="this.filter.invoice20" class="fa fa-check" aria-hidden="true"></i> Tuotannossa</button></li>'+
//             '<li><button style="text-align:left" class="btn btn-link form-control" v-on:click="toggleFilter('+"'"+'ready'+"'"+')"   ><i v-if="this.filter.ready" class="fa fa-check" aria-hidden="true"></i> Saa laskuttaa</button></li>'+
//             '<li><button style="text-align:left" class="btn btn-link form-control" v-on:click="toggleFilter('+"'"+'invoice100'+"'"+')"  ><i v-if="this.filter.invoice100" class="fa fa-check" aria-hidden="true"></i> 100% laskutettu</button></li>'+
//             '<li><button style="text-align:left" class="btn btn-link form-control" v-on:click="toggleFilter('+"'"+'closed'+"'"+')"      ><i v-if="this.filter.closed" class="fa fa-check" aria-hidden="true"></i> Suljettu</button></li>'+
//         '</ul>'+
//     '</div>'
// })

Vue.component('orders-filter',{
    props:['filter'],
    updated:function(){
    },
    methods:{
        toggleFilter:function(target){
            this.$parent.updateList(target)
        }
    },
    template:
    '<div id="filterOptions" class="collapse well bg-blue white">'+
        '<div class="row">'+
            '<div class="col-xs-6">'+
                '<ul>'+
                    '<li style="padding:0px;"><button style="text-align:left;margin:0px" class="btn btn-link form-control" v-on:click="toggleFilter('+"'"+'newOrder'+"'"+')"    ><i v-if="this.filter.newOrder" class="fa fa-check" aria-hidden="true"></i> Uudet tilaukset</button></li>'+
                    '<li style="padding:0px;"><button style="text-align:left;margin:0px" class="btn btn-link form-control" v-on:click="toggleFilter('+"'"+'pickups'+"'"+')"     ><i v-if="this.filter.pickups" class="fa fa-check" aria-hidden="true"></i> Vapautettu kuvaajille</button></li>'+
                    '<li style="padding:0px;"><button style="text-align:left;margin:0px" class="btn btn-link form-control" v-on:click="toggleFilter('+"'"+'production'+"'"+')"  ><i v-if="this.filter.production" class="fa fa-check" aria-hidden="true"></i> Saa laskuttaa 20%</button></li>'+
                    '<li style="padding:0px;"><button style="text-align:left;margin:0px" class="btn btn-link form-control" v-on:click="toggleFilter('+"'"+'invoice20'+"'"+')"   ><i v-if="this.filter.invoice20" class="fa fa-check" aria-hidden="true"></i> Tuotannossa</button></li>'+
                '</ul>'+
            '</div>'+
            '<div class="col-xs-6">'+
                '<ul>'+
                    '<li style="padding:0px;"><button style="text-align:left;margin:0px" class="btn btn-link form-control" v-on:click="toggleFilter('+"'"+'ready'+"'"+')"   ><i v-if="this.filter.ready" class="fa fa-check" aria-hidden="true"></i> Saa laskuttaa</button></li>'+
                    '<li style="padding:0px;"><button style="text-align:left;margin:0px" class="btn btn-link form-control" v-on:click="toggleFilter('+"'"+'invoice100'+"'"+')"  ><i v-if="this.filter.invoice100" class="fa fa-check" aria-hidden="true"></i> 100% laskutettu</button></li>'+
                    '<li style="padding:0px;"><button style="text-align:left;margin:0px" class="btn btn-link form-control" v-on:click="toggleFilter('+"'"+'closed'+"'"+')"      ><i v-if="this.filter.closed" class="fa fa-check" aria-hidden="true"></i> Suljettu</button></li>'+
                '</ul>'+
            '</div>'+
        '</div>'+
    '</div>'
})

Vue.component('orders',{
    props:['orders','order','length','filter','filteredList','newOrders'],
    methods:{
        updateOrders:function(){
            var newOrders = 0;
            $.get('/orders').then(function(response){
                $.each(response,function(key,object){
                    if(object.pending){
                        object.status = 'Uusi tilaus'
                        object.statusClass  = 'fa fa-circle pull-right new-order'
                        newOrders++;
                    };
                    if(!object.pending){
                        object.status = 'Vapaututettu kuvaajille'
                        object.statusClass  = 'fa fa-circle pull-right free-order'
                    };
                    if(object.artistSelection != null) {
                        object.status = 'Saa laskuttaa 20%'
                        object.statusClass = 'fa fa-circle pull-right prod-order'
                    };
                    if(object.invoice20 && !object.ready) {
                        object.status = 'Tuotannossa'
                        object.statusClass = 'fa fa-circle pull-right i20-order'
                    };
                    if(object.ready && object.invoice20){
                        console.log('READY',object)
                        object.status = 'Saa laskuttaa'
                        object.statusClass = 'fa fa-circle pull-right i100-order'
                    };
                    if(object.invoice100){
                        object.status = 'Laskutettu'
                        object.statusClass = 'fa fa-circle pull-right i100-order'
                    };
                    if(object.closed){
                        object.status = 'Suljettu'
                        object.statusClass = 'fa fa-circle pull-right closed-order'
                    };
                    object.hashId = '#order' + object.id;    //MAKE "#id" + "" for bootstrap
                    object.orderId = 'order' + object.id;
                    object.pickArtistLink = configUrl() + '/orders/artist-options/'+ object.id + '/' + object.clientToken;
                    object.showTotal = parseInt(object.total) / 100;
                    object.showComission = object.showTotal * 0.3;
                    object.showRevenue = object.revenue / 100;
                })
                this.orders = response;
                this.length = 0;
                if(newOrders == 0){
                    this.newOrders = "Ei uusia";
                }else if(newOrders == 1){
                    this.newOrders = newOrders + " uusi";
                }else{
                    this.newOrders = newOrders + " uutta";
                }
                if(this.orders && this.orders.length > 0) this.length = this.orders.length;
                this.filterList()
            }.bind(this))
        },
        updateList:function(selection){
            if(!this.filter[selection]){
                this.filter[selection] = true;
            }else{
                this.filter[selection] = false
            }
            this.filterList()
        },
        filterList:function(){
            this.filteredList = [];
            var f = this.filter
            $.each(this.orders, function(key,object){
                if(f.newOrder && object.pending && !object.closed){
                    this.filteredList.push(object)
                }
                if(f.pickups && !object.pending && !object.closed && object.artistSelection == null){
                    this.filteredList.push(object)
                }
                if(f.production && object.artistSelection != null  && !object.closed){
                    this.filteredList.push(object)
                }
                if(f.invoice20 && object.invoice20 && !object.closed && !object.ready){
                    this.filteredList.push(object)
                }
                if(f.ready && object.ready && !object.invoice100){
                    this.filteredList.push(object)
                }
                if(f.invoice100 && object.invoice100 && !object.closed){
                    this.filteredList.push(object)
                }
                if(f.closed && object.closed){
                    this.filteredList.push(object)
                }
            }.bind(this))
        }
    },
    beforeMount:function(){
        this.filter = {
            newOrder:true,
            pickups:false,
            production:false,
            invoice20:false,
            ready:false,
            invoice100:false,
            closed:false
        }

        this.updateOrders();
    },
    template:'<div class="row">'+
                '<div class="col-md-6">'+
                    '<div class="panel panel-default">'+
                        '<div class="panel-heading">'+
                            '<button class="btn btn-xs btn-success" data-toggle="collapse" href="#filterOptions">Näytä valinnat</button>'+
                            '<span class="panel-heading-pull-right">'+
                                '<p class="montserrat fw200 white" style="font-size:14px    ">{{ newOrders }} {{ orders.length }} tilauksesta</p>'+
                            '</span>'+
                        '</div>'+
                        '<div class="panel-body  panel700">'+
                            '<div>'+
                                '<orders-filter v-bind:filter="filter"></orders-filter>'+
                            '</div>'+
                            '<div class="panel-group" v-for="order in filteredList">'+
                                '<div class="panel panel-primary">'+
                                    '<div class="panel-heading pp-pointer" data-toggle="collapse" v-bind:data-target="order.hashId">'+
                                        '{{ order.clientName }}'+
                                        '<i v-bind:class="order.statusClass" aria-hidden="true"></i>  <i class="pull-right">{{ order.status }}</i>'+
                                    '</div>'+
                                    '<div v-bind:id="order.orderId" class="collapse">'+
                                        '<order v-bind:order="order"></order>'+
                                    '</div>'+
                                '</div>'+
                            '</div>'+              
                        '</div>'+
                    '</div>'+
                '</div>'+
                '<div class="col-md-6">'+
                    '<add-order></add-order>'+
                '</div>'+
            '</div>'
});

Vue.component('navigation',{
    template:
    '<div class="row">'+
        '<div class="col-md-6">'+
            '<h3 class="montserrat darkblue fw700" style="margin:20px;">LUOVAT.COM ADMIN</h3>'+
        '</div>'+
        '<div class="col-md-6">'+
            '<p class="float-right fw400 montserrat" style="margin:20px;">Hei '+ userLogged +'! Tervetuloa takaisin.</p>'+
        '</div>'+
    '</div>'
})
new Vue({
  el: '#admin'
})