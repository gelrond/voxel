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
    constructor(private readonly scene: Scene, private readonly quadSize: number = 16, private readonly quadsPerSide: number = 8) {

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
                        // populate voxels
                        // ********************************************************************************************

                        if (min.y <= 0) quad.setVoxels(true);

                        else if (max.y <= 32) {

                            for (var ix = min.x; ix <= max.x; ix++) {

                                for (var iz = min.z; iz <= max.z; iz++) {

                                    const height = this.noise(ix / 32, iz / 32) * 32;

                                    for (var iy = min.y; iy <= max.y; iy++) {

                                        if (iy < height) quad.setVoxel(ix, iy, iz, true);
                                    }
                                }
                            }
                        }
                    }
                    quad.update();
                }
            }
        }
    }
}
