Vue.component('pass-form',{
    props:['pass','checkPass','token'],
    created:function(){
        this.token = token;
    },
    methods:{
        postPassword:function(){
            if(!this.token) {
                alert('Virhe: Lataa sivu uudelleen')
                return;
            };
            if(!this.pass){
                alert('Virhe: Syötä salasana oikein')
                return;
            };
            $.post('/artists/change-password',{token:this.token,password:this.pass},function(response){
                    alert('Salasana muutettu!')
                    window.location.replace('/')
                })
        }
    },
    template: 
    '<div class="col-md-4 col-md-offset-4">'+
        '<div class="well" class="well" style="margin-top:100px;padding:50px;background-image:url('+"'"+'../images/paper-blue.jpg'+"'"+');background-size:cover;border:none;">'+
            '<label for="pass" >Anna salasana <span v-if="pass && checkPass && pass == checkPass && pass.length > 3">OK!</span></label>'+
            '<input class="form-control" id="pass" v-model="pass" type="password">'+
            '<label for="check" >Vahvista salasana</label>'+
            '<input class="form-control" id="check" v-model="checkPass" type="password">'+
            '<br>'+
            '<button class="btn btn-success" v-bind:disabled="!pass || !checkPass || pass != checkPass || pass.length < 4" v-on:click="postPassword()">Vaihda salasana</button>'+
        '</div>'+
    '</div>'
})

new Vue({
  el: '#pass'
})