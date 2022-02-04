window.onload = loaded;
const __mouseClickPos = { x: 0, y: 0 };

const optionsToBuild = {
  Debug: {
    config: {
      autoReset: false,
      inputEvt: "input",
      exclude: true,
    },
  },
  Debug: {
    config: {
      autoReset: false,
      inputEvt: "input",
      title: "Toggle hints and indications for debugging and understanding",
    },
    pause: {
      type: "checkbox",
      checked: false,
      onChange: (value) => (value ? mySketch.stopLoop() : mySketch.doLoop()),
      exclude: true,
      title: "Pause the simulation",
    },
    toggleAll: {
      type: "checkbox",
      checked: false,
      title:
        "Show debugging aids: Checks all other show options in the debug category",
      exclude: true,
      onChange: (checked) => {
        for (let key in Options.Debug) {
          if (optionsToBuild.Debug[key].exclude) continue;
          const el = document.getElementsByName(key)[0];
          el.checked = checked;
          el.dispatchEvent(new Event("click"));
        }
      },
    },
    showElectronCloud: {
      type: "checkbox",
      checked: true,
      title: "Draws an electron cloud around the atomic nuclei",
    },
    showIMF: {
      type: "checkbox",
      checked: false,
      title: "Shows intermolecular forces as a line",
    },
    showEntityTree: {
      type: "checkbox",
      checked: false,
      title:
        "Draws the structure of the quad tree used to computationally store the molecules",
    },
  },
  Coefficients: {
    config: {
      autoReset: false,
      inputEvt: "input",
    },
    Temperature: {
      type: "number",
      value: tempCoeff * 500,
      min: "0",
      // max: "100",
      step: "5",
      title: "Average temperature (K)",
      onChange: (value) => (tempCoeff = (value || 0) / 500),
    },
    IntermolecularForces: {
      type: "range",
      value: imfCoeff * 100,
      min: "0",
      max: "500",
      step: "1",
      title: "Strength *and* range of attraction between molecules",
      onChange: (value) => (imfCoeff = (value || 0) / 100),
    },
    Gravity: {
      type: "range",
      value: gravCoeff * 100,
      min: "1",
      max: "500",
      step: "1",
      title: "Strength of attraction towards the bottom of the container",
      onChange: (value) => (gravCoeff = (value || 1) / 100),
    },
  },
};

const Options = {};

function loaded() {
  const body = document.querySelector("#toolbox .body");

  for (let group in optionsToBuild) {
    const container = document.createElement("div");
    const groupObj = optionsToBuild[group];

    container.title = groupObj.config?.title || group;
    container.innerHTML = group;
    if (groupObj.config?.autoReset) container.innerHTML += " (Auto Reset)";
    container.classList.add("main");
    body.appendChild(container);

    const options = optionsToBuild[group];
    Options[group] = {};

    for (let optionName in options) {
      if (optionName === "config") continue;

      const option = options[optionName];
      const { type, value, checked, onChange, title, num } = option;

      const optionContainer = document.createElement("div");
      if (title) optionContainer.title = title;
      optionContainer.classList.add("option");

      const label = document.createElement("label");
      label.htmlFor = optionName;
      label.innerHTML = optionName;
      optionContainer.appendChild(label);

      if (option.isHeading) {
        label.classList.add("heading");
      } else {
        let input = document.createElement("input");
        for (let key in option) input[key] = option[key];
        input.name = optionName;
        input.value = value;

        const inputEvt =
          type == "checkbox" ? "click" : groupObj.config.inputEvt || "input";
        const targetProp = type == "checkbox" ? "checked" : "value";

        input.addEventListener(inputEvt, (e) => {
          const value =
            type !== "checkbox" && num !== false
              ? parseFloat(e.target[targetProp])
              : e.target[targetProp];
          Options[group][e.target.name] = value;
          if (onChange) onChange(value);
          if (groupObj.config.autoReset || option.autoReset) {
            mySketch.reset();
          }
        });
        optionContainer.appendChild(input);
        Options[group][optionName] = parseFloat(value) || checked;
      }

      body.appendChild(optionContainer);
    }
  }

  document
    .querySelector("#toolbox .head")
    .addEventListener("mousedown", mouseDown, false);
  window.addEventListener("mouseup", mouseUp, false);

  document
    .querySelector(".minimisebtncontainer")
    .addEventListener("click", (e) => {
      e.stopPropagation();
      document.querySelector("#toolbox").classList.toggle("minimise");
    });
  document
    .querySelector(".resetbtncontainer")
    .addEventListener("click", (e) => {
      e.stopPropagation();
      mySketch.init(mySketch._init);
    });

  run();
}

function mouseUp() {
  window.removeEventListener("mousemove", divMove, true);
}

function mouseDown(e) {
  __mouseClickPos.x = e.offsetX;
  __mouseClickPos.y = e.offsetY;
  window.addEventListener("mousemove", divMove, true);
}

function divMove(e) {
  var div = document.getElementById("toolbox");
  div.style.position = "absolute";
  div.style.top = max(0, e.clientY - __mouseClickPos.y) + "px";
  div.style.left =
    min(
      document.body.clientWidth - div.clientWidth,
      e.clientX - __mouseClickPos.x
    ) + "px";
}
