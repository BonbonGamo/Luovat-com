Vue.component('artist-window',{
    props:['colwidth','user'],
    methods:{
        playVideo:function(){
            $('#video-source').attr('src',this.user.reelLink);
            $("#video-modal").modal();
        }
    },
    template:
    '<div v-bind:class="colwidth">'+
        '<div class="well text-center well-option">'+
            '<h1 class="montserrat darkblue">{{ user.name }}</h1>'+
            '<p class="black" class="bestTip">Katso parhaat palat kuvaajalta {{ user.name }} painamalla alla olevaa play -nappia <strong>!</strong></p>'+
            '<a class="btn-play" v-on:click="playVideo()" ><i class="fa fa-play-circle-o" aria-hidden="true"></i></a><br>'+
            '<a class="btn btn-luovat btn-sm black" v-bind:href="user.link">Valitse minut</a>'+
        '</div>'+
    '</div>'
})

Vue.component('select-artist',{
    props:['colwidth','users'],
    created:function(){
        this.users = users;
        this.colwidth = 'col-md-' + (12 / users.length)
        },
    methods:{
        selectRandom:function(){
            $.get(users[Math.floor((Math.random() * users.length) + 0)].link)
        },
    },
    template:
        '<div class="col-md-10 col-md-offset-1 col-lg-6 col-lg-offset-3">'+
            '<div class="row">'+
                    '<div  v-for="user in users">'+
                        '<artist-window v-bind:user="user" v-bind:colwidth="colwidth"></artist-window>'+
                    '</div>'+
                '</div>'+
                '<div class="row">'+
                '<center>'+
                    '<button class="btn btn-lg btn-white m20">Kuka tahansa kuvaaja käy</button>'+
                '</center>'+
            '</div>'+
        '</div>'
})

new Vue({
    el:'#selectApp'
})

$('#video-modal').on('hidden.bs.modal', function () {
    $('#video-source').attr('src','');
 });