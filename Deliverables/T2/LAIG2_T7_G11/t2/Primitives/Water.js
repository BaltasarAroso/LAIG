/**
 * Water
 * @constructor
 */
class Water extends Plane {
	constructor(scene, idTexture, idWaveMap, heightscale = 1, nParts = 75, texscale = 1) {
        super(scene, nParts, nParts);

        this.dimension = nParts;
        this.texScale = texscale;

        this.texture = this.scene.textures[idTexture].texture;
        this.waveMap = this.scene.textures[idWaveMap].texture;
        
        this.shader = new CGFshader(this.scene.gl, 'shaders/water.vert', 'shaders/water.frag');

        // will have to bind texture to 1 later on
        this.shader.setUniformsValues({ uSampler2: 1, heightScale: heightscale });
    }

    update () {
        var time = new Date().getTime();
        
        var timeFactor = time % (this.texture.image.height * this.texScale);  // [0; height * texScale]; e.g.: [0; 512 * 1.0]
        timeFactor = timeFactor / (this.texture.image.height * this.texScale);  // normalize in [0; 1]

        this.shader.setUniformsValues({ timeTexCoord: timeFactor });
    }

    display () {
        this.scene.setActiveShader(this.shader);
        this.scene.pushMatrix();

        this.waveMap.bind(0);  // uSampler is already assigned to texture 0 by default
        this.texture.bind(1);    // uSampler2 was assigned to 1 in constructor

        this.scene.scale(this.dimension, 1, this.dimension);

        super.display();

        this.scene.popMatrix();
        this.scene.setActiveShader(this.scene.defaultShader);
    }
}
