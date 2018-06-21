
<template>
  <div class="roster" ref="content">

    <h1>{{ msg }}</h1>

      <b-table striped hover :items="roster"></b-table>
      <b-button-group size="sm">
        <b-button  v-on:click="addNew">Add New</b-button>
        <b-button  v-on:click="generatePdf">Create PDF</b-button>
      </b-button-group>

      <b-modal ref="newRosterItemModel"  title="New Roster Entry">
        <p class="my-4">Hello from modal!</p>
      </b-modal>
  </div>
</template>

<script>

//var jsPDF = require('jspdf');
//require('jspdf-autotable');



export default {
  name: 'roster',
   methods:{

    addNew: function(e)
    {     
     roster:this.$root.$data.Data.Roster.push({TM: "Roshan"});
    },

    generatePdf:function(e)
    {
        
          var rows = [ [1,2,3], [4,5,6] ];
          var col = ["First", "Second", "Third"];

          var doc = new jsPDF();

        

       //  doc.autoTable(col, rows);

       //   doc.save('Test.pdf');


        //var doc = new jsPDF();
        //doc.text("Hello World", 10, 10);
        //doc.save("pdfName" + '.pdf');

        var specialElementHandlers = {
            '#editor': function (element, renderer) {
            return true;
          }
        };


        var content  = this.$refs.content;

        doc.fromHTML(content.innerHTML, 15, 15, {
          'width': 170,
          'elementHandlers': specialElementHandlers
          
        });
    doc.save('sample-file.pdf');


    }

  },
  data () {
    return {
      msg: 'Roster',
      roster:this.$root.$data.Data.Roster

    }
  }
}
</script>