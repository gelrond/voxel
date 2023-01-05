// ********************************************************************************************************************
import * as THREE from 'three';
// ********************************************************************************************************************
import { IEquality } from '../shared/equality.interface';
// ********************************************************************************************************************
import { Vector2 } from "./vector2";
// ********************************************************************************************************************
export class Bounds2 extends THREE.Box2 implements IEquality<Bounds2> {

    // ****************************************************************************************************************
    // constructor
    // ****************************************************************************************************************
    constructor(min: Vector2, max: Vector2) { super(min, max); }

    // ****************************************************************************************************************
    // function:    insideOrOnEdge
    // ****************************************************************************************************************
    // parameters:  vector - the vector
    // ****************************************************************************************************************
    // returns:     whether inside or on the edge
    // ****************************************************************************************************************
    public insideOrOnEdge(vector: Vector2): boolean {

        if (vector) {

            if (vector.x < this.min.x) return false;

            if (vector.y < this.min.y) return false;

            if (vector.x > this.max.x) return false;

            if (vector.y > this.max.y) return false;
        }
        return true;
    }

    // ****************************************************************************************************************
    // function:    intersects
    // ****************************************************************************************************************
    // parameters:  bounds - the bounds
    // ****************************************************************************************************************
    // returns:     whether intersects
    // ****************************************************************************************************************
    public intersects(bounds: Bounds2): boolean {

        if (bounds) {

            if (bounds.max.x < this.min.x) return false;

            if (bounds.max.y < this.min.y) return false;

            if (bounds.min.x > this.max.x) return false;

            if (bounds.min.y > this.max.y) return false;
        }
        return true;
    }

    // ****************************************************************************************************************
    // function:    outside
    // ****************************************************************************************************************
    // parameters:  vector - the vector
    // ****************************************************************************************************************
    // returns:     whether outside
    // ****************************************************************************************************************
    public outside(vector: Vector2): boolean {

        return !this.insideOrOnEdge(vector);
    }
}