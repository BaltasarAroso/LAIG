#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;

uniform sampler2D uSampler;		// height map
uniform sampler2D uSampler2;	// actual texture

void main() {    
	gl_FragColor = texture2D(uSampler2, vTextureCoord);
}
