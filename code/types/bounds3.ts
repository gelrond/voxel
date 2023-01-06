// ********************************************************************************************************************
import * as THREE from 'three';
// ********************************************************************************************************************
import { max, min } from '../helpers/math.helper';
// ********************************************************************************************************************
import { IEquality } from '../shared/equality.interface';
// ********************************************************************************************************************
import { Vector3 } from "./vector3";
// ********************************************************************************************************************
export class Bounds3 extends THREE.Box3 implements IEquality<Bounds3> {

    // ****************************************************************************************************************
    // constructor
    // ****************************************************************************************************************
    constructor(min: Vector3, max: Vector3) { super(min, max); }

    // ****************************************************************************************************************
    // function:    constrain
    // ****************************************************************************************************************
    // parameters:  bounds - the bounds
    // ****************************************************************************************************************
    // returns:     the constrained bounds or null
    // ****************************************************************************************************************
    public constrain(bounds: Bounds3): Bounds3 | null {

        if (bounds) {

            if (this.intersects(bounds)) {

                const x1 = max(this.min.x, bounds.min.x);

                const y1 = max(this.min.y, bounds.min.y);

                const z1 = max(this.min.z, bounds.min.z);

                const minimum = new Vector3(x1, y1, z1);

                const x2 = min(this.max.x, bounds.max.x);

                const y2 = min(this.max.y, bounds.max.y);

                const z2 = min(this.max.z, bounds.max.z);

                const maximum = new Vector3(x2, y2, z2);

                return new Bounds3(minimum, maximum);
            }
        }
        return null;
    }

    // ****************************************************************************************************************
    // function:    insideOrOnEdge
    // ****************************************************************************************************************
    // parameters:  vector - the vector
    // ****************************************************************************************************************
    // returns:     whether inside or on the edge
    // ****************************************************************************************************************
    public insideOrOnEdge(vector: Vector3): boolean {

        if (vector) {

            if (vector.x < this.min.x) return false;

            if (vector.y < this.min.y) return false;

            if (vector.z < this.min.z) return false;

            if (vector.x > this.max.x) return false;

            if (vector.y > this.max.y) return false;

            if (vector.z > this.max.z) return false;
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
    public intersects(bounds: Bounds3): boolean {

        if (bounds) {

            if (bounds.max.x < this.min.x) return false;

            if (bounds.max.y < this.min.y) return false;

            if (bounds.max.z < this.min.z) return false;

            if (bounds.min.x > this.max.x) return false;

            if (bounds.min.y > this.max.y) return false;

            if (bounds.min.z > this.max.z) return false;
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
    public outside(vector: Vector3): boolean {

        return !this.insideOrOnEdge(vector);
    }
}
