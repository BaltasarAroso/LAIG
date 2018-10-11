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
            if ((error = this.parseNodes(nodes[index])) != null)
                return error;
        }

        // <PRIMITIVES>
        if ((index = nodeNames.indexOf("PRIMITIVES")) == -1)
            return "tag <PRIMITIVES> missing";
        else {
            if (index != PRIMITIVES_INDEX)
                this.onXMLMinorError("tag <PRIMITIVES> out of order");

            //Parse PRIMITIVES block
            if ((error = this.parseNodes(nodes[index])) != null)
                return error;
        }

        // <COMPONENTS>
        if ((index = nodeNames.indexOf("COMPONENTS")) == -1)
            return "tag <COMPONENTS> missing";
        else {
            if (index != COMPONENTS_INDEX)
                this.onXMLMinorError("tag <COMPONENTS> out of order");

            //Parse COMPONENTS block
            if ((error = this.parseNodes(nodes[index])) != null)
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

        var children = lightsNode.children;

        this.lights = [];
        var numLights = 0;

        var grandChildren = [];
        var nodeNames = [];

        // Any number of lights.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "LIGHT") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current light.
            var lightId = this.reader.getString(children[i], 'id');
            if (lightId == null)
                return "no ID defined for light";

            // Checks for repeated IDs.
            if (this.lights[lightId] != null)
                return "ID must be unique for each light (conflict: ID = " + lightId + ")";

            grandChildren = children[i].children;
            // Specifications for the current light.

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            // Gets indices of each element.
            var enableIndex = nodeNames.indexOf("enable");
            var positionIndex = nodeNames.indexOf("position");
            var ambientIndex = nodeNames.indexOf("ambient");
            var diffuseIndex = nodeNames.indexOf("diffuse");
            var specularIndex = nodeNames.indexOf("specular");

            // Light enable/disable
            var enableLight = true;
            if (enableIndex == -1) {
                this.onXMLMinorError("enable value missing for ID = " + lightId + "; assuming 'value = 1'");
            }
            else {
                var aux = this.reader.getFloat(grandChildren[enableIndex], 'value');
                if (!(aux != null && !isNaN(aux) && (aux == 0 || aux == 1)))
                    this.onXMLMinorError("unable to parse value component of the 'enable light' field for ID = " + lightId + "; assuming 'value = 1'");
                else
                    enableLight = aux == 0 ? false : true;
            }

            // Retrieves the light position.
            var positionLight = [];
            if (positionIndex != -1) {
                // x
                var x = this.reader.getFloat(grandChildren[positionIndex], 'x');
                if (!(x != null && !isNaN(x)))
                    return "unable to parse x-coordinate of the light position for ID = " + lightId;
                else
                    positionLight.push(x);

                // y
                var y = this.reader.getFloat(grandChildren[positionIndex], 'y');
                if (!(y != null && !isNaN(y)))
                    return "unable to parse y-coordinate of the light position for ID = " + lightId;
                else
                    positionLight.push(y);

                // z
                var z = this.reader.getFloat(grandChildren[positionIndex], 'z');
                if (!(z != null && !isNaN(z)))
                    return "unable to parse z-coordinate of the light position for ID = " + lightId;
                else
                    positionLight.push(z);

                // w
                var w = this.reader.getFloat(grandChildren[positionIndex], 'w');
                if (!(w != null && !isNaN(w) && w >= 0 && w <= 1))
                    return "unable to parse x-coordinate of the light position for ID = " + lightId;
                else
                    positionLight.push(w);
            }
            else
                return "light position undefined for ID = " + lightId;

            // Retrieves the ambient component.
            var ambientIllumination = [];
            if (ambientIndex != -1) {
                // R
                var r = this.reader.getFloat(grandChildren[ambientIndex], 'r');
                if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
                    return "unable to parse R component of the ambient illumination for ID = " + lightId;
                else
                    ambientIllumination.push(r);

                // G
                var g = this.reader.getFloat(grandChildren[ambientIndex], 'g');
                if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
                    return "unable to parse G component of the ambient illumination for ID = " + lightId;
                else
                    ambientIllumination.push(g);

                // B
                var b = this.reader.getFloat(grandChildren[ambientIndex], 'b');
                if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
                    return "unable to parse B component of the ambient illumination for ID = " + lightId;
                else
                    ambientIllumination.push(b);

                // A
                var a = this.reader.getFloat(grandChildren[ambientIndex], 'a');
                if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
                    return "unable to parse A component of the ambient illumination for ID = " + lightId;
                else
                    ambientIllumination.push(a);
            }
            else
                return "ambient component undefined for ID = " + lightId;

            // TODO: Retrieve the diffuse component
            this.log("Retrieve the diffuse component");

            // TODO: Retrieve the specular component
            this.log("TODO: Retrieve the specular component");

            // TODO: Store Light global information.
            this.log("TODO: Store Light global information.");
            //this.lights[lightId] = ...;
            numLights++;
        }

        if (numLights == 0)
            return "at least one light must be defined";
        else if (numLights > 8)
            this.onXMLMinorError("too many lights defined; WebGL imposes a limit of 8 lights");

        this.log("Parsed lights");

        return null;
    }

    /**
     * Parses the <TEXTURES> block. 
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) {
        // TODO: Parse block
        this.log("TODO: Parse block");

        console.log("Parsed textures");

        return null;
    }

    /**
     * Parses the <MATERIALS> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {
        // TODO: Parse block
        this.log("TODO: Parse block");

        this.log("Parsed materials");
        return null;

    }

    /**
     * Parses the <NODES> block.
     * @param {nodes block element} nodesNode
     */
    parseNodes(nodesNode) {
        // TODO: Parse block
        this.log("TODO: Parse block");

        this.log("Parsed nodes");
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
