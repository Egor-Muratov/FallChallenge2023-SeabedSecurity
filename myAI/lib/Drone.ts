import { Vector } from "./Vector";
import { Blips } from "./Blips";

export interface Drone {
    id: number;
    pos: Vector;
    battery: number;
    emergency: number;
    scans: number[];
    speed: Vector;
    radarBlips?: Blips;
}
