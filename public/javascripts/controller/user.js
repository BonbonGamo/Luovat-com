Vue.component('signBtn',{
    props:['order'],
    methods:{
        signOrder:function(){
            $.post('/orders/pickup',{orderId:this.order.id}).then(function(response){
                alert(response)
            })
        }
    },
    template:'<button v-on:click="signOrder()" class="btn btn-success-shallow">Ilmottaudu</button>'
})

Vue.component('orders',{
    props:['orders'],
    beforeMount:function(){
        $.get('/orders/pickups').then(function(response){
            $.each(response,function(key,object){
                object.hashId = '#order' + object.id;
                object.orderId = 'order' + object.id;
                object.moment = moment(object.date,'YYYY-MM-DD').locale('fi').format('LL')
            })
            this.orders = response;
        }.bind(this))
    },
    template:'<div>'+
                '<div class="panel-group">'+
                    '<div  class="panel m5 panel-primary" v-for="order in orders">'+
                        '<div data-toggle="collapse" v-bind:data-target="order.hashId" class="panel-heading"><span class="badge" style="text-transform:uppercase;">{{ order.size }}</span> <i class="fa fa-calendar" aria-hidden="true"></i> {{ order.moment }}  <i class="fa fa-map-marker" aria-hidden="true"></i> {{ order.city }}</div>'+
                        '<div class="panel-body collapse" v-bind:id="order.orderId" >'+
                            '<div>{{ order.message }}</div>'+
                            '<signBtn v-bind:order="order"></signBtn>'+
                        '</div>'+
                    '</div>'+
                '</div>'+
            '</div>'
})

Vue.component('edit-order',({
    props:['order'],
    beforeMount:function(){
            console.log('Order ',this.order)
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
        '<div class="col-xs-12">'+
            '<button class="btn btn-success">Tallenna muutokset</button>'+
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