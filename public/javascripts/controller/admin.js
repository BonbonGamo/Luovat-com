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
                    console.log(response)
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
                console.log(this.add1)
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
                    console.log(response)
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
            console.log(validatePhone(this.phone))
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

Vue.component('user',{
    props:['user'],
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
            $.post('/artists/edit',data,function(response){
                console.log(response)
            })
        },
        requestPass:function(){
            
        },
        deleteUser:function(){
            $.post('/artists/delete/'+this.user.id,function(response){
                console.log(response)
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
                '<p class="m5">  artists/change-password/{{ user.passwordChangeToken }}</p>'+
                '<button class="btn btn-success m5 w100" v-on:click="postForm()">Tallenna</button>'+
                '<button class="btn btn-primary m5 w100" type="text">Lähetä salasana</button>'+
                '<button class="btn btn-primary m5 w100" type="text">Lähetä tiedot</button>'+
                '<button class="btn btn-danger m5  w100" v-on:click="deleteUser()" type="text">Poista</button>'+
            '</div>'+
        '</div>'
})

Vue.component('order',{
    props:['order'],
    methods:{
        postForm:function(){
            var data = {
                id:this.user.id,
                clientName:this.clientName,
            }
            $.post('/artists/edit',data,function(response){
                console.log(response)
                this.$parent.updateOrders();
            })
        },
        freePending:function(){
            $.post('/orders/free-pending/'+this.order.id).then(function(){
                alert('Tilaus vapautettu')
            })
            this.$parent.updateOrders()
        },
        didInvoice20:function(){
            if(confirm('Oletko varmasti tehnyt ja lähettänyt laskun?')){
                 $.post('/orders/invoice20/'+this.order.id).then(function(response){
                    alert('Laskutuksen status muutettu')
                })
            }else{
                alert('Laskutuksen statusta ei muutettu')
            }
            this.$parent.updateOrders();
        },
        didInvoice100:function(){
            if(confirm('Oletko varmasti tehnyt ja lähettänyt laskun?')){
                $.post('/orders/invoice100/'+this.order.id).then(function(response){
                    alert('Laskutuksen status muutettu')
                })
            }else{
                alert('Laskutuksen statusta ei muutettu')
            }
            this.$parent.updateOrders();
        },
        deleteOrder:function(){
            $.post('/orders/delete/'+this.order.id,function(response){
                console.log(response)
                this.$parent.updateOrders();
            })
        }
    },
    template:
        '<div class="panel-body">'+
            '<div>'+
                '<button class="btn btn-success m5 w100" v-on:click="postForm()">Tallenna</button>'+
                '<button class="btn btn-success m5 w100" v-on:click="freePending()">Vapauta kuvaajille</button>'+
                '<button class="btn btn-primary m5 w100" v-bind:disabled="this.order.invoice20" v-on:click="didInvoice20()" type="text">Laskutettu 20%</button>'+
                '<button class="btn btn-primary m5 w100" v-bind:disabled="this.order.invoice100" v-on:click="didInvoice100()" type="text">Laskutettu 100%</button>'+
                '<button class="btn btn-danger m5  w100" v-on:click="deleteOrder()" type="text">Poista</button>'+
            '</div>'+
        '</div>'
})

Vue.component('users',{
    props:['users','user','length'],
    beforeMount:function(){
        $.get('/artists/all').then(function(response){
            $.each(response,function(key,object){
                object.hashId = '#' + object.id     //MAKE "#id" + "" for bootstrap
            })
            this.users = response;
            this.length = 0
            if(this.users && this.users.length > 0) this.length = this.users.length;
        }.bind(this))
    },
    methods:{

    },
    template:'<div class="panel panel-default"><div class="panel-heading">Käyttäjät <span class="panel-heading-pull-right"><i class="fa fa-user-o" aria-hidden="true"></i> {{ length }}</span></div><div class="panel-body  panel700">'+
                    '<div class="panel-group" v-for="user in users">'+
                        '<div class="panel panel-primary">'+
                            '<div class="panel-heading pp-pointer" data-toggle="collapse" v-bind:data-target="user.hashId">'+
                                '{{ user.firstName }}  {{ user.lastName }}'+
                            '</div>'+
                            '<div v-bind:id="user.id" class="collapse">'+
                                '<user v-bind:user="user"></user>'+
                            '</div>'+
                        '</div>'+
                    '<div>'+              
            '</div></div>'
});

Vue.component('orders-dropdown',{
    props:['filter'],
    updated:function(){
        console.log(this.filter)
    },
    methods:{
        toggleFilter:function(target){
            this.$parent.updateList(target)
        }
    },
    template:
    '<div class="dropdown">'+
        'Tilaukset  <button class="btn btn-default btn-success btn-xs dropdown-toggle" type="button" data-toggle="dropdown">Näytä '+
        '<span class="caret"></span></button>'+
        '<ul class="dropdown-menu">'+
            '<li class="dropdown-header">Näytä:</li>'+
            '<li><button style="text-align:left" class="btn btn-link form-control" v-on:click="toggleFilter('+"'"+'newOrder'+"'"+')"    ><i v-if="this.filter.newOrder" class="fa fa-check" aria-hidden="true"></i> Uudet tilaukset</button></li>'+
            '<li><button style="text-align:left" class="btn btn-link form-control" v-on:click="toggleFilter('+"'"+'pickups'+"'"+')"     ><i v-if="this.filter.pickups" class="fa fa-check" aria-hidden="true"></i> Vapautettu kuvaajille</button></li>'+
            '<li><button style="text-align:left" class="btn btn-link form-control" v-on:click="toggleFilter('+"'"+'production'+"'"+')"  ><i v-if="this.filter.production" class="fa fa-check" aria-hidden="true"></i> Tuotannossa</button></li>'+
            '<li><button style="text-align:left" class="btn btn-link form-control" v-on:click="toggleFilter('+"'"+'invoice20'+"'"+')"   ><i v-if="this.filter.invoice20" class="fa fa-check" aria-hidden="true"></i> 20% laskutettu</button></li>'+
            '<li><button style="text-align:left" class="btn btn-link form-control" v-on:click="toggleFilter('+"'"+'invoice100'+"'"+')"  ><i v-if="this.filter.invoice100" class="fa fa-check" aria-hidden="true"></i> 100% laskutettu</button></li>'+
            '<li><button style="text-align:left" class="btn btn-link form-control" v-on:click="toggleFilter('+"'"+'closed'+"'"+')"      ><i v-if="this.filter.closed" class="fa fa-check" aria-hidden="true"></i> Suljettu</button></li>'+
        '</ul>'+
    '</div>'
})

Vue.component('orders',{
    props:['orders','order','length','filter','filteredList'],
    methods:{
        updateOrders:function(){
            $.get('/orders').then(function(response){
                $.each(response,function(key,object){
                    if(object.pending){
                        object.status = 'Uusi tilaus'
                        object.statusClass  = 'fa fa-circle pull-right new-order'
                    };
                    if(!object.pending){
                        object.status = 'Tilaus vapaututettu kuvaajille'
                        object.statusClass  = 'fa fa-circle pull-right free-order'
                    };
                    if(object.artistSelection != null) {
                        object.status = 'Tuotannossa'
                        object.statusClass = 'fa fa-circle pull-right prod-order'
                    };
                    if(object.invoice20) {
                        object.status = 'Osalaskutettu'
                        object.statusClass = 'fa fa-circle pull-right i20-order'
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
                })
                this.orders = response;
                this.length = 0
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
            //console.log('ORDERS: ',this.orders)
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
                if(f.invoice20 && object.invoice20 && !object.closed){
                    this.filteredList.push(object)
                }
                if(f.invoice100 && object.invoice100 && !object.closed){
                    this.filteredList.push(object)
                }
                if(f.closed && object.closed){
                    this.filteredList.push(object)
                }
            }.bind(this))
            console.log('Filtered:',this.filteredList)
        }
    },
    beforeMount:function(){
        this.filter = {
            newOrder:true,
            pickups:false,
            production:false,
            invoice20:false,
            invoice100:false,
            closed:false
        }

        this.updateOrders();
    },
    template:'<div class="row">'+
                '<div class="col-md-6">'+
                    '<div class="panel panel-default">'+
                        '<div class="panel-heading">'+
                            '<orders-dropdown v-bind:filter="filter"></orders-dropdown>'+
                            '<span class="panel-heading-pull-right">'+
                                '<i class="fa fa-user-o" aria-hidden="true"></i>'+
                                '{{ length }}'+
                            '</span>'+
                        '</div>'+
                        '<div class="panel-body  panel700">'+
                            '<div class="panel-group" v-for="order in filteredList">'+
                                '<div class="panel panel-primary">'+
                                    '<div class="panel-heading pp-pointer" data-toggle="collapse" v-bind:data-target="order.hashId">'+
                                        '{{ order.clientName }}'+
                                        '<i v-bind:class="order.statusClass" aria-hidden="true"></i>  <i class="pull-right">{{ order.status }}</i>'+
                                    '</div>'+
                                    '<div v-bind:id="order.orderId" class="collapse">'+
                                        '<order v-bind:order="order"></order>'+
                                        '<p>/orders/artist-options/{{ order.id }}/{{ order.clientToken }}</p>'+
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
    '<div class="navigation">'+
        '<p class="navi-left" >Luovat.com</p>'+
        '<p class="navi-right" >Hei '+ userLogged +'! Tervetuloa takaisin.</p>'+
    '</div>'
})

Vue.component('side-navigation',{
    template:
    '<div class="side-navigation">'+
        '<ul style="padding:5px">'+
            '<li class="side-navigation-element"><a data-toggle="pill" href="#users">Käyttäjät</i></a></li>'+
            '<li class="side-navigation-element"><a data-toggle="pill" href="#orders">Tilaukset</i></a></li>'+
            '<li class="side-navigation-element"><a href="/logout">Kirjaudu ulos</i></a></li>'+
        '<ul>'+
    '</div>'
})

new Vue({
  el: '#admin'
})