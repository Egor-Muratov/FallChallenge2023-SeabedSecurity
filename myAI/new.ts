import { Direction } from "./lib/Direction";
import { Drone } from "./lib/Drone";
import { Fish } from "./lib/Fish";
import { Vector } from "./lib/Vector";
import { isCollision } from "./lib/isCollision";
import { readline } from "./lib/readline/readline";
import { readNumber, readNumbers } from "./lib/read";
import { readDrones } from "./lib/readDrones";


//TODO Если если по сумме непобедимый бежать на верх!
//=========================================
//              Types
//=========================================

const DRONE_COUNT = 2;
let droneLightById = new Map<number, 0 | 1>();
let firstTurn = true;
const droneFirstSink = new Map<number, boolean>();
const droneFirstUp = new Map<number, boolean>();


let lastDroneState: Drone[] = [];

function uniqByReduce<T>(array: T[]): T[] {
    return array.reduce((acc: T[], cur: T) => {
        if (!acc.includes(cur)) {
            acc.push(cur);
        }
        return acc;
    }, [])
}

const getMonsterRect = (start: Vector, direction: Vector, speed: number, radius: number) => {
    const height = direction.multiply(radius)
    const A = start.add(height.rotateLeft());
    const B = start.add(height.rotateRight());
    const finish = start.add(height.multiply(speed));
    const C = finish.add(height.rotateLeft());
    const D = finish.add(height.rotateRight());
    return [A, B, C, D];
}

const calcTypeScore = (fishes: Fish[], typeCode: number, typePoint: number): number => {
    const typeCount = fishes.filter(fish => fish.type == typeCode && fish.scanned).length;
    const typeScore = typeCount * typePoint + (typeCount == 4 ? 8 : 0);
    return typeScore
}

const calcScore = (fishes: Fish[]): number => {

    const type0Score = calcTypeScore(fishes, 0, 2);
    const type1Score = calcTypeScore(fishes, 1, 4);
    const type2Score = calcTypeScore(fishes, 2, 6);

    const color0 = fishes.filter(fish => fish.color == 0 && fish.scanned).length == 3 ? 6 : 0;
    const color1 = fishes.filter(fish => fish.color == 1 && fish.scanned).length == 3 ? 6 : 0;
    const color2 = fishes.filter(fish => fish.color == 2 && fish.scanned).length == 3 ? 6 : 0;
    const color3 = fishes.filter(fish => fish.color == 3 && fish.scanned).length == 3 ? 6 : 0;

    const typeOne = Array
        .from(fishesById.values())
        .filter(fish => fish.type == 1 && fish.bliped && !fish.scanned && !fish.researched);

    return type0Score + type1Score + type2Score + color0 + color1 + color2 + color3
}

const isOutborder = (drone: Drone): boolean => {
    const newPos = drone.pos.add(drone.speed);
    return newPos.x < 0 || newPos.x >= 10000 || newPos.y < 0 || newPos.y >= 10000
}

const bypassUglies = (drone: Drone, uglies: Fish[]) => {
    if (!uglies || uglies.length == 0) {
        return;
    }
    let angle = 0;
    const droneBaseSpeed = Vector.copy(drone.speed);
    while (isOutborder(drone) || uglies.some((ugly) => isCollision(drone, ugly, 601))) {
        angle = angle <= 0
            ? -angle + 5
            : -angle
        drone.speed = droneBaseSpeed.rotateByDegrees(angle);
        if (angle == 185) {
            break;
        }
    }
    console.error(`drone ${drone.id} angle ${angle} from ${drone.pos.x}:${drone.pos.y} to ${drone.pos.x + drone.speed.x}:${drone.pos.y + drone.speed.y} with speed ${drone.speed}`);
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
    if (firstTurn) {
        droneLightById = new Map(myDrones.map(drone => [drone.id, 0]));
        myDrones.forEach((drone) => droneFirstSink.set(drone.id, true))
        myDrones.forEach((drone) => droneFirstUp.set(drone.id, false))
    }


    const enemyDrones: Drone[] = readDrones();

    //Сканирования
    //-------------------------------------
    fishesById.forEach((fish) => {
        fish.scanned = false;
        fish.bliped = false;
        fish.lr = 0;
        fish.pos = null;
        fish.speed = null;
        if (myResearched.includes(fish.id))
            fish.researched = true;
    });
    const droneScanCount: number = readNumber();
    const myScanned: number[] = [];
    for (let i = 0; i < droneScanCount; i++) {
        const [droneId, creatureId] = readNumbers();
        if (myDronesById.has(droneId)) {
            myDronesById.get(droneId).scans.push(creatureId);
            fishesById.get(creatureId).scanned = true;
            myScanned.push(creatureId);
        }
    }
    const myScannedUniq = uniqByReduce(myScanned);

    //Видимые рыбки
    //-------------------------------------
    const visibleCreatureCount: number = readNumber();
    const tmpVisFishes: number[] = [];
    for (let i = 0; i < visibleCreatureCount; i++) {
        const [creatureId, x, y, vx, vy] = readNumbers();
        tmpVisFishes.push(creatureId);
        const fish = fishesById.get(creatureId);
        fish.pos = Vector.of([x, y]);
        fish.speed = Vector.of([vx, vy]);
    }

    //Радар
    //-------------------------------------
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

    const fishToFind = Array
        .from(fishesById.values())
        .filter(fish => !fish.isMonster && fish.bliped && !fish.scanned && !fish.researched);

    const uglies = Array
        .from(fishesById.values())
        .filter(fish => fish.isMonster && fish.pos);

    // console.error('Рыбы', Type0ToFind);
    console.error('tmpVisFishes', tmpVisFishes);
    // console.error('myResearched', myResearched);
    // console.error('myScannedUniq', myScannedUniq);
    // console.error('enemyResearched', enemyResearched);        
    // console.error('uglies', uglies.map((fish) => fish.id));
    console.error('calcScore', calcScore(Array.from(fishesById.values())));

    for (const drone of myDrones) {
        if (drone.pos.y > 8000) {
            droneFirstSink.set(drone.id, false)
        }
        if (drone.pos.y < 500) {
            droneFirstUp.set(drone.id, false)
        }
        if (myScannedUniq.length >= 10) {
            droneFirstUp.set(drone.id, true)
        }

        if (droneFirstSink.get(drone.id)) {
            console.error(`Drone ${drone.id} firstSink`);
            drone.speed = Vector.of([0, 1]);

        } else if (droneFirstUp.get(drone.id)) {
            console.error(`Drone ${drone.id} scoreUP`);
            drone.speed = Vector.of([0, -1]);

        } else if (fishToFind && fishToFind.length > 0) {
            const droneLastState = lastDroneState.find((value) => value.id == drone.id);

            //выбор цели
            const targetFish = drone.pos.x < myDrones.find((value) => value.id != drone.id).pos.x
                ? fishToFind.sort((a, b) => b.lr - a.lr).pop()
                : fishToFind.sort((a, b) => a.lr - b.lr).pop();

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

        } else {
            console.error(`Drone ${drone.id} GameEnd`);
            drone.speed = Vector.of([0, -1])
        }
        const newLight = droneLightById.get(drone.id) == 0 && drone.pos.y > 2500 && drone.battery > 4 ? 1 : 0;
        droneLightById.set(drone.id, newLight);
        drone.speed = drone.speed.normalize().multiply(600);
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


