class Particle extends Circle {
  constructor(x, y, r, color) {
    super(x, y, r);

    // this.maxSpeed = 4;
    // this.mass = this.r / 100;
    // this.frictionCoeff = 100;

    this.vel = Vector.random2D().mult(
      random([-tempCoeff * 10, tempCoeff * 10])
    );
    this.tempCoeff = 1; //x: 0<x<1
    this.acc = new Vector(0, 0);

    this.color = color || Color(100);
  }

  act(peerTree) {
    const colliding = peerTree.retrieveFromRadius(
      this.pos.x,
      this.pos.y,
      this.r
    );
    if (colliding.length > 1) {
      this.seperate(colliding);
    } else if (imfCoeff > 0) {
      const inPerception = peerTree.retrieveFromRadius(
        this.pos.x,
        this.pos.y,
        imfCoeff * width
      );
      this.cohesion(inPerception);
    }
  }

  seperate(peers) {
    const sum = new Vector();
    let count = 0;

    peers.forEach((peer) => {
      if (peer !== this) {
        const diff = Vector.sub(this.pos, peer.pos);
        sum.add(diff);
        count++;

        // this.tempCoeff = (this.tempCoeff + peer.tempCoeff) / 2;
        // peer.tempCoeff = this.tempCoeff;
        let temp = this.tempCoeff - peer.tempCoeff;
        if (temp > 0) {
          this.tempCoeff -= temp / 100;
          peer.tempCoeff += temp / 100;
        } else {
          this.tempCoeff += temp / 100;
          peer.tempCoeff -= temp / 100;
        }
      }
    });

    if (count > 0) {
      sum.setMag(this.vel.mag());
      this.vel.set(sum.x, sum.y);
      //   sum.div(count ** 2);
      //   this.applyForce(sum);
      /*
	  We assume collisions are instantenous and entirely elastic,
	  and so the change in momentum (hence velocity) is instantaneous and is
	  not represented by a force that acts over time.
	  */
    }
  }

  cohesion(peers) {
    const sum = new Vector();
    let count = 0;

    peers.forEach((peer) => {
      const diff = Vector.sub(this.pos, peer.pos);
      if (peer !== this) {
        sum.add(diff.div(diff.magSq()));
        count++;
      }
    });

    if (count > 0) {
      this.applyForce(sum.div(-count).mult(imfCoeff * 1000));
      if (Options.Debug.showIMF) {
        stroke(0, 255, 0);
        line(
          this.pos.x,
          this.pos.y,
          this.pos.x + sum.x * 10,
          this.pos.y + sum.y * 10
        );
      }
    }
    return count;
  }

  update() {
    this.applyForce(gravity);
    this.vel.add(this.acc);
    this.vel.setMag(this.tempCoeff * tempCoeff * 4);

    this.acc.set(0, 0);
    this.contain();
    this.pos.add(this.vel);
  }

  contain() {
    if (this.pos.x + this.vel.x < this.r) {
      //cold plate
      //   this.tempCoeff *= 0.8;

      this.vel.x *= -1;
      this.pos.x = this.r;
    } else if (this.pos.x + this.vel.x > width - this.r) {
      //cold plate
      //   this.tempCoeff *= 0.8;

      this.vel.x *= -1;
      this.pos.x = width - this.r;
    } else if (this.pos.y + this.vel.y < this.r) {
      //cold plate
      //   this.tempCoeff *= 0.8;

      this.vel.y *= -1;
      this.pos.y = this.r;
    } else if (this.pos.y + this.vel.y > height - this.r) {
      //hot plate
      //   this.tempCoeff *= 1.1;

      this.vel.y *= -1;
      this.pos.y = height - this.r;
    }
  }

  render() {
    if (Options.Debug.showElectronCloud) {
      noStroke();
      fill(
        100 + this.color.r * (this.vel.magSq() / 30),
        100,
        100 + this.color.b * (1 - this.vel.magSq() / 30)
      );
      ellipse(this.pos.x, this.pos.y, this.r);
    }
    fill(black);
    ellipse(this.pos.x, this.pos.y, 1);
  }

  applyForce(force) {
    if (!force) return;
    this.acc.add(force.copy().div(this.r));
  }
}
