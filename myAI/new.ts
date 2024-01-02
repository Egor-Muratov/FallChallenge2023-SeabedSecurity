import { Direction } from "./lib/Direction";
import { Drone } from "./lib/Drone";
import { Fish } from "./lib/Fish";
import { Vector } from "./lib/Vector";
import { isCollision } from "./lib/isCollision";
import { readline } from "./lib/readline/readline";
import { readNumber, readNumbers } from "./lib/read";
import { readDrones } from "./lib/readDrones";

//=========================================
//              Types
//=========================================

const DRONE_COUNT = 2;
let droneLightById = new Map<number, 0 | 1>();
let firstSink = true;
let firstTurn = true;



let lastDroneState: Drone[] = [];

const getMonsterRect = (start: Vector, direction: Vector, speed: number, radius: number) => {
    const height = direction.multiply(radius)
    const A = start.add(height.rotateLeft());
    const B = start.add(height.rotateRight());
    const finish = start.add(height.multiply(speed));
    const C = finish.add(height.rotateLeft());
    const D = finish.add(height.rotateRight());
    return [A, B, C, D];
}

const bypassUglies = (drone: Drone, uglies: Fish[]) => {
    console.error('bypassUglies', uglies);
    if (!uglies || uglies.length == 0) {
        return;
    }
    let angle = 0;
    const droneBaseSpeed = Vector.copy(drone.speed);
    while (uglies.some((ugly) => isCollision(drone, ugly))) {
        angle = angle >= 0
            ? -angle + 5
            : -angle
        drone.speed = droneBaseSpeed.rotateByDegrees(angle);
        console.error('drone try rotate', drone.speed);

    }
}

//=========================================
//              Init
//=========================================
const creatureCount: number = readNumber();

const fishesById = new Map<number, Fish>();
Array(creatureCount).fill(0).forEach(() => {
    const [id, color, type] = readNumbers();
    fishesById.set(id, { id, color, type, isMonster: type == -1 });
})
console.error('creatures', fishesById);

//=========================================
//              Game loop
//=========================================
while (true) {
    const myScore: number = readNumber();
    const foeScore: number = readNumber();

    //Исследованные рыбы 
    //-------------------------------------
    const myResearched = Array(readNumber()).fill(0).map(() => readNumber());
    const enemyResearched = Array(readNumber()).fill(0).map(() => readNumber());

    //Дроны
    //-------------------------------------
    const myDrones: Drone[] = readDrones();
    const myDronesById = new Map(myDrones.map(drone => [drone.id, drone]));
    if (firstTurn)
        droneLightById = new Map(myDrones.map(drone => [drone.id, 0]));

    const enemyDrones: Drone[] = readDrones();

    //Сканирования
    //-------------------------------------
    fishesById.forEach((fish) => {
        fish.scanned = false;
        fish.pos = null;
        fish.speed = null;
    });
    const droneScanCount: number = readNumber();
    for (let i = 0; i < droneScanCount; i++) {
        const [droneId, creatureId] = readNumbers();
        if (myDronesById.has(droneId))
            myDronesById.get(droneId).scans.push(creatureId);
        fishesById.get(creatureId).scanned = true;
    }

    //Видимые рыбки
    //-------------------------------------
    const visibleCreatureCount: number = readNumber();
    for (let i = 0; i < visibleCreatureCount; i++) {
        const [creatureId, x, y, vx, vy] = readNumbers();
        const fish = fishesById.get(creatureId);
        fish.pos = Vector.of([x, y]);
        fish.speed = Vector.of([vx, vy]);
    }

    //Радар
    //-------------------------------------
    fishesById.forEach((value) => value.bliped = false);
    fishesById.forEach((value) => value.lr = 0);

    const radarBlipCount = readNumber();
    for (let i = 0; i < radarBlipCount; i++) {
        const inputs: string[] = readline().split(' ');
        const droneId = parseInt(inputs[0]);
        const creatureId = parseInt(inputs[1]);
        const direction = inputs[2] as Direction;
        myDronesById.get(droneId).radarBlips[creatureId] = direction;
        const fish = fishesById.get(creatureId)
        fish.bliped = true;
        fish.lr += direction[1] == 'L' ? -1 : 1;
    }

    const Type0ToFind = Array
        .from(fishesById.values())
        .filter(c => (c.type == 0 || c.type == 1 || c.type == 2) && c.bliped && !c.scanned && !c.researched);

    const uglies = Array
        .from(fishesById.values())
        .filter(fish => (fish.type == -1) && fish.pos);


    // console.error('Рыбы', Type0ToFind);
    // console.error('myResearched', myResearched);
    // console.error('enemyResearched', enemyResearched);        
    console.error('uglies', uglies);

    for (const drone of myDrones) {
        if (Type0ToFind && Type0ToFind.length > 0) {
            const droneLastState = lastDroneState.find((value) => value.id == drone.id);


            //выбор цели
            const targetFish = drone.pos.x < myDrones.find((value) => value.id != drone.id).pos.x
                ? Type0ToFind.sort((a, b) => b.lr - a.lr).pop()
                : Type0ToFind.sort((a, b) => a.lr - b.lr).pop();

            //движение по горизонтали
            if (!droneLastState || droneLastState.radarBlips[targetFish.id][1] == drone.radarBlips[targetFish.id][1])
                drone.speed = drone.radarBlips[targetFish.id][1] == 'L'
                    ? drone.speed.add(Vector.of([-1, 0]))
                    : drone.speed.add(Vector.of([1, 0]));

            //движение по вертикали
            if (!droneLastState || droneLastState.radarBlips[targetFish.id][0] == drone.radarBlips[targetFish.id][0])
                drone.speed = drone.radarBlips[targetFish.id][0] == 'T'
                    ? drone.speed.add(Vector.of([0, -1]))
                    : drone.speed.add(Vector.of([0, 1]));

            console.error(`Drone ${drone.id} search ${targetFish.id} with ${drone.speed}`);
            console.error(`Because ${droneLastState?.radarBlips[targetFish.id]} ?? ${drone.radarBlips[targetFish.id]}`);


            const newLight = droneLightById.get(drone.id) == 0 && drone.pos.y > 2500 && drone.battery > 4 ? 1 : 0;
            droneLightById.set(drone.id, newLight);

        } else {
            console.error('bestDirection', 'UP');
            drone.speed = drone.speed.add(Vector.of([0, -1]))
        }
        drone.speed = drone.speed.normalize().multiply(601);
        bypassUglies(drone, uglies);
        drone.pos = drone.pos.add(drone.speed);
        console.log(
            'MOVE',
            drone.pos.toString(),
            droneLightById.get(drone.id)
        );
        continue;
    }
    firstTurn = false;

    lastDroneState = JSON.parse(JSON.stringify(myDrones))
}


