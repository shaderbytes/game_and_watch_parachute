<template>
<div v-if="!showloader" id="instructions"><p>new game: 1 Key   -   pause: p Key   -   move: arrow Keys left/right    -   zoom: mousewheel</p></div>
  <div v-if="showloader" class="preloader-window">
    <div class="preloader-container">
      <div class="preloader-text">{{ loadError }}</div>
      <div class="preloader-text">{{ loadProgress }}</div>
    </div>
  </div>
  <canvas ref="bjsCanvas" touch-action="none"></canvas>
</template>

<script>
import { ref, onMounted } from "@vue/runtime-core";
import BabylonViewer from "@/babylon/BabylonViewer";
import parachute from "@/classes/Parachute.js";
const EventNames = require("@/events/EventNames.js");
export default {
  name: "GameComponent",

  setup() {
    const bjsCanvas = ref(null);
    var loadError = ref("");
    var loadProgress = ref("");
    var showloader = ref(true);
    onMounted(() => {
      if (bjsCanvas.value) {
        let babylonViewer = new BabylonViewer();
        babylonViewer.create(bjsCanvas.value);
        babylonViewer.addEventListener(EventNames.LOAD_ERROR, (event) => {
          loadError.value = event;
        });
        babylonViewer.addEventListener(EventNames.LOAD_PROGRESS, (event) => {
          loadProgress.value = event;
        });
        babylonViewer.addEventListener(EventNames.LOAD_COMPLETE, (event) => {
          showloader.value = false;
          parachute.viewer = babylonViewer;
          parachute.initiate();
        });
        babylonViewer.load(require("../assets/glb/p_v_1_3.glb"));
      }
    });
    return {
      bjsCanvas,loadError,loadProgress,showloader
    };
  },
};
</script>

<style scoped>
.preloader-window {
  width: 100%;
  height: 100%;
  background-color: "#FFFFFF";
  display: flex;
  align-content: center;
  justify-content: center;
}
.preloader-container {
  width: 80%;
  max-width: 600px;

  display: flex;
  flex-direction: column;
  justify-content: center;
}
.preloader-text{
      text-align: center;
    font-size: 1.5em;
  font-weight: 600;
  font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif

}
#instructions{
position:absolute;
width:100%;
color: #8a8a8a;

}
#instructions p{
  text-align: center;
  width:100%;
  font-size: 13px;
   font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif
  
  }
</style>
