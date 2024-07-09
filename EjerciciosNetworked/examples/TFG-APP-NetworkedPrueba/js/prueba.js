
AFRAME.registerComponent('prueba', {
  init: function () {
    console.log("################## PRUEBA INIT ");

    let self = this;
    let scene = self.el.sceneEl;

    document.addEventListener('keydown', function (event) {
      if (event.code === 'KeyM') {
        //console.log('¡Se presionó la barra espaciadora!');
        //console.log(document.querySelector("#rig-player").getAttribute('position'));
        //let positionPlayer = document.querySelector("#rig-player").getAttribute('position');
        /*
        let entidadCreation = document.createElement('a-entity');
        entidadCreation.setAttribute('position', { x: 0, y: 0, z: -2});
        entidadCreation.setAttribute('networked', 'template:#plato-template');
        */

        //PLATO NETWORKED
        let entidadPlato = document.createElement('a-entity');
        entidadPlato.setAttribute('networked', 'template:#platoInit-template');
        entidadPlato.setAttribute('scale', '0 0 1');
        entidadPlato .setAttribute('material', 'color', "purple");
        entidadPlato.setAttribute('position', { x: 0, y: 0, z: -2});
        entidadPlato.setAttribute('geometry', {
          'primitive': 'cylinder',
          'radius': '4',
          'height': '0.3',
        });
        entidadPlato.setAttribute('animation', {
          'property': 'rotation',
          'to': '0 360 0',
          'dur': '30000',
          'easing': 'linear',
          'loop': 'true'
        });
        entidadPlato.setAttribute('animation__1', {
          'property': 'scale',
          'to': '1 1 1',
          'dur': '1000',
          'easing': 'linear',
        });

        //OJECTS DENTRO DEL PLATO
        let entidadObject = document.createElement('a-entity');
        entidadObject.setAttribute('networked', {
          'template': '#objectInit-template',
          'networkId': 'objecto1'
        });
        entidadObject.setAttribute('position', { x: 0, y: 2, z: 0});
        entidadObject.setAttribute('gltf-model', '3Dmodels/folder1.glb');
        entidadObject.setAttribute('scale', '0.2 0.2 0.2');
        entidadObject.setAttribute('animation', {
            'property': 'rotation',
            'to': '0 360 0',
            'dur': '15000',
            'easing': 'linear',
            'loop': 'true'
        });

        //OJECTS DENTRO DEL PLATO
        let entidadText = document.createElement('a-entity');
        entidadText.setAttribute('networked', 'template:#textInit-template');
        entidadText.classList.add("topNameObject");
        entidadText.setAttribute('text', {
          'value': 'Babia-QueryJson',
          'align': 'center',
          'side': 'double',
          'color': 'WHITE',
          'shader': 'msdf',
          'font': 'https://raw.githubusercontent.com/etiennepinchon/aframe-fonts/master/fonts/berkshireswash/BerkshireSwash-Regular.json'
        });

        entidadText.setAttribute('scale', '50 50 50');
        entidadText.setAttribute('position', { x: 0, y: 2.3, z: 0 });

        entidadObject.appendChild(entidadText);
        entidadPlato.appendChild(entidadObject);
        scene.appendChild(entidadPlato);

      }
    });

  },

  update: function () {
    //console.log("################## events-object-configuration UPDATE ");
  },


});