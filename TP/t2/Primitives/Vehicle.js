/**
 * Vehicle
 * @constructor
 */
class Vehicle extends CGFobject {
	constructor(scene) {
        super(scene);

        this.bodyBot = 1;
        this.bodyTop = 1;

        this.neckBot = this.bodyTop;
        this.neckMiddle = 0.5;
        this.neckTop = 0.35;

        this.bodyLength = 4;
        this.neckLength = 3;
        
        this.body = new Cylinder2(scene, this.bodyBot, this.bodyTop, this.bodyLength, 20, 20, 1, 1);
        this.neck1 = new Cylinder2(scene, this.neckBot, this.neckMiddle, this.neckLength / 3.0, 20, 20, 1, 1);
        this.neck2 = new Cylinder2(scene, this.neckMiddle, this.neckTop, 2 * this.neckLength / 3.0, 20, 20, 1, 1);

        this.base = new Cylinder2(scene, this.bodyBot, 0.001, -this.bodyLength / 10, 20, 20, 1, 1);

        this.torus = new MyTorus(scene, this.neckTop / 6.0, 0.65 * this.neckTop, 30, 30, 1, 1);
	}

	display() {
        this.scene.pushMatrix();
        this.scene.rotate(-Math.PI / 2.0, 1, 0, 0);

        this.scene.pushMatrix();
        this.scene.rotate(Math.PI, 0, 0, 1);
        this.scene.rotate(Math.PI, 1, 0, 0);

        this.base.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();

        this.body.display();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();
        this.scene.translate(0, 0, this.bodyLength);

        this.neck1.display();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();
        this.scene.translate(0, 0, this.bodyLength + this.neckLength / 3.0);

        this.neck2.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, -0.18 * this.neckTop, this.bodyLength + this.neckLength);

        this.torus.display();
        this.scene.popMatrix();

        this.scene.popMatrix();
	}
}
