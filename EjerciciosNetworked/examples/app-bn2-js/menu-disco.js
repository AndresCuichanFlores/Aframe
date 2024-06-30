import * as CONSTANTS from './constants.js';

AFRAME.registerComponent('menu-disco', {
    schema: {
        colorDisco: { type: 'string', default: '' },
        objectsStage: { type: 'array', default: [] },
        objectType: { type: 'string', default: '' },
        eventComplement: { type: 'string', default: '' },
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
        let radius = 3;
        let posicionNueva = { x: 0, y: 0, z: 0 };
        let complementsGraph = [CONSTANTS.BABIAPIE, CONSTANTS.BABIADOUGHNUT];

        this.data.objectsStage.forEach(function (object, index) {
            if (self.data.objectsStage.length != 1) {
                let angle = (Math.PI * 2 / self.data.objectsStage.length) * index;
                posicionNueva = { x: radius * Math.cos(angle), y: 0, z: radius * Math.sin(angle) };
            }

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
    entityObjectGraph.setAttribute('rotation', '90 0 0');
    entityObjectGraph.setAttribute('scale', '0.6 0.6 0.6');
    entityObjectGraph.setAttribute(object, {
        'from': 'dataInicial',
        'key': 'model',
        'size': 'sales',
        'palette': 'blues'
    });

    entityObjectGraph.addEventListener('click', function () {
        let self = this;

        this.parentNode.parentNode.childNodes.forEach(function (complementGraph) {
            if (!complementGraph.classList.contains("iconCreate")) {
                if (complementGraph == self.parentNode) {
                    complementGraph.childNodes[1].setAttribute('text', 'opacity', '1');
                    complementGraph.childNodes[0].childNodes[0].childNodes.forEach(function (entity) {
                        entity.setAttribute('material', 'opacity', 1);
                    });
                    complementGraph.classList.add("selected");
                } else {
                    complementGraph.childNodes[1].setAttribute('text', 'opacity', '0.3');
                    complementGraph.childNodes[0].childNodes[0].childNodes.forEach(function (entity) {
                        entity.setAttribute('material', 'opacity', 0.3);
                    });
                    complementGraph.classList.remove("selected");


                    //si n es seleccionado es eliminado
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
            }
        });

        this.parentNode.parentNode.parentNode.setAttribute('creation', {
            typeObjectSelected: CONSTANTS.TYPECREATION,
            valueObjectSelected: object,
        });
    });

    let entityTextObject = document.createElement('a-entity');
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
    entityTextObject.setAttribute('position', { x: 0, y: 0.9, z: 0 });

    let entityBase = document.createElement('a-entity');
    entityBase.setAttribute('id', object);
    entityBase.setAttribute('position', position);

    entityBase.appendChild(entityObjectGraph);
    entityBase.appendChild(entityTextObject);
    return entityBase;
};

let createObject = (self, object, nameObjectGLB, position) => {
    //console.log("################## menu-disco createObject  ##################");
    position.y = 1.3;

    let entityObject = document.createElement('a-entity');
    entityObject.setAttribute('position', position);
    entityObject.setAttribute(self.data.eventComplement, {
        'objectStage': object,
        'nameObjectGLB': nameObjectGLB,
        'objectType': self.data.objectType
    });
    return entityObject;
};

