var DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
const SCENE_INDEX = 0;
const VIEWS_INDEX = 1;
const AMBIENT_INDEX = 2;
const LIGHTS_INDEX = 3;
const TEXTURES_INDEX = 4;
const MATERIALS_INDEX = 5;
const TRANSFORMATIONS_INDEX = 6;
const ANIMATIONS_INDEX = 7;
const PRIMITIVES_INDEX = 8;
const COMPONENTS_INDEX = 9;

/**
 * MySceneGraph class, representing the scene graph.
 */
class MySceneGraph {
	/**
	 * @constructor
	 */
	constructor(filename, scene) {
		this.loadedOk = null;

		// Establish bidirectional references between scene and graph.
		this.scene = scene;
		scene.graph = this;

		this.nodes = [];

		this.rootId = null; // The id of the root element.

		// File reading
		this.reader = new CGFXMLreader();

		/*
         * Read the contents of the xml file, and refer to this class for loading and error handlers.
         * After the file is read, the reader calls onXMLReady on this object.
         * If any error occurs, the reader calls onXMLError on this object, with an error message
         */

		this.reader.open('scenes/' + filename, this);
	}

	/*
     * Callback to be executed after successful reading
     */
	onXMLReady() {
		this.log('XML Loading finished.');
		var rootElement = this.reader.xmlDoc.documentElement;

		// Here should go the calls for different functions to parse the various blocks
		var error = this.parseXMLFile(rootElement);

		if (error != null) {
			this.onXMLError(error);
			return;
		}

		this.loadedOk = true;

		// As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
		this.scene.onGraphLoaded();
	}

	/**
	 * Parses the XML file, processing each block.
	 * @param {XML root element} rootElement
	 */
	parseXMLFile(rootElement) {
		if (!rootElement.nodeName.match(/yas/i)) return 'Root tag <YAS> missing';

		let nodes = rootElement.children;

		// Reads the names of the nodes to an auxiliary buffer.
		let nodeNames = [];

		for (let i = 0; i < nodes.length; i++) {
			nodeNames.push(nodes[i].nodeName.toUpperCase());
		}

		let error;

		// Processes each node, verifying errors.

		// <SCENE>
		let index;
		if ((index = nodeNames.indexOf('SCENE')) == -1) {
			return 'Block <SCENE> missing';
		} else {
			if (index != SCENE_INDEX) {
				this.onXMLMinorError('Tag <SCENE> out of order');
			}

			//Parse SCENE block
			if ((error = this.parseScene(nodes[index])) != null) {
				return error;
			}
		}

		// <VIEWS>
		if ((index = nodeNames.indexOf('VIEWS')) == -1) {
			return 'Block <VIEWS> missing';
		} else {
			if (index != VIEWS_INDEX) {
				this.onXMLMinorError('Block <VIEWS> out of order');
			}

			//Parse VIEWS block
			if ((error = this.parseViews(nodes[index])) != null) {
				return error;
			}
		}

		// <AMBIENT>
		if ((index = nodeNames.indexOf('AMBIENT')) == -1) {
			return 'Block <AMBIENT> missing';
		} else {
			if (index != AMBIENT_INDEX) {
				this.onXMLMinorError('Block <AMBIENT> out of order');
			}

			//Parse AMBIENT block
			if ((error = this.parseAmbient(nodes[index])) != null) {
				return error;
			}
		}

		// <LIGHTS>
		if ((index = nodeNames.indexOf('LIGHTS')) == -1) {
			return 'Block <LIGHTS> missing';
		} else {
			if (index != LIGHTS_INDEX) {
				this.onXMLMinorError('Block <LIGHTS> out of order');
			}

			//Parse LIGHTS block
			if ((error = this.parseLights(nodes[index])) != null) {
				return error;
			}
		}

		// <TEXTURES>
		if ((index = nodeNames.indexOf('TEXTURES')) == -1) {
			return 'Block <TEXTURES> missing';
		} else {
			if (index != TEXTURES_INDEX) {
				this.onXMLMinorError('Block <TEXTURES> out of order');
			}

			//Parse TEXTURES block
			if ((error = this.parseTextures(nodes[index])) != null) {
				return error;
			}
		}

		// <MATERIALS>
		if ((index = nodeNames.indexOf('MATERIALS')) == -1) {
			return 'Block <MATERIALS> missing';
		} else {
			if (index != MATERIALS_INDEX) {
				this.onXMLMinorError('Block <MATERIALS> out of order');
			}

			//Parse MATERIALS block
			if ((error = this.parseMaterials(nodes[index])) != null) {
				return error;
			}
		}

		// <TRANSFORMATIONS>
		if ((index = nodeNames.indexOf('TRANSFORMATIONS')) == -1) {
			return 'Block <TRANSFORMATIONS> missing';
		} else {
			if (index != TRANSFORMATIONS_INDEX) {
				this.onXMLMinorError('Block <TRANSFORMATIONS> out of order');
			}

			//Parse TRANSFORMATIONS block
			if ((error = this.parseTransformations(nodes[index])) != null) {
				return error;
			}
		}

		// <ANIMATIONS>
		if ((index = nodeNames.indexOf('ANIMATIONS')) == -1) {
			return 'Block <ANIMATIONS> missing';
		} else {
			if (index != ANIMATIONS_INDEX) {
				this.onXMLMinorError('Block <ANIMATIONS> out of order');
			}

			//Parse ANIMATIONS block
			if ((error = this.parseAnimations(nodes[index])) != null) {
				return error;
			}
		}

		// <PRIMITIVES>
		if ((index = nodeNames.indexOf('PRIMITIVES')) == -1) {
			return 'Block <PRIMITIVES> missing';
		} else {
			if (index != PRIMITIVES_INDEX) {
				this.onXMLMinorError('Block <PRIMITIVES> out of order');
			}

			//Parse PRIMITIVES block
			if ((error = this.parsePrimitives(nodes[index])) != null) {
				return error;
			}
		}

		// <COMPONENTS>
		if ((index = nodeNames.indexOf('COMPONENTS')) == -1) {
			return 'Block <COMPONENTS> missing';
		} else {
			if (index != COMPONENTS_INDEX) {
				this.onXMLMinorError('Block <COMPONENTS> out of order');
			}

			//Parse COMPONENTS block
			if ((error = this.parseComponents(nodes[index])) != null) {
				return error;
			}
		}
	}

	/**
	 * Parses the <SCENE> block.
	 * @param {scene block element} sceneNode
	 */
	parseScene(sceneNode) {
		if (sceneNode.attributes.getNamedItem('root') == null) {
			return 'Missing root attribute in <SCENE> block';
		}
		this.rootId = sceneNode.attributes.getNamedItem('root').value;

		if (sceneNode.attributes.getNamedItem('axis_length') == null) {
			this.axis_length = 5.0;
			this.onXMLMinorError(
				"Missing 'axis_length' attribute in <SCENE> block. Defaulting to 5.0"
			);

			return null;
		}
		this.axis_length = parseFloat(sceneNode.attributes.getNamedItem('axis_length').value);

		this.log('Parsed scene');

		return null;
	}

	/**
	 * Parses the <VIEWS> block.
	 * @param {views block element} viewsNode
	 */
	parseViews(viewsNode) {
		let children = viewsNode.children;
		this.views = {};

		if (viewsNode.children.length === 0) {
			return 'No views defined in <VIEW> block';
		}

		let defaultView = this.reader.getString(viewsNode, 'default');
		if (defaultView == null) {
			this.onXMLMinorError(
				'No default view defined in <VIEW> block. Using default view only'
			);
			return null;
		}
		this.defaultView = defaultView;

		if (children.length === 0) {
			this.onXMLMinorError('No views defined in <VIEW> block. Using default view only');
			return null;
		}

		for (let i = 0; i < children.length; i++) {
			let view = {};
			let type = children[i].nodeName;

			let name = this.reader.getString(children[i], 'id');
			if (name == null) {
				this.onXMLMinorError('A camera with no name was found in the <VIEWS> block');
				continue;
			}
			view.name = name;

			let near = this.reader.getFloat(children[i], 'near');
			if (near == null) {
				this.onXMLMinorError(
					"A camera with no 'near' attribute was found in the <VIEWS> block. Using default value"
				);
				near = 0.1;
			}
			view.near = near;

			let far = this.reader.getFloat(children[i], 'far');
			if (far == null) {
				this.onXMLMinorError(
					"A camera with no 'near' attribute was found in the <VIEWS> block. Using default value"
				);
				far = 999;
			}
			view.far = far;

			if (type.match(/perspective/i)) {
				view.type = 'perspective';

				let angle = this.reader.getFloat(children[i], 'angle');
				if (angle == null) {
					this.onXMLMinorError(
						"A camera with no 'angle' attribute was found in the <VIEWS> block. Using default value"
					);
					angle = 0.4;
				}
				view.angle = angle;
			} else if (type.match(/ortho/i)) {
				view.type = 'ortho';

				let left = this.reader.getFloat(children[i], 'left');
				if (left == null) {
					this.onXMLMinorError(
						"A camera with no 'left' attribute was found in the <VIEWS> block. Using default value"
					);
					left = -100;
				}
				view.left = left;

				let right = this.reader.getFloat(children[i], 'right');
				if (right == null) {
					this.onXMLMinorError(
						"A camera with no 'right' attribute was found in the <VIEWS> block. Using default value"
					);
					right = 100;
				}
				view.right = right;

				let bottom = this.reader.getFloat(children[i], 'bottom');
				if (bottom == null) {
					this.onXMLMinorError(
						"A camera with no 'bottom' attribute was found in the <VIEWS> block. Using default value"
					);
					bottom = -100;
				}
				view.bottom = bottom;

				let top = this.reader.getFloat(children[i], 'top');
				if (top == null) {
					this.onXMLMinorError(
						"A camera with no 'top' attribute was found in the <VIEWS> block. Using default value"
					);
					top = 100;
				}
				view.top = top;

				view.up = { x: 0, y: 1, z: 0 };
			}

			let grandChildren = children[i].children;

			let nodeNames = [];
			for (let j = 0; j < grandChildren.length; j++) {
				nodeNames.push(grandChildren[j].nodeName.toUpperCase());
			}

			view.to = {};

			if (nodeNames.indexOf('TO') === -1) {
				return 'View number ' + nodeNames.indexOf('TO') + " is missing the 'to' attribute";
			} else {
				let x = this.reader.getFloat(grandChildren[nodeNames.indexOf('TO')], 'x');
				if (x == null) {
					this.onXMLMinorError(
						"A camera with no 'x' component in the 'to' attribute was found in the <VIEWS> block. Using default value"
					);
					x = 0;
				}
				view.to.x = x;

				let y = this.reader.getFloat(grandChildren[nodeNames.indexOf('TO')], 'y');
				if (y == null) {
					this.onXMLMinorError(
						"A camera with no 'y' component in the 'to' attribute was found in the <VIEWS> block. Using default value"
					);
					y = 0;
				}
				view.to.y = y;

				let z = this.reader.getFloat(grandChildren[nodeNames.indexOf('TO')], 'z');
				if (z == null) {
					this.onXMLMinorError(
						"A camera with no 'z' component in the 'to' attribute was found in the <VIEWS> block. Using default value"
					);
					z = 0;
				}
				view.to.z = z;
			}

			view.from = {};

			if (nodeNames.indexOf('FROM') === -1) {
				return (
					'View number ' + nodeNames.indexOf('FROM') + " is missing the 'from' attribute"
				);
			} else {
				let x = this.reader.getFloat(grandChildren[nodeNames.indexOf('FROM')], 'x');
				if (x == null) {
					this.onXMLMinorError(
						"A camera with no 'x' component in the 'from' attribute was found in the <VIEWS> block. Using default value"
					);
					x = 100;
				}
				view.from.x = x;

				let y = this.reader.getFloat(grandChildren[nodeNames.indexOf('FROM')], 'y');
				if (y == null) {
					this.onXMLMinorError(
						"A camera with no 'y' component in the 'from' attribute was found in the <VIEWS> block. Using default value"
					);
					y = 40;
				}
				view.from.y = y;

				let z = this.reader.getFloat(grandChildren[nodeNames.indexOf('FROM')], 'z');
				if (z == null) {
					this.onXMLMinorError(
						"A camera with no 'z' component in the 'from' attribute was found in the <VIEWS> block. Using default value"
					);
					z = 100;
				}
				view.from.z = z;
			}

			this.views[name] = view;
		}

		this.log('Parsed views');

		return null;
	}

	/**
	 * Parses the <AMBIENT> block.
	 * @param {ambient block element} ambientNode
	 */
	parseAmbient(ambientNode) {
		this.ambient = {};

		let children = ambientNode.children;
		let nodeNames = [];

		let ambient = { r: 0.2, g: 0.2, b: 0.2, a: 1 };
		let background = { r: 0, g: 0, b: 0, a: 1 };

		for (let i = 0; i < children.length; i++) {
			nodeNames.push(children[i].nodeName.toUpperCase());
		}

		let ambientIndex = nodeNames.indexOf('AMBIENT');
		let backgroundIndex = nodeNames.indexOf('BACKGROUND');

		if (ambientIndex !== -1) {
			let r = this.reader.getFloat(children[ambientIndex], 'r');
			let g = this.reader.getFloat(children[ambientIndex], 'g');
			let b = this.reader.getFloat(children[ambientIndex], 'b');
			let a = this.reader.getFloat(children[ambientIndex], 'a');

			r != null && !isNaN(r) && r >= 0 && r <= 1
				? (ambient.r = r)
				: this.onXMLMinorError(
						"No valid 'r' component found in 'ambient' node of <AMBIENT> block. Using " +
							ambient.r
				  );

			g != null && !isNaN(g) && g >= 0 && g <= 1
				? (ambient.g = g)
				: this.onXMLMinorError(
						"No valid 'g' component found in 'ambient' node of <AMBIENT> block. Using " +
							ambient.g
				  );

			b != null && !isNaN(b) && b >= 0 && b <= 1
				? (ambient.b = b)
				: this.onXMLMinorError(
						"No valid 'b' component found in 'ambient' node of <AMBIENT> block. Using " +
							ambient.b
				  );

			a != null && !isNaN(a) && a >= 0 && a <= 1
				? (ambient.a = a)
				: this.onXMLMinorError(
						"No valid 'a' component found in 'ambient' node of <AMBIENT> block. Using " +
							ambient.a
				  );
		} else {
			this.onXMLMinorError("No 'ambient' node found in <AMBIENT> block. Using default");
		}

		if (backgroundIndex !== -1) {
			let r = this.reader.getFloat(children[backgroundIndex], 'r');
			let g = this.reader.getFloat(children[backgroundIndex], 'g');
			let b = this.reader.getFloat(children[backgroundIndex], 'b');
			let a = this.reader.getFloat(children[backgroundIndex], 'a');

			r != null && !isNaN(r) && r >= 0 && r <= 1
				? (background.r = r)
				: this.onXMLMinorError(
						"No valid 'r' component found in 'background' node of <AMBIENT> block. Using " +
							background.r
				  );

			g != null && !isNaN(g) && g >= 0 && g <= 1
				? (background.g = g)
				: this.onXMLMinorError(
						"No valid 'g' component found in 'background' node of <AMBIENT> block. Using " +
							background.g
				  );

			b != null && !isNaN(b) && b >= 0 && b <= 1
				? (background.b = b)
				: this.onXMLMinorError(
						"No valid 'b' component found in 'background' node of <AMBIENT> block. Using " +
							background.b
				  );

			a != null && !isNaN(a) && a >= 0 && a <= 1
				? (background.a = a)
				: this.onXMLMinorError(
						"No valid 'a' component found in 'background' node of <AMBIENT> block. Using " +
							background.a
				  );
		} else {
			this.onXMLMinorError("No 'background' node found in <AMBIENT> block. Using default");
		}

		this.ambient.ambient = ambient;
		this.ambient.background = background;

		this.log('Parsed illumination');

		return null;
	}

	/**
	 * Parses the <LIGHTS> node.
	 * @param {lights block element} lightsNode
	 */
	parseLights(lightsNode) {
		let children = lightsNode.children;

		this.lights = []; // associative array of lights

		if (children.length === 0)
			return 'No nodes found in the <LIGHTS> block. At least one light must be defined';

		if (children.length > 8)
			this.onXMLMinorError('Only 8 lights allowed by WebGL. Parsing first 8 lights only');

		for (let i = 0; i < children.length && i < 8; i++) {
			let lightType = children[i].nodeName;

			if (lightType.match(/omni/i) || lightType.match(/spot/i)) {
				let light = {};

				// Get ID
				let lightId = this.reader.getString(children[i], 'id');
				if (lightId == null) return 'A node with no ID was found in the <LIGHTS> block';

				// Check if ID is duplicate
				if (this.lights[lightId] != null) {
					return (
						"A node with a duplicate ID was found in the <LIGHTS> block ('" +
						lightId +
						"')"
					);
				}

				light.type = lightType.toLowerCase();

				// Parse 'enabled' attribute
				let enabled = true;

				if (children[i].attributes.getNamedItem('enabled') == null) {
					this.onXMLMinorError(
						"Attribute 'enabled' missing for node '" +
							lightId +
							"' in the <LIGHTS> block. Setting light enabled as default"
					);
				} else {
					enabled = this.reader.getInteger(children[i], 'enabled');

					if (enabled == null || isNaN(enabled) || enabled < 0 || enabled > 1) {
						this.onXMLMinorError(
							"Invalid 'enabled' attribute in the <LIGHTS> block (light ID: '" +
								lightId +
								"')"
						);
						enabled = true;
					} else {
						enabled === 1 ? (light.enabled = true) : (light.enabled = false);
						// light.enabled = enabled;
					}
				}

				// Check if light is 'spot'
				if (lightType.match(/spot/i)) {
					// Parse 'angle' attribute
					let angle = this.reader.getFloat(children[i], 'angle');

					if (angle == null || isNaN(angle) || angle < 0) {
						this.onXMLMinorError(
							"Invalid 'angle' attribute in the <LIGHTS> block (light ID: '" +
								lightId +
								"')"
						);
						angle = 5.0;
					}
					light.angle = angle;

					// Parse 'exponent' attribute
					let exponent = 1.0;

					if (children[i].attributes.getNamedItem('exponent') == null) {
						this.onXMLMinorError(
							"Attribute 'exponent' missing for node '" +
								lightId +
								"' in the <LIGHTS> block. Setting light exponent as " +
								exponent
						);
					} else {
						exponent = this.reader.getFloat(children[i], 'exponent');

						if (exponent == null || isNaN(exponent) || exponent < 0) {
							this.onXMLMinorError(
								"Invalid 'exponent' attribute in the <LIGHTS> block (light ID: '" +
									lightId +
									"')"
							);
							exponent = 1.0;
						} else {
							light.exponent = exponent;
						}
					}
				}

				let grandChildren = children[i].children;
				let nodeNames = [];

				for (let j = 0; j < grandChildren.length; j++) {
					nodeNames.push(grandChildren[j].nodeName.toUpperCase());
				}

				let locationIndex = nodeNames.indexOf('LOCATION');
				let ambientIndex = nodeNames.indexOf('AMBIENT');
				let diffuseIndex = nodeNames.indexOf('DIFFUSE');
				let specularIndex = nodeNames.indexOf('SPECULAR');
				let targetIndex = nodeNames.indexOf('TARGET'); // 'spot' lights only

				// Parse 'location' node
				if (locationIndex === -1) {
					return "Location component undefined for light '" + lightId + "'";
				} else {
					light.location = {};

					let x = this.reader.getFloat(grandChildren[locationIndex], 'x');
					let y = this.reader.getFloat(grandChildren[locationIndex], 'y');
					let z = this.reader.getFloat(grandChildren[locationIndex], 'z');
					let w = this.reader.getFloat(grandChildren[locationIndex], 'w');

					if (x != null && !isNaN(x)) light.location.x = x;
					else
						return (
							"No valid 'x' component found in 'location' node of light '" +
							lightId +
							"'"
						);

					if (y != null && !isNaN(y)) light.location.y = y;
					else
						return (
							"No valid 'y' component found in 'location' node of light '" +
							lightId +
							"'"
						);

					if (z != null && !isNaN(z)) light.location.z = z;
					else
						return (
							"No valid 'z' component found in 'location' node of light '" +
							lightId +
							"'"
						);

					if (w != null && !isNaN(w)) light.location.w = w;
					else
						return (
							"No valid 'w' component found in 'location' node of light '" +
							lightId +
							"'"
						);
				}

				// Parse 'ambient' node
				if (ambientIndex === -1) {
					return "Ambient component undefined for light '" + lightId + "'";
				} else {
					light.ambient = {};

					let r = this.reader.getFloat(grandChildren[ambientIndex], 'r');
					let g = this.reader.getFloat(grandChildren[ambientIndex], 'g');
					let b = this.reader.getFloat(grandChildren[ambientIndex], 'b');
					let a = this.reader.getFloat(grandChildren[ambientIndex], 'a');

					if (r != null && !isNaN(r) && r >= 0 && r <= 1) light.ambient.r = r;
					else
						return (
							"No valid 'r' component found in 'ambient' node of light '" +
							lightId +
							"'"
						);

					if (g != null && !isNaN(g) && g >= 0 && g <= 1) light.ambient.g = g;
					else
						return (
							"No valid 'g' component found in 'ambient' node of light '" +
							lightId +
							"'"
						);

					if (b != null && !isNaN(b) && b >= 0 && b <= 1) light.ambient.b = b;
					else
						return (
							"No valid 'b' component found in 'ambient' node of light '" +
							lightId +
							"'"
						);

					if (a != null && !isNaN(a) && a >= 0 && a <= 1) light.ambient.a = a;
					else
						return (
							"No valid 'a' component found in 'ambient' node of light '" +
							lightId +
							"'"
						);
				}

				// Parse 'diffuse' node
				if (diffuseIndex === -1) {
					return "Diffuse component undefined for light '" + lightId + "'";
				} else {
					light.diffuse = {};

					let r = this.reader.getFloat(grandChildren[diffuseIndex], 'r');
					let g = this.reader.getFloat(grandChildren[diffuseIndex], 'g');
					let b = this.reader.getFloat(grandChildren[diffuseIndex], 'b');
					let a = this.reader.getFloat(grandChildren[diffuseIndex], 'a');

					if (r != null && !isNaN(r) && r >= 0 && r <= 1) light.diffuse.r = r;
					else
						return (
							"No valid 'r' component found in 'diffuse' node of light '" +
							lightId +
							"'"
						);

					if (g != null && !isNaN(g) && g >= 0 && g <= 1) light.diffuse.g = g;
					else
						return (
							"No valid 'g' component found in 'diffuse' node of light '" +
							lightId +
							"'"
						);

					if (b != null && !isNaN(b) && b >= 0 && b <= 1) light.diffuse.b = b;
					else
						return (
							"No valid 'b' component found in 'diffuse' node of light '" +
							lightId +
							"'"
						);

					if (a != null && !isNaN(a) && a >= 0 && a <= 1) light.diffuse.a = a;
					else
						return (
							"No valid 'a' component found in 'diffuse' node of light '" +
							lightId +
							"'"
						);
				}

				// Parse 'specular' node
				if (specularIndex === -1) {
					return "Specular component undefined for light '" + lightId + "'";
				} else {
					light.specular = {};

					let r = this.reader.getFloat(grandChildren[specularIndex], 'r');
					let g = this.reader.getFloat(grandChildren[specularIndex], 'g');
					let b = this.reader.getFloat(grandChildren[specularIndex], 'b');
					let a = this.reader.getFloat(grandChildren[specularIndex], 'a');

					if (r != null && !isNaN(r) && r >= 0 && r <= 1) light.specular.r = r;
					else
						return (
							"No valid 'r' component found in 'specular' node of light '" +
							lightId +
							"'"
						);

					if (g != null && !isNaN(g) && g >= 0 && g <= 1) light.specular.g = g;
					else
						return (
							"No valid 'g' component found in 'specular' node of light '" +
							lightId +
							"'"
						);

					if (b != null && !isNaN(b) && b >= 0 && b <= 1) light.specular.b = b;
					else
						return (
							"No valid 'b' component found in 'specular' node of light '" +
							lightId +
							"'"
						);

					if (a != null && !isNaN(a) && a >= 0 && a <= 1) light.specular.a = a;
					else
						return (
							"No valid 'a' component found in 'specular' node of light '" +
							lightId +
							"'"
						);
				}

				// Parse 'target' node if dealing with a 'spot' type light
				if (lightType === 'SPOT') {
					if (targetIndex === -1) {
						return "Target component undefined for light '" + lightId + "'";
					} else {
						light.target = {};

						let x = this.reader.getFloat(grandChildren[targetIndex], 'x');
						let y = this.reader.getFloat(grandChildren[targetIndex], 'y');
						let z = this.reader.getFloat(grandChildren[targetIndex], 'z');

						if (x != null && !isNaN(x)) light.target.x = x;
						else
							return (
								"No valid 'x' component found in 'location' node of light '" +
								lightId +
								"'"
							);

						if (y != null && !isNaN(y)) light.target.y = y;
						else
							return (
								"No valid 'y' component found in 'location' node of light '" +
								lightId +
								"'"
							);

						if (z != null && !isNaN(z)) light.target.z = z;
						else
							return (
								"No valid 'z' component found in 'location' node of light '" +
								lightId +
								"'"
							);
					}
				}

				this.lights[lightId] = light;
			} else {
				this.onXMLMinorError(
					"An invalid tag ('" +
						children[i].nodeName +
						"') was found in the <LIGHTS> block"
				);
			}
		}

		this.log('Parsed lights');

		return null;
	}

	/**
	 * Parses the <TEXTURES> block.
	 * @param {textures block element} texturesNode
	 */
	parseTextures(texturesNode) {
		this.textures = [];

		let children = texturesNode.children;

		for (let i = 0; i < children.length; i++) {
			// Get ID
			let texId = this.reader.getString(children[i], 'id');
			if (texId == null) return 'A node with no ID was found in the <TEXTURES> block';

			// Check if ID is duplicate
			if (this.textures[texId] != null)
				return (
					"A node with a duplicate ID was found in the <TEXTURES> block ('" + texId + "')"
				);

			// Get file path
			let path = this.reader.getString(children[i], 'file');
			if (path == null) {
				return (
					"A node with no file path was found in the <TEXTURES> block ('" + texId + "')"
				);
			}

			this.textures[texId] = path;
		}

		this.log('Parsed textures');

		return null;
	}

	/**
	 * Parses the <MATERIALS> node.
	 * @param {materials block element} materialsNode
	 */
	parseMaterials(materialsNode) {
		this.materials = [];
		let children = materialsNode.children;

		if (children.length === 0) {
			return 'No materials found in the <MATERIALS> block';
		}

		for (let i = 0; i < children.length; i++) {
			let material = {};

			// Get ID
			let matId = this.reader.getString(children[i], 'id');
			if (matId == null) return 'A node with no ID was found in the <MATERIALS> block';

			// Check if ID is duplicate
			if (this.materials[matId] != null)
				return (
					"A node with a duplicate ID was found in the <MATERIALS> block ('" +
					matId +
					"')"
				);

			// Parse shininess
			let shininess = 1.0;

			if (children[i].attributes.getNamedItem('shininess') == null) {
				this.onXMLMinorError(
					"Attribute 'shininess' missing for node '" +
						matId +
						"' in the <MATERIALS> block. Using value " +
						shininess
				);
			} else {
				shininess = this.reader.getFloat(children[i], 'shininess');

				if (shininess == null || isNaN(shininess) || shininess < 0) {
					this.onXMLMinorError(
						"Invalid 'shininess' attribute in the <MATERIALS> block (material ID: '" +
							matId +
							"')"
					);
					shininess = 1;
				} else {
					material.shininess = shininess;
				}
			}

			let grandChildren = children[i].children;
			let nodeNames = [];

			for (let j = 0; j < grandChildren.length; j++) {
				nodeNames.push(grandChildren[j].nodeName.toUpperCase());
			}

			let emissionIndex = nodeNames.indexOf('EMISSION');
			let ambientIndex = nodeNames.indexOf('AMBIENT');
			let diffuseIndex = nodeNames.indexOf('DIFFUSE');
			let specularIndex = nodeNames.indexOf('SPECULAR');

			// Parse 'emission' node
			if (emissionIndex === -1) {
				return "Emission component undefined for material '" + matId + "'";
			} else {
				material.emission = {};

				let r = this.reader.getFloat(grandChildren[emissionIndex], 'r');
				let g = this.reader.getFloat(grandChildren[emissionIndex], 'g');
				let b = this.reader.getFloat(grandChildren[emissionIndex], 'b');
				let a = this.reader.getFloat(grandChildren[emissionIndex], 'a');

				if (r != null && !isNaN(r) && r >= 0 && r <= 1) material.emission.r = r;
				else
					return (
						"No valid 'r' component found in 'emission' node of material '" +
						matId +
						"'"
					);

				if (g != null && !isNaN(g) && g >= 0 && g <= 1) material.emission.g = g;
				else
					return (
						"No valid 'g' component found in 'emission' node of material '" +
						matId +
						"'"
					);

				if (b != null && !isNaN(b) && b >= 0 && b <= 1) material.emission.b = b;
				else
					return (
						"No valid 'b' component found in 'emission' node of material '" +
						matId +
						"'"
					);

				if (a != null && !isNaN(a) && a >= 0 && a <= 1) material.emission.a = a;
				else
					return (
						"No valid 'a' component found in 'emission' node of material '" +
						matId +
						"'"
					);
			}

			// Parse 'ambient' node
			if (ambientIndex === -1) {
				return "Ambient component undefined for material '" + matId + "'";
			} else {
				material.ambient = {};

				let r = this.reader.getFloat(grandChildren[ambientIndex], 'r');
				let g = this.reader.getFloat(grandChildren[ambientIndex], 'g');
				let b = this.reader.getFloat(grandChildren[ambientIndex], 'b');
				let a = this.reader.getFloat(grandChildren[ambientIndex], 'a');

				if (r != null && !isNaN(r) && r >= 0 && r <= 1) material.ambient.r = r;
				else
					return (
						"No valid 'r' component found in 'ambient' node of material '" + matId + "'"
					);

				if (g != null && !isNaN(g) && g >= 0 && g <= 1) material.ambient.g = g;
				else
					return (
						"No valid 'g' component found in 'ambient' node of material '" + matId + "'"
					);

				if (b != null && !isNaN(b) && b >= 0 && b <= 1) material.ambient.b = b;
				else
					return (
						"No valid 'b' component found in 'ambient' node of material '" + matId + "'"
					);

				if (a != null && !isNaN(a) && a >= 0 && a <= 1) material.ambient.a = a;
				else
					return (
						"No valid 'a' component found in 'ambient' node of material '" + matId + "'"
					);
			}

			// Parse 'diffuse' node
			if (diffuseIndex === -1) {
				return "Diffusion component undefined for material '" + matId + "'";
			} else {
				material.diffuse = {};

				let r = this.reader.getFloat(grandChildren[diffuseIndex], 'r');
				let g = this.reader.getFloat(grandChildren[diffuseIndex], 'g');
				let b = this.reader.getFloat(grandChildren[diffuseIndex], 'b');
				let a = this.reader.getFloat(grandChildren[diffuseIndex], 'a');

				if (r != null && !isNaN(r) && r >= 0 && r <= 1) material.diffuse.r = r;
				else
					return (
						"No valid 'r' component found in 'diffuse' node of material '" + matId + "'"
					);

				if (g != null && !isNaN(g) && g >= 0 && g <= 1) material.diffuse.g = g;
				else
					return (
						"No valid 'g' component found in 'diffuse' node of material '" + matId + "'"
					);

				if (b != null && !isNaN(b) && b >= 0 && b <= 1) material.diffuse.b = b;
				else
					return (
						"No valid 'b' component found in 'diffuse' node of material '" + matId + "'"
					);

				if (a != null && !isNaN(a) && a >= 0 && a <= 1) material.diffuse.a = a;
				else
					return (
						"No valid 'a' component found in 'diffuse' node of material '" + matId + "'"
					);
			}

			// Parse 'specular' node
			if (specularIndex === -1) {
				return "Emission component undefined for material '" + matId + "'";
			} else {
				material.specular = {};

				let r = this.reader.getFloat(grandChildren[specularIndex], 'r');
				let g = this.reader.getFloat(grandChildren[specularIndex], 'g');
				let b = this.reader.getFloat(grandChildren[specularIndex], 'b');
				let a = this.reader.getFloat(grandChildren[specularIndex], 'a');

				if (r != null && !isNaN(r) && r >= 0 && r <= 1) material.specular.r = r;
				else
					return (
						"No valid 'r' component found in 'specular' node of material '" +
						matId +
						"'"
					);

				if (g != null && !isNaN(g) && g >= 0 && g <= 1) material.specular.g = g;
				else
					return (
						"No valid 'g' component found in 'specular' node of material '" +
						matId +
						"'"
					);

				if (b != null && !isNaN(b) && b >= 0 && b <= 1) material.specular.b = b;
				else
					return (
						"No valid 'b' component found in 'specular' node of material '" +
						matId +
						"'"
					);

				if (a != null && !isNaN(a) && a >= 0 && a <= 1) material.specular.a = a;
				else
					return (
						"No valid 'a' component found in 'specular' node of material '" +
						matId +
						"'"
					);
			}

			this.materials[matId] = material;
		}

		this.log('Parsed materials');

		return null;
	}

	/**
	 * Parses the <TRANSFORMATIONS> block.
	 * @param {transformations block element} transformationsNode
	 */
	parseTransformations(transformationsNode) {
		this.transformations = [];
		let children = transformationsNode.children;

		if (children.length === 0) {
			return 'No transformations found in the <TRANSFORMATIONS> block';
		}

		for (let i = 0; i < children.length; i++) {
			let transformation = {};

			// Get ID
			let transformationId = this.reader.getString(children[i], 'id');
			if (transformationId == null) {
				return 'A node with no ID was found in the <TRANSFORMATIONS> block';
			}

			// Check if ID is duplicate
			if (this.transformations[transformationId] != null) {
				return (
					"A node with a duplicate ID was found in the <TRANSFORMATIONS> block ('" +
					transformationId +
					"')"
				);
			}

			let grandChildren = children[i].children;

			if (grandChildren.length === 0) {
				return (
					"A transformation with no instructions was found in the <TRANSFORMATIONS> block ('" +
					transformationId +
					"')"
				);
			}

			transformation.operations = [];

			for (let j = 0; j < grandChildren.length; j++) {
				let op = {};

				if (grandChildren[j].nodeName.match(/translate/i)) {
					// Parse translation

					op.type = 'translate';

					let x = this.reader.getFloat(grandChildren[j], 'x');
					let y = this.reader.getFloat(grandChildren[j], 'y');
					let z = this.reader.getFloat(grandChildren[j], 'z');

					if (x != null && !isNaN(x)) {
						op.x = x;
					} else {
						return (
							"No valid 'x' component found in a 'translate' node (" +
							(j + 1) +
							") of transformation '" +
							transformationId +
							"'"
						);
					}

					if (y != null && !isNaN(y)) {
						op.y = y;
					} else {
						return (
							"No valid 'y' component found in 'translate' node (" +
							(j + 1) +
							") of transformation '" +
							transformationId +
							"'"
						);
					}

					if (z != null && !isNaN(z)) {
						op.z = z;
					} else {
						return (
							"No valid 'z' component found in 'translate' node (" +
							(j + 1) +
							") of transformation '" +
							transformationId +
							"'"
						);
					}
				} else if (grandChildren[j].nodeName.match(/rotate/i)) {
					// Parse rotation

					op.type = 'rotate';

					let axis = this.reader.getString(grandChildren[j], 'axis');
					let angle = this.reader.getFloat(grandChildren[j], 'angle');

					if (
						axis != null &&
						(axis.match(/x/i) || axis.match(/y/i) || axis.match(/z/i))
					) {
						op.axis = axis;
					} else {
						return (
							"No valid 'axis' component found in a 'rotate' node (" +
							(j + 1) +
							") of transformation '" +
							transformationId +
							"'"
						);
					}

					if (angle != null && !isNaN(angle)) {
						op.angle = angle;
					} else {
						return (
							"No valid 'angle' component found in a 'rotate' node (" +
							(j + 1) +
							") of transformation '" +
							transformationId +
							"'"
						);
					}
				} else if (grandChildren[j].nodeName.match(/scale/i)) {
					// Parse scaling

					op.type = 'scale';

					let x = this.reader.getFloat(grandChildren[j], 'x');
					let y = this.reader.getFloat(grandChildren[j], 'y');
					let z = this.reader.getFloat(grandChildren[j], 'z');

					if (x != null && !isNaN(x)) {
						op.x = x;
					} else {
						return (
							"No valid 'x' component found in a 'scale' node (" +
							(j + 1) +
							") of transformation '" +
							transformationId +
							"'"
						);
					}

					if (y != null && !isNaN(y)) {
						op.y = y;
					} else {
						return (
							"No valid 'y' component found in a 'scale' node (" +
							(j + 1) +
							") of transformation '" +
							transformationId +
							"'"
						);
					}

					if (z != null && !isNaN(z)) {
						op.z = z;
					} else {
						return (
							"No valid 'z' component found in a 'scale' node (" +
							(j + 1) +
							") of transformation '" +
							transformationId +
							"'"
						);
					}
				} else {
					// No valid operation was found

					return (
						"An invalid instruction was found in the <TRANSFORMATIONS> block ('" +
						transformationId +
						"': '" +
						grandChildren[j].nodeName +
						"')"
					);
				}

				transformation.operations.push(op);
			}

			this.transformations[transformationId] = transformation;
		}

		this.log('Parsed transformations');
		return null;
	}

	/**
	 * Parses the <ANIMATIONS> block.
	 * @param {animations block element} animationsNode
	 */
	parseAnimations(animationsNode) {
		this.animations = [];
		let children = animationsNode.children;

		for (let i = 0; i < children.length; i++) {
			let animationType = children[i].nodeName;

			if (animationType.match(/linear/i) || animationType.match(/circular/i)) {
				// Get ID
				let animationId = this.reader.getString(children[i], 'id');
				if (animationId == null) {
					return "A node with no ID was found in the <ANIMATIONS> block";
				}

				// Check if ID is duplicate
				if (this.animations[animationId] != null) {
					return (
						"A node with a duplicate ID was found in the <ANIMATIONS> block ('" +
						animationId +
						"')"
					);
				}

				// Parse 'span' attribute
				let span = this.reader.getFloat(children[i], 'span');
				if (span == null || isNaN(span) || span < 0) {
					this.onXMLMinorError(
						"Invalid 'span' attribute in the <ANIMATIONS> block (animation ID: '" +
							animationId +
							"')"
					);
				}

				let animation = {};
				animation.span = span;

				// Check if animation is 'circular'
				if (animationType.match(/circular/i)) {
					animation.type = 'circular';

					// Parse 'center' attribute
					let centerString = this.reader.getString(children[i], 'center');
					let center = [];
					if (centerString == null) {
						this.onXMLMinorError(
							"Invalid 'center' attribute in the <ANIMATIONS> block (animation ID: '" +
								animationId +
								"')"
						);
					} else {
						centerString = centerString.split(' ');
						if (centerString.length != 3) {
							return "Number of fields in 'center' attribute of 'circular' animation wrong.";
						}
						center[0] = parseFloat(centerString[0]);
						center[1] = parseFloat(centerString[1]);
						center[2] = parseFloat(centerString[2]);
						if ((center[0] == null || isNaN(center[0])) ||
							(center[1] == null || isNaN(center[1])) ||
							(center[2] == null || isNaN(center[2])))
						{
							return "One of the fields in 'center' attribute of 'circular' animation is not a number.";
						}
						animation.center = { x: center[0], y: center[1], z: center[2] };
					}

					// Parse 'radius' attribute
					let radius = this.reader.getFloat(children[i], 'radius');
					if (radius == null || isNaN(radius) || radius < 0) {
						this.onXMLMinorError(
							"Invalid 'radius' attribute in the <ANIMATIONS> block (animation ID: '" +
								animationId +
								"')"
						);
					} else {
						animation.radius = radius;
					}

					// Parse 'startang' attribute
					let startang = this.reader.getFloat(children[i], 'startang');
					if (startang == null || isNaN(startang)) {
						this.onXMLMinorError(
							"Invalid 'startang' attribute in the <ANIMATIONS> block (animation ID: '" +
								animationId +
								"')"
						);
					} else {
						animation.startAng = startang;
					}

					// Parse 'rotang' attribute
					let rotang = this.reader.getFloat(children[i], 'rotang');
					if (rotang == null || isNaN(rotang)) {
						this.onXMLMinorError(
							"Invalid 'rotang' attribute in the <ANIMATIONS> block (animation ID: '" +
								animationId +
								"')"
						);
					} else {
						animation.rotAng = rotang;
					}


				} else { // 'linear' animation
					animation.type = 'linear';

					let grandChildren = children[i].children;
					let controlpoints = [];

					if (grandChildren.length < 2) {
						return "Minimum of 2 control points for each linear animation.";
					}

					for (let j = 0; j < grandChildren.length; j++) {
						if (!grandChildren[j].nodeName.match(/controlpoint/i)) {
							return (
								"Invalid tag was found in 'controlpoint' node of animation '" +
								animationId +
								"'"
							);
						}

						let controlpoint = {};

						let x = this.reader.getFloat(grandChildren[j], 'xx');
						let y = this.reader.getFloat(grandChildren[j], 'yy');
						let z = this.reader.getFloat(grandChildren[j], 'zz');

						if (x != null && !isNaN(x)) controlpoint.x = x;
						else
							return (
								"No valid 'xx' component found in 'controlpoint' node of animation '" +
								animationId +
								"'"
							);

						if (y != null && !isNaN(y)) controlpoint.y = y;
						else
							return (
								"No valid 'yy' component found in 'controlpoint' node of animation '" +
								animationId +
								"'"
							);

						if (z != null && !isNaN(z)) controlpoint.z = z;
						else
							return (
								"No valid 'zz' component found in 'controlpoint' node of animation '" +
								animationId +
								"'"
							);
						
						controlpoints.push(controlpoint);
					}
					animation.controlpoints = controlpoints;
				}

				this.animations[animationId] = animation;
			} else {
				this.onXMLMinorError(
					"An invalid tag ('" +
						children[i].nodeName +
						"') was found in the <ANIMATIONS> block"
				);
			}
		}

		this.log('Parsed animations');

		return null;
	}

	/**
	 * Parses the <PRIMITIVES> block.
	 * @param {primitives block element} primitivesNode
	 */
	parsePrimitives(primitivesNode) {
		this.primitives = [];
		let children = primitivesNode.children;

		for (let i = 0; i < children.length; i++) {
			let primitive = {};

			// Get ID
			let primitiveId = this.reader.getString(children[i], 'id');
			if (primitiveId == null) {
				return 'A node with no ID was found in the <PRIMITIVES> block';
			}

			// Check if ID is duplicate
			if (this.primitives[primitiveId] != null) {
				return (
					"A node with a duplicate ID was found in the <PRIMITIVES> block ('" +
					primitiveId +
					"')"
				);
			}

			let grandChildren = children[i].children;

			if (grandChildren.length === 0) {
				return (
					"A primitive with no nodes was found in the <PRIMITIVES> block ('" +
					primitiveId +
					"')"
				);
			} else if (grandChildren.length > 1) {
				return (
					"Primitives must contain a single node only <PRIMITIVES> block ('" +
					primitiveId +
					"')"
				);
			}

			let nodeName = grandChildren[0].nodeName.toUpperCase();

			// If tag is valid, parse its attributes
			switch (nodeName) {
				case 'RECTANGLE': {
					primitive.type = 'rectangle';

					let x1 = this.reader.getFloat(grandChildren[0], 'x1');
					let y1 = this.reader.getFloat(grandChildren[0], 'y1');

					let x2 = this.reader.getFloat(grandChildren[0], 'x2');
					let y2 = this.reader.getFloat(grandChildren[0], 'y2');

					// Point 1
					if (x1 != null && !isNaN(x1)) {
						primitive.x1 = x1;
					} else {
						return (
							"No valid 'x1' component found in node '" +
							grandChildren[0].nodeName +
							"' of primitive '" +
							primitiveId +
							"'"
						);
					}
					if (y1 != null && !isNaN(y1)) {
						primitive.y1 = y1;
					} else {
						return (
							"No valid 'y1' component found in node '" +
							grandChildren[0].nodeName +
							"' of primitive '" +
							primitiveId +
							"'"
						);
					}

					// Point 2
					if (x2 != null && !isNaN(x2)) {
						primitive.x2 = x2;
					} else {
						return (
							"No valid 'x2' component found in node '" +
							grandChildren[0].nodeName +
							"' of primitive '" +
							primitiveId +
							"'"
						);
					}
					if (y2 != null && !isNaN(y2)) {
						primitive.y2 = y2;
					} else {
						return (
							"No valid 'y2' component found in node '" +
							grandChildren[0].nodeName +
							"' of primitive '" +
							primitiveId +
							"'"
						);
					}

					break;
				}

				case 'TRIANGLE': {
					primitive.type = 'triangle';

					let x1 = this.reader.getFloat(grandChildren[0], 'x1');
					let y1 = this.reader.getFloat(grandChildren[0], 'y1');
					let z1 = this.reader.getFloat(grandChildren[0], 'z1');

					let x2 = this.reader.getFloat(grandChildren[0], 'x2');
					let y2 = this.reader.getFloat(grandChildren[0], 'y2');
					let z2 = this.reader.getFloat(grandChildren[0], 'z2');

					let x3 = this.reader.getFloat(grandChildren[0], 'x3');
					let y3 = this.reader.getFloat(grandChildren[0], 'y3');
					let z3 = this.reader.getFloat(grandChildren[0], 'z3');

					// Point 1
					if (x1 != null && !isNaN(x1)) {
						primitive.x1 = x1;
					} else {
						return (
							"No valid 'x1' component found in node '" +
							grandChildren[0].nodeName +
							"' of primitive '" +
							primitiveId +
							"'"
						);
					}
					if (y1 != null && !isNaN(y1)) {
						primitive.y1 = y1;
					} else {
						return (
							"No valid 'y1' component found in node '" +
							grandChildren[0].nodeName +
							"' of primitive '" +
							primitiveId +
							"'"
						);
					}
					if (z1 != null && !isNaN(z1)) {
						primitive.z1 = z1;
					} else {
						return (
							"No valid 'z1' component found in node '" +
							grandChildren[0].nodeName +
							"' of primitive '" +
							primitiveId +
							"'"
						);
					}

					// Point 2
					if (x2 != null && !isNaN(x2)) {
						primitive.x2 = x2;
					} else {
						return (
							"No valid 'x2' component found in node '" +
							grandChildren[0].nodeName +
							"' of primitive '" +
							primitiveId +
							"'"
						);
					}
					if (y2 != null && !isNaN(y2)) {
						primitive.y2 = y2;
					} else {
						return (
							"No valid 'y2' component found in node '" +
							grandChildren[0].nodeName +
							"' of primitive '" +
							primitiveId +
							"'"
						);
					}
					if (z2 != null && !isNaN(z2)) {
						primitive.z2 = z2;
					} else {
						return (
							"No valid 'z2' component found in node '" +
							grandChildren[0].nodeName +
							"' of primitive '" +
							primitiveId +
							"'"
						);
					}

					// Point 3
					if (x3 != null && !isNaN(x3)) {
						primitive.x3 = x3;
					} else {
						return (
							"No valid 'x3' component found in node '" +
							grandChildren[0].nodeName +
							"' of primitive '" +
							primitiveId +
							"'"
						);
					}
					if (y3 != null && !isNaN(y3)) {
						primitive.y3 = y3;
					} else {
						return (
							"No valid 'y3' component found in node '" +
							grandChildren[0].nodeName +
							"' of primitive '" +
							primitiveId +
							"'"
						);
					}
					if (z3 != null && !isNaN(z3)) {
						primitive.z3 = z3;
					} else {
						return (
							"No valid 'z3' component found in node '" +
							grandChildren[0].nodeName +
							"' of primitive '" +
							primitiveId +
							"'"
						);
					}

					break;
				}

				case 'CYLINDER': {
					primitive.type = 'cylinder';

					let base = this.reader.getFloat(grandChildren[0], 'base');
					let top = this.reader.getFloat(grandChildren[0], 'top');
					let height = this.reader.getFloat(grandChildren[0], 'height');

					let slices = this.reader.getInteger(grandChildren[0], 'slices');
					let stacks = this.reader.getInteger(grandChildren[0], 'stacks');

					// Base
					if (base != null && !isNaN(base) && base >= 0) {
						primitive.base = base;
					} else {
						return (
							"No valid 'base' component found in node '" +
							grandChildren[0].nodeName +
							"' of primitive '" +
							primitiveId +
							"'"
						);
					}

					// Top
					if (top != null && !isNaN(top) && top >= 0) {
						primitive.top = top;
					} else {
						return (
							"No valid 'top' component found in node '" +
							grandChildren[0].nodeName +
							"' of primitive '" +
							primitiveId +
							"'"
						);
					}

					// Height
					if (height != null && !isNaN(height) && height >= 0) {
						primitive.height = height;
					} else {
						return (
							"No valid 'height' component found in node '" +
							grandChildren[0].nodeName +
							"' of primitive '" +
							primitiveId +
							"'"
						);
					}

					// Slices
					if (slices != null && !isNaN(slices) && slices > 0) {
						primitive.slices = slices;
					} else {
						return (
							"No valid 'slices' component found in node '" +
							grandChildren[0].nodeName +
							"' of primitive '" +
							primitiveId +
							"'"
						);
					}

					// Stacks
					if (stacks != null && !isNaN(stacks) && stacks > 0) {
						primitive.stacks = stacks;
					} else {
						return (
							"No valid 'stacks' component found in node '" +
							grandChildren[0].nodeName +
							"' of primitive '" +
							primitiveId +
							"'"
						);
					}

					break;
				}

				case 'SPHERE': {
					primitive.type = 'sphere';

					let radius = this.reader.getFloat(grandChildren[0], 'radius');

					let slices = this.reader.getInteger(grandChildren[0], 'slices');
					let stacks = this.reader.getInteger(grandChildren[0], 'stacks');

					// Radius
					if (radius != null && !isNaN(radius) && radius > 0) {
						primitive.radius = radius;
					} else {
						return (
							"No valid 'radius' component found in node '" +
							grandChildren[0].nodeName +
							"' of primitive '" +
							primitiveId +
							"'"
						);
					}

					// Slices
					if (slices != null && !isNaN(slices) && slices > 0) {
						primitive.slices = slices;
					} else {
						return (
							"No valid 'slices' component found in node '" +
							grandChildren[0].nodeName +
							"' of primitive '" +
							primitiveId +
							"'"
						);
					}

					// Stacks
					if (stacks != null && !isNaN(stacks) && stacks > 0) {
						primitive.stacks = stacks;
					} else {
						return (
							"No valid 'stacks' component found in node '" +
							grandChildren[0].nodeName +
							"' of primitive '" +
							primitiveId +
							"'"
						);
					}

					break;
				}

				case 'TORUS': {
					primitive.type = 'torus';

					let inner = this.reader.getFloat(grandChildren[0], 'inner');
					let outer = this.reader.getFloat(grandChildren[0], 'outer');

					let slices = this.reader.getInteger(grandChildren[0], 'slices');
					let loops = this.reader.getInteger(grandChildren[0], 'loops');

					// Inner (thickness)
					if (inner != null && !isNaN(inner) && inner > 0) {
						primitive.inner = inner;
					} else {
						return (
							"No valid 'inner' component found in node '" +
							grandChildren[0].nodeName +
							"' of primitive '" +
							primitiveId +
							"'"
						);
					}

					// Outer (aperture)
					if (outer != null && !isNaN(outer) && outer > 0) {
						primitive.outer = outer;
					} else {
						return (
							"No valid 'outer' component found in node '" +
							grandChildren[0].nodeName +
							"' of primitive '" +
							primitiveId +
							"'"
						);
					}

					// Slices
					if (slices != null && !isNaN(slices) && slices > 0) {
						primitive.slices = slices;
					} else {
						return (
							"No valid 'slices' component found in node '" +
							grandChildren[0].nodeName +
							"' of primitive '" +
							primitiveId +
							"'"
						);
					}

					// Loops
					if (loops != null && !isNaN(loops) && loops > 0) {
						primitive.loops = loops;
					} else {
						return (
							"No valid 'loops' component found in node '" +
							grandChildren[0].nodeName +
							"' of primitive '" +
							primitiveId +
							"'"
						);
					}

					break;
				}

				default: {
					return (
						"A primitive containing an invalid tag was found in the <PRIMITIVES> block ('" +
						primitiveId +
						"')"
					);
				}
			}

			this.primitives[primitiveId] = primitive;
		}

		this.log('Parsed primitives');
		return null;
	}

	/**
	 * Parses the <COMPONENTS> block.
	 * @param {nodes block element} componentsNode
	 */
	parseComponents(componentsNode) {
		this.components = [];
		let children = componentsNode.children;

		for (let i = 0; i < children.length; i++) {
			let component = {};

			// Get ID
			let componentId = this.reader.getString(children[i], 'id');
			if (componentId == null) {
				return 'A node with no ID was found in the <COMPONENTS> block';
			}

			// Check if ID is duplicate
			if (this.components[componentId] != null) {
				return (
					"A node with a duplicate ID was found in the <COMPONENTS> block ('" +
					componentId +
					"')"
				);
			}

			let grandChildren = children[i].children;
			let nodeNames = [];

			for (let j = 0; j < grandChildren.length; j++) {
				nodeNames.push(grandChildren[j].nodeName.toUpperCase());
			}

			let transformationIndex = nodeNames.indexOf('TRANSFORMATION');
			let materialsIndex = nodeNames.indexOf('MATERIALS');
			let textureIndex = nodeNames.indexOf('TEXTURE');
			let animationsIndex = nodeNames.indexOf('ANIMATIONS');
			let childrenIndex = nodeNames.indexOf('CHILDREN');

			// Parse 'transformation' node
			if (transformationIndex === -1) {
				return "Unable to parse transformation block for component '" + componentId + "'";
			} else {
				// Great-grandchildren
				let transformations = grandChildren[transformationIndex].children;

				// If the block is empty, instructions are skipped, no error is thrown
				if (transformations.length > 0) {
					if (transformations[0].nodeName.match(/transformationref/i)) {
						// Get transformation ID

						let transformationRefId = this.reader.getString(transformations[0], 'id');
						if (transformationRefId == null) {
							return (
								"A transformation reference is missing the ID in component '" +
								componentId +
								"'"
							);
						}

						if (this.transformations[transformationRefId] == null) {
							return (
								"A component ('" +
								componentId +
								"') is referencing a non existant transformation ('" +
								transformationRefId +
								"')"
							);
						}

						component.transformationRef = transformationRefId;
					} else {
						// Parse block of transformation operations

						component.transformations = [];

						for (let j = 0; j < transformations.length; j++) {
							let op = {};

							if (transformations[j].nodeName.match(/translate/i)) {
								// Parse translation

								op.type = 'translate';

								let x = this.reader.getFloat(transformations[j], 'x');
								let y = this.reader.getFloat(transformations[j], 'y');
								let z = this.reader.getFloat(transformations[j], 'z');

								if (x != null && !isNaN(x)) {
									op.x = x;
								} else {
									return (
										"No valid 'x' component found in a 'translate' node (" +
										(j + 1) +
										") of component '" +
										componentId +
										"'"
									);
								}

								if (y != null && !isNaN(y)) {
									op.y = y;
								} else {
									return (
										"No valid 'y' component found in 'translate' node (" +
										(j + 1) +
										") of component '" +
										componentId +
										"'"
									);
								}

								if (z != null && !isNaN(z)) {
									op.z = z;
								} else {
									return (
										"No valid 'z' component found in 'translate' node (" +
										(j + 1) +
										") of component '" +
										componentId +
										"'"
									);
								}
							} else if (transformations[j].nodeName.match(/rotate/i)) {
								// Parse rotation

								op.type = 'rotate';

								let axis = this.reader.getString(transformations[j], 'axis');
								let angle = this.reader.getFloat(transformations[j], 'angle');

								if (
									axis != null &&
									(axis.match(/x/i) || axis.match(/y/i) || axis.match(/z/i))
								)
									op.axis = axis;
								else
									return (
										"No valid 'axis' component found in a 'rotate' node (" +
										(j + 1) +
										") of component '" +
										componentId +
										"'"
									);

								if (angle != null && !isNaN(angle)) op.angle = angle;
								else
									return (
										"No valid 'angle' component found in a 'rotate' node (" +
										(j + 1) +
										") of component '" +
										componentId +
										"'"
									);
							} else if (transformations[j].nodeName.match(/scale/i)) {
								// Parse scaling

								op.type = 'scale';

								let x = this.reader.getFloat(transformations[j], 'x');
								let y = this.reader.getFloat(transformations[j], 'y');
								let z = this.reader.getFloat(transformations[j], 'z');

								if (x != null && !isNaN(x)) op.x = x;
								else
									return (
										"No valid 'x' component found in a 'scale' node (" +
										(j + 1) +
										") of component '" +
										componentId +
										"'"
									);

								if (y != null && !isNaN(y)) op.y = y;
								else
									return (
										"No valid 'y' component found in a 'scale' node (" +
										(j + 1) +
										") of component '" +
										componentId +
										"'"
									);

								if (z != null && !isNaN(z)) op.z = z;
								else
									return (
										"No valid 'z' component found in a 'scale' node (" +
										(j + 1) +
										") of component '" +
										componentId +
										"'"
									);
							} else {
								// No valid operation was found

								return (
									"An invalid tag was found in the <TRANSFORMATION> block of component '" +
									componentId +
									"'"
								);
							}

							// Put the valid operation in the transformations array of the component
							component.transformations.push(op);
						}
					}
				}
			}

			// Parse 'materials' node
			if (materialsIndex === -1) {
				return "Unable to parse materials block for component '" + componentId + "'";
			} else {
				let materials = grandChildren[materialsIndex].children;

				if (materials.length === 0) {
					return (
						"No materials found in the <MATERIALS> block of component '" +
						componentId +
						"'"
					);
				}

				component.materials = [];

				for (let j = 0; j < materials.length; j++) {
					// Get ID
					let matId = this.reader.getString(materials[j], 'id');
					if (matId == null) {
						return (
							"A node with no ID was found in the <MATERIALS> block of component '" +
							componentId +
							"'"
						);
					}

					if (this.materials[matId] == null && !matId.match(/inherit/i)) {
						return (
							"A component ('" +
							componentId +
							"') is referencing an invalid material ('" +
							matId +
							"')"
						);
					}

					if (component.materials.indexOf(matId) === -1) {
						// First occurence of this material in component
						matId.match(/inherit/i)
							? component.materials.push(matId.toLowerCase())
							: component.materials.push(matId);
					} else {
						// Ignore duplicates
						this.onXMLMinorError(
							"A component ('" +
								componentId +
								"') is referencing the same material ('" +
								matId +
								"') more than once. Keeping first reference only"
						);
					}
				}
			}

			// Parse 'texture' node
			if (textureIndex === -1) {
				return "Unable to parse texture block for component '" + componentId + "'";
			} else {
				component.texture = {};

				// Get ID
				let texId = this.reader.getString(children[i].children[textureIndex], 'id');
				if (texId == null) {
					return "A texture with no ID was found in component '" + componentId + "'";
				}

				if (
					this.textures[texId] == null &&
					!texId.match(/inherit/i) &&
					!texId.match(/none/i)
				) {
					return (
						"A component ('" +
						componentId +
						"') is referencing an invalid texture ('" +
						texId +
						"')"
					);
				}

				let inherit = false;

				if (texId.match(/none/i)) {
					component.texture.id = 'none';
				} else {
					if (texId.match(/inherit/i)) {
						component.texture.id = 'inherit';
						inherit = true;
					} else {
						component.texture.id = texId;
					}

					// Parse length_s and length_t
					let length_s = this.reader.getFloat(
						children[i].children[textureIndex],
						'length_s',
						!inherit
					);
					let length_t = this.reader.getFloat(
						children[i].children[textureIndex],
						'length_t',
						!inherit
					);

					if (length_s != null && !isNaN(length_s)) {
						component.texture.length_s = length_s;
					} else if (!texId.match(/inherit/i)) {
						return (
							"No valid 'length_s' component found in texture '" +
							texId +
							"' of component '" +
							componentId +
							"'"
						);
					}

					if (length_t != null && !isNaN(length_t)) {
						component.texture.length_t = length_t;
					} else if (!texId.match(/inherit/i)) {
						return (
							"No valid 'length_t' component found in texture '" +
							texId +
							"' of component '" +
							componentId +
							"'"
						);
					}
				}
			}

			// Parse 'animations' node
			if (animationsIndex !== -1) {
				// Great-grandchildren
				let animations = grandChildren[animationsIndex].children;

				if(animations.length > 0) {
					for (let j = 0; j < animations.length; j++) {
						if (animations[j].nodeName.match(/animationref/i)) {
							let animationRefId = this.reader.getString(animations[j], 'id');
							if (animationRefId == null) {
								return (
									"An animation reference is missing the ID in component '" +
									componentId +
									"'"
								);
							}
							
							let animation = this.animations[animationRefId];
							if (animation == null) {
								return (
									"A component ('" +
									componentId +
									"') is referencing a non existant animation ('" +
									animationRefId +
									"')"
								);
							}

							if (component.animations == null) {
								component.animations = [];
							}

							// create animation in component
							if (animation.type.match(/linear/i)) {
								component.animations.push(new LinearAnimation(
									this.scene,
									animation.span,
									animation.controlpoints
								));
							} else if (animation.type.match(/circular/i)) {
								component.animations.push(new CircularAnimation(
									this.scene,
									animation.span,
									animation.center,
									animation.radius,
									animation.startAng,
									animation.rotAng
								));
							}
						}
					}
				}
			}

			// Parse 'children' node
			if (childrenIndex === -1) {
				return "Unable to parse children block for component '" + componentId + "'";
			} else {
				// Great-grandchildren
				let greatGrandChildren = grandChildren[childrenIndex].children;

				component.children = {};
				component.children.primitives = [];
				component.children.components = [];

				for (let j = 0; j < greatGrandChildren.length; j++) {
					// Get child ID
					let childId = this.reader.getString(greatGrandChildren[j], 'id');
					if (childId == null) {
						return (
							"A child reference is missing the ID in component '" + componentId + "'"
						);
					}

					if (greatGrandChildren[j].nodeName.match(/primitiveref/i)) {
						if (this.primitives[childId] == null) {
							return (
								"A component ('" +
								componentId +
								"') is referencing a non existant primitive ('" +
								childId +
								"')"
							);
						} else {
							component.children.primitives.push(childId);
						}
					} else if (greatGrandChildren[j].nodeName.match(/componentref/i)) {
						component.children.components.push(childId);
					} else {
						return (
							"A child ('" +
							childId +
							"') of component ('" +
							componentId +
							"') has an invalid tag ('" +
							greatGrandChildren[j].nodeName +
							"')"
						);
					}
				}
			}

			this.components[componentId] = component;
		}

		// Check if all component references are valid
		for (let i = 0; i < children.length; i++) {
			let grandChildren = children[i].children;
			let nodeNames = [];

			// Get ID
			let componentId = this.reader.getString(children[i], 'id');
			if (componentId == null) {
				return 'A node with no ID was found in the <COMPONENTS> block';
			}

			for (let j = 0; j < grandChildren.length; j++) {
				nodeNames.push(grandChildren[j].nodeName.toUpperCase());
			}

			let childrenIndex = nodeNames.indexOf('CHILDREN');

			let greatGrandChildren = grandChildren[childrenIndex].children;

			for (let j = 0; j < greatGrandChildren.length; j++) {
				let id = this.reader.getString(greatGrandChildren[j], 'id');
				if (greatGrandChildren[j].nodeName.match(/componentref/i)) {
					if (this.components[id] == null) {
						return (
							"A component ('" +
							componentId +
							"') is referencing a non existant component ('" +
							id +
							"')"
						);
					}
				}
			}
		}

		this.log('Parsed components');

		return null;
	}

	/*
     * Callback to be executed on any read error, showing an error on the console.
     * @param {string} message
     */
	onXMLError(message) {
		console.error('XML Loading Error: ' + message);
		this.loadedOk = false;
	}

	/**
	 * Callback to be executed on any minor error, showing a warning on the console.
	 * @param {string} message
	 */
	onXMLMinorError(message) {
		console.warn('Warning: ' + message);
	}

	/**
	 * Callback to be executed on any message.
	 * @param {string} message
	 */
	log(message) {
		console.log('   ' + message);
	}

	/**
	 * Displays the scene, processing each node, starting in the root node.
	 */
	displayScene(nodeName, matI = null, texI = null) {
		// entry point for graph rendering

		if (nodeName == null) {
			return null;
		}

		let node = this.components[nodeName];

		if (node == null) {
			return null;
		}

		let material = matI;
		let textura = texI;

		if (node.materials.length !== 0) {
			if (
				!node.materials[this.scene.materialCounter % node.materials.length].match(
					/inherit/i
				)
			) {
				material = node.materials[this.scene.materialCounter % node.materials.length];
			}
		}

		if (!node.texture.id.match(/inherit/i)) {
			textura = node.texture.id;
		}

		if (node.hasOwnProperty('transformationRef')) {
			this.applyTransformation(this.transformations[node.transformationRef].operations);
		} else if (node.hasOwnProperty('transformations')) {
			this.applyTransformation(node.transformations);
		}

		if (node.hasOwnProperty('animations')) {
			for (let i = 0; i < node.animations.length; i++) {
				node.animations[i].update();
				if (!node.animations[i].done) break;
			}
		}

		if (node.hasOwnProperty('children')) {
			if (node.children.hasOwnProperty('primitives')) {
				for (let i = 0; i < node.children.primitives.length; i++) {
					this.scene.pushMatrix();

					if (
						material != null &&
						!material.match(/inherit/i) &&
						!material.match(/default/i)
					) {
						this.scene.materials[material].apply();
					}

					if (
						textura != null &&
						!textura.match(/inherit/i) &&
						!textura.match(/default/i) &&
						!textura.match(/none/i)
					) {
						this.scene.textures[textura].apply();
					}

					this.displayPrimitive(
						node.children.primitives[i],
						node.texture.length_s,
						node.texture.length_t
					);

					this.scene.popMatrix();
				}
			}
			
			if (node.children.hasOwnProperty('components')) {
				for (let i = 0; i < node.children.components.length; i++) {
					this.scene.pushMatrix();

					this.displayScene(node.children.components[i], material, textura);

					this.scene.popMatrix();
				}
			}
		}
	}

	/**
	 * Displays a primitive
	 */
	displayPrimitive(primitiveName, length_s = 1, length_t = 1) {
		if (primitiveName == null || this.primitives[primitiveName] == null) {
			return null;
		}

		let primitive = this.primitives[primitiveName];
		primitiveName = primitiveName + '_' + length_s + '_' + length_t;

		if (this.scene.primitives == null) {
			this.scene.primitives = {};
		}

		switch (primitive.type) {
			case 'rectangle':
				if (this.scene.primitives[primitiveName] == null) {
					this.scene.primitives[primitiveName] = new MyQuad(
						this.scene,
						primitive.x1,
						primitive.x2,
						primitive.y1,
						primitive.y2,
						0,
						length_s,
						0,
						length_t
					);
				}
				break;

			case 'triangle':
				if (this.scene.primitives[primitiveName] == null) {
					this.scene.primitives[primitiveName] = new MyTriangle(
						this.scene,
						primitive.x1,
						primitive.x2,
						primitive.x3,
						primitive.y1,
						primitive.y2,
						primitive.y3,
						primitive.z1,
						primitive.z2,
						primitive.z3,
						length_s,
						length_t
					);
				}
				break;

			case 'cylinder':
				if (this.scene.primitives[primitiveName] == null) {
					this.scene.primitives[primitiveName] = new MyCylinder(
						this.scene,
						primitive.base,
						primitive.top,
						primitive.height,
						primitive.slices,
						primitive.stacks,
						length_s,
						length_t
					);
				}
				break;

			case 'sphere':
				if (this.scene.primitives[primitiveName] == null) {
					this.scene.primitives[primitiveName] = new MySphere(
						this.scene,
						primitive.radius,
						primitive.slices,
						primitive.stacks,
						length_s,
						length_t
					);
				}
				break;

			case 'torus':
				if (this.scene.primitives[primitiveName] == null) {
					this.scene.primitives[primitiveName] = new MyTorus(
						this.scene,
						primitive.inner,
						primitive.outer,
						primitive.slices,
						primitive.loops,
						length_s,
						length_t
					);
				}
				break;

			default:
		}

		this.scene.primitives[primitiveName].display();
	}

	/**
	 * Parses a transformation and applies it to the scene matrix
	 */
	applyTransformation(operations) {
		for (let i = 0; i < operations.length; i++) {
			switch (operations[i].type) {
				case 'translate':
					this.scene.translate(operations[i].x, operations[i].y, operations[i].z);
					break;
				case 'scale':
					this.scene.scale(operations[i].x, operations[i].y, operations[i].z);
					break;
				case 'rotate':
					this.scene.rotate(
						operations[i].angle * DEGREE_TO_RAD,
						operations[i].axis === 'x' ? 1 : 0,
						operations[i].axis === 'y' ? 1 : 0,
						operations[i].axis === 'z' ? 1 : 0
					);
					break;
				default:
					this.onXMLMinorError(
						"An invalid operation was found in a transformation matrix ('" +
							operations[i].type +
							"')"
					);
			}
		}
	}
}
