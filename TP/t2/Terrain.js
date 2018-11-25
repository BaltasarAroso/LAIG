/**
 * Terrain
 * @constructor
 */
class Terrain extends Plane {
	constructor(scene, idTexture, idHeightMap, nParts = 50) {
        super(scene, nParts, nParts);

        this.idTexture = idTexture;
        this.idHeightMap = idHeightMap;
        this.nParts = nParts;

        this.texture = this.scene.textures[idTexture].texture;
        this.heightMap = this.scene.textures[idHeightMap].texture;
        
        this.shader = new CGFshader(this.scene.gl, "shaders/terrain.vert", "shaders/terrain.frag");

        // will have to bind texture to 1 later on
        this.shader.setUniformsValues({ uSampler2: 1, normScale: 3.5 });
    }

    display () {
        this.scene.setActiveShader(this.shader);
        this.scene.pushMatrix();

        this.heightMap.bind(0);  // uSampler is already assigned to texture 0 by default
        this.texture.bind(1);    // uSampler2 was assigned to 1 in constructor

        this.scene.scale(this.nParts, 1, this.nParts);

        super.display();

        this.scene.popMatrix();
        this.scene.setActiveShader(this.scene.defaultShader);
    }
}
