// ********************************************************************************************************************
import { lerp } from '../helpers/math.helper';
// ********************************************************************************************************************
import { Bounds3 } from '../types/bounds3';
// ********************************************************************************************************************
import { Vector3 } from '../types/vector3';
// ********************************************************************************************************************
import { VoxelQuad } from './voxel-quad';
// ********************************************************************************************************************
export class VoxelArea extends Bounds3 {

    // ****************************************************************************************************************
    // children - the children
    // ****************************************************************************************************************
    private children: VoxelArea[] = [];

    // ****************************************************************************************************************
    // voxel - the voxel
    // ****************************************************************************************************************
    public voxel: number = 0;

    // ****************************************************************************************************************
    // constructor
    // ****************************************************************************************************************
    constructor(min: Vector3, max: Vector3, public quad: VoxelQuad | null = null) { super(min, max); }

    // ****************************************************************************************************************
    // function:    collapseChildren
    // ****************************************************************************************************************
    // parameters:  n/a
    // ****************************************************************************************************************
    // returns:     n/a
    // ****************************************************************************************************************
    private collapseChildren(): void {

        this.children = [];
    }

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

            const areaLUB = new VoxelArea(new Vector3(minX, midY, midZ), new Vector3(midX, maxY, maxZ), this.quad);

            const areaRUB = new VoxelArea(new Vector3(midX, midY, midZ), new Vector3(maxX, maxY, maxZ), this.quad);

            const areaLDB = new VoxelArea(new Vector3(minX, minY, midZ), new Vector3(midX, midY, maxZ), this.quad);

            const areaRDB = new VoxelArea(new Vector3(midX, minY, midZ), new Vector3(maxX, midY, maxZ), this.quad);

            const areaLUF = new VoxelArea(new Vector3(minX, midY, minZ), new Vector3(midX, maxY, midZ), this.quad);

            const areaRUF = new VoxelArea(new Vector3(midX, midY, minZ), new Vector3(maxX, maxY, midZ), this.quad);

            const areaLDF = new VoxelArea(new Vector3(minX, minY, minZ), new Vector3(midX, midY, midZ), this.quad);

            const areaRDF = new VoxelArea(new Vector3(midX, minY, minZ), new Vector3(maxX, midY, midZ), this.quad);

            this.children = [areaLUB, areaRUB, areaLDB, areaRDB, areaLUF, areaRUF, areaLDF, areaRDF];
        }
        return this.children;
    }

    // ****************************************************************************************************************
    // function:    setVoxel
    // ****************************************************************************************************************
    // parameters:  x - the x
    // ****************************************************************************************************************
    //              y - the y
    // ****************************************************************************************************************
    //              z - the z
    // ****************************************************************************************************************
    //              voxel - the voxel
    // ****************************************************************************************************************
    // returns:     n/a
    // ****************************************************************************************************************
    public setVoxel(x: number, y: number, z: number, voxel: number): void {

    }

    // ****************************************************************************************************************
    // function:    setVoxels
    // ****************************************************************************************************************
    // parameters:  bounds - the bounds
    // ****************************************************************************************************************
    //              voxel - the voxel
    // ****************************************************************************************************************
    // returns:     whether full
    // ****************************************************************************************************************
    public setVoxels(bounds: Bounds3, voxel: number): boolean {

        if (this.intersects(bounds)) {

            // ********************************************************************************************************
            // this area
            // ********************************************************************************************************

            if (this.containsBox(bounds)) {

                if (this.voxel = voxel) {

                    this.collapseChildren();

                    this.quad?.setDirty();

                    return true;
                }
                return false;
            }

            // ********************************************************************************************************
            // ensure children created if filling
            // ********************************************************************************************************

            if (voxel && this.children.length === 0) {

                this.createChildren();
            }

            // ********************************************************************************************************
            // process children
            // ********************************************************************************************************

            var numFull = 0, numEmpty = 0;

            for (var i = 0; i < this.children.length; i++) {

                if (this.children[i].setVoxels(bounds, voxel)) numFull++; else numEmpty++;
            }

            // ********************************************************************************************************
            // check all full
            // ********************************************************************************************************

            if (numFull === this.children.length) {

                this.children.find()
            }
        }
    }


    /*
        // ****************************************************************************************************************
        // noise - the noise
        // ****************************************************************************************************************
        private static noise: NoiseFunction2D = createNoise2D();
    
        // ****************************************************************************************************************
        // dirty - whether dirty
        // ****************************************************************************************************************
        public dirty: boolean = true;
    
        // ****************************************************************************************************************
        // geometry - the geometry
        // ****************************************************************************************************************
        private geometry: BufferGeometry | null = null;
    
        // ****************************************************************************************************************
        // material - the material
        // ****************************************************************************************************************
        private material: Material = new MeshStandardMaterial({ color: '#ffffff', wireframe: false });
    
        // ****************************************************************************************************************
        // mesh - the mesh
        // ****************************************************************************************************************
        private mesh: InstancedMesh | null = null;
    
        // ****************************************************************************************************************
        // size - the size
        // ****************************************************************************************************************
        private readonly size: number = 0;
    
        // ****************************************************************************************************************
        // voxels - the voxels
        // ****************************************************************************************************************
        private voxels: number[][][] = [];
    
        // ****************************************************************************************************************
        // constructor
        // ****************************************************************************************************************
        constructor(private readonly scene: Scene, public readonly location: Vector3, min: Vector3, max: Vector3) {
    
            super(min, max);
    
            this.size = max.x - min.x;
    
            this.createArray();
    
            if (max.y < 0) this.setVoxels(this, 1);
    
            else {
    
                for (var x = 0; x < this.size; x++) {
    
                    for (var y = 0; y < this.size; y++) {
    
                        for (var z = 0; z < this.size; z++) {
    
                            const height = VoxelGroup.noise(this.min.x + x / 256, this.min.z + z / 256) * this.size;
    
                            if (height > this.min.y + y) {
    
                                this.voxels[x][y][z] = 1;
                            }
                        }
                    }
                }
            }
        }
    
        // ****************************************************************************************************************
        // function:    createArray
        // ****************************************************************************************************************
        // parameters:  n/a
        // ****************************************************************************************************************
        // returns:     n/a
        // ****************************************************************************************************************
        private createArray(): void {
    
            for (var x = 0; x < this.size; x++) {
    
                this.voxels[x] = [];
    
                for (var y = 0; y < this.size; y++) {
    
                    this.voxels[x][y] = [];
    
                    for (var z = 0; z < this.size; z++) {
    
                        this.voxels[x][y][z] = 0;
                    }
                }
            }
        }
    
        // ****************************************************************************************************************
        // function:    getVoxel
        // ****************************************************************************************************************
        // parameters:  position - the position
        // ****************************************************************************************************************
        // returns:     the voxel
        // ****************************************************************************************************************
        public getVoxel(position: Vector3): number {
    
            if (this.insideOrOnEdge(position)) {
    
                const x = position.x - this.min.x;
    
                const y = position.y - this.min.y;
    
                const z = position.z - this.min.z;
    
                return this.voxels[x][y][z];
            }
            return 0;
        }
    
        // ****************************************************************************************************************
        // function:    setVoxel
        // ****************************************************************************************************************
        // parameters:  position - the position
        // ****************************************************************************************************************
        //              voxel - the voxel
        // ****************************************************************************************************************
        // returns:     n/a
        // ****************************************************************************************************************
        public setVoxel(position: Vector3, voxel: number): void {
    
            if (this.insideOrOnEdge(position)) {
    
                const x = position.x - this.min.x;
    
                const y = position.y - this.min.y;
    
                const z = position.z - this.min.z;
    
                this.voxels[x][y][z] = voxel;
    
                this.dirty = true;
            }
        }
    
        // ****************************************************************************************************************
        // function:    setVoxels
        // ****************************************************************************************************************
        // parameters:  bounds - the bounds
        // ****************************************************************************************************************
        //              voxel - the voxel
        // ****************************************************************************************************************
        // returns:     n/a
        // ****************************************************************************************************************
        public setVoxels(bounds: Bounds3, voxel: number): void {
    
            if (this.intersects(bounds)) {
    
                for (var x = bounds.min.x; x < bounds.max.x; x++) {
    
                    for (var y = bounds.min.y; y < bounds.max.y; y++) {
    
                        for (var z = bounds.min.z; z < bounds.max.z; z++) {
    
                            this.setVoxel(new Vector3(x, y, z), voxel);
                        }
                    }
                }
            }
        }
    
        // ****************************************************************************************************************
        // function:    updateGeometry
        // ****************************************************************************************************************
        // parameters:  n/a
        // ****************************************************************************************************************
        // returns:     n/a
        // ****************************************************************************************************************
        public updateGeometry(): void {
    
            if (!this.dirty) return;
    
            // ************************************************************************************************************
            // update geometry
            // ************************************************************************************************************
    
            this.geometry = this.geometry ?? new BoxGeometry(1, 1, 1, 1, 1, 1);
    
            const matrices: Matrix4[] = [];
    
            for (var x = 0; x < this.size; x++) {
    
                for (var y = 0; y < this.size; y++) {
    
                    for (var z = 0; z < this.size; z++) {
    
                        const voxel = this.voxels[x][y][z];
    
                        const voxelMinX = x > 0 ? this.voxels[x - 1][y][z] : null;
    
                        const voxelMaxX = x < this.size - 1 ? this.voxels[x + 1][y][z] : null;
    
                        const voxelMinY = y > 0 ? this.voxels[x][y - 1][z] : null;
    
                        const voxelMaxY = y < this.size - 1 ? this.voxels[x][y + 1][z] : null;
    
                        const voxelMinZ = z > 0 ? this.voxels[x][y][z - 1] : null;
    
                        const voxelMaxZ = z < this.size - 1 ? this.voxels[x][y][z + 1] : null;
    
                        if (voxel > 0 && (voxelMinX === null || voxelMaxX === null || voxelMinY === null || voxelMaxY === null || voxelMinZ === null || voxelMaxZ === null)) {
    
                            const matrix = new Matrix4();
    
                            matrix.setPosition(this.min.x + x, this.min.y + y, this.min.z + z);
    
                            matrices.push(matrix);
                        }
                    }
                }
            }
    
            // ************************************************************************************************************
            // update mesh
            // ************************************************************************************************************
    
            if (this.mesh) this.scene.remove(this.mesh);
    
            this.mesh = new InstancedMesh(this.geometry, this.material, matrices.length);
    
            for (var i = 0; i < matrices.length; i++) {
    
                this.mesh.setMatrixAt(i, matrices[i]);
            }
            this.scene.add(this.mesh);
    
            this.dirty = false;
        }
        */
}
