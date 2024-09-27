import * as CONSTANTS from './constants.js';

AFRAME.registerComponent('menu-disco', {
    schema: {
        colorDisco: { type: 'string', default: '' },
        objectsStage: { type: 'array', default: [] },
        objectType: { type: 'string', default: '' },
    },

    init: function () {
        //console.log("################## menu-disco INIT ");
        this.customizeDiscoStage();
        this.createObjectsStage('folder1');
    },

    update: function () {
        //console.log("################## menu-disco UPDATE");
    },

    customizeDiscoStage: function () {
        //console.log("################## menu-disco customizeDiscoStage  ##################");
        this.el.setAttribute('scale', '0 0 1');
        this.el.setAttribute('material', 'color', this.data.colorDisco);
        this.el.setAttribute('geometry', {
            'primitive': 'cylinder',
            'radius': '4',
            'height': '0.3',
        });
        this.el.setAttribute('animation', {
            'property': 'rotation',
            'to': '0 360 0',
            'dur': '30000',
            'easing': 'linear',
            'loop': 'true'
        });
        this.el.setAttribute('animation__1', {
            'property': 'scale',
            'to': '1 1 1',
            'dur': '1000',
            'easing': 'linear',
        });
    },

    createObjectsStage: function (nameObjectGLB) {
        //console.log("################## menu-disco createObjectsStage  ##################");
        let self = this;
        let radius = 3.2;
        let posicionNueva = { x: 0, y: 0, z: 0 };
        let complementsGraph = [CONSTANTS.BABIAPIE, CONSTANTS.BABIADOUGHNUT];

        this.data.objectsStage.forEach(function (object, index) {
            /*
                if (self.data.objectsStage.length != 1) {
                let angle = (Math.PI * 2 / self.data.objectsStage.length) * index;
                posicionNueva = { x: radius * Math.cos(angle), y: 0, z: radius * Math.sin(angle) };
            }
            */
            let angle = (Math.PI * 2 / self.data.objectsStage.length) * index;
            posicionNueva = { x: radius * Math.cos(angle), y: 0, z: radius * Math.sin(angle) };

            let entityObject;
            if (complementsGraph.includes(object)) {
                entityObject = createObjectGraph(object, posicionNueva);
            } else {
                entityObject = createObject(self, object, nameObjectGLB, posicionNueva);
            }

            self.el.appendChild(entityObject);
        })
    },
});


let createObjectGraph = (object, position) => {
    //console.log("################## menu-disco createObject  ##################");
    position.y = 1.5;

    let entityObjectGraph = document.createElement('a-entity');
    //entityObjectGraph.classList.add("objectRayCaster");
    entityObjectGraph.setAttribute('networked', 'template', '#graphInit-template');
    entityObjectGraph.setAttribute('rotation', '0 0 0');
    entityObjectGraph.setAttribute('scale', '0.6 0.6 0.6');
    entityObjectGraph.classList.add("objectRayCaster");
    entityObjectGraph.setAttribute(object, {
        'from': 'dataInicial',
        'key': 'model',
        'size': 'sales',
        'palette': 'blues',
        'legend_lookat': '#rig-player'
    });

    let entityTextObject = document.createElement('a-entity');
    entityTextObject.setAttribute('networked', 'template:#textInit-template');
    entityTextObject.classList.add("topNameObject");
    entityTextObject.setAttribute('text', {
        'value': object,
        'align': 'center',
        'side': 'double',
        'color': 'WHITE',
        'shader': 'msdf',
        'font': 'https://raw.githubusercontent.com/etiennepinchon/aframe-fonts/master/fonts/berkshireswash/BerkshireSwash-Regular.json'
    });
    entityTextObject.setAttribute('scale', '10 10 10');
    entityTextObject.setAttribute('rotation', '-90 0 0');
    entityTextObject.setAttribute('position', { x: 0, y: 0, z: -1.179});

    let entityBase = document.createElement('a-entity');
    entityBase.setAttribute('networked', 'template:#auxInit-template');
    entityBase.setAttribute('position', position);

    //CILINDRO AUX PARA DETECTAR EL CLICK
    entityBase.classList.add("objectRayCaster");
    entityBase.setAttribute('rotation', '90 0 0');
    entityBase.setAttribute('geometry', {
      'primitive': 'cylinder',
      'radius': '1',
      'height': '1',
    });
    //entityBase.setAttribute('material', 'color', 'red');
    //entityBase.setAttribute('material', 'opacity', '0.5');
    entityBase.setAttribute('material', 'visible', 'false');

    let oneclick = true;

    entityBase.addEventListener('click', function () {
        if (!document.querySelector('#entityEventsController').getAttribute("events-controller").activateController || document.querySelector('#entityEventsController').getAttribute("events-controller").pressbuttonxa) {
            document.querySelector('#entityEventsController').setAttribute("events-controller", "pressbuttonxa", "false");

            if (oneclick) {
                console.log("CLICKKK EN LA CAJA AUXXXX");
                let self = this;
                this.parentNode.childNodes.forEach(function (complementGraph) {
                    if (complementGraph == self) {
                        complementGraph.classList.add("selected");
                    } else {
                        complementGraph.classList.remove("selected");
                        complementGraph.setAttribute('component-synchronize', {
                            'componentShare': 'remove',
                            'valueShare': 'animation',
                        });
                        complementGraph.setAttribute('animation', {
                            'property': 'scale',
                            'to': '0 0 0',
                            'dur': '1000',
                            'easing': 'linear',
                        });
                        complementGraph.addEventListener('animationcomplete', function (event) {
                            complementGraph.parentNode.removeChild(complementGraph)
                        })
                    }
                });

                this.parentNode.parentNode.setAttribute('creation', {
                    typeObjectSelected: CONSTANTS.TYPECREATION,
                    valueObjectSelected: object,
                });
                oneclick = false;
            }
        }
    });


    entityBase.appendChild(entityObjectGraph);
    entityBase.appendChild(entityTextObject);
    return entityBase;
};

let createObject = (self, object, nameObjectGLB, position) => {
    //console.log("################## menu-disco createObject  ##################");
    position.y = 1.3;

    let entityObject = document.createElement('a-entity');
    entityObject.setAttribute('networked', 'template', '#objectInit-template');
    entityObject.classList.add("objectRayCaster");
    entityObject.setAttribute('position', position);
    entityObject.setAttribute('events-object-creation', {
        'objectStage': object,
        'nameObjectGLB': nameObjectGLB,
        'objectType': self.data.objectType
    });
    return entityObject;
};

