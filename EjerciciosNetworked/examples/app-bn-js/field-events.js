
AFRAME.registerComponent('field-events', {

    init: function () {
      console.log("################## INIT poster-events");
    },

    update: function () {
      console.log("################## UPDATE poster-events");
    },

    menu: {
      queryes: ["folder_json", "folder_csv", "folder_search"],
      graphs: ["graph2", "graph3", "graph4"],
      filters: []
    },


    events: {
      mouseenter: function (evt) {
        //console.log("################## mouseenter poster-events");
        NAF.utils.takeOwnership(this.el);
        this.el.setAttribute('animation', { 'property': 'scale', 'to': '1.2 1.2 1.2', 'dur': '200' });

      },
      mouseleave: function (evt) {
        //console.log("################## mouseleave poster-events");
        this.el.setAttribute('animation', { 'property': 'scale', 'to': '1 1 1', 'dur': '200' });

      },
      click: function (evt) {
        console.log("################## click poster-events");
        NAF.utils.takeOwnership(this.el);
        this.el.children[0].setAttribute('visible', 'true');
        //this.el.children[0].setAttribute('material','color', 'blue');

        document.querySelectorAll('.main-row').forEach(entityField => {
          if (this.el.children[0] !== entityField.children[0]) {
            NAF.utils.takeOwnership(entityField);
            entityField.children[0].setAttribute('visible', 'false');
            //entityField.children[0].setAttribute('material','color', 'red');
          }
        });

        this.createValuesMenu();

      }
    },

    createValuesMenu: function () {
      console.log("################## createValuesMenu  ##################");
      let self = this;
      let selectedField = self.el.getAttribute('id');
      var platformTop = document.getElementById("platform_top");

      //elimino todos los hijos 
      platformTop.innerHTML = '';

      //agrego todos los hijos del campo seleccionado
      self.menu[selectedField].forEach(function (value, index) {

        let radius = 2.5;
        let angle = (Math.PI * 2 / self.menu.queryes.length) * index;
        let x = radius * Math.cos(angle);
        let z = radius * Math.sin(angle);

        let entityChildren = document.createElement('a-entity');
        entityChildren.setAttribute('id', value);
        entityChildren.setAttribute('networked', {'template': '#' + value + '-template', 'networkId': value});
        entityChildren.setAttribute('property-events', '');
        entityChildren.setAttribute('position', { x: x, y: 1, z: z });
        entityChildren.setAttribute('animation', {
          'property': 'rotation', 
          'to': '0 360 0',
          'dur': '8000', 
          'easing': 'linear',
          'loop': 'true'
        });
        entityChildren.setAttribute('animation__1', {
          'property': 'scale', 
          'to': '0.2 0.2 0.2',
          'dur': '500', 
        });
        platformTop.appendChild(entityChildren);
      });
    },
  });
