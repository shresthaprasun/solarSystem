import { AmbientLight, PerspectiveCamera, PointLight, Scene, WebGLRenderer } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Planet } from "./planet";
import { Space } from "./skybox";

export class Project {
    private renderer: WebGLRenderer;
    private camera: PerspectiveCamera;
    private scene: Scene;
    private controls: OrbitControls;
    private planets: Planet[];


    constructor() {
        this.planets = [];
    }

    public init() {
        const container = document.getElementById("viewer");
        this.renderer = new WebGLRenderer({ antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.domElement.style.position = "absolute";
        this.renderer.domElement.style.width = "100%";
        this.renderer.domElement.style.height = "100%";
        container.appendChild(this.renderer.domElement);
        this.renderer.setSize(this.renderer.domElement.clientWidth, this.renderer.domElement.clientHeight);
        this.renderer.shadowMap.enabled = true;

        this.camera = new PerspectiveCamera(60, this.renderer.domElement.clientWidth / this.renderer.domElement.clientHeight, 1, 10000);
        this.camera.position.set(0, 0, 500);
        this.camera.up.set(0, 1, 0);
        this.camera.lookAt(0, 0, 0);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.update();

        this.scene = new Scene();

        // const light = new AmbientLight(0xffffff);
        // this.scene.add(light);

        const pointLight = new PointLight(0xffffff);
        pointLight.castShadow = true;
        pointLight.position.set(0,0,0);
        this.scene.add(pointLight);

        this.build();
        this.animate();
    }

    private build() {
        const skybox = new Space("./texture/space.jpg");
        this.scene.add(skybox.mesh);

        const sun = new Planet({ diameter: 108, revolutionSpeed: 0, rotationSpeed: 0.001, textureImage: "./texture/sun.jpg", distanceFromReference: 0, emitsLight: true });
        this.scene.add(sun.mesh);
        sun.mesh.castShadow = false;
        sun.mesh.receiveShadow = false;
        this.planets.push(sun);

        const earth = new Planet({ diameter: 10, revolutionSpeed: 0.01, rotationSpeed: 0.1, textureImage: "./texture/earth.jpg", referencePlanet: sun, distanceFromReference: 108 });
        earth.mesh.castShadow = true;
        earth.mesh.receiveShadow = true;
        this.scene.add(earth.mesh);
        this.planets.push(earth);

        const moon = new Planet({ diameter: 5, revolutionSpeed: 0.5, rotationSpeed: 0.1, textureImage: "./texture/moon.jpg", referencePlanet: earth, distanceFromReference: 20 });
        moon.mesh.castShadow = true;
        moon.mesh.receiveShadow = true;
        this.scene.add(moon.mesh);
        this.planets.push(moon);
    }

    public animate() {
        requestAnimationFrame(this.animate.bind(this));
        this.controls.update();
        for (const planet of this.planets) {
            planet.update();
        }
        this.renderer.render(this.scene, this.camera);
    }
}