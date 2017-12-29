Vue.component('signBtn',{
    props:['order'],
    methods:{
        signOrder:function(){
            var confirmPickup = confirm('Vahvista, että sitoudut ottamaan työn vastaan.')
            if(confirmPickup){
                $.post('/orders/pickup',{orderId:this.order.id}).then(function(response){
                    toastr.success(response)
                    this.$parent.updateOrders();
                }.bind(this))
            }
            return;
        }
    },
    template:'<button v-on:click="signOrder()" class="btn btn-success-shallow">Ilmottaudu</button>'
})

Vue.component('edit-artist',{
    props:['user'],
    created:function(){
        this.loadData();
    },
    methods:{
        loadData:function(){
            $.get('/artists/data').then(function(cbUser){
                this.user = cbUser;
                console.log(cbUser)
            }.bind(this))
        },
        postEdit:function(){
            $.post('/artists/artist-self-edit',this.user).then(function(userEdited){
                toastr.success('Tiedot muutettu')
            }.bind(this))
            .fail(function(response){
                toastr.warning('Jotain meni pieleen')
            })
        }
    },
    template:
    '<div class="row">'+
        '<div class="form-group">'+
            '<div class="col-md-12"><h2 class="darkblue montserrat">Kuvaajan tiedot</h2></div>'+
            '<div class="col-md-6 col-md-offset-0 col-xs-10 col-xs-offset-1" style="padding:30px">'+
                '<label for="firstName">Etunimi</label>'+
                '<input class="form-control order-form-input" id="firstName" v-model="user.firstName"></input>'+
                '<label for="lastName">Sukunimi</label>'+
                '<input class="form-control order-form-input" id="lastName" v-model="user.lastName"></input>'+
                '<label for="email">Sähköposti</label>'+
                '<input class="form-control order-form-input" id="email" v-model="user.email"></input>'+
                '<label for="phone">Puhelinnumero</label>'+
                '<input class="form-control order-form-input" id="phone" v-model="user.phone"></input><br>'+
            '</div>'+
            '<div class="col-md-6 col-md-offset-0 col-xs-10 col-xs-offset-1" style="padding:30px">'+
                '<label for="street">Katuosoite</label>'+
                '<input class="form-control order-form-input" id="street" v-model="user.street"></input>'+
                '<label for="zipCode">Postinumero</label>'+
                '<input class="form-control order-form-input" id="zipCode" v-model="user.zipCode"></input>'+
                '<label for="city">Kaupunki</label>'+
                '<input class="form-control order-form-input" id="city" v-model="user.city"></input>'+
                '<label for="payment">Laskutustapa</label>'+
                '<select class="form-control order-form-input" id="payment" v-model="user.payment"><option>Yrittäjä</option><option>Ukko.fi</option></select>'+
            '</div>'+
            '<div class="col-md-12">'+
                '<button class="btn btn-luovat btn-sm" style="float:right" v-on:click="postEdit()" >Tallenna muutokset</button>'+
            '</div>'+
        '</div>'+
    '</div>'
})

Vue.component('orders',{
    props:['orders','eagers'],
    created:function(){
        this.orders = [];
    },
    methods:{
        updateOrders:function(){
            $.get('/orders/pickups').then(function(response){
                $.each(response.open,function(key,object){
                    object.hashId = '#order' + object.id;
                    object.orderId = 'order' + object.id;
                    object.moment = moment(object.date,'YYYY-MM-DD').locale('fi').format('LL')
                    if(object.moment.indexOf('Invalid') != -1){
                        object.moment = 'Aikaa ei sovittu'
                    }
                })
                this.orders = response.open;
            }.bind(this))
            $.get('/orders/orders-progres').then(function(response){
                $.each(response,function(key,object){
                    object.hashId = '#eager' + object.id;
                    object.orderId = 'eager' + object.id;
                    object.moment = moment(object.date,'YYYY-MM-DD').locale('fi').format('LL')
                    if(object.moment.indexOf('Invalid') != -1){
                        object.moment = 'Aikaa ei sovittu'
                    }
                })
                this.eagers = response;
            }.bind(this))
        }
    },
    beforeMount:function(){
        this.updateOrders();
    },
    template:'<div class="row">'+
                '<div class="col-md-12">'+    
                    '<div class="panel-group">'+
                        '<h2 class="darkblue m5 montserrat m20">Uudet keikat</h2>'+
                        '<div  class="panel m5 panel-primary" v-for="order in orders">'+
                            '<div data-toggle="collapse" v-bind:data-target="order.hashId" class="panel-heading"><p style="margin:0px"><span class="badge plaster black" style="text-transform:uppercase;">{{ order.size }}</span> <span style="float:right;"><i class="fa fa-calendar" aria-hidden="true"></i> {{ order.moment }}  <br><i class="fa fa-map-marker" aria-hidden="true"></i> {{ order.city }}</p></span></div>'+
                            '<div class="panel-body collapse" v-bind:id="order.orderId" >'+
                                '<div>'+
                                '<p><strong>Tilauksen viesti</strong></p>'+
                                '<p>{{ order.message }}</p>'+
                                '</div>'+
                                '<signBtn style="float:right" v-bind:order="order"></signBtn>'+
                            '</div>'+
                        '</div>'+
                        '<center><h1 v-if="orders.length == 0" class="m20" style="color:#EEE">Ei uusia keikkoja</h1></center>'+
                    '</div>'+
                    '<div class="panel-group">'+
                        '<h2 class="darkblue m5 montserrat m20">Ilmoittautumiset</h2>'+
                        '<div  class="panel m5 panel-primary" v-for="eager in eagers">'+
                            '<div data-toggle="collapse" v-bind:data-target="eager.hashId" class="panel-heading"><p style="margin:0px"><span class="badge plaster black" style="text-transform:uppercase;">{{ eager.size }}</span> <span style="float:right;"><i class="fa fa-calendar" aria-hidden="true"></i> {{ eager.moment }}  <br><i class="fa fa-map-marker" aria-hidden="true"></i> {{ eager.city }}</p></span></div>'+
                            '<div class="panel-body collapse" v-bind:id="eager.orderId" >'+
                                '<p><strong>Tilauksen viesti</strong></p>'+
                                '<p>{{ eager.message }}</p>'+
                            '</div>'+
                        '</div>'+
                    '</div>'+
                '</div>'+
            '</div>'
})

Vue.component('edit-order',({
    props:['order','ready'],
    created:function(){
            this.ready = this.order.ready;
    },
    methods:{
        increase:function(t){
            this.order[t]++
        },
        decrease:function(t){
            if(this.order[t] > 0){
                this.order[t]--
            }
        },
        boolean:function(t){
            if(!this.order[t]){
                this.order[t] = true
            }else{
                this.order[t] = false
            }
        },
        readyState:function(){
            if(!this.ready){
                this.ready = true;
            }else{
                this.ready = false;
            }
        },
        postEdit:function(){
            $.post('/orders/artist-edit-order',{
                id:this.order.id,
                extraHours:this.order.extraHours,
                add1:this.order.additional1,
                add2:this.order.additional2,
                add3:this.order.additional3
            }).then(function(response){
                console.log(response)
                if(response == 'OK'){
                    toastr.success('Tilaus muutettu')
                    return;
                }
                toastr.warning('Virhe tapahtui')
            })
        },
        postReady:function(){
            $.post('/orders/artist-order-ready/'+this.order.id)
            .then(function(response){
                toastr.success('Tilaus lähetetty laskutettavaksi')
            })
        }
    },
    template:
    '<div class="edit-order">'+
        '<div class="col-xs-3 well well-white">'+
            '<center>'+
                '<p>Lisätyötunnit</p>'+
                '<div class="btn-group">'+
                    '<button type="button" class="btn  btn-blue" v-on:click="increase('+"'extraHours'"+')"> + </button>'+
                    '<button type="button" class="btn  btn-display">{{ order.extraHours }}</button>'+
                    '<button type="button" class="btn  btn-blue" v-on:click="decrease('+"'extraHours'"+')"> - </button>'+
                '</div>'+
            '</center>'+
        '</div>'+
        '<div class="col-xs-3 well well-white">'+
            '<center>'+
                '<p>Tekstitys</p>'+
                '<button class="btn btn-checkbox" v-on:click="boolean('+"'additional1'"+')">'+
                    '<i v-if="order.additional1" class="fa fa-check" aria-hidden="true"></i>'+
                '</button>'+
            '</center>'+
        '</div>'+
        '<div class="col-xs-3 well well-white">'+
            '<center>'+
                '<p>Ilmakuvaus</p>'+
                '<button class="btn btn-checkbox" v-on:click="boolean('+"'additional2'"+')">'+
                    '<i v-if="order.additional2" class="fa fa-check" aria-hidden="true"></i>'+
                '</button>'+
            '</center>'+
        '</div>'+
        '<div class="col-xs-3 well well-white">'+
            '<center>'+
                '<p>Voice Over</p>'+
                '<button class="btn btn-checkbox" v-on:click="boolean('+"'additional3'"+')">'+
                    '<i v-if="order.additional3" class="fa fa-check" aria-hidden="true"></i>'+
                '</button>'+
            '</center>'+
        '</div>'+
        '<div class="col-xs-4">'+
            '<button class="btn btn-success" v-on:click="postEdit()">Tallenna muutokset</button>'+
        '</div>'+
        '<div class="col-xs-5">'+
            '<p>Työ on suoritettu loppuun'+
            '<button v-bind:disabled="ready" class="btn btn-checkbox m5" v-on:click="readyState()">'+
                '<i v-if="ready" class="fa fa-check" aria-hidden="true"></i>'+
            '</button>'+
            '</p>'+
        '</div>'+
        '<div class="col-xs-3">'+
            '<button v-bind:disabled="order.ready" class="btn btn-success" v-on:click="postReady()">Työ valmis</button>'+
        '</div>'+
    '</div>'
}))

Vue.component('button-balance',{
    props:['balance'],
    created:function(){
        $.get('/artists/artist-balance').then(function(balance){
            this.balance = balance.sum / 100
            console.log(this.balance)
        }.bind(this))
    },
    template:'<a class="btn btn-sm montserrat fw700 btn-luovat" style="float:right;" >SALDO: {{ balance }} € </a>'
})

Vue.component('my-orders',{
    props:['orders','oldOrders','newOrders','editForm'],
    beforeMount:function(){
        var oldOrders = [];
        var newOrders = [];
        $.get('/orders/get-orders-by-artist').then(function(response){
            $.each(response,function(key,object){
                if(object.extraHours == null) object.extraHours = 0;
                object.hashId = '#myorder' + object.id;
                object.orderId = 'myorder' + object.id;
                object.moment = moment(object.eventDate,'YYYY-MM-DD').locale('fi').format('LL');
                if(object.moment.indexOf('Invalid') != -1) object.moment = 'Aikaa ei sovittu';
                object.artistCut = object.artistCut / 100;
                if(object.ready) {
                    oldOrders.push(object);
                    return
                };
                newOrders.push(object);
            })
            this.orders = response;
            this.oldOrders = oldOrders;
            this.newOrders = newOrders;
            console.log(response)
        }.bind(this))
    },
     template:'<div class="row">'+
                '<div class="col-md-12">'+
                    '<h2 class="montserrat m20 darkblue">Työn alla:</h2>'+
                    '<div class="panel-group">'+
                        '<div  class="panel m5 panel-primary" v-for="order in newOrders">'+
                            '<div data-toggle="collapse" v-bind:data-target="order.hashId" class="panel-heading" style="margin:0px;">'+
                                '<span class="badge plaster black" style="text-transform:uppercase;">{{ order.eventSize }}</span>'+
                                '{{ order.clientName }}'+
                                '<p style="float:right;margin-right:10px">'+
                                    '<i class="fa fa-calendar" aria-hidden="true"></i> {{ order.moment }} <br>  '+
                                    '<i class="fa fa-map-marker" aria-hidden="true"></i> {{ order.eventCity }}'+
                                '</p>'+
                            '</div>'+
                            '<div class="panel-body collapse" v-bind:id="order.orderId" >'+
                                '<div class="col-xs-6">'+
                                    '<p><b>Asiakas</b></p>'+
                                    '<p>{{ order.clientName }}</p>'+
                                    '<p><b>Sähköposti</b></p>'+
                                    '<p>{{ order.clientEmail }}</p>'+
                                    '<p><b>Paikka</b></p>'+
                                    '<p>{{ order.eventCity }}</p>'+
                                '</div>'+
                                '<div class="col-xs-6">'+
                                    '<p><b>Yritys</b></p>'+
                                    '<p>{{ order.clientCompany }}</p>'+
                                    '<p><b>Puhelinnumero</b></p>'+
                                    '<p>{{ order.clientPhone }}</p>'+
                                    '<p><b>Päivä</b></p>'+
                                    '<p>{{ order.eventDate }}</p>'+
                                    '<p><b>Tulo</b></p>'+
                                    '<p>{{ order.artistCut }} €</p>'+
                                '</div>'+
                                '<div class="col-xs-12 p15">'+
                                    '<p><b>Viesti</b></p>'+
                                    '<p>{{ order.clientMessage }}</p>'+
                                    '<p><b>Lisätilaukset</b></p>'+
                                '</div>'+
                                '<edit-order v-bind:order="order"></edit-order>'+
                            '</div>'+
                        '</div>'+
                    '</div>'+
                    '<h2 class="montserrat m20 darkblue">Tehdyt keikat</h2>'+
                    '<div class="panel-group">'+
                        '<div  class="panel m5 panel-primary" v-for="order in oldOrders">'+
                            '<div data-toggle="collapse" v-bind:data-target="order.hashId" class="panel-heading" style="margin:0px;">'+
                                '<span class="badge plaster black" style="text-transform:uppercase;">{{ order.eventSize }}</span>'+
                                '{{ order.clientName }}'+
                                '<p style="float:right;margin-right:10px">'+
                                    '<i class="fa fa-calendar" aria-hidden="true"></i> {{ order.moment }} <br>  '+
                                    '<i class="fa fa-map-marker" aria-hidden="true"></i> {{ order.eventCity }}'+
                                '</p>'+
                            '</div>'+
                            '<div class="panel-body collapse" v-bind:id="order.orderId" >'+
                                '<div class="col-xs-6">'+
                                    '<p><b>Asiakas</b></p>'+
                                    '<p>{{ order.clientName }}</p>'+
                                    '<p><b>Sähköposti</b></p>'+
                                    '<p>{{ order.clientEmail }}</p>'+
                                    '<p><b>Paikka</b></p>'+
                                    '<p>{{ order.eventCity }}</p>'+
                                '</div>'+
                                '<div class="col-xs-6">'+
                                    '<p><b>Yritys</b></p>'+
                                    '<p>{{ order.clientCompany }}</p>'+
                                    '<p><b>Puhelinnumero</b></p>'+
                                    '<p>{{ order.clientPhone }}</p>'+
                                    '<p><b>Päivä</b></p>'+
                                    '<p>{{ order.eventDate }}</p>'+
                                    '<p><b>Tulo</b></p>'+
                                    '<p>{{ order.artistCut }} €</p>'+
                                '</div>'+
                                '<div class="col-xs-12 p15">'+
                                    '<p><b>Viesti</b></p>'+
                                    '<p>{{ order.clientMessage }}</p>'+
                                '</div>'+
                            '</div>'+
                        '</div>'+
                    '</div>'+
                '</div>'+
            '</div>'
})

new Vue({
    el:'#userApp'
})