// ********************************************************************************************************************
import { GeometryBuilder } from '../geometry/geometry-builder';
// ********************************************************************************************************************
import { GeometryData } from '../geometry/geometry-data';
// ********************************************************************************************************************
import { lerp } from '../helpers/math.helper';
// ********************************************************************************************************************
import { Bounds3 } from '../types/bounds3';
// ********************************************************************************************************************
import { Vector3 } from '../types/vector3';
// ********************************************************************************************************************
export class VoxelArea extends Bounds3 {

    // ****************************************************************************************************************
    // children - the children
    // ****************************************************************************************************************
    private children: VoxelArea[] = [];

    // ****************************************************************************************************************
    // dirty - the dirty
    // ****************************************************************************************************************
    public dirty: boolean = true;

    // ****************************************************************************************************************
    // state - the state
    // ****************************************************************************************************************
    private state: boolean = false;

    // ****************************************************************************************************************
    // constructor
    // ****************************************************************************************************************
    constructor(min: Vector3, max: Vector3, public parent: VoxelArea | null = null) { super(min, max); }

    // ****************************************************************************************************************
    // function:    createChildren
    // ****************************************************************************************************************
    // parameters:  n/a
    // ****************************************************************************************************************
    // returns:     n/a
    // ****************************************************************************************************************
    private createChildren(): VoxelArea[] {

        if (this.children.length === 0) {

            // ********************************************************************************************************
            // obtain min
            // ********************************************************************************************************

            const minX = this.min.x;

            const minY = this.min.y;

            const minZ = this.min.z;

            // ********************************************************************************************************
            // obtain max
            // ********************************************************************************************************

            const maxX = this.max.x;

            const maxY = this.max.y;

            const maxZ = this.max.z;

            // ********************************************************************************************************
            // obtain mid
            // ********************************************************************************************************

            const midX = lerp(minX, maxX);

            const midY = lerp(minY, maxY);

            const midZ = lerp(minZ, maxZ);

            // ********************************************************************************************************
            // obtain areas
            // ********************************************************************************************************

            const areaLUB = new VoxelArea(new Vector3(minX, midY, midZ), new Vector3(midX, maxY, maxZ), this);

            const areaRUB = new VoxelArea(new Vector3(midX, midY, midZ), new Vector3(maxX, maxY, maxZ), this);

            const areaLDB = new VoxelArea(new Vector3(minX, minY, midZ), new Vector3(midX, midY, maxZ), this);

            const areaRDB = new VoxelArea(new Vector3(midX, minY, midZ), new Vector3(maxX, midY, maxZ), this);

            const areaLUF = new VoxelArea(new Vector3(minX, midY, minZ), new Vector3(midX, maxY, midZ), this);

            const areaRUF = new VoxelArea(new Vector3(midX, midY, minZ), new Vector3(maxX, maxY, midZ), this);

            const areaLDF = new VoxelArea(new Vector3(minX, minY, minZ), new Vector3(midX, midY, midZ), this);

            const areaRDF = new VoxelArea(new Vector3(midX, minY, minZ), new Vector3(maxX, midY, midZ), this);

            this.children = [areaLUB, areaRUB, areaLDB, areaRDB, areaLUF, areaRUF, areaLDF, areaRDF];
        }
        return this.children;
    }

    // ****************************************************************************************************************
    // function:    createGeometry
    // ****************************************************************************************************************
    // parameters:  n/a
    // ****************************************************************************************************************
    // returns:     n/a
    // ****************************************************************************************************************
    public createGeometry(builder: GeometryBuilder): void {

        if (this.children.length) {

            for (var i = 0; i < this.children.length; i++) {

                this.children[i].createGeometry(builder);
            }
        } else if (this.state) {

            // ********************************************************************************************************
            // obtain points
            // ********************************************************************************************************

            const pointLDB = new Vector3(this.min.x, this.max.y, this.max.y);

            const pointRDB = new Vector3(this.max.x, this.max.y, this.max.y);

            const pointLUB = new Vector3(this.min.x, this.min.y, this.max.y);

            const pointRUB = new Vector3(this.max.x, this.min.y, this.max.y);

            const pointLDF = new Vector3(this.min.x, this.max.y, this.min.y);

            const pointRDF = new Vector3(this.max.x, this.max.y, this.min.y);

            const pointLUF = new Vector3(this.min.x, this.min.y, this.min.y);

            const pointRUF = new Vector3(this.max.x, this.min.y, this.min.y);

            // ********************************************************************************************************
            // obtain geometry
            // ********************************************************************************************************

            const positionLDB = new GeometryData(pointLDB);

            const positionRDB = new GeometryData(pointRDB);

            const positionLUB = new GeometryData(pointLUB);

            const positionRUB = new GeometryData(pointRUB);

            const positionLDF = new GeometryData(pointLDF);

            const positionRDF = new GeometryData(pointRDF);

            const positionLUF = new GeometryData(pointLUF);

            const positionRUF = new GeometryData(pointRUF);

            // ********************************************************************************************************
            // create geometry
            // ********************************************************************************************************

            const indices = builder.addGeometries([positionLDB, positionRDB, positionLUB, positionRUB, positionLDF, positionRDF, positionLUF, positionRUF]);

            builder.addIndices([indices[0], indices[1], indices[2], indices[2], indices[1], indices[3]]);
        }
        this.dirty = false;
    }

    // ****************************************************************************************************************
    // function:    markDirty
    // ****************************************************************************************************************
    // parameters:  n/a
    // ****************************************************************************************************************
    // returns:     n/a
    // ****************************************************************************************************************
    private markDirty(): void {

        this.dirty = true;

        if (this.children.length) {

            if (this.children.every(ch => ch.state)) {

                this.state = true;

                this.children = [];
            }
            else if (this.children.every(ch => !ch.state)) {

                this.state = false;

                this.children = [];
            }
        }
        this.parent?.markDirty();
    }

    // ****************************************************************************************************************
    // function:    setStates
    // ****************************************************************************************************************
    // parameters:  bounds - the bounds
    // ****************************************************************************************************************
    //              state - the state
    // ****************************************************************************************************************
    // returns:     whether changed
    // ****************************************************************************************************************
    public setStates(bounds: Bounds3, state: boolean): boolean {

        if (this.intersects(bounds)) {

            if (this.equals(bounds)) {

                this.state = state;

                this.markDirty();

                return true;
            }
            this.createChildren();

            for (var i = 0; i < this.children.length; i++) {

                const childBounds = this.children[i].constrain(bounds);

                if (childBounds) this.children[i].setStates(childBounds, state)
            }
            return true;
        }
        return false;
    }
}
