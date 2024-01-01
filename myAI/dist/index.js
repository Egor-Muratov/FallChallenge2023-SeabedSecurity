/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 437:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
var __webpack_unused_export__;

__webpack_unused_export__ = ({ value: true });
exports.O = void 0;
//=========================================
//              Vector Math
//=========================================
/**
 * An immutable 2D Vector that supports various operations.
 * @public
 */
var Vector = /** @class */ (function () {
    /**
     * Create a vector with the given components.
     * @param x - The component of the x-axis.
     * @param y - The component of the y-axis.
     * @returns The vector.
     */
    function Vector(x, y) {
        this.x = x;
        this.y = y;
    }
    /**
     * Create a vector with the given components.
     * @param x - The component of the x-axis.
     * @param y - The component of the y-axis.
     * @returns The vector.
     */
    Vector.of = function (_a) {
        var x = _a[0], y = _a[1];
        return new Vector(x, y);
    };
    /**
     * Add another vector to the vector.
     * @param val - The vector to be added.
     * @returns The resulting vector of the addition.
     */
    Vector.prototype.add = function (val) {
        return new Vector(this.x + val.x, this.y + val.y);
    };
    /**
     * Subtract another vector from the vector.
     * @param val - The vector to be added.
     * @returns The resulting vector of the subtraction.
     */
    Vector.prototype.subtract = function (val) {
        return new Vector(this.x - val.x, this.y - val.y);
    };
    /**
     * Multiply the vector by a scalar.
     * @param scalar - The scalar the vector will be multiplied by.
     * @returns The resulting vector of the multiplication.
     */
    Vector.prototype.multiply = function (scalar) {
        return new Vector(this.x * scalar, this.y * scalar);
    };
    /**
     * Divide the vector by a scalar.
     * @param scalar - The scalar the vector will be divided by.
     * @returns The resulting vector of the division.
     */
    Vector.prototype.divide = function (scalar) {
        return new Vector(this.x / scalar, this.y / scalar);
    };
    /**
     * Calculate the dot product of the vector and another vector.
     * @param other - The other vector used for calculating the dot product.
     * @returns The dot product.
     */
    Vector.prototype.dot = function (other) {
        return this.x * other.x + this.y * other.y;
    };
    /**
     * Calculate the cross product of the vector and another vector. The cross product of two vectors `a` and `b` is defined as `a.x * b.y - a.y * b.x`.
     * @param other - The other vector used for calculating the cross product.
     * @returns The cross product.
     */
    Vector.prototype.cross = function (other) {
        return this.x * other.y - other.x * this.y;
    };
    /**
     * Calculate the Hadamard product of the vector and another vector.
     * @param other - The other vector used for calculating the Hadamard product.
     * @returns The Hadamard product.
     */
    Vector.prototype.hadamard = function (other) {
        return new Vector(this.x * other.x, this.y * other.y);
    };
    /**
     * Calculate the length of the vector using the L2 norm.
     * @returns The length.
     */
    Vector.prototype.length = function () {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    };
    /**
     * Normalize the vector using the L2 norm.
     * @returns The normalized vector.
     */
    Vector.prototype.normalize = function () {
        var length = this.length();
        return new Vector(this.x / length, this.y / length);
    };
    /**
     * Rotate the vector by the given radians counterclockwise.
     * @param radians - The radians the vector will be rotated by.
     * @returns The rotated vector.
     */
    Vector.prototype.rotateByRadians = function (radians) {
        var cos = Math.cos(radians);
        var sin = Math.sin(radians);
        return new Vector(this.x * cos - this.y * sin, this.x * sin + this.y * cos);
    };
    /**
     * Rotate the vector by the given degrees counterclockwise.
     * @param degrees - The degrees the vector will be rotated by.
     * @returns The rotated vector.
     */
    Vector.prototype.rotateByDegrees = function (degrees) {
        return this.rotateByRadians((degrees * Math.PI) / 180);
    };
    //clockwise
    Vector.prototype.rotateRight = function () {
        return new Vector(this.y, -this.x);
    };
    //counter-clockwise
    Vector.prototype.rotateLeft = function () {
        return new Vector(-this.y, this.x);
    };
    Vector.prototype.toString = function () {
        return "".concat(Math.trunc(this.x), " ").concat(Math.trunc(this.y));
    };
    Vector.prototype.inRange = function (v, range) {
        return (v.x - this.x) * (v.x - this.x) + (v.y - this.y) * (v.y - this.y) <= range * range;
    };
    Vector.prototype.isZero = function () {
        return this.x == 0 && this.y == 0;
    };
    Vector.prototype.inRect = function (point, rectangle, precision) {
        var fix = function (n, p) { return (n * Math.pow(10, p)).toFixed(); };
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
    };
    return Vector;
}());
exports.O = Vector;


/***/ }),

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
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__nccwpck_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__nccwpck_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__nccwpck_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__nccwpck_require__.o(definition, key) && !__nccwpck_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__nccwpck_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
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
__nccwpck_require__.r(__webpack_exports__);
/* harmony import */ var _lib_Vector__WEBPACK_IMPORTED_MODULE_0__ = __nccwpck_require__(437);
/* harmony import */ var _lib_readline_readline__WEBPACK_IMPORTED_MODULE_1__ = __nccwpck_require__(655);
/* harmony import */ var _lib_readline_readline__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__nccwpck_require__.n(_lib_readline_readline__WEBPACK_IMPORTED_MODULE_1__);


const DRONE_HIT_RANGE = 200;
const UGLY_EAT_RANGE = 300;
//=========================================
//              Types
//=========================================
const moveDown = (pos, light) => console.log('MOVE', pos.x, 9999, light);
const moveUp = (pos, light) => console.log('MOVE', pos.x, 0, light);
;
const moveDelta = {
    BL: _lib_Vector__WEBPACK_IMPORTED_MODULE_0__/* .Vector.of */ .O.of([-1, 1]),
    BR: _lib_Vector__WEBPACK_IMPORTED_MODULE_0__/* .Vector.of */ .O.of([1, 1]),
    TL: _lib_Vector__WEBPACK_IMPORTED_MODULE_0__/* .Vector.of */ .O.of([-1, -1]),
    TR: _lib_Vector__WEBPACK_IMPORTED_MODULE_0__/* .Vector.of */ .O.of([1, -1]),
};
const DRONE_COUNT = 2;
const droneLightById = new Map();
let firstSink = true;
let firstTurn = true;
const readNumber = () => parseInt((0,_lib_readline_readline__WEBPACK_IMPORTED_MODULE_1__.readline)());
const readNumbers = () => (0,_lib_readline_readline__WEBPACK_IMPORTED_MODULE_1__.readline)().split(' ').map(Number);
let prevMyDrones = [];
const getMonsterRect = (start, direction, speed, radius) => {
    const height = direction.multiply(radius);
    const A = start.add(height.rotateLeft());
    const B = start.add(height.rotateRight());
    const finish = start.add(height.multiply(speed));
    const C = finish.add(height.rotateLeft());
    const D = finish.add(height.rotateRight());
    return [A, B, C, D];
};
const isCollision = (drone, ugly) => {
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
};
const getBestWay = (drone, uglys) => {
};
//=========================================
//              State Machine
//=========================================
var MachineStates;
(function (MachineStates) {
    MachineStates["sink"] = "sink";
    MachineStates["firstFullSink"] = "firstFullSink";
    MachineStates["runAwayFromMonster"] = "runAwayFromMonster";
    MachineStates["avoidMonsterAndSink"] = "avoidMonsterAndSink";
    MachineStates["avoidMonsterAndSearch"] = "avoidMonsterAndSearch";
    MachineStates["sendScans"] = "sendScans";
    MachineStates["search"] = "search";
})(MachineStates || (MachineStates = {}));
var MachineActions;
(function (MachineActions) {
    MachineActions["foundMonster"] = "foundMonster";
    MachineActions["monsterHunting"] = "monsterHunting";
})(MachineActions || (MachineActions = {}));
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
    const myScanCount = readNumber();
    const myScaned = [];
    for (let i = 0; i < myScanCount; i++) {
        const researchedId = readNumber();
        fishesById.get(researchedId).researched = true;
        myScaned.push(researchedId);
    }
    const foeScanCount = readNumber();
    const foeScaned = [];
    for (let i = 0; i < foeScanCount; i++) {
        foeScaned.push(readNumber());
    }
    //Дроны
    //-------------------------------------
    const myDrones = [];
    const myDronesById = new Map();
    const myDroneCount = readNumber();
    for (let i = 0; i < myDroneCount; i++) {
        const [id, x, y, emergency, battery] = readNumbers();
        const drone = {
            id,
            pos: _lib_Vector__WEBPACK_IMPORTED_MODULE_0__/* .Vector.of */ .O.of([x, y]),
            battery,
            emergency,
            scans: [],
            speed: _lib_Vector__WEBPACK_IMPORTED_MODULE_0__/* .Vector.of */ .O.of([0, 0]),
            radarBlips: {}
        };
        myDronesById.set(id, drone);
        myDrones.push(drone);
        if (firstTurn)
            droneLightById.set(id, 0);
    }
    const foeDroneCount = readNumber();
    for (let i = 0; i < foeDroneCount; i++) {
        const [droneId, droneX, droneY, dead, battery] = readNumbers();
    }
    //Сканирования
    //-------------------------------------
    fishesById.forEach((value) => value.scanned = false);
    const droneScanCount = readNumber();
    for (let i = 0; i < droneScanCount; i++) {
        const [droneId, creatureId] = readNumbers();
        if (myDronesById.has(droneId))
            myDronesById.get(droneId).scans.push(creatureId);
        fishesById.get(creatureId).scanned = true;
    }
    //Видимые рыбки
    //-------------------------------------
    const visibleCreatureCount = readNumber();
    for (let i = 0; i < visibleCreatureCount; i++) {
        const [creatureId, x, y, vx, vy] = readNumbers();
        const fish = fishesById.get(creatureId);
        fish.pos = _lib_Vector__WEBPACK_IMPORTED_MODULE_0__/* .Vector.of */ .O.of([x, y]);
        fish.speed = _lib_Vector__WEBPACK_IMPORTED_MODULE_0__/* .Vector.of */ .O.of([vx, vy]);
    }
    //Радар
    //-------------------------------------
    fishesById.forEach((value) => value.bliped = false);
    fishesById.forEach((value) => value.lr = 0);
    const radarBlipCount = readNumber();
    for (let i = 0; i < radarBlipCount; i++) {
        const inputs = (0,_lib_readline_readline__WEBPACK_IMPORTED_MODULE_1__.readline)().split(' ');
        const droneId = parseInt(inputs[0]);
        const creatureId = parseInt(inputs[1]);
        const direction = inputs[2];
        myDronesById.get(droneId).radarBlips[creatureId] = direction;
        const fish = fishesById.get(creatureId);
        fish.bliped = true;
        fish.lr += direction[1] == 'L' ? -1 : 1;
    }
    const Type0ToFind = Array
        .from(fishesById.values())
        .filter(c => (c.type == 0 || c.type == 1) && c.bliped && !c.scanned && !c.researched);
    console.error('Рыбы', Type0ToFind);
    for (const drone of myDrones) {
        if (Type0ToFind && Type0ToFind.length > 0) {
            const prevDrone = prevMyDrones.find((value) => value.id == drone.id);
            //выбор цели
            const targetFish = drone.pos.x < myDrones.find((value) => value.id != drone.id).pos.x
                ? Type0ToFind.sort((a, b) => b.lr - a.lr).pop()
                : Type0ToFind.sort((a, b) => a.lr - b.lr).pop();
            //движение по горизонтали
            if (!prevDrone || prevDrone.radarBlips[targetFish.id][1] == drone.radarBlips[targetFish.id][1])
                drone.speed = drone.radarBlips[targetFish.id][1] == 'L'
                    ? drone.speed.add(_lib_Vector__WEBPACK_IMPORTED_MODULE_0__/* .Vector.of */ .O.of([-1, 0]))
                    : drone.speed.add(_lib_Vector__WEBPACK_IMPORTED_MODULE_0__/* .Vector.of */ .O.of([1, 0]));
            //движение по вертикали
            if (!prevDrone || prevDrone.radarBlips[targetFish.id][0] == drone.radarBlips[targetFish.id][0])
                drone.speed = drone.radarBlips[targetFish.id][0] == 'T'
                    ? drone.speed.add(_lib_Vector__WEBPACK_IMPORTED_MODULE_0__/* .Vector.of */ .O.of([0, -1]))
                    : drone.speed.add(_lib_Vector__WEBPACK_IMPORTED_MODULE_0__/* .Vector.of */ .O.of([0, 1]));
            console.error(`Drone ${drone.id} search ${targetFish.id} with ${drone.speed}`);
            console.error(`Because ${prevDrone === null || prevDrone === void 0 ? void 0 : prevDrone.radarBlips[targetFish.id]} ?? ${drone.radarBlips[targetFish.id]}`);
            const newLight = droneLightById.get(drone.id) == 0 && drone.pos.y > 2500 && drone.battery > 4 ? 1 : 0;
            droneLightById.set(drone.id, newLight);
        }
        else {
            console.error('bestDirection', 'UP');
            drone.speed = drone.speed.add(_lib_Vector__WEBPACK_IMPORTED_MODULE_0__/* .Vector.of */ .O.of([0, -1]));
        }
        drone.speed = drone.speed.normalize().multiply(601);
        drone.pos = drone.pos.add(drone.speed);
        console.log('MOVE', drone.pos.toString(), droneLightById.get(drone.id));
        continue;
    }
    firstTurn = false;
    prevMyDrones = JSON.parse(JSON.stringify(myDrones));
}

})();

module.exports = __webpack_exports__;
/******/ })()
;