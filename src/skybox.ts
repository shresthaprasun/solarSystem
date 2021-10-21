import { BackSide, Mesh, MeshBasicMaterial, SphereBufferGeometry, TextureLoader } from "three";

export class Space{
    private sphere: Mesh;

    public get mesh(): Mesh{
        return this.sphere;
    }
    constructor(textureUrl: string){
        const texture = new TextureLoader().load(textureUrl);
        this.sphere = new Mesh(
            new SphereBufferGeometry(9000),
            new MeshBasicMaterial({ map: texture, side: BackSide, depthWrite: false })
        );
    }
}