var DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
const SCENE_INDEX = 0;
const VIEWS_INDEX = 1;
const AMBIENT_INDEX = 2;
const LIGHTS_INDEX = 3;
const TEXTURES_INDEX = 4;
const MATERIALS_INDEX = 5;
const TRANSFORMATIONS_INDEX = 6;
const PRIMITIVES_INDEX = 7;
const COMPONENTS_INDEX = 8;


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

        this.rootId = null;                    // The id of the root element.

        this.axisCoords = [];

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
        this.log("XML Loading finished.");
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

		if(rootElement.nodeName.toUpperCase() !== "YAS")
		return "root tag <YAS> missing";

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
        if ((index = nodeNames.indexOf("SCENE")) == -1)
            return "tag <SCENE> missing";
        else {
            if (index != SCENE_INDEX)
                this.onXMLMinorError("tag <SCENE> out of order");

			//Parse SCENE block
            if ((error = this.parseScene(nodes[index])) != null)
                return error;
        }

        // <VIEWS>
        if ((index = nodeNames.indexOf("VIEWS")) == -1)
            return "tag <VIEWS> missing";
        else {
            if (index != VIEWS_INDEX)
                this.onXMLMinorError("tag <VIEWS> out of order");

            //Parse VIEWS block
            if ((error = this.parseViews(nodes[index])) != null)
                return error;
        }

        // <AMBIENT>
        if ((index = nodeNames.indexOf("AMBIENT")) == -1)
            return "tag <AMBIENT> missing";
        else {
            if (index != AMBIENT_INDEX)
                this.onXMLMinorError("tag <AMBIENT> out of order");

            //Parse AMBIENT block
            if ((error = this.parseAmbient(nodes[index])) != null)
                return error;
		}

        // <LIGHTS>
        if ((index = nodeNames.indexOf("LIGHTS")) == -1)
            return "tag <LIGHTS> missing";
        else {
            if (index != LIGHTS_INDEX)
                this.onXMLMinorError("tag <LIGHTS> out of order");

            //Parse LIGHTS block
            if ((error = this.parseLights(nodes[index])) != null)
                return error;
		}	

        // <TEXTURES>
        if ((index = nodeNames.indexOf("TEXTURES")) == -1)
            return "tag <TEXTURES> missing";
        else {
            if (index != TEXTURES_INDEX)
                this.onXMLMinorError("tag <TEXTURES> out of order");

            //Parse TEXTURES block
            if ((error = this.parseTextures(nodes[index])) != null)
                return error;
        }

        // <MATERIALS>
        if ((index = nodeNames.indexOf("MATERIALS")) == -1)
            return "tag <MATERIALS> missing";
        else {
            if (index != MATERIALS_INDEX)
                this.onXMLMinorError("tag <MATERIALS> out of order");

            //Parse MATERIALS block
            if ((error = this.parseMaterials(nodes[index])) != null)
                return error;
        }

        // <TRANSFORMATIONS>
        if ((index = nodeNames.indexOf("TRANSFORMATIONS")) == -1)
            return "tag <TRANSFORMATIONS> missing";
        else {
            if (index != TRANSFORMATIONS_INDEX)
                this.onXMLMinorError("tag <TRANSFORMATIONS> out of order");

            //Parse TRANSFORMATIONS block
            if ((error = this.parseTransformations(nodes[index])) != null)
                return error;
        }

        // <PRIMITIVES>
        if ((index = nodeNames.indexOf("PRIMITIVES")) == -1)
            return "tag <PRIMITIVES> missing";
        else {
            if (index != PRIMITIVES_INDEX)
                this.onXMLMinorError("tag <PRIMITIVES> out of order");

            //Parse PRIMITIVES block
            if ((error = this.parsePrimitives(nodes[index])) != null)
                return error;
        }

        // <COMPONENTS>
        if ((index = nodeNames.indexOf("COMPONENTS")) == -1)
            return "tag <COMPONENTS> missing";
        else {
            if (index != COMPONENTS_INDEX)
                this.onXMLMinorError("tag <COMPONENTS> out of order");

            //Parse COMPONENTS block
            if ((error = this.parseComponents(nodes[index])) != null)
                return error;
        }
    }

    /**
     * Parses the <SCENE> block.
     * @param {scene block element} sceneNode
     */
    parseScene(sceneNode) {

		if(sceneNode.attributes.getNamedItem("root") === null) {
			return "Missing root attribute in <SCENE> element";
		}
		this.rootId = sceneNode.attributes.getNamedItem("root").value;


		if(sceneNode.attributes.getNamedItem("axis_length") === null) {
			this.axis_length = 5.0;
			this.onXMLMinorError("Missing 'axis_length' attribute in <SCENE> element. Defaulting to 5.0");
			
			return null;
		}

		this.axis_length = parseFloat(sceneNode.attributes.getNamedItem("axis_length").value);

        this.axisCoords['x'] = [this.axis_length, 0, 0];
        this.axisCoords['y'] = [0, this.axis_length, 0];
        this.axisCoords['z'] = [0, 0, this.axis_length];

        this.log("Parsed scene");

        return null;
    }

    /**
     * Parses the <VIEWS> block.
     * @param {views block element} viewsNode
     */
    parseViews(viewsNode) {

		let children = viewsNode.children;
		this.views = {};
		
		if(viewsNode.children.length === 0) {
			return "No views defined in <VIEW> element";
		}

		if(typeof viewsNode.attributes.getNamedItem("default") === "undefined") {
			this.onXMLMinorError(
				"No default view defined in <VIEW> element. Selecting first view encountered - '" 
				+ children[0].attributes.getNamedItem("id").value 
				+ "'"
			);
		} else {
			this.defaultView = viewsNode.attributes.getNamedItem("default").value;
		}

		for(let i = 0; i < children.length; i++) {
			let view = {
				type: "perspective",
				near: 0.1,
				far: 500,
				from: {x: 50.0, y: 50.0, z: 50.0},
				to: {x: 0.0, y: 0.0, z: 0.0}
			};

			let type = children[i].nodeName.toUpperCase();

			if(!(type === "PERSPECTIVE" || type === "ORTHO")) {
				if(i === children.length - 1) {
					this.onXMLMinorError("An invalid camera was found in <VIEW> element. Using " + view.type);
					name = i + "_" + view.type;
					view.angle = 20.0;
					this.views[name] = view;
					continue;
				}
			}

			children[i].attributes.getNamedItem("near") != null ?
				view.near = parseFloat(children[i].attributes.getNamedItem("near").value) :
				this.onXMLMinorError("View number " + (i + 1) + " has no defined 'near' value. Using " + view.near);

			children[i].attributes.getNamedItem("far") != null ?
				view.far = parseFloat(children[i].attributes.getNamedItem("far").value) :
				this.onXMLMinorError("View number " + (i + 1) + " has no defined 'far' value. Using " + view.far);

			let grandChildren = children[i].children;
			if(grandChildren.length < 2)
				this.onXMLMinorError("View number " + (i + 1) + " has missing direction values. Using default");

			let toIndex = -1;
			let fromIndex = -1;
			for(let j = 0; j < grandChildren.length; j++) {
				if(grandChildren[j].nodeName.toUpperCase() === "TO")
					toIndex = j;
				if(grandChildren[j].nodeName.toUpperCase() === "FROM")
					fromIndex = j;
			}

			if(toIndex !== -1) {
				grandChildren[toIndex].attributes["x"] != null ?
					view.to.x = parseFloat(grandChildren[toIndex].attributes["x"].value) : 
					this.onXMLMinorError("View number " + (i + 1) + " has missing x coordinate in 'to' attribute. Using " + view.to.x);

				grandChildren[toIndex].attributes["y"] != null ?
					view.to.y = parseFloat(grandChildren[toIndex].attributes["y"].value) : 
					this.onXMLMinorError("View number " + (i + 1) + " has missing y coordinate in 'to' attribute. Using " + view.to.y);

				grandChildren[toIndex].attributes["z"] != null ?
					view.to.z = parseFloat(grandChildren[toIndex].attributes["z"].value) : 
					this.onXMLMinorError("View number " + (i + 1) + " has missing z coordinate in 'to' attribute. Using " + view.to.z);
			} else {
				this.onXMLMinorError("View number " + (i + 1) + " has missing 'to' attribute. Using default");
			}
			
			if(fromIndex !== -1) {
				grandChildren[fromIndex].attributes["x"] != null ?
					view.from.x = parseFloat(grandChildren[fromIndex].attributes["x"].value) : 
					this.onXMLMinorError("View number " + (i + 1) + " has missing x coordinate in 'from' attribute. Using " + view.from.x);

				grandChildren[fromIndex].attributes["y"] != null ?
					view.from.y = parseFloat(grandChildren[fromIndex].attributes["y"].value) : 
					this.onXMLMinorError("View number " + (i + 1) + " has missing y coordinate in 'from' attribute. Using " + view.from.y);
				
				grandChildren[fromIndex].attributes["z"] != null ?
					view.from.z = parseFloat(grandChildren[fromIndex].attributes["z"].value) : 
					this.onXMLMinorError("View number " + (i + 1) + " has missing z coordinate in 'from' attribute. Using " + view.from.z);
			} else {
				this.onXMLMinorError("View number " + (i + 1) + " has missing 'from' attribute. Using default");
			}

			if(type === "PERSPECTIVE") {
				view.angle = 20.0;
				children[i].attributes.getNamedItem("angle") != null ?
					view.angle = parseFloat(children[i].attributes.getNamedItem("angle").value) :
					this.onXMLMinorError("View number " + (i + 1) + " has no defined 'to' value. Using " + view.angle);

			} else if(type === "ORTHO") {
				view.type = "ortho";
				view.top = 100;
				view.bottom = -100;
				view.left = -100;
				view.right = 100;

				children[i].attributes.getNamedItem("top") != null ?
					view.top = parseFloat(children[i].attributes.getNamedItem("top").value) :
					this.onXMLMinorError("View number " + (i + 1) + " has no defined 'top' value. Using " + view.top);
				
				children[i].attributes.getNamedItem("bottom") != null ?
					view.bottom = parseFloat(children[i].attributes.getNamedItem("bottom").value) :
					this.onXMLMinorError("View number " + (i + 1) + " has no defined 'bottom' value. Using " + view.bottom);
				
				children[i].attributes.getNamedItem("left") != null ?
					view.left = parseFloat(children[i].attributes.getNamedItem("left").value) :
					this.onXMLMinorError("View number " + (i + 1) + " has no defined 'left' value. Using " + view.left);
				
				children[i].attributes.getNamedItem("right") != null ?
					view.right = parseFloat(children[i].attributes.getNamedItem("right").value) :
					this.onXMLMinorError("View number " + (i + 1) + " has no defined 'right' value. Using " + view.right);
			}
			
			if(view.name == null)
				name = i + "_" + view.type;

			children[i].attributes.getNamedItem("id") != null ?
				name = children[i].attributes.getNamedItem("id").value :
				this.onXMLMinorError("View number " + (i + 1) + " has no defined id. Using " + name);

			this.views[name] = view;
		}

        this.log("Parsed views");

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

		let ambient = {r: 0.2, g: 0.2, b: 0.2, a: 1};
		let background = {r: 0, g: 0, b: 0, a: 1};

		for(let i = 0; i < children.length; i++) {
			nodeNames.push(children[i].nodeName.toUpperCase());
		}
		
		let ambientIndex = nodeNames.indexOf("AMBIENT");
		let backgroundIndex = nodeNames.indexOf("BACKGROUND");

		if(ambientIndex !== -1) {
			let r = this.reader.getFloat(children[ambientIndex], 'r');
			let g = this.reader.getFloat(children[ambientIndex], 'g');
			let b = this.reader.getFloat(children[ambientIndex], 'b');
			let a = this.reader.getFloat(children[ambientIndex], 'a');

			(r != null && !isNaN(r) && r >= 0 && r <= 1) ?
				ambient.r = r :
				this.onXMLMinorError("No valid 'r' component found in 'ambient' node of <AMBIENT> element. Using " + ambient.r);

			(g != null && !isNaN(g) && g >= 0 && g <= 1) ?
				ambient.g = g :
				this.onXMLMinorError("No valid 'g' component found in 'ambient' node of <AMBIENT> element. Using " + ambient.g);

			(b != null && !isNaN(b) && b >= 0 && b <= 1) ?
				ambient.b = b :
				this.onXMLMinorError("No valid 'b' component found in 'ambient' node of <AMBIENT> element. Using " + ambient.b);

			(a != null && !isNaN(a) && a >= 0 && a <= 1) ?
				ambient.a = a :
				this.onXMLMinorError("No valid 'a' component found in 'ambient' node of <AMBIENT> element. Using " + ambient.a);
		} else {
			this.onXMLMinorError("No 'ambient' node found in <AMBIENT> element. Using default");
		}

		if(backgroundIndex !== -1) {
			let r = this.reader.getFloat(children[backgroundIndex], 'r');
			let g = this.reader.getFloat(children[backgroundIndex], 'g');
			let b = this.reader.getFloat(children[backgroundIndex], 'b');
			let a = this.reader.getFloat(children[backgroundIndex], 'a');

			(r != null && !isNaN(r) && r >= 0 && r <= 1) ?
				background.r = r :
				this.onXMLMinorError("No valid 'r' component found in 'background' node of <AMBIENT> element. Using " + background.r);

			(g != null && !isNaN(g) && g >= 0 && g <= 1) ?
				background.g = g :
				this.onXMLMinorError("No valid 'g' component found in 'background' node of <AMBIENT> element. Using " + background.g);

			(b != null && !isNaN(b) && b >= 0 && b <= 1) ?
				background.b = b :
				this.onXMLMinorError("No valid 'b' component found in 'background' node of <AMBIENT> element. Using " + background.b);

			(a != null && !isNaN(a) && a >= 0 && a <= 1) ?
				background.a = a :
				this.onXMLMinorError("No valid 'a' component found in 'background' node of <AMBIENT> element. Using " + background.a);
		} else {
			this.onXMLMinorError("No 'background' node found in <AMBIENT> element. Using default");
		}

		this.ambient.ambient = ambient;
		this.ambient.background = background;

        this.log("Parsed illumination");

        return null;
    }


    /**
     * Parses the <LIGHTS> node.
     * @param {lights block element} lightsNode
     */
    parseLights(lightsNode) {

		let children = lightsNode.children;

		this.lights = []; // associative array of lights
		
		if(children.length === 0)
			return "No nodes found in the <LIGHTS> element. At least one light must be defined";
		
		if(children.length > 8)
			this.onXMLMinorError("Only 8 lights allowed by WebGL. Parsing first 8 lights only");

		for(let i = 0; i < children.length && i < 8; i++) {
			let lightType = children[i].nodeName.toUpperCase();

			if(lightType === "OMNI" || lightType === "SPOT") {
				let light = {};

				// Get ID
				let lightId = this.reader.getString(children[i], "id");
				if(lightId == null)
					return "A node with no ID was found in the <LIGHTS> element";

				// Check if ID is duplicate
				if(this.lights[lightId] != null)
					return "A node with a duplicate ID was found in the <LIGHTS> element ('" + lightId + "')";
				
				light.type = lightType.toLowerCase();

				// Parse 'enabled' attribute
				let enabled = true;

				if(children[i].attributes.getNamedItem("enabled") == null) {
					this.onXMLMinorError(
						"Attribute 'enabled' missing for node '" 
						+ lightId 
						+ "' in the <LIGHTS> element. Setting light enabled as default");
				} else {
					enabled = this.reader.getInteger(children[i], "enabled");

					if(enabled == null || isNaN(enabled) || enabled < 0 || enabled > 1) {
						this.onXMLMinorError("Unable to parse 'enabled' attribute in the <LIGHTS> element (light ID: '" + lightId + "')");
						enabled = true;
					} else {
						enabled === 1 ? light.enabled = true : light.enabled = false;
						// light.enabled = enabled;
					}
				}

				// Check if light is 'spot'
				if(lightType === "SPOT") {
					// Parse 'angle' attribute
					let angle = 20.0;

					if(children[i].attributes.getNamedItem("angle") == null) {
						this.onXMLMinorError(
							"Attribute 'angle' missing for node '" 
							+ lightId 
							+ "' in the <LIGHTS> element. Using " + angle + " degrees as default");
					} else {
						angle = this.reader.getFloat(children[i], "angle");

						if(angle == null || isNaN(angle) || angle < 0) {
							this.onXMLMinorError("Unable to parse 'angle' attribute in the <LIGHTS> element (light ID: '" + lightId + "')");
							angle = 20.0;
						} else {
							light.angle = angle;
						}
					}

					// Parse 'exponent' attribute
					let exponent = 1.0;
					
					if(children[i].attributes.getNamedItem("exponent") == null) {
						this.onXMLMinorError(
							"Attribute 'exponent' missing for node '" 
							+ lightId 
							+ "' in the <LIGHTS> element. Setting light exponent as " + exponent);
					} else {
						exponent = this.reader.getFloat(children[i], "exponent");

						if(exponent == null || isNaN(exponent) || exponent < 0 || exponent > 1) {
							this.onXMLMinorError("Unable to parse 'exponent' attribute in the <LIGHTS> element (light ID: '" + lightId + "')");
							exponent = 1.0;
						} else {
							light.exponent = exponent;
						}
					}
				}

				let grandChildren = children[i].children;
				let nodeNames = [];

				for(let j = 0; j < grandChildren.length; j++) {
					nodeNames.push(grandChildren[j].nodeName);
				}

				let locationIndex = nodeNames.indexOf("location");
				let ambientIndex =  nodeNames.indexOf("ambient");
				let diffuseIndex =  nodeNames.indexOf("diffuse");
				let specularIndex =  nodeNames.indexOf("specular");
				let targetIndex =  nodeNames.indexOf("target"); 	// 'spot' lights only

				// Parse 'location' node
				if(locationIndex === -1) {
					return "Location component undefined for light '" + lightId + "'";
				} else {
					light.location = {};

					let x = this.reader.getFloat(grandChildren[locationIndex], 'x');
					let y = this.reader.getFloat(grandChildren[locationIndex], 'y');
					let z = this.reader.getFloat(grandChildren[locationIndex], 'z');
					let w = this.reader.getFloat(grandChildren[locationIndex], 'w');
		
					if(x != null && !isNaN(x))
						light.location.x = x;
					else
						return "No valid 'x' component found in 'location' node of light '" + lightId + "'";

					if(y != null && !isNaN(y))
						light.location.y = y;
					else
						return "No valid 'y' component found in 'location' node of light '" + lightId + "'";

					if(z != null && !isNaN(z))
						light.location.z = z;
					else
						return "No valid 'z' component found in 'location' node of light '" + lightId + "'";

					if(w != null && !isNaN(w))
						light.location.w = w;
					else
						return "No valid 'w' component found in 'location' node of light '" + lightId + "'";
				}

				// Parse 'ambient' node
				if(ambientIndex === -1) {
					return "Ambient component undefined for light '" + lightId + "'";
				} else {
					light.ambient = {};

					let r = this.reader.getFloat(grandChildren[ambientIndex], 'r');
					let g = this.reader.getFloat(grandChildren[ambientIndex], 'g');
					let b = this.reader.getFloat(grandChildren[ambientIndex], 'b');
					let a = this.reader.getFloat(grandChildren[ambientIndex], 'a');
		
					if(r != null && !isNaN(r) && r >= 0 && r <= 1)
						light.ambient.r = r;
					else
						return "No valid 'r' component found in 'ambient' node of light '" + lightId + "'";

					if(g != null && !isNaN(g) && g >= 0 && g <= 1)
						light.ambient.g = g;
					else
						return "No valid 'g' component found in 'ambient' node of light '" + lightId + "'";

					if(b != null && !isNaN(b) && b >= 0 && b <= 1)
						light.ambient.b = b;
					else
						return "No valid 'b' component found in 'ambient' node of light '" + lightId + "'";

					if(a != null && !isNaN(a) && a >= 0 && a <= 1)
						light.ambient.a = a;
					else
						return "No valid 'a' component found in 'ambient' node of light '" + lightId + "'";
				}

				// Parse 'diffuse' node
				if(diffuseIndex === -1) {
					return "Diffuse component undefined for light '" + lightId + "'";
				} else {
					light.diffuse = {};

					let r = this.reader.getFloat(grandChildren[diffuseIndex], 'r');
					let g = this.reader.getFloat(grandChildren[diffuseIndex], 'g');
					let b = this.reader.getFloat(grandChildren[diffuseIndex], 'b');
					let a = this.reader.getFloat(grandChildren[diffuseIndex], 'a');
		
					if(r != null && !isNaN(r) && r >= 0 && r <= 1)
						light.diffuse.r = r;
					else
						return "No valid 'r' component found in 'diffuse' node of light '" + lightId + "'";

					if(g != null && !isNaN(g) && g >= 0 && g <= 1)
						light.diffuse.g = g;
					else
						return "No valid 'g' component found in 'diffuse' node of light '" + lightId + "'";

					if(b != null && !isNaN(b) && b >= 0 && b <= 1)
						light.diffuse.b = b;
					else
						return "No valid 'b' component found in 'diffuse' node of light '" + lightId + "'";

					if(a != null && !isNaN(a) && a >= 0 && a <= 1)
						light.diffuse.a = a;
					else
						return "No valid 'a' component found in 'diffuse' node of light '" + lightId + "'";
				}

				// Parse 'specular' node
				if(specularIndex === -1) {
					return "Specular component undefined for light '" + lightId + "'";
				} else {
					light.specular = {};

					let r = this.reader.getFloat(grandChildren[specularIndex], 'r');
					let g = this.reader.getFloat(grandChildren[specularIndex], 'g');
					let b = this.reader.getFloat(grandChildren[specularIndex], 'b');
					let a = this.reader.getFloat(grandChildren[specularIndex], 'a');

					if(r != null && !isNaN(r) && r >= 0 && r <= 1)
						light.specular.r = r;
					else
						return "No valid 'r' component found in 'specular' node of light '" + lightId + "'";

					if(g != null && !isNaN(g) && g >= 0 && g <= 1)
						light.specular.g = g;
					else
						return "No valid 'g' component found in 'specular' node of light '" + lightId + "'";

					if(b != null && !isNaN(b) && b >= 0 && b <= 1)
						light.specular.b = b;
					else
						return "No valid 'b' component found in 'specular' node of light '" + lightId + "'";

					if(a != null && !isNaN(a) && a >= 0 && a <= 1)
						light.specular.a = a;
					else
						return "No valid 'a' component found in 'specular' node of light '" + lightId + "'";
				}

				// Parse 'target' node if dealing with a 'spot' type light
				if(lightType === 'SPOT') {
					if(targetIndex === -1) {
						return "Target component undefined for light '" + lightId + "'";
					} else {
						light.target = {};
	
						let x = this.reader.getFloat(grandChildren[targetIndex], 'x');
						let y = this.reader.getFloat(grandChildren[targetIndex], 'y');
						let z = this.reader.getFloat(grandChildren[targetIndex], 'z');
			
						if(x != null && !isNaN(x))
							light.target.x = x;
						else
							return "No valid 'x' component found in 'location' node of light '" + lightId + "'";
	
						if(y != null && !isNaN(y))
							light.target.y = y;
						else
							return "No valid 'y' component found in 'location' node of light '" + lightId + "'";
	
						if(z != null && !isNaN(z))
							light.target.z = z;
						else
							return "No valid 'z' component found in 'location' node of light '" + lightId + "'";						
					}
				}

				this.lights[lightId] = light;
			} else {
				this.onXMLMinorError("An invalid tag ('" + children[i].nodeName + "') was found in the <LIGHTS> element");
			}
		}

        this.log("Parsed lights");

        return null;
    }

    /**
     * Parses the <TEXTURES> block. 
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) {
		this.textures = [];

		let children = texturesNode.children;

		for(let i = 0; i < children.length; i++) {
			// Get ID
			let texId = this.reader.getString(children[i], "id");
			if(texId == null)
				return "A node with no ID was found in the <TEXTURES> element";

			// Check if ID is duplicate
			if(this.textures[texId] != null)
				return "A node with a duplicate ID was found in the <TEXTURES> element ('" + texId + "')";

			// Get file path
			let path = this.reader.getString(children[i], "file");
			if(path == null)
				return "A node with no file path was found in the <TEXTURES> element ('" + texId + "')";
			
			this.textures[texId] = path;
		}

        this.log("Parsed textures");

        return null;
    }

    /**
     * Parses the <MATERIALS> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {

		this.materials = [];
		let children = materialsNode.children;

		if(children.length === 0) {
			return "No materials found in the <MATERIALS> element";
		}

		for(let i = 0; i < children.length; i++) {

			let material = {};

			// Get ID
			let matId = this.reader.getString(children[i], "id");
			if(matId == null)
				return "A node with no ID was found in the <MATERIALS> element";

			// Check if ID is duplicate
			if(this.materials[matId] != null)
				return "A node with a duplicate ID was found in the <MATERIALS> element ('" + matId + "')";

			// Parse shininess
			let shininess = 1.0;

			if(children[i].attributes.getNamedItem("shininess") == null) {
				this.onXMLMinorError(
					"Attribute 'shininess' missing for node '" 
					+ matId 
					+ "' in the <MATERIALS> element. Using value " + shininess);
			} else {
				shininess = this.reader.getFloat(children[i], "shininess");

				if(shininess == null || isNaN(shininess) || shininess < 0 || shininess > 1) {
					this.onXMLMinorError("Unable to parse 'shininess' attribute in the <MATERIALS> element (material ID: '" + matId + "')");
					shininess = 1;
				} else {
					material.shininess = shininess;
				}
			}

			let grandChildren = children[i].children;
			let nodeNames = [];

			for(let j = 0; j < grandChildren.length; j++) {
				nodeNames.push(grandChildren[j].nodeName);
			}

			let emissionIndex = nodeNames.indexOf("emission");
			let ambientIndex =  nodeNames.indexOf("ambient");
			let diffuseIndex =  nodeNames.indexOf("diffuse");
			let specularIndex =  nodeNames.indexOf("specular");

			// Parse 'emission' node
			if(emissionIndex === -1) {
				return "Emission component undefined for material '" + matId + "'";
			} else {
				material.emission = {};

				let r = this.reader.getFloat(grandChildren[emissionIndex], 'r');
				let g = this.reader.getFloat(grandChildren[emissionIndex], 'g');
				let b = this.reader.getFloat(grandChildren[emissionIndex], 'b');
				let a = this.reader.getFloat(grandChildren[emissionIndex], 'a');
	
				if(r != null && !isNaN(r) && r >= 0 && r <= 1)
					material.emission.r = r
				else
					return "No valid 'r' component found in 'emission' node of material '" + matId + "'";

				if(g != null && !isNaN(g) && g >= 0 && g <= 1)
					material.emission.g = g
				else
					return "No valid 'g' component found in 'emission' node of material '" + matId + "'";

				if(b != null && !isNaN(b) && b >= 0 && b <= 1)
					material.emission.b = b
				else
					return "No valid 'b' component found in 'emission' node of material '" + matId + "'";

				if(a != null && !isNaN(a) && a >= 0 && a <= 1)
					material.emission.a = a
				else
					return "No valid 'a' component found in 'emission' node of material '" + matId + "'";
			}

			// Parse 'ambient' node
			if(ambientIndex === -1) {
				return "Ambient component undefined for material '" + matId + "'";
			} else {
				material.ambient = {};

				let r = this.reader.getFloat(grandChildren[ambientIndex], 'r');
				let g = this.reader.getFloat(grandChildren[ambientIndex], 'g');
				let b = this.reader.getFloat(grandChildren[ambientIndex], 'b');
				let a = this.reader.getFloat(grandChildren[ambientIndex], 'a');
	
				if(r != null && !isNaN(r) && r >= 0 && r <= 1)
					material.ambient.r = r
				else
					return "No valid 'r' component found in 'ambient' node of material '" + matId + "'";

				if(g != null && !isNaN(g) && g >= 0 && g <= 1)
					material.ambient.g = g
				else
					return "No valid 'g' component found in 'ambient' node of material '" + matId + "'";

				if(b != null && !isNaN(b) && b >= 0 && b <= 1)
					material.ambient.b = b
				else
					return "No valid 'b' component found in 'ambient' node of material '" + matId + "'";

				if(a != null && !isNaN(a) && a >= 0 && a <= 1)
					material.ambient.a = a
				else
					return "No valid 'a' component found in 'ambient' node of material '" + matId + "'";
			}

			// Parse 'diffuse' node
			if(diffuseIndex === -1) {
				return "Diffusion component undefined for material '" + matId + "'";
			} else {
				material.diffuse = {};

				let r = this.reader.getFloat(grandChildren[diffuseIndex], 'r');
				let g = this.reader.getFloat(grandChildren[diffuseIndex], 'g');
				let b = this.reader.getFloat(grandChildren[diffuseIndex], 'b');
				let a = this.reader.getFloat(grandChildren[diffuseIndex], 'a');
	
				if(r != null && !isNaN(r) && r >= 0 && r <= 1)
					material.diffuse.r = r
				else
					return "No valid 'r' component found in 'diffuse' node of material '" + matId + "'";

				if(g != null && !isNaN(g) && g >= 0 && g <= 1)
					material.diffuse.g = g
				else
					return "No valid 'g' component found in 'diffuse' node of material '" + matId + "'";

				if(b != null && !isNaN(b) && b >= 0 && b <= 1)
					material.diffuse.b = b
				else
					return "No valid 'b' component found in 'diffuse' node of material '" + matId + "'";

				if(a != null && !isNaN(a) && a >= 0 && a <= 1)
					material.diffuse.a = a
				else
					return "No valid 'a' component found in 'diffuse' node of material '" + matId + "'";
			}

			// Parse 'specular' node
			if(specularIndex === -1) {
				return "Emission component undefined for material '" + matId + "'";
			} else {
				material.specular = {};

				let r = this.reader.getFloat(grandChildren[specularIndex], 'r');
				let g = this.reader.getFloat(grandChildren[specularIndex], 'g');
				let b = this.reader.getFloat(grandChildren[specularIndex], 'b');
				let a = this.reader.getFloat(grandChildren[specularIndex], 'a');
	
				if(r != null && !isNaN(r) && r >= 0 && r <= 1)
					material.specular.r = r
				else
					return "No valid 'r' component found in 'specular' node of material '" + matId + "'";

				if(g != null && !isNaN(g) && g >= 0 && g <= 1)
					material.specular.g = g
				else
					return "No valid 'g' component found in 'specular' node of material '" + matId + "'";

				if(b != null && !isNaN(b) && b >= 0 && b <= 1)
					material.specular.b = b
				else
					return "No valid 'b' component found in 'specular' node of material '" + matId + "'";

				if(a != null && !isNaN(a) && a >= 0 && a <= 1)
					material.specular.a = a
				else
					return "No valid 'a' component found in 'specular' node of material '" + matId + "'";
			}

			this.materials[matId] = material;
		}

		this.log("Parsed materials");

		return null;
    }

    /**
     * Parses the <TRANSFORMATIONS> block.
     * @param {transformations block element} transformationsNode
     */
    parseTransformations(transformationsNode) {

		this.transformations = [];
		let children = transformationsNode.children;

		if(children.length === 0) {
			return "No transformations found in the <TRANSFORMATIONS> element"
		}

		for(let i = 0; i < children.length; i++) {

			let transformation = {};

			// Get ID
			let transformationId = this.reader.getString(children[i], "id");
			if(transformationId == null) {
				return "A node with no ID was found in the <TRANSFORMATIONS> element";
			}

			// Check if ID is duplicate
			if(this.transformations[transformationId] != null) {
				return "A node with a duplicate ID was found in the <TRANSFORMATIONS> element ('" + transformationId + "')";
			}

			let grandChildren = children[i].children;

			if(grandChildren.length === 0) {
				return "A transformation with no instructions was found in the <TRANSFORMATIONS> element ('" + transformationId + "')";
			}

			transformation.operations = [];

			for(let j = 0; j < grandChildren.length; j++) {
				let op = {};

				if(grandChildren[j].nodeName.toUpperCase() === "TRANSLATE") {
				// Parse translation

					op.type = "translate";

					let x = this.reader.getFloat(grandChildren[j], 'x');
					let y = this.reader.getFloat(grandChildren[j], 'y');
					let z = this.reader.getFloat(grandChildren[j], 'z');
		
					if(x != null && !isNaN(x))
						op.x = x;
					else
						return "No valid 'x' component found in a 'translate' node (" + (j + 1) + ") of transformation '" + transformationId + "'";

					if(y != null && !isNaN(y))
						op.y = y;
					else
						return "No valid 'y' component found in 'translate' node (" + (j + 1) + ") of transformation '" + transformationId + "'";

					if(z != null && !isNaN(z))
						op.z = z;
					else
						return "No valid 'z' component found in 'translate' node (" + (j + 1) + ") of transformation '" + transformationId + "'";
				
				} else if(grandChildren[j].nodeName.toUpperCase() === "ROTATE") {
				// Parse rotation

					op.type = "rotate";

					let axis = this.reader.getString(grandChildren[j], 'axis');
					let angle = this.reader.getFloat(grandChildren[j], 'angle');
		
					if(axis != null && (axis.toUpperCase() === "X" || axis.toUpperCase() === "Y" || axis.toUpperCase() ==="Z"))
						op.axis = axis;
					else
						return "No valid 'axis' component found in a 'rotate' node (" + (j + 1) + ") of transformation '" + transformationId + "'";

					if(angle != null && !isNaN(angle))
						op.angle = angle;
					else
						return "No valid 'angle' component found in a 'rotate' node (" + (j + 1) + ") of transformation '" + transformationId + "'";

				} else if(grandChildren[j].nodeName.toUpperCase() === "SCALE") {
				// Parse scaling

					op.type = "scale";

					let x = this.reader.getFloat(grandChildren[j], 'x');
					let y = this.reader.getFloat(grandChildren[j], 'y');
					let z = this.reader.getFloat(grandChildren[j], 'z');
		
					if(x != null && !isNaN(x))
						op.x = x;
					else
						return "No valid 'x' component found in a 'scale' node (" + (j + 1) + ") of transformation '" + transformationId + "'";

					if(y != null && !isNaN(y))
						op.y = y;
					else
						return "No valid 'y' component found in a 'scale' node (" + (j + 1) + ") of transformation '" + transformationId + "'";

					if(z != null && !isNaN(z))
						op.z = z;
					else
						return "No valid 'z' component found in a 'scale' node (" + (j + 1) + ") of transformation '" + transformationId + "'";
					
				} else {
				// No valid operation was found

					return "An invalid instruction was found in the <TRANSFORMATIONS> element ('" 
						+ transformationId + "': '" 
						+ grandChildren[j].nodeName + "')";
					
				}

				transformation.operations.push(op);
			}

			this.transformations[transformationId] = transformation;
		}

        this.log("Parsed transformations");
        return null;
    }

    /**
     * Parses the <PRIMITIVES> block.
     * @param {primitives block element} primitivesNode
     */
    parsePrimitives(primitivesNode) {

		this.primitives = [];
		let children = primitivesNode.children;			

		for(let i = 0; i < children.length; i++) {

			let primitive = {};

			// Get ID
			let primitiveId = this.reader.getString(children[i], "id");
			if(primitiveId == null) {
				return "A node with no ID was found in the <PRIMITIVES> element";
			}

			// Check if ID is duplicate
			if(this.primitives[primitiveId] != null) {
				return "A node with a duplicate ID was found in the <PRIMITIVES> element ('" + primitiveId + "')";
			}

			let grandChildren = children[i].children;

			if(grandChildren.length === 0) {
				return "A primitive with no nodes was found in the <PRIMITIVES> element ('" + primitiveId + "')";
			} else if(grandChildren.length > 1) {
				return "Primitives must contain a single node only <PRIMITIVES> element ('" + primitiveId + "')";
			}

			let nodeName = grandChildren[0].nodeName.toUpperCase();
		
			// If tag is valid, parse its attributes
			switch(nodeName) {

				case "RECTANGLE": {
					primitive.type = "rectangle";

					let x1 = this.reader.getFloat(grandChildren[0], 'x1');
					let y1 = this.reader.getFloat(grandChildren[0], 'y1');

					let x2 = this.reader.getFloat(grandChildren[0], 'x2');
					let y2 = this.reader.getFloat(grandChildren[0], 'y2');

					// Point 1
					if(x1 != null && !isNaN(x1))
						primitive.x1 = x1;
					else
						return "No valid 'x1' component found in node '" + grandChildren[0].nodeName + "' of primitive '" + primitiveId + "'";
					if(y1 != null && !isNaN(y1))
						primitive.y1 = y1;
					else
						return "No valid 'y1' component found in node '" + grandChildren[0].nodeName + "' of primitive '" + primitiveId + "'";
		
					// Point 2
					if(x2 != null && !isNaN(x2))
						primitive.x2 = x2;
					else
						return "No valid 'x2' component found in node '" + grandChildren[0].nodeName + "' of primitive '" + primitiveId + "'";
					if(y2 != null && !isNaN(y2))
						primitive.y2 = y2;
					else
						return "No valid 'y2' component found in node '" + grandChildren[0].nodeName + "' of primitive '" + primitiveId + "'";

					break;
				}

				case "TRIANGLE": {
					primitive.type = "triangle";

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
					if(x1 != null && !isNaN(x1))
						primitive.x1 = x1;
					else
						return "No valid 'x1' component found in node '" + grandChildren[0].nodeName + "' of primitive '" + primitiveId + "'";
					if(y1 != null && !isNaN(y1))
						primitive.y1 = y1;
					else
						return "No valid 'y1' component found in node '" + grandChildren[0].nodeName + "' of primitive '" + primitiveId + "'";
					if(z1 != null && !isNaN(z1))
						primitive.z1 = z1;
					else
						return "No valid 'z1' component found in node '" + grandChildren[0].nodeName + "' of primitive '" + primitiveId + "'";
		
					// Point 2
					if(x2 != null && !isNaN(x2))
						primitive.x2 = x2;
					else
						return "No valid 'x2' component found in node '" + grandChildren[0].nodeName + "' of primitive '" + primitiveId + "'";
					if(y2 != null && !isNaN(y2))
						primitive.y2 = y2;
					else
						return "No valid 'y2' component found in node '" + grandChildren[0].nodeName + "' of primitive '" + primitiveId + "'";
					if(z2 != null && !isNaN(z2))
						primitive.z2 = z2;
					else
						return "No valid 'z2' component found in node '" + grandChildren[0].nodeName + "' of primitive '" + primitiveId + "'";
		
					// Point 3
					if(x3 != null && !isNaN(x3))
						primitive.x3 = x3;
					else
						return "No valid 'x3' component found in node '" + grandChildren[0].nodeName + "' of primitive '" + primitiveId + "'";
					if(y3 != null && !isNaN(y3))
						primitive.y3 = y3;
					else
						return "No valid 'y3' component found in node '" + grandChildren[0].nodeName + "' of primitive '" + primitiveId + "'";
					if(z3 != null && !isNaN(z3))
						primitive.z3 = z3;
					else
						return "No valid 'z3' component found in node '" + grandChildren[0].nodeName + "' of primitive '" + primitiveId + "'";

					break;
				}

				case "CYLINDER": {
					primitive.type = "cylinder";

					let base = this.reader.getFloat(grandChildren[0], 'base');
					let top = this.reader.getFloat(grandChildren[0], 'top');
					let height = this.reader.getFloat(grandChildren[0], 'height');
					
					let slices = this.reader.getInteger(grandChildren[0], 'slices');
					let stacks = this.reader.getInteger(grandChildren[0], 'stacks');

					// Base
					if(base != null && !isNaN(base) && base > 0)
						primitive.base = base;
					else
						return "No valid 'base' component found in node '" + grandChildren[0].nodeName + "' of primitive '" + primitiveId + "'";

					// Top
					if(top != null && !isNaN(top) && top > 0)
						primitive.top = top;
					else
						return "No valid 'top' component found in node '" + grandChildren[0].nodeName + "' of primitive '" + primitiveId + "'";

					// Height
					if(height != null && !isNaN(height) && height > 0)
						primitive.height = height;
					else
						return "No valid 'height' component found in node '" + grandChildren[0].nodeName + "' of primitive '" + primitiveId + "'";

					// Slices
					if(slices != null && !isNaN(slices) && slices > 0)
						primitive.slices = slices;
					else
						return "No valid 'slices' component found in node '" + grandChildren[0].nodeName + "' of primitive '" + primitiveId + "'";

					// Stacks
					if(stacks != null && !isNaN(stacks) && stacks > 0)
						primitive.stacks = stacks;
					else
						return "No valid 'stacks' component found in node '" + grandChildren[0].nodeName + "' of primitive '" + primitiveId + "'";

					break;
				}

				case "SPHERE": {
					primitive.type = "sphere";

					let radius = this.reader.getFloat(grandChildren[0], 'radius');
					
					let slices = this.reader.getInteger(grandChildren[0], 'slices');
					let stacks = this.reader.getInteger(grandChildren[0], 'stacks');

					// Radius
					if(radius != null && !isNaN(radius) && radius > 0)
						primitive.radius = radius;
					else
						return "No valid 'radius' component found in node '" + grandChildren[0].nodeName + "' of primitive '" + primitiveId + "'";

					// Slices
					if(slices != null && !isNaN(slices) && slices > 0)
						primitive.slices = slices;
					else
						return "No valid 'slices' component found in node '" + grandChildren[0].nodeName + "' of primitive '" + primitiveId + "'";

					// Stacks
					if(stacks != null && !isNaN(stacks) && stacks > 0)
						primitive.stacks = stacks;
					else
						return "No valid 'stacks' component found in node '" + grandChildren[0].nodeName + "' of primitive '" + primitiveId + "'";

					break;
				}

				case "TORUS": {
					primitive.type = "torus";

					let inner = this.reader.getFloat(grandChildren[0], 'inner');
					let outer = this.reader.getFloat(grandChildren[0], 'outer');
					
					let slices = this.reader.getInteger(grandChildren[0], 'slices');
					let loops = this.reader.getInteger(grandChildren[0], 'loops');

					// Inner (thickness)
					if(inner != null && !isNaN(inner) && inner > 0)
						primitive.inner = inner;
					else
						return "No valid 'inner' component found in node '" + grandChildren[0].nodeName + "' of primitive '" + primitiveId + "'";

					// Outer (aperture)
					if(outer != null && !isNaN(outer) && outer > 0)
						primitive.outer = outer;
					else
						return "No valid 'outer' component found in node '" + grandChildren[0].nodeName + "' of primitive '" + primitiveId + "'";

					// Slices
					if(slices != null && !isNaN(slices) && slices > 0)
						primitive.slices = slices;
					else
						return "No valid 'slices' component found in node '" + grandChildren[0].nodeName + "' of primitive '" + primitiveId + "'";

					// Loops
					if(loops != null && !isNaN(loops) && loops > 0)
						primitive.loops = loops;
					else
						return "No valid 'loops' component found in node '" + grandChildren[0].nodeName + "' of primitive '" + primitiveId + "'";

					break;
				}

				default: {
					return "A primitive containing an invalid tag was found in the <PRIMITIVES> element ('" + primitiveId + "')";
				}
			}

			this.primitives[primitiveId] = primitive;
		}

        this.log("Parsed primitives");
        return null;
    }

    /**
     * Parses the <COMPONENTS> block.
     * @param {nodes block element} componentsNode
     */
    parseComponents(componentsNode) {
        // TODO: Parse components block
        this.log("TODO: Parse components block");
		console.log(componentsNode); 	// DEBUG

        this.log("Parsed components");
        return null;
    }

    /*
     * Callback to be executed on any read error, showing an error on the console.
     * @param {string} message
     */
    onXMLError(message) {
        console.error("XML Loading Error: " + message);
        this.loadedOk = false;
    }

    /**
     * Callback to be executed on any minor error, showing a warning on the console.
     * @param {string} message
     */
    onXMLMinorError(message) {
        console.warn("Warning: " + message);
    }


    /**
     * Callback to be executed on any message.
     * @param {string} message
     */
    log(message) {
        console.log("   " + message);
	}
	

    /**
     * Displays the scene, processing each node, starting in the root node.
     */
    displayScene(nodeName, TexI, MatI) {
        // entry point for graph rendering
        //TODO: Render loop starting at root of graph
		
		// this.log(nodeName); // DEBUG

		// let material = MatI;
		// let textura = TexI;

		// if(nomeName != null) {
		// 	let node = this.graph[nodeName];

		// 	if(node.material != null) {
		// 		material = node.material;
		// 	}
		// 	if(node.textura != null) {
		// 		textura = node.textura;
		// 	}

		// 	this.mulMatrix(node.mat);

		// 	for(i = 0; i < node.descendants.length; i++) {
		// 		this.pushMatrix();

		// 		this.displayScene(node.descendants[i], textura, material);
				
		// 		this.popMatrix();
		// 	}
		// }

		// if(node.primitiva != null) {
		// 	// Aplicar Material
		// 	// Aplicar Textura

		// 	node.primitive.draw();
		// }

    }
}
