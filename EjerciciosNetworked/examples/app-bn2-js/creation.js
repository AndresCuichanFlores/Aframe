
import * as CONSTANTS from './constants.js';

AFRAME.registerComponent('creation', {
    schema: {
        typeObjectSelected: { type: 'string', oneOf: [CONSTANTS.MAINOPCION, CONSTANTS.TYPECREATION] },
        valueObjectSelected: { type: 'string', default: '' },
    },

    init: function () {
        //console.log("################## configuration INIT ");
        this.initializeParameters();
        createNewMenuDisco(this, Object.keys(this.dashboard), CONSTANTS.MAINOPCION, '#659DBD');
    },

    update: function () {
        //console.log("################## configuration UPDATE ");

        this.valuesSelectded[this.data.typeObjectSelected] = this.data.valueObjectSelected;
        
        if (this.valuesSelectded[CONSTANTS.MAINOPCION] === CONSTANTS.QUERYES) {
            this.executeMenuQueryes();
        } else if (this.valuesSelectded[CONSTANTS.MAINOPCION] === CONSTANTS.GRAPHS) {
            this.executeMenuGraphs();
        } else if (this.valuesSelectded[CONSTANTS.MAINOPCION] === CONSTANTS.FILTERS) {
            this.executeMenuFilters();
        }
        //console.dir(this.valuesSelectded);
    },


    documentsCreated: {},
    filtersCreated: [],

    dashboard: {
        [CONSTANTS.QUERYES]: [CONSTANTS.BABIAQUERYJSON, CONSTANTS.BABIAQUERYCSV],

        [CONSTANTS.GRAPHS]: [CONSTANTS.BABIAPIE, CONSTANTS.BABIADOUGHNUT],

        [CONSTANTS.FILTERS]: []
    },

    initializeParameters: function () {
        this.valuesSelectded = {
            [CONSTANTS.MAINOPCION]: undefined,
            [CONSTANTS.TYPECREATION]: undefined,
        };
        this.numeroDiscosCreados = 0;
    },

    executeMenuQueryes: function () {
        if (this.data.typeObjectSelected === CONSTANTS.MAINOPCION) {
            this.deleteDiscoTypeCreation();
            createNewMenuDisco(this, this.dashboard[this.data.valueObjectSelected], CONSTANTS.TYPECREATION, '#8080ff');
        } else if (this.data.typeObjectSelected === CONSTANTS.TYPECREATION) {
            this.deleteIconCreate();
            this.createIconCreate();
        }
    },

    executeMenuGraphs: function () {
        if (this.data.typeObjectSelected === CONSTANTS.MAINOPCION) {
            this.deleteDiscoTypeCreation();
            createNewMenuDisco(this, this.dashboard[this.data.valueObjectSelected], CONSTANTS.TYPECREATION, '#8080ff');
        } else if (this.data.typeObjectSelected === CONSTANTS.TYPECREATION) {
            this.deleteIconCreate();
            this.createIconCreate();
        }
    },

    executeMenuFilters: function () {
        if (this.data.typeObjectSelected === CONSTANTS.MAINOPCION) {
            this.deleteDiscoTypeCreation();
            let elementsQuerys = document.querySelectorAll('[babia-queryjson], [babia-querycsv]');
            let ids = [];
            elementsQuerys.forEach(element => {
                if (element.id) {
                    ids.push('babia-filter:' + element.id);
                }
            });
            createNewMenuDisco(this, ids, CONSTANTS.TYPECREATION, '#8080ff');
        } else if (this.data.typeObjectSelected === CONSTANTS.TYPECREATION) {
            this.deleteIconCreate();
            this.createIconCreate();
        }
    },

    deleteDiscoTypeCreation: function () {
        let discoTypeCreation = this.el.querySelector('#Menu-' + CONSTANTS.TYPECREATION);
        if (discoTypeCreation) {
            this.el.removeChild(discoTypeCreation);
            this.numeroDiscosCreados -= 1;
        }
    },

    deleteIconCreate: function () {
        let discoTypeCreation = this.el.querySelector('#Menu-' + CONSTANTS.TYPECREATION);
        let iconCreate = discoTypeCreation.querySelector('.iconCreate');
        if (iconCreate) {
            discoTypeCreation.removeChild(iconCreate);
        }
    },

    createIconCreate: function () {
        // console.log("################## configuration createMenu   ##################");
        let self = this;
        let positionEntity = this.el.getAttribute('position');
        let discoTypeCreation = this.el.querySelector('#Menu-' + CONSTANTS.TYPECREATION);
        let entityCreateIcon = document.createElement('a-entity');
        //console.log('positionEntityCreated: ' + positionEntity.x + ', ' + positionEntity.y + ', ' + positionEntity.z);

        //Icono create
        entityCreateIcon.classList.add("iconCreate");
        entityCreateIcon.setAttribute('gltf-model', 'assets/real/iconCreate.glb');
        entityCreateIcon.setAttribute('scale', '0 0 0.4');
        entityCreateIcon.setAttribute('rotation', '0 -180 0');
        entityCreateIcon.setAttribute('position', '0 3 0');
        entityCreateIcon.setAttribute('animation', {
            'property': 'rotation',
            'to': '0 180 0',
            'dur': '10000',
            'easing': 'linear',
            'loop': 'true'
        });
        entityCreateIcon.setAttribute('animation__1', {
            'property': 'scale',
            'to': '0.4 0.4 0.4',
            'dur': '1000',
        });

        entityCreateIcon.addEventListener('click', function () {
            //Desaparezca el icono de create
            this.removeAttribute('animation');
            this.removeAttribute('animation__1');
            this.setAttribute('animation', {
                'property': 'scale',
                'to': '0 0 0',
                'dur': '10',
                'easing': 'linear',
            });

            //Desaparezca el primer disco
            self.el.childNodes[0].removeAttribute('animation');
            self.el.childNodes[0].setAttribute('animation', {
                'property': 'scale',
                'to': '0 0 0',
                'dur': '2000',
                'easing': 'linear',
            });

            //Desaparezca los objetos no selecionas y centrar el selecionado del segundo disco
            self.el.childNodes[1].childNodes.forEach(element => {
                if (element.classList.contains('selected')) {
                    element.setAttribute('animation', {
                        'property': 'position',
                        'from': { x: element.getAttribute('position').x, y: element.getAttribute('position').y, z: 0 },
                        'to': { x: 0, y: element.getAttribute('position').y, z: 0 },
                        'dur': '2000',
                        'easing': 'linear',
                    });

                    setTimeout(() => {
                        self.el.removeChild(self.el.childNodes[0]);
                        element.removeAttribute('id');
                        element.setAttribute('animation', {
                            'property': 'position',
                            'to': { x: element.getAttribute('position').x, y: element.getAttribute('position').y + 1, z: element.getAttribute('position').z },
                            'dur': '1000',
                            'easing': 'linear',
                        });
                        element.setAttribute('animation__1', {
                            'property': 'scale',
                            'to': '0.4 0.4 0.4',
                            'dur': '1000',
                            'easing': 'linear',
                        });
                        element.addEventListener('animationcomplete', function (event) {
                            //console.log('La animación de escala ha terminado2.');

                            element.setAttribute("configuration-prueba", {
                                typeObjectSelected: CONSTANTS.TYPECREATION,
                                valueObjectSelected: self.valuesSelectded[CONSTANTS.TYPECREATION]
                            });
                            self.el.childNodes[0].removeAttribute('animation');
                            self.el.removeAttribute('creation');

                        });
                    }, 2200);

                } else {
                    element.setAttribute('animation', {
                        'property': 'scale',
                        'to': '0 0 0',
                        'dur': '1000',
                        'easing': 'linear',
                    });
                    element.addEventListener('animationcomplete', function (event) {
                        //console.log('La animación de escala ha terminado.');
                        self.el.childNodes[1].removeChild(element);
                    });
                }
            });

            //Movimiento hacia abajo del segundo disco
            self.el.childNodes[1].removeAttribute('animation');
            self.el.childNodes[1].removeAttribute('animation__1');
            self.el.childNodes[1].setAttribute('animation', {
                'property': 'position',
                'to': { x: 0, y: 0, z: 0 },
                'dur': '2000',
                'easing': 'linear',
            });
        });

        //Texto Create
        let entityObjectChildren = document.createElement('a-entity');
        entityObjectChildren.setAttribute('text', {
            'value': "CREATE",
            'align': 'center',
            'side': 'double',
            'color': 'BLACK',
            'shader': 'msdf',
            'font': 'https://raw.githubusercontent.com/etiennepinchon/aframe-fonts/master/fonts/berkshireswash/BerkshireSwash-Regular.json'
        });
        entityObjectChildren.setAttribute('scale', '22 22 22');
        entityObjectChildren.setAttribute('rotation', '0 180 0');
        entityObjectChildren.setAttribute('position', '0 3.2 0');

        entityCreateIcon.appendChild(entityObjectChildren);
        discoTypeCreation.appendChild(entityCreateIcon);
    },
});

let createNewMenuDisco = (self, objects, objectType, colorDisco) => {
    //console.log("################## menu-disco createNewMenuDisco  ##################");
    //console.log(self.numeroDiscosCreados)

    let entityMenuDisco = document.createElement('a-entity');
    entityMenuDisco.setAttribute('id', 'Menu-' + objectType);
    entityMenuDisco.setAttribute('position', { x: 0, y: 3 * self.numeroDiscosCreados, z: 0 });
    entityMenuDisco.setAttribute('menu-disco', {
        'objectsStage': objects,
        'objectType': objectType,
        'colorDisco': colorDisco,
        'eventComplement': 'events-object-creation'
    });
    self.el.appendChild(entityMenuDisco);
    self.numeroDiscosCreados += 1;
};
