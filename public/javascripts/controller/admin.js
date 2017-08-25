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

Vue.component('users',{
    props:['users','user'],
    beforeMount:function(){
        $.get('/artists/all').then(function(response){
            $.each(response,function(key,object){
                object.hashId = '#' + object.id     //MAKE "#id" + "" for bootstrap
            })
            this.users = response;
        }.bind(this))
    },
    methods:{
        postForm:function(target){
        }
    },
    template:'<div class="panel panel-default"><div class="panel-heading">Käyttäjät</div><div class="panel-body">'+
                    '<div class="panel-group" v-for="user in users">'+
                        '<div class="panel panel-primary">'+
                            '<div class="panel-heading" data-toggle="collapse" v-bind:data-target="user.hashId">'+
                                '{{ user.firstName }}  {{ user.lastName }}'+
                            '</div>'+
                            '<div v-bind:id="user.id" class="collapse">'+
                                '<user v-bind:user="user"></user>'+
                            '</div>'+
                        '</div>'+
                    '<div>'+              
            '</div></div>'
});

new Vue({
  el: '#admin'
})