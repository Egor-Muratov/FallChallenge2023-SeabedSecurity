import { Drone } from "./Drone";
import { Vector } from "./Vector";
import { readNumber, readNumbers } from "./read";

export function readDrones() {
    const myDrones: Drone[] = [];
    const myDroneCount: number = readNumber();
    for (let i = 0; i < myDroneCount; i++) {
        const [id, x, y, emergency, battery] = readNumbers();
        const drone: Drone = {
            id,
            pos: Vector.of([x, y]),
            battery,
            emergency,
            scans: [],
            speed: Vector.of([0, 0]),
            radarBlips: {}
        };
        myDrones.push(drone);
    }
    return myDrones;
}
