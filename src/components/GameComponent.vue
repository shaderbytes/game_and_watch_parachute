<template>
  <canvas ref="bjsCanvas" touch-action="none"></canvas>
</template>

<script>
import { ref, onMounted } from "@vue/runtime-core";
import BabylonViewer from "@/babylon/BabylonViewer";
export default {
  name: "GameComponent",

  setup() {
    const bjsCanvas = ref(null);
    onMounted(() => {
     
      if (bjsCanvas.value) {
       
          let babylonViewer = new BabylonViewer();
          babylonViewer.create(bjsCanvas.value);
          babylonViewer.load(
            require("../assets/glb/cf_for_babylon_v6.glb")
          );
      
      }
    });
    return {
      bjsCanvas,
    };
  },
};
</script>

<style scoped></style>
