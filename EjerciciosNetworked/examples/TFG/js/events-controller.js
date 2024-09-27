

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

    //INTERACTUAR TRIGGER VR
    document.addEventListener('triggerdown', () => {
      console.log("CLICK abuttondown")
      self.data.pressbuttonxa = true;
    });

    //GENERADOR INTERFAZ DE USUARIO INICIAL PARA VR
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

    //GENERADOR INTERFAZ DE USUARIO INICIAL PARA PC
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
    let entidadCreation = document.createElement('a-entity');
    entidadCreation.setAttribute('id', 'InitCreation');
    entidadCreation.setAttribute('networked', 'template:#auxInit-template');
    entidadCreation.setAttribute('creation', '');
    let newPosition = this.searchPositionMenu();
    entidadCreation.object3D.position.copy(newPosition);

    scene.appendChild(entidadCreation);
  },

  searchPositionMenu: function () {

    var distance = -12; 
    let player = document.querySelector("#player");
    var direction = new THREE.Vector3();
    var childWorldPosition = new THREE.Vector3();
    var newPosition = new THREE.Vector3();

    player.object3D.getWorldPosition(childWorldPosition);
    player.object3D.getWorldDirection(direction);
    newPosition.copy(childWorldPosition).add(direction.multiplyScalar(distance));
    newPosition.y = 0

    //console.log("Posición de la nueva entidad:", newPosition);
    return newPosition;
  },

});