"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vector = void 0;
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
exports.Vector = Vector;
