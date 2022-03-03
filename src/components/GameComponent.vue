<template>
  <canvas ref="bjsCanvas" touch-action="none"></canvas>
</template>

<script>
import { ref, onMounted } from "@vue/runtime-core";
import BabylonViewer from "@/babylon/BabylonViewer";
import parachute from "@/classes/Parachute.js";
export default {
  name: "GameComponent",

  setup() {
    const bjsCanvas = ref(null);
    onMounted(() => {
     
      if (bjsCanvas.value) {
       
          let babylonViewer = new BabylonViewer();
          babylonViewer.create(bjsCanvas.value);
          babylonViewer.load(
            require("../assets/glb/p_v_1_2.glb")
          );
          parachute.viewer = babylonViewer;
          parachute.initiate();
         
         
          
      }
    });
    return {
      bjsCanvas,
    };
  },
};
</script>

<style scoped></style>
