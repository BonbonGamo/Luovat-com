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
    methods:{
        updateUsers:function(){
            this.$parent.updateUsers();
            this.$parent.updateRekry();
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
        if(!this.user.userLevel) this.user.userLevel = 's';
        this.user.changePasswordLink = configUrl() + '/artists/send-password-change-link/' + this.user.id;
    },
    methods:{
        postForm:function(){
            var data = {
                id:             this.user.id,
                firstName:      this.user.firstName,   
                lastName:       this.user.lastName, 
                email:          this.user.email,     
                phone:          this.user.phone,       
                street:         this.user.street,      
                city:           this.user.city,        
                zipCode:        this.user.zipCode,     
                reelLink:       this.user.reelLink,    
                reelPassword:   this.user.reelPassword,
                activateUser:   this.user.activeUser,
                userLevel:      this.user.userLevel
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
                '<select v-bind:value="user.userLevel" v-model="user.userLevel" class="pp-form-control">'+
                    '<option value="s">S</option>'+
                    '<option value="m">M</option>'+
                    '<option value="l">L</option>'+
                '</select>'+
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

Vue.component('user-main',{
    props:['users','rekry'],
    created:function(){
        this.updateUsers();
        this.updateRekry();
    },
    template:
    '<div>'+
        '<div class="col-md-6 col-lg-6">'+
            '<users v-bind:users="users" v-bind:length="users.length" ></users>'+
        '</div>'+
        '<div class="col-md-6 col-lg-6">'+
            '<rekry v-bind:users="rekry" v-bind:length="rekry.length"></rekry>'+
            '<add-user></add-user>'+
        '</div>'+
    '</div>',
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
            }.bind(this))
        },
        updateRekry:function(){
            $.get('/artists/rekry')
            .then(function(response){
                $.each(response,function(key,object){
                    object.hashId = '#' + object.id     //MAKE "#id" + "" for bootstrap
                    if(object.activeUser){
                        users.push(object)
                    }
                    return;
                })
                this.rekry = response;
            }.bind(this))
        }
    }
})

Vue.component('add-user',{
    props:['firstName','lastName','email'],
    methods:{
        postNewUser:function(){
            if(this.firstName.length > 2 && this.lastName.length > 2){
                $.post('/artists/new',{firstName:this.firstName,lastName:this.lastName,email:this.email},function(response){
                    alert('Käyttäjä lisätty')
                    this.$parent.updateRekry();
                }.bind(this))
            }
        },
        validEmail:function(){
            return validateEmail();
        }
    },
    template:'<div class="panel panel-default">'+
                '<div class="panel-heading">Lisää käyttäjä</div>'+
                '<div class="panel-body">'+
                    '<label for="fn">Etunimi: <span v-if="firstName && firstName.length > 2"> OK! </span></label>'+
                    '<input class="form-control" id="fn" type="text" v-model="firstName">'+
                    '<label for="ln" >Sukunimi: <span v-if="lastName && lastName.length > 2"> OK! </span></label>'+
                    '<input class="form-control" id="ln" type="text" v-model="lastName">'+
                    '<label for="em" >Sähköposti: <span v-if="email && this.validEmail()"> OK! </span></label>'+
                    '<input class="form-control" id="em" type="email" v-model="email">'+
                    '<br>'+
                    '<button class="btn btn-success" v-on:click="postNewUser()">Luo käyttäjä</button>'+
                '</div>'+
            '</div>'
})

Vue.component('users',{
    props:['users','length'], //USER & REKRY REMOVED 
    beforeMount:function(){
        //this.updateUsers()
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
