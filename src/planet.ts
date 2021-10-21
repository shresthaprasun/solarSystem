import { ClampToEdgeWrapping, Mesh, MeshBasicMaterial, MeshLambertMaterial, MeshPhongMaterial, SphereBufferGeometry, Texture, TextureLoader, Vector3, Wrapping } from "three";
import { rotateAboutPoint } from "./utilities";

interface IPlanetArgs {
    diameter: number;
    distanceFromReference: number;
    rotationSpeed: number;
    revolutionSpeed: number;
    textureImage: string;
    emitsLight?: boolean;
    referencePlanet?: Planet;
}

export class Planet {
    private sphere: Mesh;
    private referencePlanet: Planet | undefined;
    private rotationSpeed: number;
    private revolutionSpeed: number;
    private prevReferencePosition: Vector3;

    public get position(): Vector3 {
        return this.sphere.position;
    }

    public get mesh(): Mesh {
        return this.sphere;
    }

    constructor(args: IPlanetArgs) {
        const {
            diameter = 0,
            distanceFromReference = 0,
            rotationSpeed = 1,
            revolutionSpeed = 0,
            textureImage = "",
            emitsLight = false,
            referencePlanet = undefined
        } = args;

        this.referencePlanet = referencePlanet;
        this.rotationSpeed = rotationSpeed;
        this.revolutionSpeed = revolutionSpeed;

        const geometry = new SphereBufferGeometry(diameter / 2);
        const texture = new TextureLoader().load(textureImage);
        texture.wrapS = texture.wrapT = ClampToEdgeWrapping;
        let material: MeshLambertMaterial | MeshBasicMaterial = new MeshLambertMaterial();
        if (emitsLight) {
            material = new MeshBasicMaterial();
        }
        material.map = texture;
        this.sphere = new Mesh(geometry, material);

        this.sphere.position.x = distanceFromReference;
        this.prevReferencePosition = new Vector3();
        if (this.referencePlanet) {
            this.sphere.position.add(this.referencePlanet.position);
            this.prevReferencePosition.copy(this.referencePlanet.position);
        }


    }

    public update() {
        this.sphere.rotateY(0.1 * this.rotationSpeed);
        if (this.referencePlanet) {
            const axis = new Vector3().subVectors(this.referencePlanet.position, this.prevReferencePosition);
            this.sphere.position.add(axis);
            if (axis.length() === 0) {
                axis.set(0, 1, 0);
            }
            axis.normalize();
            rotateAboutPoint(this.sphere, this.referencePlanet.position, axis, 0.1 * this.revolutionSpeed, true);
            this.prevReferencePosition.copy(this.referencePlanet.position);
        }
    }
}