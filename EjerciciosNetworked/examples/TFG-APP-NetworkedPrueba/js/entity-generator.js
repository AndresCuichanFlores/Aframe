import * as CONSTANTS from './constants.js';

AFRAME.registerComponent('entity-generator', {
  init: function () {
    //console.log("################## entityGenerator INIT");
    let self = this;
    self.bButtonPressed = false;
    self.yButtonPressed = false;

    // GENERADOR PARA PC
    document.addEventListener('keydown', function (event) {
      if (event.code === 'Space') {
        self.createMenuInit();
      }
    });

    // GENERADOR PARA OCULUS
    document.addEventListener('bbuttondown', function () {
      self.bButtonPressed = true;
      self.checkBothButtons();
    });
    document.addEventListener('bbuttonup', function () {
      self.bButtonPressed = false;
    });
    document.addEventListener('ybuttondown', function () {
      self.yButtonPressed = true;
      self.checkBothButtons();
    });
    document.addEventListener('ybuttonup', function () {
      self.yButtonPressed = false;
    });

},

  update: function () {
    //console.log("################## entityGenerator UPDATE");
  },

  checkBothButtons: function () {
    if (this.bButtonPressed && this.yButtonPressed) {
      this.createMenuInit();
    }
  },

  createMenuInit: function () {
    let scene = this.el.sceneEl;
    let positionPlayer = document.querySelector("#rig-player").getAttribute('position');
    let entidadCreation = document.createElement('a-entity');
    entidadCreation.setAttribute('id', 'InitCreation');
    entidadCreation.setAttribute('networked', 'template:#auxInit-template');
    entidadCreation.setAttribute('creation', '');
    let newPosition = this.searchPositionMenu();
    entidadCreation.setAttribute('position', `${newPosition.x} ${newPosition.y} ${newPosition.z}`);

    scene.appendChild(entidadCreation);
  },

  searchPositionMenu: function () {
    let rig = document.querySelector("#player")
    let rotation = rig.getAttribute('rotation');
    let radianY = rotation.y * (Math.PI / 180);
    let direction = {
      x: -Math.sin(radianY),
      z: -Math.cos(radianY)
    };
    let position = document.querySelector("#rig-player").getAttribute('position');
    let newPosition = {
      x: position.x + direction.x * 10,
      y: 0, // Mantener la misma altura
      z: position.z + direction.z * 10
    };

    return newPosition;
  },

});