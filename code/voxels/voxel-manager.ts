// ********************************************************************************************************************
import { createNoise2D, NoiseFunction2D } from "simplex-noise";
// ********************************************************************************************************************
import { Scene } from "three";
// ********************************************************************************************************************
import { round } from "../helpers/math.helper";
// ********************************************************************************************************************
import { Vector3 } from "../types/vector3";
// ********************************************************************************************************************
import { VoxelQuad } from "./voxel-quad";
// ********************************************************************************************************************
export class VoxelManager {

    // ****************************************************************************************************************
    // noise - the noise
    // ****************************************************************************************************************
    private readonly noise: NoiseFunction2D = createNoise2D();

    // ****************************************************************************************************************
    // quadSizeHalf - the quad size half
    // ****************************************************************************************************************
    private readonly quadSizeHalf: number = 0;

    // ****************************************************************************************************************
    // quads - the quads
    // ****************************************************************************************************************
    private readonly quads: VoxelQuad[] = [];

    // ****************************************************************************************************************
    // quadsPerSideHalf - the quads per side half
    // ****************************************************************************************************************
    private readonly quadsPerSideHalf: number = 0;

    // ****************************************************************************************************************
    // constructor
    // ****************************************************************************************************************
    constructor(private readonly scene: Scene, private readonly quadSize: number = 32, private readonly quadsPerSide: number = 16) {

        this.quadSizeHalf = this.quadSize >> 1;

        this.quadsPerSideHalf = this.quadsPerSide >> 1;
    }

    // ****************************************************************************************************************
    // function:    update
    // ****************************************************************************************************************
    // parameters:  n/a
    // ****************************************************************************************************************
    // returns:     n/a
    // ****************************************************************************************************************
    public update(position: Vector3): void {

        const lx = round(position.x / this.quadSize);

        const lz = round(position.z / this.quadSize);

        for (var x = lx - this.quadsPerSideHalf; x <= lx + this.quadsPerSideHalf; x++) {

            for (var y = - this.quadsPerSideHalf; y <= + this.quadsPerSideHalf; y++) {

                for (var z = lz - this.quadsPerSideHalf; z <= lz + this.quadsPerSideHalf; z++) {

                    const location = new Vector3(x, y, z);

                    // ************************************************************************************************
                    // create quad
                    // ************************************************************************************************

                    var quad = this.quads.find(gr => gr.location.equals(location));

                    if (quad === undefined) {

                        const wx = x * this.quadSize;

                        const wy = y * this.quadSize;

                        const wz = z * this.quadSize;

                        const min = new Vector3(wx - this.quadSizeHalf, wy - this.quadSizeHalf, wz - this.quadSizeHalf);

                        const max = new Vector3(wx + this.quadSizeHalf, wy + this.quadSizeHalf, wz + this.quadSizeHalf);

                        quad = new VoxelQuad(this.scene, location, min, max);

                        this.quads.push(quad);

                        // ********************************************************************************************
                        // populate quad
                        // ********************************************************************************************

                        if (max.y < 0) quad.setVoxels(quad, 1);

                        else {

                            for (var x = 0; x < quad.size; x++) {

                                for (var y = 0; y < quad.size; y++) {

                                    for (var z = 0; z < quad.size; z++) {

                                        const height = this.noise(quad.min.x + x / 256, quad.min.z + z / 256) * quad.size;

                                        if (height > quad.min.y + y) {

                                            quad.setVoxel(x, y, z, 1);
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if (quad.dirty) quad.updateGeometry();
                }
            }
        }
    }
}
