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
            // obtain positions
            // ********************************************************************************************************

            const positionLdb = new Vector3(this.min.x, this.min.y, this.max.z);

            const positionRdb = new Vector3(this.max.x, this.min.y, this.max.z);

            const positionLub = new Vector3(this.min.x, this.max.y, this.max.z);

            const positionRub = new Vector3(this.max.x, this.max.y, this.max.z);

            const positionLdf = new Vector3(this.min.x, this.min.y, this.min.z);

            const positionRdf = new Vector3(this.max.x, this.min.y, this.min.z);

            const positionLuf = new Vector3(this.min.x, this.max.y, this.min.z);

            const positionRuf = new Vector3(this.max.x, this.max.y, this.min.z);

            // ********************************************************************************************************
            // obtain data
            // ********************************************************************************************************

            const dataLdb = new GeometryData(positionLdb);

            const dataRdb = new GeometryData(positionRdb);

            const dataLub = new GeometryData(positionLub);

            const dataRub = new GeometryData(positionRub);

            const dataLdf = new GeometryData(positionLdf);

            const dataRdf = new GeometryData(positionRdf);

            const dataLuf = new GeometryData(positionLuf);

            const dataRuf = new GeometryData(positionRuf);

            // ********************************************************************************************************
            // create geometry
            // ********************************************************************************************************

            builder.addCube(dataLdb, dataRdb, dataLub, dataRub, dataLdf, dataRdf, dataLuf, dataRuf);
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
