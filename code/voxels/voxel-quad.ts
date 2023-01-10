// ********************************************************************************************************************
import { Mesh, MeshStandardMaterial, Scene, TextureLoader, Vector2 } from 'three/src/Three';
// ********************************************************************************************************************
import { GeometryBuilder } from '../geometry/geometry-builder';
// ********************************************************************************************************************
import { GeometryData } from '../geometry/geometry-data';
// ********************************************************************************************************************
import { Bounds3 } from '../types/bounds3';
// ********************************************************************************************************************
import { Vector3 } from '../types/vector3';
// ********************************************************************************************************************
export class VoxelQuad extends Bounds3 {

    // ****************************************************************************************************************
    // dirty - whether dirty
    // ****************************************************************************************************************
    private dirty: boolean = false;

    // ****************************************************************************************************************
    // mesh - the mesh
    // ****************************************************************************************************************
    private mesh: Mesh | null = null;

    // ****************************************************************************************************************
    // vectorMaxX - the vector max x
    // ****************************************************************************************************************
    private static vectorMaxX: Vector3 = new Vector3(1, 0, 0);

    // ****************************************************************************************************************
    // vectorMaxY - the vector max x
    // ****************************************************************************************************************
    private static vectorMaxY: Vector3 = new Vector3(0, 1, 0);

    // ****************************************************************************************************************
    // vectorMaxZ - the vector max z
    // ****************************************************************************************************************
    private static vectorMaxZ: Vector3 = new Vector3(0, 0, 1);

    // ****************************************************************************************************************
    // vectorMinX - the vector min x
    // ****************************************************************************************************************
    private static vectorMinX: Vector3 = new Vector3(-1, 0, 0);

    // ****************************************************************************************************************
    // vectorMinY - the vector min y
    // ****************************************************************************************************************
    private static vectorMinY: Vector3 = new Vector3(0, -1, 0);

    // ****************************************************************************************************************
    // vectorMinZ - the vector min z
    // ****************************************************************************************************************
    private static vectorMinZ: Vector3 = new Vector3(0, 0, -1);

    // ****************************************************************************************************************
    // vectorUv1 - the vector uv 1
    // ****************************************************************************************************************
    private static vectorUv1: Vector2 = new Vector2(0, 0);

    // ****************************************************************************************************************
    // vectorUv2 - the vector uv 2
    // ****************************************************************************************************************
    private static vectorUv2: Vector2 = new Vector2(1, 0);

    // ****************************************************************************************************************
    // vectorUv3 - the vector uv 3
    // ****************************************************************************************************************
    private static vectorUv3: Vector2 = new Vector2(0, 1);

    // ****************************************************************************************************************
    // vectorUv4 - the vector uv 4
    // ****************************************************************************************************************
    private static vectorUv4: Vector2 = new Vector2(1, 1);

    // ****************************************************************************************************************
    // voxels - the voxels
    // ****************************************************************************************************************
    private voxels: boolean[][][] = [];

    // ****************************************************************************************************************
    // constructor
    // ****************************************************************************************************************
    constructor(private readonly scene: Scene, public readonly location: Vector3, min: Vector3, max: Vector3) { super(min, max); }

    // ****************************************************************************************************************
    // function:    createArray
    // ****************************************************************************************************************
    // parameters:  voxel - the voxel
    // ****************************************************************************************************************
    // returns:     n/a
    // ****************************************************************************************************************
    private createArray(voxel: boolean | null = null): void {

        if (this.voxels.length === 0) {

            this.voxels.length = this.sizeX;

            // *********************************************************************************************************
            // create array 1
            // *********************************************************************************************************

            for (var x = 0; x < this.sizeX; x++) {

                this.voxels[x] = [];

                this.voxels[x].length = this.sizeY;

                // *****************************************************************************************************
                // create array 2
                // *****************************************************************************************************

                for (var y = 0; y < this.sizeY; y++) {

                    this.voxels[x][y] = [];

                    this.voxels[x][y].length = this.sizeZ;

                    if (voxel === null) continue;

                    // *************************************************************************************************
                    // create array 3
                    // *************************************************************************************************

                    for (var z = 0; z < this.sizeZ; z++) {

                        this.voxels[x][y][z] = voxel;
                    }
                }
            }
        }
    }

    // ****************************************************************************************************************
    // function:    createGeometry
    // ****************************************************************************************************************
    // parameters:  builder - the builder
    // ****************************************************************************************************************
    // returns:     n/a
    // ****************************************************************************************************************
    public createGeometry(builder: GeometryBuilder): void {

        if (this.voxels.length) {

            const half = 0.5;

            for (var x = 0; x < this.sizeX; x++) {

                for (var y = 0; y < this.sizeY; y++) {

                    for (var z = 0; z < this.sizeZ; z++) {

                        if (this.voxels[x][y][z]) {

                            // ****************************************************************************************
                            // world
                            // ****************************************************************************************

                            const wx = this.min.x + x;

                            const wy = this.min.y + y;

                            const wz = this.min.z + z;

                            // ****************************************************************************************
                            // min x
                            // ****************************************************************************************

                            if (x === 0 || !this.voxels[x - 1][y][z]) {

                                const dataLub = new GeometryData(new Vector3(wx - half, wy + half, wz - half), VoxelQuad.vectorUv1, VoxelQuad.vectorMinX);

                                const dataLuf = new GeometryData(new Vector3(wx - half, wy + half, wz + half), VoxelQuad.vectorUv2, VoxelQuad.vectorMinX);

                                const dataLdb = new GeometryData(new Vector3(wx - half, wy - half, wz - half), VoxelQuad.vectorUv3, VoxelQuad.vectorMinX);

                                const dataLdf = new GeometryData(new Vector3(wx - half, wy - half, wz + half), VoxelQuad.vectorUv4, VoxelQuad.vectorMinX);

                                builder.addQuad(dataLub, dataLuf, dataLdb, dataLdf);
                            }

                            // ****************************************************************************************
                            // max x
                            // ****************************************************************************************

                            if (x === this.sizeX - 1 || !this.voxels[x + 1][y][z]) {

                                const dataRuf = new GeometryData(new Vector3(wx + half, wy + half, wz + half), VoxelQuad.vectorUv1, VoxelQuad.vectorMaxX);

                                const dataRub = new GeometryData(new Vector3(wx + half, wy + half, wz - half), VoxelQuad.vectorUv2, VoxelQuad.vectorMaxX);

                                const dataRdf = new GeometryData(new Vector3(wx + half, wy - half, wz + half), VoxelQuad.vectorUv3, VoxelQuad.vectorMaxX);

                                const dataRdb = new GeometryData(new Vector3(wx + half, wy - half, wz - half), VoxelQuad.vectorUv4, VoxelQuad.vectorMaxX);

                                builder.addQuad(dataRuf, dataRub, dataRdf, dataRdb);
                            }

                            // ****************************************************************************************
                            // min y
                            // ****************************************************************************************

                            if (y === 0 || !this.voxels[x][y - 1][z]) {

                                const dataRdb = new GeometryData(new Vector3(wx + half, wy - half, wz - half), VoxelQuad.vectorUv1, VoxelQuad.vectorMinY);

                                const dataLdb = new GeometryData(new Vector3(wx - half, wy - half, wz - half), VoxelQuad.vectorUv2, VoxelQuad.vectorMinY);

                                const dataRdf = new GeometryData(new Vector3(wx + half, wy - half, wz + half), VoxelQuad.vectorUv3, VoxelQuad.vectorMinY);

                                const dataLdf = new GeometryData(new Vector3(wx - half, wy - half, wz + half), VoxelQuad.vectorUv4, VoxelQuad.vectorMinY);

                                builder.addQuad(dataRdb, dataLdb, dataRdf, dataLdf);
                            }

                            // ****************************************************************************************
                            // max y
                            // ****************************************************************************************

                            if (y === this.sizeY - 1 || !this.voxels[x][y + 1][z]) {

                                const dataLub = new GeometryData(new Vector3(wx - half, wy + half, wz - half), VoxelQuad.vectorUv1, VoxelQuad.vectorMaxY);

                                const dataRub = new GeometryData(new Vector3(wx + half, wy + half, wz - half), VoxelQuad.vectorUv2, VoxelQuad.vectorMaxY);

                                const dataLuf = new GeometryData(new Vector3(wx - half, wy + half, wz + half), VoxelQuad.vectorUv3, VoxelQuad.vectorMaxY);

                                const dataRuf = new GeometryData(new Vector3(wx + half, wy + half, wz + half), VoxelQuad.vectorUv4, VoxelQuad.vectorMaxY);

                                builder.addQuad(dataLub, dataRub, dataLuf, dataRuf);
                            }

                            // ****************************************************************************************
                            // min z
                            // ****************************************************************************************

                            if (z === 0 || !this.voxels[x][y][z - 1]) {

                                const dataRub = new GeometryData(new Vector3(wx + half, wy + half, wz - half), VoxelQuad.vectorUv1, VoxelQuad.vectorMinZ);

                                const dataLub = new GeometryData(new Vector3(wx - half, wy + half, wz - half), VoxelQuad.vectorUv2, VoxelQuad.vectorMinZ);

                                const dataRdb = new GeometryData(new Vector3(wx + half, wy - half, wz - half), VoxelQuad.vectorUv3, VoxelQuad.vectorMinZ);

                                const dataLdb = new GeometryData(new Vector3(wx - half, wy - half, wz - half), VoxelQuad.vectorUv4, VoxelQuad.vectorMinZ);

                                builder.addQuad(dataRub, dataLub, dataRdb, dataLdb);
                            }

                            // ****************************************************************************************
                            // max z
                            // ****************************************************************************************

                            if (z === this.sizeZ - 1 || !this.voxels[x][y][z + 1]) {

                                const dataLuf = new GeometryData(new Vector3(wx - half, wy + half, wz + half), VoxelQuad.vectorUv1, VoxelQuad.vectorMaxZ);

                                const dataRuf = new GeometryData(new Vector3(wx + half, wy + half, wz + half), VoxelQuad.vectorUv2, VoxelQuad.vectorMaxZ);

                                const dataLdf = new GeometryData(new Vector3(wx - half, wy - half, wz + half), VoxelQuad.vectorUv3, VoxelQuad.vectorMaxZ);

                                const dataRdf = new GeometryData(new Vector3(wx + half, wy - half, wz + half), VoxelQuad.vectorUv4, VoxelQuad.vectorMaxZ);

                                builder.addQuad(dataLuf, dataRuf, dataLdf, dataRdf);
                            }
                        }
                    }
                }
            }
        }
    }

    // ****************************************************************************************************************
    // function:    getVoxel
    // ****************************************************************************************************************
    // parameters:  x - the x
    // ****************************************************************************************************************
    //              y - the y
    // ****************************************************************************************************************
    //              z - the z
    // ****************************************************************************************************************
    // returns:     the voxel 
    // ****************************************************************************************************************
    public getVoxel(x: number, y: number, z: number): boolean {

        x -= this.min.x;

        y -= this.min.y;

        z -= this.min.z;

        if (x >= 0 && x < this.sizeX && y >= 0 && y < this.sizeY && z >= 0 && z < this.sizeZ) {

            return this.getVoxelInternal(x, y, z);
        }
        return false;
    }

    // ****************************************************************************************************************
    // function:    getVoxelInternal
    // ****************************************************************************************************************
    // parameters:  x - the x
    // ****************************************************************************************************************
    //              y - the y
    // ****************************************************************************************************************
    //              z - the z
    // ****************************************************************************************************************
    // returns:     the voxel
    // ****************************************************************************************************************
    private getVoxelInternal(x: number, y: number, z: number): boolean {

        if (this.voxels.length) {

            return this.voxels[x][y][z];
        }
        return false;
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
    public setVoxel(x: number, y: number, z: number, voxel: boolean): void {

        x -= this.min.x;

        y -= this.min.y;

        z -= this.min.z;

        if (x >= 0 && x < this.sizeX && y >= 0 && y < this.sizeY && z >= 0 && z < this.sizeZ) {

            this.setVoxelInternal(x, y, z, voxel);
        }
    }

    // ****************************************************************************************************************
    // function:    setVoxelInternal
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
    private setVoxelInternal(x: number, y: number, z: number, voxel: boolean): void {

        if (voxel) this.createArray();

        if (this.voxels.length) {

            this.voxels[x][y][z] = voxel;

            this.dirty = true;
        }
    }

    // ****************************************************************************************************************
    // function:    setVoxels
    // ****************************************************************************************************************
    // parameters:  voxel - the voxel
    // ****************************************************************************************************************
    // returns:     n/a
    // ****************************************************************************************************************
    public setVoxels(voxel: boolean): void {

        this.voxels = [];

        this.createArray(voxel);

        this.dirty = true;
    }

    // ****************************************************************************************************************
    // function:    update
    // ****************************************************************************************************************
    // parameters:  n/a
    // ****************************************************************************************************************
    // returns:     n/a
    // ****************************************************************************************************************
    public update(): void {

        if (this.dirty && this.voxels.length) {

            this.dirty = false;

            if (this.mesh) this.scene.remove(this.mesh);

            const builder = new GeometryBuilder();

            this.createGeometry(builder);

            if (builder.valid) {

                const geometry = builder.generate();

                geometry.computeVertexNormals();

                const texture = new TextureLoader().load('/resources/voxel.png');

                const material = new MeshStandardMaterial({ color: '#ffffff', map: texture, roughness: 0.5, wireframe: false });

                this.mesh = new Mesh(geometry, material);

                this.scene.add(this.mesh);
            }
        }
    }
}
