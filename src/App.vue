<template>
  
  <GameComponent/>
</template>

<script>
import GameComponent from './components/GameComponent.vue'

export default {
  name: 'App',
  components: {
    GameComponent
  }
}
</script>

<style>
html{  
   width:100%;
   height:100%;
}
body{
   overflow: hidden;
   margin: 0;
   width:100%;
   height:100%;
}
#app { 
  color: #2c3e50;
  overflow: hidden;
   width:100%;
   height:100%;
  
}
</style>
