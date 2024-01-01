import { Vector } from "./lib/Vector";
import { readline } from "./lib/readline/readline";

const DRONE_HIT_RANGE = 200;
const UGLY_EAT_RANGE = 300;

//=========================================
//              Types
//=========================================
const moveDown = (pos: Vector, light: number) => console.log(
  'MOVE',
  pos.x,
  9999,
  light
)

const moveUp = (pos: Vector, light: number) => console.log(
  'MOVE',
  pos.x,
  0,
  light
)

type Direction = 'TL' | 'TR' | 'BR' | 'BL';

interface Blips {
  [key: number]: string;
};

interface Fish {
  id: number;
  color: number;
  type: number;
  isMonster: any;
  pos?: Vector;
  speed?:Vector;
  bliped?: boolean;
  scanned?: boolean;
  researched?: boolean;
  lr?: number;
}

interface Drone {
  id: number;
  pos: Vector;
  battery: number;
  emergency: number;
  scans: number[];
  speed: Vector;
  radarBlips?: Blips;
}

const moveDelta: {[key in Direction]: Vector} = {
  BL:Vector.of([-1, 1]),
  BR:Vector.of([1, 1]),
  TL:Vector.of([-1, -1]),
  TR:Vector.of([1, -1]),
}

const DRONE_COUNT = 2;
const droneLightById = new Map<number,0 | 1>();
let firstSink = true;
let firstTurn = true;

const readNumber = () => parseInt(readline());
const readNumbers = () => readline().split(' ').map(Number);

let prevMyDrones: Drone[]=[];

const getMonsterRect = (start: Vector, direction: Vector, speed: number, radius: number) => {
  const height = direction.multiply(radius)
  const A = start.add(height.rotateLeft());
  const B = start.add(height.rotateRight());
  const finish = start.add(height.multiply(speed));
  const C = finish.add(height.rotateLeft());
  const D = finish.add(height.rotateRight());
  return [A,B,C,D];
}

const isCollision = ( drone: Drone, ugly: Fish): boolean => {
  // Check instant collision
  if (ugly.pos.inRange(drone.pos, DRONE_HIT_RANGE + UGLY_EAT_RANGE)) {
      return true;
  }

  // Both units are motionless
  if (drone.speed.isZero() && ugly.speed.isZero()) {
      return false;
  }

  // Change referencial
  const x = ugly.pos.x;
  const y = ugly.pos.y;
  const ux = drone.pos.x;
  const uy = drone.pos.y;
  const x2 = x - ux;
  const y2 = y - uy;
  const r2 = UGLY_EAT_RANGE + DRONE_HIT_RANGE;
  const vx2 = ugly.speed.x - drone.speed.x;
  const vy2 = ugly.speed.y - drone.speed.y;

  // Resolving: sqrt((x + t*vx)^2 + (y + t*vy)^2) = radius <=> t^2*(vx^2 + vy^2) + t*2*(x*vx + y*vy) + x^2 + y^2 - radius^2 = 0
  // at^2 + bt + c = 0;
  // a = vx^2 + vy^2
  // b = 2*(x*vx + y*vy)
  // c = x^2 + y^2 - radius^2 
  const a = vx2 * vx2 + vy2 * vy2;

  if (a <= 0.0) {
      return false;
  }

  const b = 2.0 * (x2 * vx2 + y2 * vy2);
  const c = x2 * x2 + y2 * y2 - r2 * r2;
  const delta = b * b - 4.0 * a * c;

  if (delta < 0.0) {
      return false;
  }

  const t = (-b - Math.sqrt(delta)) / (2.0 * a);

  if (t <= 0.0) {
      return false;
  }

  if (t > 1.0) {
      return false;
  }
  return true;
}

const getBestWay = (drone: Drone, uglys: Fish[]) => {
  
}



//=========================================
//              State Machine
//=========================================
enum MachineStates {
	sink = 'sink',
	firstFullSink = 'firstFullSink',
	runAwayFromMonster = 'runAwayFromMonster',
	avoidMonsterAndSink = 'avoidMonsterAndSink',
	avoidMonsterAndSearch = 'avoidMonsterAndSearch',
    sendScans = 'sendScans',
    search = 'search'

}

enum MachineActions {
	foundMonster = 'foundMonster',
	monsterHunting = 'monsterHunting',
}

type MachineState = keyof typeof MachineStates
type MachineAction = keyof typeof MachineActions

type StateMachine = {
	[state in MachineStates]: {
		[action in MachineActions]?: MachineState
	}
}

//=========================================
//              Init
//=========================================
const creatureCount: number = readNumber();

const fishesById = new Map<number, Fish>();
Array(creatureCount).fill(0).forEach(() => {
    const [id, color, type] = readNumbers();
    fishesById.set(id, {id, color, type, isMonster: type == -1});
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
    const myScanCount: number = readNumber();
    const myScaned: number[] = [];
    for (let i = 0; i < myScanCount; i++) {
        const researchedId = readNumber();
        fishesById.get(researchedId).researched = true;
        myScaned.push(researchedId);
    }

    const foeScanCount: number = readNumber();
    const foeScaned: number[] = [];
    for (let i = 0; i < foeScanCount; i++) {
        foeScaned.push(readNumber());
    }

    //Дроны
    //-------------------------------------
    const myDrones: Drone[] = []
    const myDronesById = new Map<number, Drone>();
    const myDroneCount: number = readNumber();
    for (let i = 0; i < myDroneCount; i++) {
        const [id, x, y, emergency, battery] = readNumbers();
        const drone: Drone = {
            id,
            pos:Vector.of([x, y]),
            battery,
            emergency,
            scans:[],
            speed: Vector.of([0,0]),
            radarBlips:{}
        }
        myDronesById.set(id, drone);
        myDrones.push(drone);
        if (firstTurn)
            droneLightById.set(id, 0);
    }
    const foeDroneCount: number = readNumber();
    for (let i = 0; i < foeDroneCount; i++) {
        const [droneId, droneX, droneY, dead, battery] = readNumbers();
    }

    //Сканирования
    //-------------------------------------
    fishesById.forEach((value)=>value.scanned = false);
    const droneScanCount: number = readNumber();
    for (let i = 0; i < droneScanCount; i++) {
        const [droneId, creatureId] = readNumbers();
        if ( myDronesById.has(droneId) )
            myDronesById.get(droneId).scans.push(creatureId);
            fishesById.get(creatureId).scanned = true;

    }

    //Видимые рыбки
    //-------------------------------------
    const visibleCreatureCount: number = readNumber();
    for (let i = 0; i < visibleCreatureCount; i++) {
        const [creatureId, x, y, vx, vy] = readNumbers();
        const fish = fishesById.get(creatureId);
        fish.pos =Vector.of([x, y]);
        fish.speed = Vector.of([vx, vy]);
    }

    //Радар
    //-------------------------------------
    fishesById.forEach((value)=>value.bliped = false);
    fishesById.forEach((value)=>value.lr = 0);

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
        .filter(c => (c.type == 0 || c.type == 1) && c.bliped && !c.scanned && !c.researched );

        console.error('Рыбы', Type0ToFind);

    for (const drone of myDrones) {
        if (Type0ToFind && Type0ToFind.length > 0 ) {        
            const prevDrone = prevMyDrones.find((value) => value.id == drone.id);

            
            //выбор цели
            const targetFish = drone.pos.x < myDrones.find((value) => value.id != drone.id).pos.x
            ? Type0ToFind.sort((a,b)=> b.lr-a.lr).pop()
            : Type0ToFind.sort((a,b)=> a.lr-b.lr).pop();
            
            //движение по горизонтали
            if (!prevDrone || prevDrone.radarBlips[targetFish.id][1] == drone.radarBlips[targetFish.id][1])
                drone.speed = drone.radarBlips[targetFish.id][1] == 'L'
                    ? drone.speed.add(Vector.of([-1,0]))
                    : drone.speed.add(Vector.of([1,0]));
            
            //движение по вертикали
            if (!prevDrone || prevDrone.radarBlips[targetFish.id][0] == drone.radarBlips[targetFish.id][0])
                drone.speed = drone.radarBlips[targetFish.id][0] == 'T'
                    ? drone.speed.add(Vector.of([0,-1]))
                    : drone.speed.add(Vector.of([0,1]));

            console.error(`Drone ${drone.id} search ${targetFish.id} with ${drone.speed}`);
            console.error(`Because ${prevDrone?.radarBlips[targetFish.id]} ?? ${drone.radarBlips[targetFish.id]}`);

            const newLight = droneLightById.get(drone.id) == 0 && drone.pos.y > 2500 && drone.battery > 4 ? 1 : 0;
            droneLightById.set(drone.id, newLight);
                  
        } else {
            console.error('bestDirection', 'UP');
            drone.speed = drone.speed.add(Vector.of([0,-1]))
        }
        drone.speed = drone.speed.normalize().multiply(601);
        drone.pos = drone.pos.add(drone.speed);
        console.log(
            'MOVE',
            drone.pos.toString(),
            droneLightById.get(drone.id)
        ); 
        continue;  
        
    }
    firstTurn = false;
    prevMyDrones = JSON.parse(JSON.stringify(myDrones))

}

