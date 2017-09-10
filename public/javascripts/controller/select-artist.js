Vue.component('artist-window',{
    props:['colwidth','user'],
    template:
    '<div v-bind:class="colwidth">'+
        '<div class="well text-center">'+
            '<h2>{{ user.name }}</h2>'+
            '<a class="btn-play" v-bind:href="user.reelLink"><i class="fa fa-play-circle-o" aria-hidden="true"></i></a><br>'+
            '<a class="btn btn-success-shallow" v-bind:href="user.link">Valitse minut</a>'+
        '</div>'+
    '</div>'
})

Vue.component('select-artist',{
    props:['colwidth','users'],
    created:function(){
        this.users = users;
        this.colwidth = 'col-md-' + (12 / users.length)
        console.log(this.colwidth)
    },
    template:'<div>'+
                '<div v-for="user in users">'+
                    '<artist-window v-bind:user="user" v-bind:colwidth="colwidth"></artist-window>'+
                '</div>'+
            '</div>'
})

new Vue({
    el:'#selectApp'
})