#ifdef GL_ES
precision highp float;
#endif

attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

varying vec2 vTextureCoord;
uniform sampler2D uSampler;		// height map
uniform sampler2D uSampler2;	// actual texture

uniform float normScale;

float calculateHeight(vec3 rgb) {
	return (rgb.r + rgb.g + rgb.b);
}

void main() {
	vTextureCoord = aTextureCoord;

	vec4 color = texture2D(uSampler, aTextureCoord);

	vec3 offset = vec3(0.0, calculateHeight(color.rgb) * normScale, 0.0);

	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition + offset, 1.0);
}