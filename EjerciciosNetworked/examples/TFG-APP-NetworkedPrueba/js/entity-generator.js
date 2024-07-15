import * as CONSTANTS from './constants.js';

AFRAME.registerComponent('entity-generator', {
  init: function () {
    //console.log("################## entityGenerator INIT");
    let self = this;
    let scene = self.el.sceneEl;

    document.addEventListener('keydown', function (event) {
      if (event.code === 'Space') {
        let positionPlayer = document.querySelector("#rig-player").getAttribute('position');
        let entidadCreation = document.createElement('a-entity');
        entidadCreation.setAttribute('id', 'InitCreation');
        entidadCreation.setAttribute('networked', 'template:#creationInit-template');
        entidadCreation.setAttribute('position', { x: positionPlayer.x, y: 0, z: positionPlayer.z});
        entidadCreation.setAttribute('creation', '');
        scene.appendChild(entidadCreation);
      }
    });
  },

  update: function () {
    //console.log("################## entityGenerator UPDATE");
  },
});