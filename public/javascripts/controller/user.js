Vue.component('signBtn',{
    props:['order'],
    methods:{
        signOrder:function(){
            $.post('/orders/pickup',{orderId:this.order.id}).then(function(response){
                alert(response)
                this.$parent.updateOrders();
            }.bind(this))
        }
    },
    template:'<button v-on:click="signOrder()" class="btn btn-success-shallow">Ilmottaudu</button>'
})

Vue.component('orders',{
    props:['orders'],
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
        }
    },
    beforeMount:function(){
        this.updateOrders();
    },
    template:'<div>'+
                '<div class="panel-group">'+
                    '<div  class="panel m5 panel-primary" v-for="order in orders">'+
                        '<div data-toggle="collapse" v-bind:data-target="order.hashId" class="panel-heading"><p style="margin:0px"><span class="badge" style="text-transform:uppercase;">{{ order.size }}</span> <span style="float:right;"><i class="fa fa-calendar" aria-hidden="true"></i> {{ order.moment }}  <i class="fa fa-map-marker" aria-hidden="true"></i> {{ order.city }}</p></span></div>'+
                        '<div class="panel-body collapse" v-bind:id="order.orderId" >'+
                            '<div>'+
                            '<p><strong>Tilauksen viesti</strong></p>'+
                            '<p>{{ order.message }}</p>'+
                            '</div>'+
                            '<signBtn style="float:right" v-bind:order="order"></signBtn>'+
                        '</div>'+
                    '</div>'+
                '</div>'+
            '</div>'
})

Vue.component('edit-order',({
    props:['order','ready'],
    created:function(){
            this.ready = false;
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
                artistStatus:this.order.artistStatus,
                extraHours:this.order.extraHours,
                add1:this.order.additional1,
                add2:this.order.additional2,
                add3:this.order.additional3
            }).then(function(response){
                alert('Tilausta muutettu')
            })
        }
    },
    template:
    '<div class="edit-order">'+
        '<div class="col-xs-3 well well-white">'+
            '<center>'+
                '<p>Lisätyötunnit</p>'+
                '<div class="btn-group">'+
                    '<button type="button" class="btn  btn-success" v-on:click="increase('+"'extraHours'"+')"> + </button>'+
                    '<button type="button" class="btn  btn-display">{{ order.extraHours }}</button>'+
                    '<button type="button" class="btn  btn-success" v-on:click="decrease('+"'extraHours'"+')"> - </button>'+
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
            '<button class="btn btn-checkbox m5" v-on:click="readyState()">'+
                '<i v-if="ready" class="fa fa-check" aria-hidden="true"></i>'+
            '</button>'+
            '</p>'+
        '</div>'+
        '<div class="col-xs-3">'+
            '<button v-bind:disabled="!ready" class="btn btn-success" v-on:click="postReady()">Työ valmis</button>'+
        '</div>'+
    '</div>'
}))

Vue.component('my-orders',{
    props:['orders','editForm'],
    beforeMount:function(){
        $.get('/orders/get-orders-by-artist').then(function(response){
            $.each(response,function(key,object){
                if(object.extraHours == null) object.extraHours = 0;
                object.hashId = '#myorder' + object.id;
                object.orderId = 'myorder' + object.id;
                object.moment = moment(object.eventDate,'YYYY-MM-DD').locale('fi').format('LL')
            })
            this.orders = response;
            console.log(response)
        }.bind(this))
    },
     template:'<div>'+
                '<div class="panel-group">'+
                    '<div  class="panel m5 panel-primary" v-for="order in orders">'+
                        '<div data-toggle="collapse" v-bind:data-target="order.hashId" class="panel-heading"><span class="badge" style="text-transform:uppercase;">{{ order.eventSize }}</span> <i class="fa fa-calendar" aria-hidden="true"></i> {{ order.moment }}  <i class="fa fa-map-marker" aria-hidden="true"></i> {{ order.eventCity }}</div>'+
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
            '</div>'
})

new Vue({
    el:'#userApp'
})