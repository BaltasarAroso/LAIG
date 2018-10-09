/**
 * MyCylinder
 * @constructor
 */
class MyCylinder extends CGFobject {
    constructor(scene, slices, stacks) {
        super(scene);

        this.slices = slices;
        this.stacks = stacks;

        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        this.angle = 2*Math.PI/this.slices;

        this.initBuffers();
    };

    initBuffers() {

        for(let z = 0; z <= this.stacks; z++) {
            for(let i = 0; i < this.slices; i++) {

                this.vertices.push(
                    Math.cos(i*this.angle),
                    Math.sin(i*this.angle),
                    z/this.stacks
                );

                //PL4 - extra
                this.texCoords.push(((i % 2 === 0) ? 0 : 1), z/this.stacks);

                if(z > 0) {
                    if(i === this.slices - 1) {
                        this.indices.push(
                            i + (z-1)*this.slices,
                            i + 1 +(z-2)*this.slices,
                            i + z*this.slices
                        );

                        this.indices.push(
                            i + 1 + (z-1)*this.slices,
                            i + z*this.slices,
                            i + 1 + (z-2)*this.slices
                        );
                    } else {
                        this.indices.push(
                            i + (z-1)*this.slices,
                            i + 1 + (z-1)*this.slices,
                            i + z*this.slices
                        );

                        this.indices.push(
                            i + 1 + z*this.slices,
                            i + z*this.slices,
                            i + 1 + (z-1)*this.slices
                        );
                    }
                }

                this.normals.push(
                    Math.cos(i*this.angle),
                    Math.sin(i*this.angle),
                    0
                );

            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    };
}
