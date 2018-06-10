<template>
  <div class="now">
  <b-container class="main-content">

    <b-row  align-h="center" align-v="center">  
    <div class="item">
        <h3>{{ item.title }} : {{item.player}} : [ {{item.time}} ]</h3>    
    </div>  
    </b-row>

    <b-row  align-h="center" align-v="center">    
       <div class="item">   
           <b-img rounded="circle" blank width="275" height="275" blank-color="#eee" alt="img" class="m-1" />     
           <b-img rounded="circle" blank width="275" height="275" blank-color="#f00" alt="img" class="m-1" />  
           <b-img rounded="circle" blank width="275" height="275" blank-color="#eee" alt="img" class="m-1" />  
       </div>  
    </b-row>

    <b-row  align-h="center" align-v="center">  
      <div class="item">  
        <h1>{{ stopWatch.minute }} : {{stopWatch.second}} </h1>    
      </div>  
    </b-row>    
  </b-container>
  </div>
</template>

<script>
export default {
  name: 'now',
  data () {
    return {
      item:{
      title: 'Prepared Speech',
      player: 'Roshan Perera',
      time: '7-5 minutes'
      },
      stopWatch:{
        minute:4,
        second:45
      },
      signal:{
          green: {minute:5, second:0}, yellow:{minute:6,second:0}, red: {minute:7, second:0},

      }      
    }
  }
}
</script>

<style>
.main-content{
 
}

.item
{
  padding:40px;
  padding-bottom:40px;
}
</style>