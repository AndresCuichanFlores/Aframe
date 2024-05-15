

AFRAME.registerComponent('property-events', {

    init: function () {
        console.log("################## INIT property-events");
    },

    update: function () {
        //console.log("################## UPDATE property-events");
    },

    menu: {
        queryes: ["#folder_jsone-template", "#folder_csv-template", "#folder_search-template"],
        graphs: ["#graph2-template", "#graph3-template", "#graph4-template"],
        filters: []
    },


    events: {
        mouseenter: function (evt) {
            //console.log("################## mouseenter poster-events");
            //NAF.utils.takeOwnership(this.el);
            //this.el.setAttribute('animation', { 'property': 'scale', 'to': '1.2 1.2 1.2', 'dur': '200' });

        },
        mouseleave: function (evt) {
            //console.log("################## mouseleave poster-events");
            //this.el.setAttribute('animation', { 'property': 'scale', 'to': '1 1 1', 'dur': '200' });

        },
        click: function (evt) {
            console.log("################## click property-events");

            //console.log(this.el)
            //console.log(this.el.getAttribute('id'))
            var scene = this.el.sceneEl;
            var scenery = document.getElementById("scenery");
            var platformTop = document.getElementById("platform_top");

            scenery.removeChild(platformTop);

            //Crear la plataforma de nuevo pero con movimiento y cambio de color
            let entityCreate1 = document.createElement('a-entity');
            entityCreate1.setAttribute('geometry', {
              'primitive': 'cylinder', 
              'radius': '3.5',
              'height': '0.2', 
            });
            entityCreate1.setAttribute('position', '0 0.2 -6');
            entityCreate1.setAttribute('material', 'color', '#24D1D3');
            entityCreate1.setAttribute('animation', {
              'property': 'rotation', 
              'to': '0 360 360',
              'dur': '900', 
              'easing': 'linear', 
              'loop': 'one', 
            });
            entityCreate1.setAttribute('animation__1', {
                'property': 'material.color', 
                'to': '#C99E10',
                'dur': '800', 
              });
            scenery.appendChild(entityCreate1);

            //Crear Elemento selecionado otra vez
            let entityParent = document.createElement('a-entity');
            entityParent.classList.add("createdEntity");

            let entityChildren = document.createElement('a-entity');
            entityChildren.setAttribute('networked', 'template', '#' + this.el.getAttribute('id') + '-template');
            entityChildren.setAttribute('position', { x: 0, y: 1, z: -6 } );
            entityChildren.setAttribute('configuration-ui', '');
            entityChildren.setAttribute('animation__1', {
                'property': 'scale', 
                'to': '0.3 0.3 0.3',
                'dur': '500', 
                'delay':'800'
            });
            entityParent.appendChild(entityChildren);

            scene.appendChild(entityParent);

            //borrar el menu de create
            var entityCreateUI = document.getElementById("createUI");
            scene.removeChild(entityCreateUI);
        }
    },

    createValuesMenu: function () {

    },


});