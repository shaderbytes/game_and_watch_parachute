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
body{
   overflow: hidden;
   margin: 0;
}
#app { 
  color: #2c3e50;
  overflow: hidden;
  
}
</style>
