import { Drone } from "./Drone";
import { Fish } from "./Fish";

export const isCollision = (drone: Drone, ugly: Fish, radius: number = 500): boolean => {
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
