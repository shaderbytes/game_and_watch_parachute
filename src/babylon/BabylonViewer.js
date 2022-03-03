import * as BABYLON from "babylonjs";

import "babylonjs-loaders";
import "babylonjs-post-process";
import "babylonjs-materials";
import { gsap } from "gsap";

var BabylonViewer = function () {
  this.scene;
  this.engine;
  this.hdrTexture;
  this.canvasDom;
  this.SSAOPipeline;
  this.camera;
  this.glowLayer;
  this.defaultPLR;
  this.camAlphaMax = 10;
  this.rootTransformNode;
};

BabylonViewer.prototype = {
  changeBackgroundColor: function (color) {
    this.scene.clearColor = BABYLON.Color3.FromHexString(color);
  },

  lookAt(index) {
    gsap.to(this.camera, {
      duration: 0.4,
      alpha: (90 + ((1 - index) / 1) * this.camAlphaMax) * 0.01745329251,
      beta: 90 * 0.01745329251,
    });
  },

  setGlowLayer: function (state) {
    if (state === true) {
      this.glowLayer = new BABYLON.GlowLayer("glow", this.scene);
      this.glowLayer.intensity = 1.5;
    } else {
      if (this.glowLayer !== null && this.glowLayer !== undefined) {
        this.glowLayer.dispose();
      }
    }
  },

  setdefaultPP: function (state) {
    if (state === true) {
      this.defaultPLR = new BABYLON.DefaultRenderingPipeline(
        "defaultPipeline",
        true,
        this.scene,
        [this.camera]
      );
      this.defaultPLR.fxaaEnabled = state;
      this.defaultPLR.samples = 2;
    } else {
      if (this.defaultPLR !== null && this.defaultPLR !== undefined) {
        this.defaultPLR.dispose();
      }
    }
  },

  setSSAO: function (state) {
    if (state === true) {
      if (BABYLON.SSAO2RenderingPipeline.IsSupported) {
        // Create SSAO and configure all properties (for the example)
        var ssaoRatio = {
          ssaoRatio: 0.5, // Ratio of the SSAO post-process, in a lower resolution
          blurRatio: 0.5, // Ratio of the combine post-process (combines the SSAO and the scene)
        };
        this.SSAOPipeline = new BABYLON.SSAO2RenderingPipeline(
          "ssao",
          this.scene,
          ssaoRatio
        );
        this.SSAOPipeline.radius = 2;
        this.SSAOPipeline.totalStrength = 1;
        this.SSAOPipeline.expensiveBlur = true;
        this.SSAOPipeline.samples = 32;
        this.SSAOPipeline.maxZ = 250;
        // Attach camera to the SSAO render pipeline
        this.scene.postProcessRenderPipelineManager.attachCamerasToRenderPipeline(
          "ssao",
          this.camera
        );
        this.scene.postProcessRenderPipelineManager.enableEffectInPipeline(
          "ssao",
          this.SSAOPipeline.SSAOCombineRenderEffect,
          this.camera
        );

        //fix for ssao affecting transparent objects
        this.scene.enableGeometryBufferRenderer().renderTransparentMeshes = false;
      }
    } else {
      if (this.SSAOPipeline !== null && this.SSAOPipeline !== undefined) {
        this.SSAOPipeline.dispose();
      }
    }
  },

  load: function (url) {
    BABYLON.SceneLoader.ImportMesh(
      "",
      url.default,
      "",
      this.scene,
      this.loadSuccess.bind(this),
      this.loadProgress.bind(this),
      this.loadError.bind(this)
    );
  },
  loadSuccess: function (event) {
    console.log(event[0]);
    event[0].parent = this.rootTransformNode;
    event[0].rotation = new BABYLON.Vector3(0, 0, 0);

    event[0].scaling = new BABYLON.Vector3(1, 1, 1);
  },

  loadError: function (error) {
    console.log("loadError");
    console.log(error);
  },
  loadProgress: function () {
    console.log("loadProgress");
  },

  create: function (canvasDom) {
    this.canvasDom = canvasDom;
    this.engine = new BABYLON.Engine(this.canvasDom, true); // Generate the BABYLON 3D engine
    this.engine.enableOfflineSupport = false;
    BABYLON.Database.IDBStorageEnabled = false; //disable the .manifest checking.
    this.scene = new BABYLON.Scene(this.engine); // Create the scene space
    this.scene.clearColor = new BABYLON.Color3(
      0.266,
      0.266,
      0.266
    ).toLinearSpace();

    this.rootTransformNode = new BABYLON.TransformNode("root_transform_fix");

    this.rootTransformNode.rotation = new BABYLON.Vector3(-1.5708, 0, 0);

    this.rootTransformNode.scaling = new BABYLON.Vector3(-1, 1, 1);

    //Adding an Arc Rotate this.camera ..
    this.camera = new BABYLON.ArcRotateCamera(
      "Camera",
      1.5708,
      1.5708,
      3,
      new BABYLON.Vector3(0, 0, 0),
      this.scene
    );
    this.camera.attachControl(this.canvasDom, false);
    this.camera.wheelPrecision = 50;
    this.camera.panningSensibility = 250;
    this.camera.pinchPrecision = 700;

    this.camera.panningSensibility = 1000;
    this.camera.allowUpsideDown = false;
    this.camera.lowerRadiusLimit = 0.01;

    this.camera.inputs.removeByType("ArcRotateCameraKeyboardMoveInput");
    this.camera.inputs.removeByType("ArcRotateCameraPointersInput");

    let p = require("../assets/images/babylon/autoshop_02_2k_bw.env");

    this.hdrTexture = new BABYLON.CubeTexture.CreateFromPrefilteredData(
      p.default,
      this.scene
    );
    this.hdrTexture.gammaSpace = false;
    this.hdrTexture.level = 1;
    this.scene.environmentTexture = this.hdrTexture;
    //this.setSSAO(true);
    this.scene.environmentIntensity = 0.7;

    //this.setGlowLayer(true);
    this.setdefaultPP(true);

    this.engine.runRenderLoop(this.onRenderLoop.bind(this));
    window.addEventListener("resize", this.onWindowResize.bind(this));
    this.onWindowResize();
  },
  onRenderLoop: function () {
    this.scene.render();
  },
  onWindowResize: function () {
    this.engine.resize();
    this.canvasDom.width = 0;
    this.canvasDom.height = 0;
    setTimeout(() => {
      this.canvasDom.width = window.innerWidth;
      this.canvasDom.height = window.innerHeight;
    }, 500);
  },
};

export default BabylonViewer;
