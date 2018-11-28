attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

varying vec2 vTextureCoord;
uniform sampler2D uSampler;		// height map

uniform float heightScale;
uniform float timeTexCoord;

float calculateHeight(vec3 rgb) {
	return (rgb.r + rgb.g + rgb.b);
}

void main() {
	vTextureCoord = aTextureCoord + vec2(timeTexCoord, timeTexCoord);

	vec4 color = texture2D(uSampler, aTextureCoord + vec2(timeTexCoord, timeTexCoord));

	vec3 offset = vec3(0.0, calculateHeight(color.rgb) * heightScale, 0.0);

	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition + offset, 1.0);
}