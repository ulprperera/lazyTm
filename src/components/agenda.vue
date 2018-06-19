<template>
  <div class="agenda">   
    <b-card title="Agenda" >

      <b-card-header>      
          <b-button-group size="sm">
          <b-button v-on:click="moveUp()" >Move Up </b-button>
          <b-button v-on:click="moveDown()" >Move Down</b-button>
          <b-button v-on:click="addNew()" >Add New</b-button>
          <b-button v-on:click="remove()" >Remove</b-button>

           <b-button v-on:click="deleteAgenda()" >Test</b-button>
        
          </b-button-group>
      </b-card-header>

      <template>
      <div id="agendaItems">
        <b-table striped hover :fields="fields" :items="agendaItems" @row-clicked="selected">          

        <template slot="time" slot-scope="data">     
        {{ data.item.time.hour|00}} : {{data.item.time.minute|00}}      
        </template>

        <template slot="discription" slot-scope="data">
          <input class="editableAgendaItem longText" type="text" v-model="data.item.discription"> </input>
        </template>

        <template slot="duration" slot-scope="data">
            <div style="display:inline" v-if="data.item.duration.min>0">
              <input class="editableAgendaItem shortText inline alignRight" type="text" v-model="data.item.duration.min"> </input>
              to 
            </div>
            <input class="editableAgendaItem shortText inline" type="text" v-model="data.item.duration.max"> </input>  
            minutes 
            <b-button v-on:click="toggleDuration(data.item.rank)" >
              <span v-if="data.item.duration.min >=0">Single</span>
              <span v-if="data.item.duration.min <0">Range</span> </b-button>          
        </template>  
      

        <template slot="signal" slot-scope="data"> 
        <div v-if="data.item.signal.green" class="inline">
          G <input  class="editableAgendaItem shortText inline alignRight" type="text" v-model="data.item.signal.green.minute"></input>
           :<input  class="editableAgendaItem shortText inline" type="text" v-model="data.item.signal.green.second"></input>
         </div>

        <div v-if="data.item.signal.yellow" class="inline">
          Y <input  class="editableAgendaItem shortText inline alignRight" type="text" v-model="data.item.signal.yellow.minute"></input>
           :<input  class="editableAgendaItem shortText inline" type="text" v-model="data.item.signal.yellow.second"></input>
         </div>

        <div v-if="data.item.signal.red" class="inline">
          R <input  class="editableAgendaItem shortText inline alignRight" type="text" v-model="data.item.signal.red.minute"></input>
           :<input  class="editableAgendaItem shortText inline" type="text" v-model="data.item.signal.red.second"></input>
         </div>                 
        </template> 

    
        </b-table>
      </div>  
      </template>        

        <b-button-group size="sm">
        <b-button v-on:click="addAgendaItem" >Add From Roster</b-button>      
        <b-button v-on:click="updateRecord" >Update</b-button>        
        </b-button-group>

      <b-card-footer>This is a footer</b-card-footer>

    </b-card>   
    
  </div>
</template>
<script>

import {db} from '../firebase'
import {cs} from '../firebase'
import {_} from 'vue-underscore';


export default { 
  
  methods:{

    updateRecord()
    {
        cs.collection('agenda').doc("id").collection("items").doc('1').get()   
        
        .then(function(querySnapshot) {
            console.log(querySnapshot);

            querySnapshot = {rank: 2, discription: "la la la", duration:{min:3, max:3}, player:"Sandya", signal:  {green: {minute:2, second:0}, yellow:{minute:2,second:30}, red: {minute:3, second:0}}}
            cs.collection("agenda").doc("id").collection('items').doc("1").set(querySnapshot);

        })
        .catch(function(error) {
            console.error("Error adding document: ", error);
        });
    },   

    selected(data){    
      this.clearSelection();
      this.$data.agendaItems[data.rank -1]._rowVariant = 'danger';
      this.$data.selectedItem = this.$data.agendaItems[data.rank -1];
    },   

    moveUp(){
      var rank = this.$data.selectedItem.rank;
      if (rank>1){
        this.$data.agendaItems[rank-2].rank = rank;  
        this.$data.agendaItems[rank-1].rank = rank -1;
        this.clearSelection();  
        this.$data.agendaItems = _.sortBy(this.$data.agendaItems,'rank');
        this.$data.agendaItems[rank-2]._rowVariant = 'danger';     
      }
    },

    moveDown(){
      var rank = this.$data.selectedItem.rank;
        if (rank < this.$data.agendaItems.length){ 
          this.$data.agendaItems[rank].rank = rank;  
          this.$data.agendaItems[rank-1].rank = rank + 1;
          this.clearSelection(); 
          this.$data.agendaItems = _.sortBy(this.$data.agendaItems,'rank');
          this.$data.agendaItems[rank]._rowVariant = 'danger';  
        }
    },    

    toggleDuration(rank){
      if (this.$data.agendaItems[rank-1].duration.min >= 0 ) this.$data.agendaItems[rank-1].duration.min = -1 ;     
      else this.$data.agendaItems[rank-1].duration.min = this.$data.agendaItems[rank-1].duration.max;      
    },

    clearSelection(){
      var newList = [];
        for (var i=0; i<this.$data.agendaItems.length; i++){
          this.$data.agendaItems[i]._rowVariant ='';
          newList.push(this.$data.agendaItems[i]);       
        }
        this.$data.agendaItems = newList;
    },

    addNew(){
      var newRank = this.getMaxRank() + 1; 
      this.$data.agendaItems.push({
          rank: newRank,
          discription: "",
          duration:{min:2, max:3},
          player:'',
          signal: {} 
      });
      this.clearSelection();
    },    

    getMaxRank(){
      var record = _.max(this.$data.agendaItems, function(o){return o.rank});
      return record.rank;
    },

    remove(){ 
      var selectedRank = this.$data.selectedItem.rank;     
      var index = _.findIndex(this.$data.agendaItems, {rank:selectedRank});
      this.$data.agendaItems.splice(index, 1);
      this.reRank(); 
    },

    reRank()    {
      var newList = [];
      for (var i=0; i<this.$data.agendaItems.length; i++ )
      {     
        this.$data.agendaItems[i].rank = i+1;
        newList.push(this.$data.agendaItems[i]);      
      }
        this.$data.agendaItems = newList;
    },

    dateToString(dte){
      return dte.getDate() + "-" + (dte.getMonth() + 1) + "-" +  dte.getFullYear();
    },

    addAgendaItem() {

      var now = new Date();
      var docId = this.$data.agendaDocId;
      var agendaItems = this.$data.agendaItems;
      var initialItemCount = this.$data.itemCountOnLoad;
      cs.collection("agenda").doc(docId).set({
      date: new Date() ,
      status: "Active",    
      })
      .then(function(docRef) {        
          for (var i=0; i<agendaItems.length; i++){
            cs.collection("agenda").doc(docId).collection('items').doc(i.toString()).set(agendaItems[i]);
          }

          for (var i= agendaItems.length ; i<=initialItemCount; i++){
            cs.collection("agenda").doc(docId).collection('items').doc(i.toString()).delete();
          }
      })
      .catch(function(error) {
          console.error("Error adding document: ", error);
      });        
    },

     deleteAgenda(){

      cs.collection("agenda").doc("id").delete().then(function() {
      console.log("Document successfully deleted!");
      }).catch(function(error) {
          console.error("Error removing document: ", error);
      });
    },
     updateTime()
    {
       var statTime = {hour:17, minute:20}
       var agendaItems = [];

       var firstItem = this.$data.agendaItems[0];       
       firstItem.time = {hour:statTime.hour,  minute:statTime.minute};
       agendaItems.push(firstItem);

        for (var i=1; i<this.$data.agendaItems.length; i++ ){
        
          var item = this.$data.agendaItems[i];
          var min =  agendaItems[i-1].time.minute + this.$data.agendaItems[i-1].duration.max;
          var hr =  agendaItems[i-1].time.hour;

          if (min >=60)
          {
            min = min-60;
            hr++;
          }

          item.time = {minute:min, hour:hr};         
          agendaItems.push(item);
        }
        this.$data.agendaItems =  agendaItems;
        
      },
  }, 

  data () {
    return {
      msg: 'Aganda',
      fields: {time:{key:'time', label:' '}, discription:{key:'discription', label:' '}, duration:{key:'duration', label:' '}, signal:{key:'signal', label:' '}},
      agendaItems:[],
      selectedItem:{},
      itemCountOnLoad:0,
      agendaDocId:""
    }
  }, 

  created(){

    var that = this;

    cs.collection('agenda').where("status","==","Active").orderBy("date", "desc").limit(1).get().then(function(querySnapshot) {  
      
      that.$data.agendaDocId = querySnapshot.docs[0].id;     
      that.$binding("agendaItems", cs.collection('agenda').doc(that.$data.agendaDocId).collection("items")).then((agendaItem) => {
        that.$data.agendaItems = _.sortBy(agendaItem,'rank'); 
        that.reRank();
        that.updateTime();
        that.$data.itemCountOnLoad = that.$data.agendaItems.length;
    }); 
    
    }).catch(function(error) {
      console.log("Error getting document:", error);
    });    

  }
}
</script>

<style>

.table td, .table th {   
    text-align: left;
}

#agendaItems{
    overflow: auto;
    display: flex;
    height: 50vh;
}
.editableAgendaItem{
    border: 0px;
    background: none;
}
.longText{
  width:300px;
}
.shortText
{
   width:20px;
  
}
.alignRight{
 text-align:right;
}

.table td, .table th
{
  padding:0px;
  vertical-align:middle;
  line-height:1;  
}

.inline{
display:inline;
}

</style>