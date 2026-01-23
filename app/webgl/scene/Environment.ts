import * as THREE from "three";
import gsap from "gsap";
import { addWorldSpaceFog } from "./Fog";
import { createPollutionCloud } from "./Smoke";

const SKY_CLEAN = {
  top: new THREE.Color("#2277ff"),
  mid: new THREE.Color("#5599ff"),
  bot: new THREE.Color("#aaddff"),
  fog: new THREE.Color("#aaddff"),
  fogDistMin: 23,
  fogDistMax: 90,
  fogDensity: 2
};

const SKY_POLLUTED = {
  top: new THREE.Color("#4a4842"),
  mid: new THREE.Color("#6b6356"),
  bot: new THREE.Color("#8a8d95"),
  fog: new THREE.Color("#9a9da5"),
  fogDistMin: 16,
  fogDistMax: 80,
  fogDensity: 3.5
};


const LIGHTS_CLEAN = {
  ambientIntensity: 1.0,
  ambientColor: new THREE.Color("#ffffff"),
  hemiIntensity: 1.0,
  hemiSkyColor: new THREE.Color("#5599ff"),
  hemiGroundColor: new THREE.Color("#88ff44"),
  sunIntensity: 3.8,
  sunColor: new THREE.Color("#fffef5"),
};


const LIGHTS_POLLUTED = {
  ambientIntensity: 0.4,
  ambientColor: new THREE.Color("#887766"),
  hemiIntensity: 0.3,
  hemiSkyColor: new THREE.Color("#554433"),
  hemiGroundColor: new THREE.Color("#665544"),
  sunIntensity: 1.2,
  sunColor: new THREE.Color("#ffaa55"),
};



const MAX_FOG_SCORE = 16;


const SMOKE_COLOR_POLLUTED = new THREE.Color("#938776");
const SMOKE_COLOR_CLEAN = new THREE.Color("#ffffffc3");

export default class Environment {
    private scene: THREE.Scene;
    private renderer: THREE.WebGLRenderer;
    private skyContext: CanvasRenderingContext2D | null = null;
    private skyTexture: THREE.CanvasTexture | null = null;
    private skyMesh: THREE.Mesh | null = null;
    private ambientLight!: THREE.AmbientLight;
    private hemiLight!: THREE.HemisphereLight;
    private sunLight!: THREE.DirectionalLight;
    private fogControls: any = null;
    private pollutionCloud: THREE.Points | null = null;
    

    private currentSkyState = {
        top: new THREE.Color().copy(SKY_CLEAN.top),
        mid: new THREE.Color().copy(SKY_CLEAN.mid),
        bot: new THREE.Color().copy(SKY_CLEAN.bot),
        fog: new THREE.Color().copy(SKY_CLEAN.fog),
        fogDistMin: SKY_CLEAN.fogDistMin,
        fogDistMax: SKY_CLEAN.fogDistMax,
        fogDensity: SKY_CLEAN.fogDensity,
    };

    private currentLightsState = {
        ambientIntensity: LIGHTS_CLEAN.ambientIntensity,
        ambientColor: new THREE.Color().copy(LIGHTS_CLEAN.ambientColor),
        
        hemiIntensity: LIGHTS_CLEAN.hemiIntensity,
        hemiSkyColor: new THREE.Color().copy(LIGHTS_CLEAN.hemiSkyColor),
        hemiGroundColor: new THREE.Color().copy(LIGHTS_CLEAN.hemiGroundColor),
        
        sunIntensity: LIGHTS_CLEAN.sunIntensity,
        sunColor: new THREE.Color().copy(LIGHTS_CLEAN.sunColor),
    };

    constructor(scene: THREE.Scene, renderer: THREE.WebGLRenderer) {
        this.scene = scene;
        this.renderer = renderer;
        
        this.setupRenderer();
        this.setupSky();
        this.setupLights();
        this.setupPollution();
    }


    private setupRenderer() {
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.6;
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }

    // ciel
    private setupSky() {
        this.scene.background = new THREE.Color("#aaddff");

        const canvasGradient = document.createElement("canvas");
        canvasGradient.width = 1;
        canvasGradient.height = 256;
        const ctx = canvasGradient.getContext("2d");

        if (ctx) {
            this.skyContext = ctx;
            
            const gradient = ctx.createLinearGradient(0, 0, 0, 256);
            gradient.addColorStop(0, "#2277ff");
            gradient.addColorStop(0.3, "#5599ff");
            gradient.addColorStop(1, "#aaddff");
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 1, 256);
        }


        this.skyTexture = new THREE.CanvasTexture(canvasGradient);
        
        // big sphere autour de la scene
        const skyGeo = new THREE.SphereGeometry(400, 32, 32);
        const skyMat = new THREE.MeshBasicMaterial({
            map: this.skyTexture,
            side: THREE.BackSide,
            fog: false,
            depthWrite: false
        });

    
        this.skyMesh = new THREE.Mesh(skyGeo, skyMat);
        this.skyMesh.name = "SkyDome";
        this.scene.add(this.skyMesh);
    }

    //lights
    private setupLights() {
        this.ambientLight = new THREE.AmbientLight(
            LIGHTS_CLEAN.ambientColor, 
            LIGHTS_CLEAN.ambientIntensity
        );
        this.scene.add(this.ambientLight);


        this.hemiLight = new THREE.HemisphereLight(
            LIGHTS_CLEAN.hemiSkyColor, 
            LIGHTS_CLEAN.hemiGroundColor, 
            LIGHTS_CLEAN.hemiIntensity
        );
        this.hemiLight.position.set(0, 20, 0);
        this.scene.add(this.hemiLight);

        this.sunLight = new THREE.DirectionalLight(
            LIGHTS_CLEAN.sunColor, 
            LIGHTS_CLEAN.sunIntensity
        );
        this.sunLight.position.set(15, 30, 15);
        this.sunLight.castShadow = true;


        //  ombres
        this.sunLight.shadow.bias = -0.0005;
        this.sunLight.shadow.normalBias = 0.05;
        this.sunLight.shadow.mapSize.width = 2048;
        this.sunLight.shadow.mapSize.height = 2048;

        const d = 60;
        this.sunLight.shadow.camera.near = 0.5;
        this.sunLight.shadow.camera.far = 200;
        this.sunLight.shadow.camera.left = -d;
        this.sunLight.shadow.camera.right = d;
        this.sunLight.shadow.camera.top = d;
        this.sunLight.shadow.camera.bottom = -d;

        this.scene.add(this.sunLight);
    }


    // nuage de pollution
    private setupPollution() {
        this.pollutionCloud = createPollutionCloud({
            count: 200,
            radius: 40,
            height: 15,
            color: "#ffffff",
            opacity: 0,
            size: 12
        });
        this.scene.add(this.pollutionCloud);
    }

    //anim nuage
    public tick() {
        if (this.pollutionCloud) {
            this.pollutionCloud.rotation.y += 0.001;
        }
    }


    //fog
    public initFog() {
        setTimeout(() => {
            this.fogControls = addWorldSpaceFog(this.scene, {
                fogColor: new THREE.Color(SKY_CLEAN.fog),
                minFogDistance: 25,
                maxFogDistance: 65,
                fogDensity: 2.5,
            });
        }, 100);
    }

    public updateSkyAndFog(currentFogValue: number, cameraOverlay?: THREE.Mesh) {
        if (!this.skyContext || !this.skyTexture || !this.fogControls) return;

        let ratio = currentFogValue / MAX_FOG_SCORE;
        const INTENSITY_FACTOR = 0.5;
        ratio = Math.max(0, Math.min(1, ratio * INTENSITY_FACTOR));
        
        const targetTop = new THREE.Color().copy(SKY_CLEAN.top).lerp(SKY_POLLUTED.top, ratio);
        const targetMid = new THREE.Color().copy(SKY_CLEAN.mid).lerp(SKY_POLLUTED.mid, ratio);
        const targetBot = new THREE.Color().copy(SKY_CLEAN.bot).lerp(SKY_POLLUTED.bot, ratio);
        const targetFog = new THREE.Color().copy(SKY_CLEAN.fog).lerp(SKY_POLLUTED.fog, ratio);

        const targetDistMin = SKY_CLEAN.fogDistMin + (SKY_POLLUTED.fogDistMin - SKY_CLEAN.fogDistMin) * ratio;
        const targetDistMax = SKY_CLEAN.fogDistMax + (SKY_POLLUTED.fogDistMax - SKY_CLEAN.fogDistMax) * ratio;
        const targetDensity = SKY_CLEAN.fogDensity + (SKY_POLLUTED.fogDensity - SKY_CLEAN.fogDensity) * ratio;

        const targetAmbientIntensity = THREE.MathUtils.lerp(
            LIGHTS_CLEAN.ambientIntensity, 
            LIGHTS_POLLUTED.ambientIntensity, 
            ratio
        );
        const targetAmbientColor = new THREE.Color()
            .copy(LIGHTS_CLEAN.ambientColor)
            .lerp(LIGHTS_POLLUTED.ambientColor, ratio);

        const targetHemiIntensity = THREE.MathUtils.lerp(
            LIGHTS_CLEAN.hemiIntensity, 
            LIGHTS_POLLUTED.hemiIntensity, 
            ratio
        );
        const targetHemiSky = new THREE.Color()
            .copy(LIGHTS_CLEAN.hemiSkyColor)
            .lerp(LIGHTS_POLLUTED.hemiSkyColor, ratio);
        const targetHemiGround = new THREE.Color()
            .copy(LIGHTS_CLEAN.hemiGroundColor)
            .lerp(LIGHTS_POLLUTED.hemiGroundColor, ratio);

        const targetSunIntensity = THREE.MathUtils.lerp(
            LIGHTS_CLEAN.sunIntensity, 
            LIGHTS_POLLUTED.sunIntensity, 
            ratio
        );
        const targetSunColor = new THREE.Color()
            .copy(LIGHTS_CLEAN.sunColor)
            .lerp(LIGHTS_POLLUTED.sunColor, ratio);

        gsap.to(this.currentSkyState.top, { r: targetTop.r, g: targetTop.g, b: targetTop.b, duration: 1.5 });
        gsap.to(this.currentSkyState.mid, { r: targetMid.r, g: targetMid.g, b: targetMid.b, duration: 1.5 });
        gsap.to(this.currentSkyState.bot, { r: targetBot.r, g: targetBot.g, b: targetBot.b, duration: 1.5 });
        gsap.to(this.currentSkyState.fog, { r: targetFog.r, g: targetFog.g, b: targetFog.b, duration: 1.5 });


        gsap.to(this.currentSkyState, {
            fogDistMin: targetDistMin,
            fogDistMax: targetDistMax,
            fogDensity: targetDensity,
            duration: 1.5,
        });

        gsap.to(this.currentLightsState, {
            ambientIntensity: targetAmbientIntensity,
            hemiIntensity: targetHemiIntensity,
            sunIntensity: targetSunIntensity,
            duration: 1.5,

            onUpdate: () => {
                this.ambientLight.intensity = this.currentLightsState.ambientIntensity;
                this.hemiLight.intensity = this.currentLightsState.hemiIntensity;
                this.sunLight.intensity = this.currentLightsState.sunIntensity;
            }
        });

        gsap.to(this.currentLightsState.ambientColor, {
            r: targetAmbientColor.r,
            g: targetAmbientColor.g,
            b: targetAmbientColor.b,
            duration: 1.5,
            onUpdate: () => {
                this.ambientLight.color.copy(this.currentLightsState.ambientColor);
            }
        });

        gsap.to(this.currentLightsState.hemiSkyColor, {
            r: targetHemiSky.r,
            g: targetHemiSky.g,
            b: targetHemiSky.b,
            duration: 1.5,
            onUpdate: () => {
                this.hemiLight.color.copy(this.currentLightsState.hemiSkyColor);
            }
        });

        gsap.to(this.currentLightsState.hemiGroundColor, {
            r: targetHemiGround.r,
            g: targetHemiGround.g,
            b: targetHemiGround.b,
            duration: 1.5,
            onUpdate: () => {
                this.hemiLight.groundColor.copy(this.currentLightsState.hemiGroundColor);
            }
        });

        gsap.to(this.currentLightsState.sunColor, {
            r: targetSunColor.r,
            g: targetSunColor.g,
            b: targetSunColor.b,
            duration: 1.5,
            onUpdate: () => {
                this.sunLight.color.copy(this.currentLightsState.sunColor);

                const gradient = this.skyContext!.createLinearGradient(0, 0, 0, 256);
                gradient.addColorStop(0, `#${this.currentSkyState.top.getHexString()}`);
                gradient.addColorStop(0.5, `#${this.currentSkyState.mid.getHexString()}`);
                gradient.addColorStop(1, `#${this.currentSkyState.bot.getHexString()}`);
                
                this.skyContext!.fillStyle = gradient;
                this.skyContext!.fillRect(0, 0, 1, 256);
                this.skyTexture!.needsUpdate = true;

                if (this.fogControls) {
                    this.fogControls.updateFogColor(this.currentSkyState.fog);
                    this.fogControls.updateFogDistance(
                        this.currentSkyState.fogDistMin, 
                        this.currentSkyState.fogDistMax
                    );
                    this.fogControls.updateFogDensity(this.currentSkyState.fogDensity);
                }

                if (cameraOverlay) {
                    const mat = cameraOverlay.material as THREE.MeshBasicMaterial;
                    mat.color.copy(this.currentSkyState.top);
                }

                if (this.pollutionCloud) {
                    const mat = this.pollutionCloud.material as THREE.PointsMaterial;
                    const targetOpacity = ratio * 0.15; 
                    mat.opacity = targetOpacity;
                    
                    const targetColor = new THREE.Color().copy(SMOKE_COLOR_CLEAN).lerp(SMOKE_COLOR_POLLUTED, ratio);
                    mat.color.copy(targetColor);
                }
            }
        });
    }

    public getSkyContext() { return this.skyContext; }
    public getSkyTexture() { return this.skyTexture; }
    public getSkyMesh() { return this.skyMesh; }
    public getHemiLight() { return this.hemiLight; }
    public getSunLight() { return this.sunLight; }
    public getFogControls() { return this.fogControls; }
    public getPollutionCloud() { return this.pollutionCloud; }

}