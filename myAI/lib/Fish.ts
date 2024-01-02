import { Vector } from "./Vector";

export interface Fish {
    id: number;
    color: number;
    type: number;
    isMonster: any;
    pos?: Vector;
    speed?: Vector;
    bliped?: boolean;
    scanned?: boolean;
    researched?: boolean;
    lr?: number;
}
