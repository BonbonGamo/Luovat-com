Vue.component('campaigns-main',{
    props:['campaigns'],
    created:function(){
        this.updateCampaigns();
    },
    methods:{
        updateCampaigns:function(){
            $.get('/campaigns')
            .then(function(campaigns){
                $.each(campaigns, function(key, o){
                    o.hashId = '#collapse' + o.id
                    o.collapseId = 'collapse' + o.id
                })
                this.campaigns = campaigns;
            }.bind(this))
        }
    },
    template:
    '<div class="row">'+
        '<div class="col-md-6">'+
            '<campaigns v-bind:campaigns="campaigns" ></campaigns>'+
        '</div>'+
        '<div class="col-md-6">'+
            '<new-campaign percent="20"></new-campaign>'+
        '</div>'+
    '</div>'
})

Vue.component('campaigns',{
    props:['campaigns'],
    methods:{
        updateCampaigns:function(){
            this.$parent.updateCampaigns();
        }
    },
    template:
    '<div class="panel  panel700">'+
        '<div class="panel-heading">'+
            'Kampanjat'+
        '</div>'+
        '<div class="panel-body">'+
            '<div class="panel-group">'+
                '<campaign v-for="campaign in campaigns" v-bind:campaign="campaign"></campaign>'+
            '</div>'+
        '</div>'+
    '</div>'
})

Vue.component('campaign',{
    props:['campaign'],
    methods:{
        postEdit:function(){
            $.post('/campaigns/edit',this.campaign)
            .then(function(response){
                this.$parent.updateCampaigns();
                toastr.success('Tilaus päivitetty')
            })
        },
        activate:function(){
            $.post('/campaigns/toggle-active/' + this.campaign.id + '/' + this.campaign.isActive)
            .then(function(response){
                this.$parent.updateCampaigns();
                toastr.success('Tilaus aktivoitu')
            })
        }
    },
    template:
    '<div class="panel">'+
        '<div class="panel-heading" data-toggle="collapse" v-bind:data-target="campaign.hashId">'+
            '{{ campaign.campaignName }}'+
        '</div>'+
        '<div v-bind:id="campaign.collapseId" class="panel-body collapse">'+
            '<div class="row">'+
                '<div class="col-xs-6">'+
                    '<label>Nimi:</label>'+
                    '<input type="text" class="form-control m10" v-model="campaign.campaignName"></input>'+
                    '<label>Kampanjakoodi:</label>'+
                    '<input type="text" class="form-control m10" v-model="campaign.campaignCode"></input>'+
                    '<label>Alkaa:</label>'+
                    '<input type="date" id="startId" class="form-control m10" v-model="campaign.starts"></input>'+
                    '<label>Loppuu:</label>'+
                    '<input type="date" class="form-control m10" v-model="campaign.ends"></input>'+
                    '<label>Ale %:</label>'+
                    '<input type="number" min="0" max="100" class="form-control m10" v-model="campaign.percent"></input>'+
                '</div>'+
                '<div class="col-xs-6">'+
                    '<div class="form-group m10">'+
                        '<label>Tekijä:</label>'+
                        '<p>{{ campaign.madeBy}}</p>'+
                    '</div>'+
                    '<div class="form-group m10">'+
                        '<label>Viimeksi muokannut:</label>'+
                        '<p>{{ campaign.editedBy}}</p>'+
                    '</div>'+
                    '<div class="form-group m10">'+
                        '<label>Valinnat:</label>'+
                        '<button class="btn btn-xs btn-success m5" style="min-width:90%" v-on:click="activate()"><span v-if="campaign.isActive">Poista käytöstä</span><span v-if="!campaign.isActive">Muuta aktiiviseksi</span></button>'+
                        '<button class="btn btn-xs btn-success m5" style="min-width:90%" v-on:click="postEdit()" >Tallenna</button>'+
                        '<button class="btn btn-xs btn-success m5" style="min-width:90%" disabled="true">Uusi kopioiden</button>'+
                    '</div>'+
                '</div>'+
            '</div>'+
        '</div>'+
    '</div>',
})

Vue.component('new-campaign',{
    props:['campaignName','campaignCode','starts','ends','percent'],
    methods:{
        newCampaign:function(){
            $.post('/campaigns/new',{
                campaignName:this.campaignName,
                campaignCode:this.campaignCode,
                start:this.starts,
                ends:this.ends,
                percent:this.percent
            })
            .then(function(response){
                this.$parent.updateCampaigns();
            })
        }
    },
    template:
    '<div class="panel">'+
        '<div class="panel-heading">'+
            'Uusi kampanja'+
        '</div>'+
        '<div class="panel-body">'+
            '<div class="form-group">'+

                '<label for="nm">Nimi:</label>'+
                '<input class="form-control" type="text" id="nm" v-model="campaignName" placeholder="Nimi"/>'+

                '<label for="cd">Koodi:</label>'+
                '<input class="form-control" type="text" id="cd" v-model="campaignCode" placeholder="Kampanjakoodi"/>'+

                '<label for="str">Alkaa:</label>'+
                '<input class="form-control" type="date" id="str" v-model="starts" placeholder="Alkaa"/>'+

                '<label for="end">Loppuu:</label>'+
                '<input class="form-control" type="date" id="end"  max="document.getElmentById('+"'str'"+')" v-model="ends" placeholder="Loppuu"/>'+

                '<label for="per">Ale %:</label>'+
                '<input class="form-control" type="number" min="0" max="100"  id="per" v-model="percent" placeholder=""/>'+

                '<br>'+
                '<button class="btn btn-success form-control" v-on:click="newCampaign()">Lisää kampanja</button>'+
            '</div>'+
        '</div>'+
    '</div>'
})
