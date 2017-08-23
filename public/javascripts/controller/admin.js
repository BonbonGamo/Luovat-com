Vue.component('user-table', {
    props:['rows'],
    methods:{
        getRows:function(){
            var self = this
            $.get('/artists').then(function(response){
                this.rows = response;
                console.log(this)
            }.bind(this))
        }
    },
    beforeMount:function(){
        this.getRows()
    },
    template:'<div><table class="table">'+
        '<tr>'+
            '<th>Etunimi</th>'+
            '<th>Sukunimi</th>'+
            '<th></th>'+
        '</tr>'+
         '<tr v-for="row in this.rows">'+
            '<th>{{ row.firstName }}</th>'+
            '<th>{{ row.lastName }}</th>'+
            '<th><button v-bind:target="row.id"></buttom></th>'+
        '</tr>'+
    '</table></div>'
})

Vue.component('my-component', {
  template: '<div>A custom component!</div>'
})

new Vue({
  el: '#admin'
})