<template>
  <div id="app">

    <b-navbar toggleable="md" type="dark" variant="info">    
     <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
      <b-collapse is-nav id="nav_collapse">
         <b-navbar-brand href="#/now"><img src="./assets/tm.png" alt="BV" height="48" width="70"></b-navbar-brand>
        <b-navbar-nav>
          <b-nav-item href="#/now">Now</b-nav-item>
          <b-nav-item href="#/agenda">Agenda</b-nav-item>
          <b-nav-item href="#/roster">Roster</b-nav-item>  
          </b-navbar-nav>  
        </b-collapse>    
    </b-navbar>

    
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #030e61;
  margin-top: 10px;
}
</style>
