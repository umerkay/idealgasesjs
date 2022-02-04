//normalised values
let tempCoeff = 273.15 / 500;
let imfCoeff = 0.1;
let gravCoeff = 0.2;
let avgIndTempCoeff = 1;

let gravity = new Vector(0, gravCoeff);

function Initiate() {
  EntityTree = new Tree(width / 2, height / 2, width / 2, height / 2, 4); //create Quad Tree for storing everything
  for (let i = 0; i < 1000; i++) {
    EntityTree.add(new Particle(random(width), random(height), 5));
  }
}

function Loop() {
  background(200);

  gravity = new Vector(0, gravCoeff);

  const agents = EntityTree.allLeaves;

  avgIndTempCoeff = 0;
  for (let point of agents) {
    avgIndTempCoeff += point.tempCoeff;
    point.act(EntityTree);
  }
  avgIndTempCoeff /= agents.length;

  for (point of agents) {
    point.update();
    point.render();
  }

  EntityTree.restructure();
  if (Options.Debug.showEntityTree) EntityTree.render();

  //   fill(red);
  //   rect(width / 2, height - 1, width, 2);

  fill(black);
  this.currentCtx.textAlign = "start";
  text(this._frames_last, 20, 20, "left");
  text(Math.floor(avgIndTempCoeff * tempCoeff * 500) + " K", 20, 40, "left");
}
let mySketch;
function run() {
  mySketch = new Sketch({
    width: 500,
    height: 500,
    frameRate: 30,
    container: "output",
  })
    //   mySketch = new Sketch({
    //     width,
    //     height: height - 4,
    //     frameRate: 30,
    //     container: "output",
    //   })
    .init(Initiate)
    .loop(Loop);
  Sketches.loop();
}
