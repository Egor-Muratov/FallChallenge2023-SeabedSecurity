/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 655:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const fs = __nccwpck_require__(147)

// Variable used to store the remain of stdin (happen if several lines have been read at once by getStdin)
let stdin = ''
// File descriptor for stdin
let fd = null

// Read stdin until endByte of end of file is reached
// Beware that endByte is not necessarly the last character!
function getStdin (endByte) {
  const BUFSIZE = 256
  let buf = Buffer.allocUnsafe(BUFSIZE)
  let totalBuf = Buffer.allocUnsafe(0)
  let bytesRead
  let endBytePos

  if (fd === null) {
    fd = fs.openSync('/dev/stdin', 'rs')
  }

  do {
    bytesRead = fs.readSync(fd, buf, 0, BUFSIZE, null)
    totalBuf = Buffer.concat([totalBuf, buf], totalBuf.length + bytesRead)
    endBytePos = buf.indexOf(endByte)
  } while (bytesRead > 0 && (endBytePos < 0 || endBytePos >= bytesRead))

  return totalBuf
}

function readline () {
  if (stdin.indexOf('\n') === -1) {
    stdin = stdin + getStdin('\n'.charCodeAt(0)).toString('utf-8')
  }

  // If still empty then EOF reached. Return null to keep the same behaviour as SpiderMonkey.
  if (stdin.length === 0) {
    return null
  }

  // At this point, either stdin contains '\n' or it's the end of the file: we have something to return
  const newline = stdin.indexOf('\n')
  if (newline !== -1) {
    const line = stdin.slice(0, newline)

    stdin = stdin.slice(newline + 1)
    return line
  } else {
    const line = stdin

    stdin = ''
    return line
  }
}

module.exports = {
  readline
}


/***/ }),

/***/ 147:
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__nccwpck_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
// ESM COMPAT FLAG
__nccwpck_require__.r(__webpack_exports__);

;// CONCATENATED MODULE: ./lib/Vector.ts
//=========================================
//              Vector Math
//=========================================
/**
 * An immutable 2D Vector that supports various operations.
 * @public
 */
class Vector {
    /**
     * Create a vector with the given components.
     * @param x - The component of the x-axis.
     * @param y - The component of the y-axis.
     * @returns The vector.
     */
    static of([x, y]) {
        return new Vector(x, y);
    }
    static copy(vector) {
        return new Vector(vector.x, vector.y);
    }
    /**
     * Create a vector with the given components.
     * @param x - The component of the x-axis.
     * @param y - The component of the y-axis.
     * @returns The vector.
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    /**
     * Add another vector to the vector.
     * @param val - The vector to be added.
     * @returns The resulting vector of the addition.
     */
    add(val) {
        return new Vector(this.x + val.x, this.y + val.y);
    }
    /**
     * Subtract another vector from the vector.
     * @param val - The vector to be added.
     * @returns The resulting vector of the subtraction.
     */
    subtract(val) {
        return new Vector(this.x - val.x, this.y - val.y);
    }
    /**
     * Multiply the vector by a scalar.
     * @param scalar - The scalar the vector will be multiplied by.
     * @returns The resulting vector of the multiplication.
     */
    multiply(scalar) {
        return new Vector(this.x * scalar, this.y * scalar);
    }
    /**
     * Divide the vector by a scalar.
     * @param scalar - The scalar the vector will be divided by.
     * @returns The resulting vector of the division.
     */
    divide(scalar) {
        return new Vector(this.x / scalar, this.y / scalar);
    }
    /**
     * Calculate the dot product of the vector and another vector.
     * @param other - The other vector used for calculating the dot product.
     * @returns The dot product.
     */
    dot(other) {
        return this.x * other.x + this.y * other.y;
    }
    /**
     * Calculate the cross product of the vector and another vector. The cross product of two vectors `a` and `b` is defined as `a.x * b.y - a.y * b.x`.
     * @param other - The other vector used for calculating the cross product.
     * @returns The cross product.
     */
    cross(other) {
        return this.x * other.y - other.x * this.y;
    }
    /**
     * Calculate the Hadamard product of the vector and another vector.
     * @param other - The other vector used for calculating the Hadamard product.
     * @returns The Hadamard product.
     */
    hadamard(other) {
        return new Vector(this.x * other.x, this.y * other.y);
    }
    /**
     * Calculate the length of the vector using the L2 norm.
     * @returns The length.
     */
    length() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }
    /**
     * Normalize the vector using the L2 norm.
     * @returns The normalized vector.
     */
    normalize() {
        const length = this.length();
        return new Vector(this.x / length, this.y / length);
    }
    /**
     * Rotate the vector by the given radians counterclockwise.
     * @param radians - The radians the vector will be rotated by.
     * @returns The rotated vector.
     */
    rotateByRadians(radians) {
        const cos = Math.cos(radians);
        const sin = Math.sin(radians);
        return new Vector(this.x * cos - this.y * sin, this.x * sin + this.y * cos);
    }
    /**
     * Rotate the vector by the given degrees counterclockwise.
     * @param degrees - The degrees the vector will be rotated by.
     * @returns The rotated vector.
     */
    rotateByDegrees(degrees) {
        return this.rotateByRadians((degrees * Math.PI) / 180);
    }
    //clockwise
    rotateRight() {
        return new Vector(this.y, -this.x);
    }
    //counter-clockwise
    rotateLeft() {
        return new Vector(-this.y, this.x);
    }
    toString() {
        return `${Math.trunc(this.x)} ${Math.trunc(this.y)}`;
    }
    inRange(v, range) {
        return (v.x - this.x) * (v.x - this.x) + (v.y - this.y) * (v.y - this.y) <= range * range;
    }
    isZero() {
        return this.x == 0 && this.y == 0;
    }
    inRect(point, rectangle, precision) {
        const fix = (n, p) => (n * Math.pow(10, p)).toFixed();
        var p = precision || 6;
        var rectArea = 0.5 * Math.abs((rectangle[0].y - rectangle[2].y) * (rectangle[3].x - rectangle[1].x)
            + (rectangle[1].y - rectangle[3].y) * (rectangle[0].x - rectangle[2].x));
        var triangleArea = rectangle.reduce(function (prev, cur, i, arr) {
            var j = i == arr.length - 1 ? 0 : i + 1;
            return prev + 0.5 * Math.abs(point.x * (arr[i].y - arr[j].y)
                + arr[i].x * (arr[j].y - point.y)
                + arr[j].x * (point.y - arr[i].y));
        }, 0);
        return fix(triangleArea, p) == fix(rectArea, p);
    }
}

;// CONCATENATED MODULE: ./lib/isCollision.ts
const isCollision = (drone, ugly, radius = 500) => {
    // Check instant collision
    if (ugly.pos.inRange(drone.pos, radius)) {
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
    const r2 = radius;
    const vx2 = ugly.speed.x - drone.speed.x;
    const vy2 = ugly.speed.y - drone.speed.y;
    // Resolving: sqrt((x + t*vx)^2 + (y + t*vy)^2) = radius <=> t^2*(vx^2 + vy^2) + t*2*(x*vx + y*vy) + x^2 + y^2 - radius^2 = 0
    // at^2 + bt + c = 0;
    // a = vx^2 + vy^2
    // b = 2*(x*vx + y*vy)
    // c = x^2 + y^2 - radius^2 
    const a = vx2 * vx2 + vy2 * vy2;
    if (a <= 0) {
        return false;
    }
    const b = 2 * (x2 * vx2 + y2 * vy2);
    const c = x2 * x2 + y2 * y2 - r2 * r2;
    const delta = b * b - 4 * a * c;
    if (delta < 0) {
        return false;
    }
    const t = (-b - Math.sqrt(delta)) / (2 * a);
    if (t <= 0) {
        return false;
    }
    if (t > 1) {
        return false;
    }
    return true;
};

// EXTERNAL MODULE: ./lib/readline/readline.js
var readline = __nccwpck_require__(655);
;// CONCATENATED MODULE: ./lib/read.ts

const readNumber = () => parseInt((0,readline.readline)());
const readNumbers = () => (0,readline.readline)().split(' ').map(Number);

;// CONCATENATED MODULE: ./lib/readDrones.ts


function readDrones() {
    const myDrones = [];
    const myDroneCount = readNumber();
    for (let i = 0; i < myDroneCount; i++) {
        const [id, x, y, emergency, battery] = readNumbers();
        const drone = {
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

;// CONCATENATED MODULE: ./new.ts





//TODO Если если по сумме непобедимый бежать на верх!
//=========================================
//              Types
//=========================================
const DRONE_COUNT = 2;
let droneLightById = new Map();
let firstTurn = true;
const droneFirstSink = new Map();
const droneFirstUp = new Map();
let lastDroneState = [];
function uniqByReduce(array) {
    return array.reduce((acc, cur) => {
        if (!acc.includes(cur)) {
            acc.push(cur);
        }
        return acc;
    }, []);
}
const getMonsterRect = (start, direction, speed, radius) => {
    const height = direction.multiply(radius);
    const A = start.add(height.rotateLeft());
    const B = start.add(height.rotateRight());
    const finish = start.add(height.multiply(speed));
    const C = finish.add(height.rotateLeft());
    const D = finish.add(height.rotateRight());
    return [A, B, C, D];
};
const calcTypeScore = (fishes, typeCode, typePoint) => {
    const typeCount = fishes.filter(fish => fish.type == typeCode && fish.scanned).length;
    const typeScore = typeCount * typePoint + (typeCount == 4 ? 8 : 0);
    return typeScore;
};
const calcScore = (fishes) => {
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
    return type0Score + type1Score + type2Score + color0 + color1 + color2 + color3;
};
const isOutborder = (drone) => {
    const newPos = drone.pos.add(drone.speed);
    return newPos.x < 0 || newPos.x >= 10000 || newPos.y < 0 || newPos.y >= 10000;
};
const bypassUglies = (drone, uglies) => {
    if (!uglies || uglies.length == 0) {
        return;
    }
    let angle = 0;
    const droneBaseSpeed = Vector.copy(drone.speed);
    while (isOutborder(drone) || uglies.some((ugly) => isCollision(drone, ugly, 601))) {
        angle = angle <= 0
            ? -angle + 5
            : -angle;
        drone.speed = droneBaseSpeed.rotateByDegrees(angle);
        if (angle == 185) {
            break;
        }
    }
    console.error(`drone ${drone.id} angle ${angle} from ${drone.pos.x}:${drone.pos.y} to ${drone.pos.x + drone.speed.x}:${drone.pos.y + drone.speed.y} with speed ${drone.speed}`);
};
//=========================================
//              Init
//=========================================
const creatureCount = readNumber();
const fishesById = new Map();
Array(creatureCount).fill(0).forEach(() => {
    const [id, color, type] = readNumbers();
    fishesById.set(id, { id, color, type, isMonster: type == -1 });
});
console.error('creatures', fishesById);
//=========================================
//              Game loop
//=========================================
while (true) {
    const myScore = readNumber();
    const foeScore = readNumber();
    //Исследованные рыбы 
    //-------------------------------------
    const myResearched = Array(readNumber()).fill(0).map(() => readNumber());
    const enemyResearched = Array(readNumber()).fill(0).map(() => readNumber());
    //Дроны
    //-------------------------------------
    const myDrones = readDrones();
    const myDronesById = new Map(myDrones.map(drone => [drone.id, drone]));
    if (firstTurn) {
        droneLightById = new Map(myDrones.map(drone => [drone.id, 0]));
        myDrones.forEach((drone) => droneFirstSink.set(drone.id, true));
        myDrones.forEach((drone) => droneFirstUp.set(drone.id, false));
    }
    const enemyDrones = readDrones();
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
    const droneScanCount = readNumber();
    const myScanned = [];
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
    const visibleCreatureCount = readNumber();
    const tmpVisFishes = [];
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
        const inputs = (0,readline.readline)().split(' ');
        const droneId = parseInt(inputs[0]);
        const creatureId = parseInt(inputs[1]);
        const direction = inputs[2];
        myDronesById.get(droneId).radarBlips[creatureId] = direction;
        const fish = fishesById.get(creatureId);
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
            droneFirstSink.set(drone.id, false);
        }
        if (drone.pos.y < 500) {
            droneFirstUp.set(drone.id, false);
        }
        if (myScannedUniq.length >= 10) {
            droneFirstUp.set(drone.id, true);
        }
        if (droneFirstSink.get(drone.id)) {
            console.error(`Drone ${drone.id} firstSink`);
            drone.speed = Vector.of([0, 1]);
        }
        else if (droneFirstUp.get(drone.id)) {
            console.error(`Drone ${drone.id} scoreUP`);
            drone.speed = Vector.of([0, -1]);
        }
        else if (fishToFind && fishToFind.length > 0) {
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
            console.error(`Because ${droneLastState === null || droneLastState === void 0 ? void 0 : droneLastState.radarBlips[targetFish.id]} ?? ${drone.radarBlips[targetFish.id]}`);
        }
        else {
            console.error(`Drone ${drone.id} GameEnd`);
            drone.speed = Vector.of([0, -1]);
        }
        const newLight = droneLightById.get(drone.id) == 0 && drone.pos.y > 2500 && drone.battery > 4 ? 1 : 0;
        droneLightById.set(drone.id, newLight);
        drone.speed = drone.speed.normalize().multiply(600);
        bypassUglies(drone, uglies);
        drone.pos = drone.pos.add(drone.speed);
        console.log('MOVE', drone.pos.toString(), droneLightById.get(drone.id));
        continue;
    }
    firstTurn = false;
    lastDroneState = JSON.parse(JSON.stringify(myDrones));
}

})();

module.exports = __webpack_exports__;
/******/ })()
;