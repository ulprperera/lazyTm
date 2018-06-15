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

        <template slot="rank" slot-scope="data">
            <input type="text" v-model="data.item.rank"> </input>
        </template>

        <template slot="discription" slot-scope="data">
          <input type="text" v-model="data.item.discription"> </input>
        </template>

        <template slot="duration" slot-scope="data">
            <div v-if="data.item.duration.min>0">
              <input type="text" v-model="data.item.duration.min"> </input>
              to 
            </div>
            <input type="text" v-model="data.item.duration.max"> </input>  
            minutes 
            <b-button v-on:click="toggleDuration(data.item.rank)" >
              <span v-if="data.item.duration.min >=0">Single</span>
              <span v-if="data.item.duration.min <0">Range</span> </b-button>          
        </template>  

        <template slot="edit" slot-scope="data">
          <b-button size="sm" class="mr-2" v-on:click="test(data)">Edit</b-button>
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

      var agenda =  {                   
                    date:"Tomorrow",
                    status:"active", //now, completed
                    items:[
                        {rank: 1, discription: "Arrive and settle in", duration:{min:10, max:10}, player:'All', signal: {} },
                        {rank: 2, discription: "Welcome ro members and guests", duration:{min:3, max:3}, player:"Sandya", signal:  {green: {minute:2, second:0}, yellow:{minute:2,second:30}, red: {minute:3, second:0}}},
                        {rank: 3, discription: "Word of the day/grammarian", duration:{min:2, max:2}, player:"janet", signal: {green: {minute:1, second:0}, yellow:{minute:1,second:30}, red: {minute:2, second:0}} },
                        {rank: 4, discription: "Table topics", duration:{min:8, max:8}, player:"Leandro", signal: {}},
                        {rank: 5, discription: "Introduction to prepared speech 1", duration:{min:2, max:2}, player:"Annie", signal: {green: {minute:1, second:0}, yellow:{minute:1,second:30}, red: {minute:2, second:0}}},
                        {rank: 6, discription: "Prepared speech 1", duration:{min:5, max:7}, player:'Roshan', signal:  {green: {minute:5, second:0}, yellow:{minute:6,second:0}, red: {minute:7, second:0}}},
                        {rank: 7, discription: "Introduction to prepared speech 2", duration:{min:2, max:2}, player:"Jason", signal: {green: {minute:1, second:0}, yellow:{minute:1,second:30}, red: {minute:2, second:0}}},
                        {rank: 8, discription: "Prepared speech 2", duration:{min:5, max:7}, player:"Stephanie", signal:  {green: {minute:5, second:0}, yellow:{minute:6,second:0}, red: {minute:7, second:0}}},
                        {rank: 9, discription: "Table topics evaluation", duration:{min:6, max:6}, player:"Harpreet/Mel", signal: {green: {minute:4, second:0}, yellow:{minute:5,second:30}, red: {minute:6, second:0}}},
                        {rank: 10, discription: "Evaluation of prepared speech 1", duration:{min:3, max:3}, player:"Annie", signal: {green: {minute:2, second:0}, yellow:{minute:2,second:30}, red: {minute:3, second:0}}},
                        {rank: 11, discription: "Evaluation of prepared speech 2", duration:{min:3, max:3}, player:"Jason", signal: {green: {minute:2, second:0}, yellow:{minute:2,second:30}, red: {minute:3, second:0}}},
                        {rank: 12, discription: "Grammarian evaluation", duration:{min:3, max:3}, player:"Janet", signal: {green: {minute:2, second:0}, yellow:{minute:2,second:30}, red: {minute:3, second:0}}},
                        {rank: 13, discription: "Time keeper evaluation", duration:{min:2, max:2}, player:"Scott", signal: {green: {minute:1, second:0}, yellow:{minute:1,second:30}, red: {minute:2, second:0}}},
                        {rank: 14, discription: "General evaluation",  duration:{min:5, max:5}, player:"Samir", signal:  {green: {minute:3, second:0}, yellow:{minute:4,second:0}, red: {minute:5, second:0}}},
                        {rank: 15, discription: "Trophy presentation and news",  duration:{min:3, max:3}, player:"Evaluators", signal:  {green: {minute:2, second:0}, yellow:{minute:2,second:30}, red: {minute:3, second:0}}},
                        {rank: 16, discription: "Meeting end",  duration:{min:1, max:1}, player:"Sandya", signal: {}}
                      ]
                    }         

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
    }

  }, 

  data () {
    return {
      msg: 'Aganda',
      fields: {rank:{key:'rank', label:' '}, discription:{key:'discription', label:' '}, duration:{key:'duration', label:' '}, edit:{key:'edit', label:' '}},
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

</style>