<template>
  <div class="agenda" ref="content">  

      <b-modal ref="tableTopicsModal" hide-footer title="Using Component Methods">
        <div class="d-block text-center">
            <h3>Hello From My Modal!</h3>
        </div>      
      </b-modal>

    <b-card title="Agenda" >
      <b-card-header>     

          <b-container>
              <b-row>
                  <b-col cols="3">
                    <b-row>
                      <div id="imageDiv" >
                        <img class="preview" :src="imageData">
                      </div>
                    </b-row>                          
                  </b-col>
                  <b-col cols="8">
                     <div id="messageDiv">           
                        <div class="headerItem"> Toastmaster {{this.toastmaster}}</div> <br>
                        <div class="headerItem"> Theme  <input class="editableAgendaItem longText" type="text" v-model="this.theme"> </input> </div><br>
                        <div class="headerItem"> Venue <input class="editableAgendaItem longText" type="text" v-model="this.venue"> </input> </div><br>
                        <div class="headerItem"> Toastmaster values <input class="editableAgendaItem longText" type="text" v-model="this.values"> </input> </div><br>
                    </div>
                  </b-col>
                  <b-col cols="1">      
                      <div class="buttonPanel">
                    
                        <b-button-group vertical>                      
                          <b-button v-on:click=""class="btn-outline-primary">Start Session</b-button>
                          <b-button v-on:click="" class="btn-outline-primary">Archive</b-button>                                             
                        </b-button-group>
                     
                    </div>         

                  </b-col>                 
              </b-row>
               <b-row>
                      <b-col cols="8">
                        <div class="input-group">
                          <input type="file" @change="previewImage" accept="image/*">
                        </div>
                      </b-col>

                      <b-col cols="4">                                     
                          <b-button-group>                      
                            <b-button v-on:click="moveUp()"class="btn-outline-primary">Move Up </b-button>
                            <b-button v-on:click="moveDown()" class="btn-outline-primary">Move Down</b-button>
                            <b-button v-on:click="addNew()" class="btn-outline-primary">Add New</b-button>
                            <b-button v-on:click="remove()" class="btn-outline-primary">Remove</b-button>
                            <b-button v-on:click="generatePdf()" class="btn-outline-primary">test</b-button>                      
                          </b-button-group>                  
                                 
                       </b-col>

                    </b-row>             
          </b-container>         
      </b-card-header>

      <template>
      <div id="agendaItems">
        <b-table striped hover :fields="fields" :items="agendaItems" @row-clicked="selected">          

          <template slot="time" slot-scope="data">     
          <span v-if="data.item.time && data.item.time.hour && data.item.time.minute">{{ data.item.time.hour|00}} : {{data.item.time.minute|00}}</span>      
          </template>

          <template slot="discription" slot-scope="data">
            <input class="editableAgendaItem longText" type="text" v-model="data.item.discription"> </input>
          </template>

          <template slot="player" slot-scope="data">
            <input class="editableAgendaItem" type="text" v-model="data.item.player"> </input>
          </template>


          <template slot="duration" slot-scope="data">
              <div style="display:inline" v-if="data.item.duration.min>0">
                <input class="editableAgendaItem shortText inline alignRight" type="text" v-model="data.item.duration.min"> </input>
                to 
              </div>
              <input class="editableAgendaItem shortText inline" type="text" v-model="data.item.duration.max"> </input>  
              minutes 
              <button v-on:click="toggleDuration(data.item.rank)" class="btn btn-link">
                <span v-if="data.item.duration.min >=0">(Single)</span>
                <span v-if="data.item.duration.min <0" >(Range)</span> </button>          
          </template>  
        

          <template slot="signal" slot-scope="data"> 
          <div v-if="data.item.signal.green" class="inline">
            G <input  class="editableAgendaItem shortText inline alignRight" type="text" v-model="data.item.signal.green.minute" ></input>
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

          <template slot="start" slot-scope="data"> 
             <b-button v-on:click="startItem(data.item)"class="btn-outline-primary">Start</b-button>
          </template> 
          <template slot="stop" slot-scope="data"> 
             <b-button v-on:click="stopItem(data.item)"class="btn-outline-primary">Stop</b-button>
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
var numeral = require("numeral");

export default { 
  
  methods:{

      updateRecord(){
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
          this.$data.agendaItems[i] = this.setFormatting(this.$data.agendaItems[i]);
          newList.push(this.$data.agendaItems[i]);              
        }
          this.$data.agendaItems = newList;
      },

      setFormatting(item) {

          if (item.signal){
              
          if (item.signal.green) {
            if ( item.signal.green.minute.toString().length==1)
              item.signal.green.minute = "0" + item.signal.green.minute.toString();

            if (item.signal.green.second.toString().length==1)
              item.signal.green.second = "0" + item.signal.green.second.toString();   
          }  

          if (item.signal.yellow) {
            if (item.signal.yellow.minute.toString().length==1)
              item.signal.yellow.minute = "0" + item.signal.yellow.minute.toString();

            if ( item.signal.yellow.second.toString().length==1)
              item.signal.yellow.second = "0" + item.signal.yellow.second.toString();   
          } 

          if (item.signal.red) {
            if (item.signal.red.minute.toString().length==1)
              item.signal.red.minute = "0" + item.signal.red.minute.toString();

            if (item.signal.red.second.toString().length==1)
              item.signal.red.second = "0" + item.signal.red.second.toString();   
          }           
          }
          return item;
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
      updateTime(){
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

      previewImage(event) {

          var that = this;

          // Reference to the DOM input element
          var input = event.target;
          // Ensure that you have a file before attempting to read it
          if (input.files && input.files[0]) {
              // create a new FileReader to read this image and convert to base64 format
              var reader = new FileReader();
              // Define a callback function to run, when FileReader finishes its job
              reader.onload = (e) => {
                  // Note: arrow function used here, so that "this.imageData" refers to the imageData of Vue component
                  // Read image as base64 and set to imageData
                  this.imageData = e.target.result;
              }
              // Start the reader job - read file as a data url (base64 format)
              reader.readAsDataURL(input.files[0]);

              var file = input.files[0];  
              var img = new Image();
              img.src = window.URL.createObjectURL( file );

              img.onload = function() {
              that.imageWidth = img.naturalWidth;
              that.imageHeight = img.naturalHeight;
              window.URL.revokeObjectURL( img.src );            
            };
          }
      },
    
      generatePdf(e)
      {        
        var doc = new jsPDF();        
        doc.setFont("helvetica"); 

        doc.setFontSize(16);
        doc.text("Aganda", 100, 10);

        var maxImgDim = 60;
        var imgWidth = maxImgDim;
        var imgHeight = maxImgDim;        

        if (this.$data.imageWidth > this.$data.imageHeight ) imgHeight = this.$data.imageHeight / this.$data.imageWidth * maxImgDim;
        else imgWidth = this.$data.imageWidth/this.$data.imageHeight * maxImgDim          

        doc.addImage(this.imageData, 'JPEG', 15, 20, imgWidth, imgHeight);
        doc.setFontSize(9);

        this.$data.agendaItems.forEach(function(item,index) {

          var itemStartY = 80

          var time = numeral(item.time.hour).format("00") + ": " + numeral(item.time.minute).format("00")
          doc.text(time, 15, itemStartY + 10*index);

          doc.text(item.discription, 30, itemStartY + 10*index);   

          doc.text(item.player, 85, itemStartY + 10*index);          

          var duration =  item.duration.max + " minutes";
          if (item.duration.min > 0 && item.duration.min != item.duration.max) duration = item.duration.min + " - " + item.duration.max + " minutes";
          doc.text(duration, 115, itemStartY + 10*index);
          
          var signal="";
          if (item.signal){

              if (item.signal.green && item.signal.green.minute)
              {
                signal = signal + "G " +  numeral(item.signal.green.minute).format("00");
                if (item.signal.green.second) signal = signal + ":" + numeral(item.signal.green.second).format("00");
                else signal = signal + ":00";                  
              }

              if (item.signal.yellow && item.signal.yellow.minute)
              {
                signal = signal + "  Y " +  numeral(item.signal.yellow.minute).format("00");
                if (item.signal.yellow.second) signal = signal + ":" + numeral(item.signal.yellow.second).format("00");
                else signal = signal + ":00";                  
              }

              if (item.signal.red && item.signal.red.minute)
              {
                signal = signal + "  R " +  numeral(item.signal.red.minute).format("00");
                if (item.signal.red.second) signal = signal + ":" + numeral(item.signal.red.second).format("00");
                else signal = signal + ":00";                  
              } 
                doc.text(signal, 145, itemStartY + 10*index);                  
          }

        });

        doc.save('sample-file.pdf');                      
      },  

      startItem(item){

        if (item.discription.toLowerCase().trim() === "table topics") {
            this.$refs.tableTopicsModal.show()
        }

      },

      stopItem(item){

      },

      addTableTopicSpeker(){

      },  

        
         
  }, 

  data () {
    return {
      msg: 'Aganda',
      fields: {time:{key:'time', label:' '}, discription:{key:'discription', label:' '}, player:{key:'player', label:' '}, duration:{key:'duration', label:' '}, signal:{key:'signal', label:' '}, start:{key:'start', label:' '}, stop:{key:'stop', label:' '}},
      agendaItems:[],
      selectedItem:{},
      itemCountOnLoad:0,
      agendaDocId:"",
      imageData: "",
      imageHeight:0,
      imageWidth:0, 
      toastmaster: "Roshan Perera",
      theme: "Save the World",
      venue: "Food & Plant Research",
      values: "Respect, Integrity, Service, Excellence"
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

.container{
  margin:0px;  
}

#agendaItems{
    overflow: auto;
    display: flex;
    height: 50vh;
}
.editableAgendaItem{
    border: 0px;
    background: none;
    color: #0d08f9
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

#imageDiv{
  width:200px; 
  background:#dceaf9;
  height:200px;
  margin-bottom:15px;  
  float:left;
  border-radius:5px;
  display: flex;
  align-items: center; 
}

#messageDiv{  
  padding-top: 20px;
}

.preview{
  max-width:200px;
  max-height:200px; 
}

.buttonPanel{
  padding-top: 20px;
}
.btn-toolbar{
  background:gray;  
}

.headerItem{
  text-align:left;  
  display:block; 
}
.btn{
  margin-bottom:5px;
  border-radius:5px!import;
}

input[type="file"] {
    width:100px;
}

@media only screen and  (min-width: 1200px){
  .container {
      max-width:1250px; 
  }
}

</style>