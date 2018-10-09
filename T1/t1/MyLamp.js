/**
 * MyLamp
 * @constructor
 */
class MyLamp extends CGFobject {
    constructor(scene, slices, stacks) {
        super(scene);

        this.slices = slices;
        this.stacks = stacks;

        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        this.initBuffers();
    };

    initBuffers() {

        /* Starts deploying side to side triangles on the first stack;
             Following stacks are pairs of complementary triangles.
             (obs: if stacks = 1 => cone/pyramid) */

        // Y-axis oriented
        this.vertices.push(0, 1, 0);
        this.normals.push(0, 1, 0);
        this.texCoords.push(0.5, 0.5);
        for(let t = 1; t <= this.stacks; t++) {
            let theta = (t/this.stacks)*(Math.PI/2);

            for(let p = 0; p < this.slices; p++) {
                let phi = (p/this.slices)*2*Math.PI;

                this.vertices.push(
                    Math.sin(theta)*Math.cos(phi),
                    Math.cos(theta),
                    Math.sin(theta)*Math.sin(phi)
                );

                this.texCoords.push(
                    Math.cos(phi) + 0.5, Math.sin(phi) + 0.5
                );

                this.normals.push(
                    Math.sin(theta)*Math.cos(phi),
                    Math.cos(theta),
                    Math.sin(theta)*Math.sin(phi)
                );

                if(t === 1) {
                    // 1 triangles
                    if(p === this.slices - 1) {
                        this.indices.push(
                            0,
                            p + 2 - this.slices,
                            p + 1
                        );
                    } else {
                        this.indices.push(
                            0,
                            p + 2,
                            p + 1
                        );
                    }
                } else {
                    // 2 triangles
                    if(p === this.slices - 1) {
                        this.indices.push(
                            p + 1 + (t-2)*this.slices,
                            p + 2 + (t-2)*this.slices,
                            p + 1 + (t-1)*this.slices
                        );
                        this.indices.push(
                            p + 2 + (t-2)*this.slices,
                            p + 1 + (t-2)*this.slices,
                            p + 2 + (t-3)*this.slices
                        );
                    } else {
                        this.indices.push(
                            p + 1 + (t-2)*this.slices,
                            p + 2 + (t-1)*this.slices,
                            p + 1 + (t-1)*this.slices
                        );
                        this.indices.push(
                            p + 2 + (t-1)*this.slices,
                            p + 1 + (t-2)*this.slices,
                            p + 2 + (t-2)*this.slices
                        );
                    }
                }
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    };
}
