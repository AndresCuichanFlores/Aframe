

AFRAME.registerComponent('events-controller', {
  schema: {
    activateController: { type: 'boolean', default: "" },
    pressbuttonxa: { type: 'boolean', default: false }
  },

  init: function () {
    console.log("################## events-controller ");
    let self = this;

    /*
    document.addEventListener('raycaster-intersection', (evt) => {
      //console.log('Intersecting with: ');
    });

    document.addEventListener('raycaster-intersection-cleared', (evt) => {
        //console.log('Raycast cleared from the box');
    });
    */

    //INTERACTUAR VR
    document.addEventListener('abuttondown', () => {
      console.log("CLICK abuttondown")
      self.data.pressbuttonxa = true;
    });

    document.addEventListener('xbuttondown', () => {
      console.log("CLICK abuttondown")
      self.data.pressbuttonxa = true;
    });

    // GENERADOR MENUS PARA VR
    self.bButtonPressed = false;
    self.yButtonPressed = false;
    
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

    // GENERADOR MENUS PARA PC
    document.addEventListener('keydown', function (event) {
      if (event.code === 'Space') {
        self.createMenuInit();
      }
    });

  },

  update: function () {
    //console.log("################## remove-component UPDATE ");
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
      y: 0,
      z: position.z + direction.z * 10
    };

    return newPosition;
  },

});