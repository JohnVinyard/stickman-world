import { World, Heightfield, Body, Plane } from 'cannon';

export default class GameState {

    public readonly world: World;
    public readonly ground: Body;

    constructor() {
        this.world = new World();
        this.world.gravity.set(0, 0, -9.82);

        const groundBody = new Body({ mass: 0 });
        const groundShape = new Plane();
        
        groundBody.addShape(groundShape);
        this.world.addBody(groundBody);

        this.ground = groundBody;
        
    }
}