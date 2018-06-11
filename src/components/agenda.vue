<template>
  <div class="agenda">   
    <b-card title="Agenda" >

      <b-card-header>      
          <b-button-group size="sm">
          <b-button href="#" >Add From Roster</b-button>
          <b-button href="#" >Add New</b-button>
          </b-button-group>
      </b-card-header>

      <template>
        <b-table striped hover :fields="fields" :items="agendaItems" @row-clicked="selected">

  

        <template slot="rank" slot-scope="data">
            <input type="text" v-model="data.item.rank"> </input>
        </template>

          <template slot="discription" slot-scope="data">
            <input type="text" v-model="data.item.discription"> </input>
          </template>

          <template slot="duration" slot-scope="data">
            <div v-if="data.item.duration.min - data.item.duration.max !=0">
               {{data.item.duration.min}} - {{data.item.duration.max}} minutes
            </div>
            <div v-else-if="data.item.duration.min - data.item.duration.max == 0">
              {{data.item.duration.min}} minutes
            </div>            
          </template>  

          <template slot="edit" slot-scope="data">
            <b-button size="sm" class="mr-2" v-on:click="test(data)">Edit</b-button>
          </template>

          <template slot="select" slot-scope="data">
            <b-button size="sm" class="mr-2" v-on:click="selected(data)">Select</b-button>
          </template>

    
        </b-table>
      </template>        

        <b-button-group size="sm">
        <b-button v-on:click="addAgendaItem" >Add From Roster</b-button>
        <b-button v-on:click="getRecord" >Search</b-button>
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
 
  firebase:{
   //agenda: db.ref('agenda'),     
  },
  firestore:{      
  // agendaItems:  cs.collection('agenda').doc("id").collection("items")   

  },
  methods:{

  getRecord()
  {
      db.ref('agenda').orderByChild('date').equalTo('Today').on("value", function(snapshot) {
      console.log(snapshot.val());
     console.log(snapshot.key);
      console.log(snapshot.child('date').key);
    });
  },

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

   

    selected(data)
    {
     

      var newList = [];

       for (var i=0; i<this.$data.agendaItems.length; i++){
            this.$data.agendaItems[i]._rowVariant ='';
          newList.push(this.$data.agendaItems[i]);
        
        }       

        this.$data.agendaItems = newList;

          this.$data.agendaItems[data.rank -1]._rowVariant = 'danger';

    },

   

    addAgendaItem:function()
    {

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
                        {rank: 11, discription: "Grammarian evaluation", duration:{min:3, max:3}, player:"Janet", signal: {green: {minute:2, second:0}, yellow:{minute:2,second:30}, red: {minute:3, second:0}}},
                        {rank: 12, discription: "Time keeper evaluation", duration:{min:2, max:2}, player:"Scott", signal: {green: {minute:1, second:0}, yellow:{minute:1,second:30}, red: {minute:2, second:0}}},
                        {rank: 13, discription: "General evaluation",  duration:{min:5, max:5}, player:"Samir", signal:  {green: {minute:3, second:0}, yellow:{minute:4,second:0}, red: {minute:5, second:0}}},
                        {rank: 14, discription: "Trophy presentation and news",  duration:{min:3, max:3}, player:"Evaluators", signal:  {green: {minute:2, second:0}, yellow:{minute:2,second:30}, red: {minute:3, second:0}}},
                        {rank: 15, discription: "Meeting end",  duration:{min:1, max:1}, player:"Sandya", signal: {}}
                      ]
                    }

    //  var newPostKey = db.ref("agenda/-LE8N6Qoqyrw1IKygaV5").update(agenda);;

      
      cs.collection("agenda").doc("id").set({
      date: new Date() ,
      status: "Active",    
      })
      .then(function(docRef) {
         
          for (var i=0; i<agenda.items.length; i++){
           cs.collection("agenda").doc("id").collection('items').doc(i.toString()).set(agenda.items[i]);
          }
      })
      .catch(function(error) {
          console.error("Error adding document: ", error);
      });
         
    }
  },

  data () {
    return {
      msg: 'Aganda',
      fields: {rank:{key:'rank', label:' '}, discription:{key:'discription', label:' '}, duration:{key:'duration', label:' '}, edit:{key:'edit', label:' '}, select:{key:'select', label:' '}},
      agendaItems:[]
    }
  },

  created(){

      this.$binding("agendaItems", cs.collection('agenda').doc("id").collection("items")).then((agendaItem) => {
      this.$data.agendaItems = _.sortBy(agendaItem,'rank');
       
  })

  }
}
</script>

<style>

.table td, .table th {   
    text-align: left;
}

</style>