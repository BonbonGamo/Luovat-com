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
            })
        }
    },
    template:
    '<div class="row">'+
        '<div class="col-md-6">'+
            '<campaigns v-bind:campaigns="campaigns" ></campaigns>'+
        '</div>'+
        '<div class="col-md-6">'+
            '<new-campaign></new-campaign>'+
        '</div>'+
    '</div>'
})

Vue.component('campaigns',{
    props:['campaigns'],
    template:
    '<div class="panel">'+
        '<div class="panel-heading">'+
            'Kampanjat'+
        '</div>'+
        '<div class="panel-body">'+
            '<div class="panel-group">'+
                '<div class="panel" v-for="campaign in campaigns">'+
                    '<div class="panel-heading" data-toggle="collapse" v-bind:data-target="campaign.hashId">'+
                        '{{ campaign.campaignName }}'+
                    '</div>'+
                    '<div v-bind:id="campaign.collapseId" class="panel-body collapse">'+
                        '<label for="" ></label>'+
                        '<input id="" />'+
                    '</div>'+
                '</div>'+
            '</div>'+
        '</div>'+
    '</div>'
})

Vue.component('new-campaign',{
    props:['campaign'],
    created:function(){
        this.campaign = {
            campaignName:'',
            campaignCode:'',
            starts:'',
            ends:'',
            percent:20
        }
    },
    methods:{
        newCampaign:function(){
            $.post('/campaigns/new',this.campaign)
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
                '<input class="form-control" type="text" id="nm" v-model="campaign.campaignName" placeholder="Nimi"/>'+
                '<label for="cd">Koodi:</label>'+
                '<input class="form-control" type="text" id="cd" v-model="campaign.campaignCode" placeholder="Kampanjakoodi"/>'+
                '<label for="str">Alkaa:</label>'+
                '<input class="form-control" type="date" id="str" v-model="campaign.starts" placeholder="Alkaa"/>'+
                '<label for="end">Loppuu:</label>'+
                '<input class="form-control" type="date" id="end" v-model="campaign.ends" placeholder="Loppuu"/>'+
                '<label for="per">Ale %:</label>'+
                '<input class="form-control" type="number" min="0" max="100"  id="per" v-model="campaign.percent" placeholder="Alkaa"/>'+
                '<br>'+
                '<button class="btn btn-success form-control" v-on:click="newCampaign()">Lisää kampanja</button>'+
            '</div>'+
        '</div>'+
    '</div>'
})
