/**
 * Terrain
 * @constructor
 */
class Terrain extends Plane {
	constructor(scene, idTexture, idHeightMap, heightscale = 1, nParts = 50) {
        super(scene, nParts, nParts);

        this.dimension = nParts;

        this.texture = this.scene.textures[idTexture].texture;
        this.heightMap = this.scene.textures[idHeightMap].texture;
        
        this.shader = new CGFshader(this.scene.gl, "shaders/terrain.vert", "shaders/terrain.frag");

        // will have to bind texture to 1 later on
        this.shader.setUniformsValues({ uSampler2: 1, normScale: heightscale });
    }

    display () {
        this.scene.setActiveShader(this.shader);
        this.scene.pushMatrix();

        this.heightMap.bind(0);  // uSampler is already assigned to texture 0 by default
        this.texture.bind(1);    // uSampler2 was assigned to 1 in constructor

        this.scene.scale(this.dimension, 1, this.dimension);

        super.display();

        this.scene.popMatrix();
        this.scene.setActiveShader(this.scene.defaultShader);
    }
}
