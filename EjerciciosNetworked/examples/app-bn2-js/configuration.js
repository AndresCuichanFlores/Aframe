import * as CONSTANTS from './constants.js';

AFRAME.registerComponent('configuration', {
    schema: {
        typeObjectSelected: { type: 'string', oneOf: [CONSTANTS.MAINOPCION, CONSTANTS.TYPECREATION, CONSTANTS.PROPERTY, CONSTANTS.VALUEPROPERTY, CONSTANTS.SUBPROPERTY, CONSTANTS.SUBVALUEPROPERTY] },
        valueObjectSelected: { type: 'string', default: '' },
    },

    init: function () {
        console.log("################## configuration INIT ");
        this.initializeParameters();
        //this.createConfIcon();

        if (Object.keys(this.dashboard[CONSTANTS.QUERYES]).includes(this.data.valueObjectSelected)) {
            this.valuesSelectded[CONSTANTS.MAINOPCION] = CONSTANTS.QUERYES;
        } else if (Object.keys(this.dashboard[CONSTANTS.GRAPHS]).includes(this.data.valueObjectSelected)) {
            this.valuesSelectded[CONSTANTS.MAINOPCION] = CONSTANTS.GRAPHS;
        } else if (Object.keys(this.dashboard[CONSTANTS.FILTERS]).includes(this.data.valueObjectSelected)) {
            this.valuesSelectded[CONSTANTS.MAINOPCION] = CONSTANTS.FILTERS;
        }
    },

    update: function () {
        console.log("################## configuration UPDATE ");
        this.valuesSelectded[this.data.typeObjectSelected] = this.data.valueObjectSelected;

        if (this.valuesSelectded[CONSTANTS.MAINOPCION] === CONSTANTS.QUERYES) {
            this.executeMenuQueryes();
        } else if (this.valuesSelectded[CONSTANTS.MAINOPCION] === CONSTANTS.GRAPHS) {
            this.executeMenuGraphs();
        } else if (this.valuesSelectded[CONSTANTS.MAINOPCION] === CONSTANTS.FILTERS) {
            this.executeMenuFilters();
        }
        console.dir('this.valuesSelectded');
        console.log(this.valuesSelectded);
    },

    //VARIABLES GLOBALES
    documentsCreated: {},
    specialProperties: [CONSTANTS.FROM, CONSTANTS.KEY, CONSTANTS.SIZE],

    dashboard: {
        [CONSTANTS.QUERYES]: {
            [CONSTANTS.BABIAQUERYJSON]: {
                url: ['./data/laptops.json', './data/plants.json', './data/cafes.json'],
            },
            [CONSTANTS.BABIAQUERYCSV]: {
                url: ['./data/cuentas.csv', './data/hacienda.csv', './data/nomina.csv'],
            },
        },

        [CONSTANTS.GRAPHS]: {
            [CONSTANTS.BABIAPIE]: {
                from: {},
                legend: ['true', 'false'],
                animation: ['true', 'false'],
                palette: ['blues', 'bussiness', 'commerce', 'flat', 'foxy', 'icecream', 'pearl', 'sunset', 'ubuntu'],
            },
            [CONSTANTS.BABIADOUGHNUT]: {
                from: {},
                legend: ['true', 'false'],
                animation: ['true', 'false'],
                palette: ['blues', 'bussiness', 'commerce', 'flat', 'foxy', 'icecream', 'pearl', 'sunset', 'ubuntu'],
            },
        },

        [CONSTANTS.FILTERS]: {
            [CONSTANTS.BABIAFILTER]: [],
        }
    },

    //FUNCIONES DEL COMPONENTE

    initializeParameters: function () {
        this.valuesSelectded = {
            [CONSTANTS.MAINOPCION]: undefined,
            [CONSTANTS.TYPECREATION]: undefined,
            [CONSTANTS.PROPERTY]: undefined,
            [CONSTANTS.VALUEPROPERTY]: undefined,
            [CONSTANTS.SUBPROPERTY]: undefined,
            [CONSTANTS.SUBVALUEPROPERTY]: undefined,
        };
        this.numeroDiscosCreados = 0;
        this.baseParent = this.el.parentNode;
        this.objectBabiaCreated = this.baseParent.querySelector('#Menu-' + CONSTANTS.TYPECREATION).childNodes[0];
        this.subProperties = {};
    },

    executeMenuQueryes: function () {
        if (this.data.typeObjectSelected === CONSTANTS.TYPECREATION) {
            createNewMenuDisco(this, Object.keys(this.dashboard[this.valuesSelectded[CONSTANTS.MAINOPCION]][this.data.valueObjectSelected]), CONSTANTS.PROPERTY, '#fcb983');
        } else if (this.data.typeObjectSelected === CONSTANTS.PROPERTY) {
            createNewMenuDisco(this, this.dashboard[this.valuesSelectded[CONSTANTS.MAINOPCION]][this.valuesSelectded[CONSTANTS.TYPECREATION]][this.data.valueObjectSelected], CONSTANTS.VALUEPROPERTY, '#9efc83');
        } else if (this.data.typeObjectSelected === CONSTANTS.VALUEPROPERTY) {
            this.updateComplementBabia()
        }
    },

    executeMenuGraphs: function () {
        if (this.data.typeObjectSelected === CONSTANTS.TYPECREATION) {
            createNewMenuDisco(this, Object.keys(this.dashboard[this.valuesSelectded[CONSTANTS.MAINOPCION]][this.data.valueObjectSelected]), CONSTANTS.PROPERTY, '#fcb983');
        } else if (this.data.typeObjectSelected === CONSTANTS.PROPERTY) {
            let discoValueProperty = this.el.querySelector('#Menu-' + CONSTANTS.VALUEPROPERTY);
            if (discoValueProperty) {
                while (this.el.childNodes.length > 0) {
                    var child = this.el.childNodes[this.el.childNodes.length - 1];
                    this.el.removeChild(child);
                    this.numeroDiscosCreados -= 1;
                    if (child === discoValueProperty) {
                        break;
                    }
                }
            }

            if (this.data.valueObjectSelected === CONSTANTS.FROM) {
                let idQuerys = searchQuerysCreated(CONSTANTS.BABIAQUERYJSON, CONSTANTS.BABIAQUERYCSV, CONSTANTS.BABIAFILTER);
                createNewMenuDisco(this, idQuerys, CONSTANTS.VALUEPROPERTY, '#9efc83');
            } else {
                createNewMenuDisco(this, this.dashboard[this.valuesSelectded[CONSTANTS.MAINOPCION]][this.valuesSelectded[CONSTANTS.TYPECREATION]][this.data.valueObjectSelected], CONSTANTS.VALUEPROPERTY, '#9efc83');
            }
        } else if (this.data.typeObjectSelected === CONSTANTS.VALUEPROPERTY) {
            if (this.valuesSelectded[CONSTANTS.PROPERTY] === CONSTANTS.FROM) {
                let discoSubProperty = this.el.querySelector('#Menu-' + CONSTANTS.SUBPROPERTY);
                if (discoSubProperty) {
                    while (this.el.childNodes.length > 0) {
                        var child = this.el.childNodes[this.el.childNodes.length - 1];
                        this.el.removeChild(child);
                        this.numeroDiscosCreados -= 1;
                        if (child === discoSubProperty) {
                            break;
                        }
                    }
                }
                this.subProperties = {};
                createNewMenuDisco(this, [CONSTANTS.KEY, CONSTANTS.SIZE], CONSTANTS.SUBPROPERTY, '#85faf4');
            } else {
                this.updateComplementBabia();
            }
        } else if (this.data.typeObjectSelected === CONSTANTS.SUBPROPERTY) {
            let discoSubValueProperty = this.el.querySelector('#Menu-' + CONSTANTS.SUBVALUEPROPERTY);
            if (discoSubValueProperty) {
                this.el.removeChild(discoSubValueProperty);
                this.numeroDiscosCreados -= 1;
            }
            if (this.valuesSelectded[CONSTANTS.VALUEPROPERTY].includes(":")) {
                let nameDocument = this.valuesSelectded[CONSTANTS.VALUEPROPERTY].split(":")[0];
                createNewMenuDisco(this, Object.keys(this.documentsCreated[nameDocument][this.data.valueObjectSelected]), CONSTANTS.SUBVALUEPROPERTY, '#85faf4');
            } else {
                createNewMenuDisco(this, Object.keys(this.documentsCreated[this.valuesSelectded[CONSTANTS.VALUEPROPERTY]][this.data.valueObjectSelected]), CONSTANTS.SUBVALUEPROPERTY, '#85faf4');
            }
        } else if (this.data.typeObjectSelected === CONSTANTS.SUBVALUEPROPERTY) {
            this.subProperties[this.valuesSelectded[CONSTANTS.SUBPROPERTY]] = this.valuesSelectded[CONSTANTS.SUBVALUEPROPERTY];
            if (Object.keys(this.subProperties).length === 2) {
                this.updateComplementBabia();
            }
        }
    },

    executeMenuFilters: function () {
        let nameDocumentFilter = this.objectBabiaCreated.querySelector('.botNameObject').getAttribute('text').value;
        if (nameDocumentFilter.includes(":")) {
            nameDocumentFilter = nameDocumentFilter.split(":")[0];
        }

        if (this.data.typeObjectSelected === CONSTANTS.TYPECREATION) {
            createNewMenuDisco(this, Object.keys(this.documentsCreated[nameDocumentFilter].key), CONSTANTS.PROPERTY, '#fcb983');
        } else if (this.data.typeObjectSelected === CONSTANTS.PROPERTY) {
            if (this.el.childNodes[1]) {
                while (this.el.childNodes.length > 0) {
                    var child = this.el.childNodes[this.el.childNodes.length - 1];
                    if (child === this.el.childNodes[1]) {
                        break;
                    }
                    this.el.removeChild(child);
                    this.numeroDiscosCreados -= 1;
                }
            }

            createNewMenuDisco(this, this.documentsCreated[nameDocumentFilter].key[this.data.valueObjectSelected], CONSTANTS.VALUEPROPERTY, '#9efc83');
        } else if (this.data.typeObjectSelected === CONSTANTS.VALUEPROPERTY) {
            this.updateComplementBabia()
        }
    },

    updateComplementBabia: function () {
        // console.log("################## configuration createMenu   ##################");
        let self = this;

        if (this.valuesSelectded[CONSTANTS.MAINOPCION] === CONSTANTS.QUERYES) {

            let idObjectConfiguration = this.valuesSelectded[CONSTANTS.VALUEPROPERTY].substring(this.valuesSelectded[CONSTANTS.VALUEPROPERTY].lastIndexOf('/') + 1, this.valuesSelectded[CONSTANTS.VALUEPROPERTY].lastIndexOf('.'));
            this.objectBabiaCreated.setAttribute('id', idObjectConfiguration);

            if (this.valuesSelectded[CONSTANTS.TYPECREATION] === CONSTANTS.BABIAQUERYJSON) {
                this.objectBabiaCreated.setAttribute(CONSTANTS.BABIAQUERYJSON, this.valuesSelectded[CONSTANTS.PROPERTY], this.valuesSelectded[CONSTANTS.VALUEPROPERTY]);
                this.addBotNameObject(idObjectConfiguration);
                addDocumentCreatedJSON(this, idObjectConfiguration);
            } else if (this.valuesSelectded[CONSTANTS.TYPECREATION] === CONSTANTS.BABIAQUERYCSV) {
                this.objectBabiaCreated.setAttribute(CONSTANTS.BABIAQUERYCSV, this.valuesSelectded[CONSTANTS.PROPERTY], this.valuesSelectded[CONSTANTS.VALUEPROPERTY]);
                this.addBotNameObject(idObjectConfiguration);
                addDocumentCreatedCSV(this, idObjectConfiguration);
            }

        } else if (this.valuesSelectded[CONSTANTS.MAINOPCION] === CONSTANTS.GRAPHS) {

            this.objectBabiaCreated.childNodes[0].setAttribute(this.valuesSelectded[CONSTANTS.TYPECREATION], {
                [this.valuesSelectded[CONSTANTS.PROPERTY]]: this.valuesSelectded[CONSTANTS.VALUEPROPERTY],
                [CONSTANTS.KEY]: this.subProperties[CONSTANTS.KEY],
                [CONSTANTS.SIZE]: this.subProperties[CONSTANTS.SIZE],
            });

        } else if (this.valuesSelectded[CONSTANTS.MAINOPCION] === CONSTANTS.FILTERS) {
            let nameDocumentFilter = this.objectBabiaCreated.querySelector('.botNameObject').getAttribute('text').value;
            if (nameDocumentFilter.includes(":")) {
                nameDocumentFilter = nameDocumentFilter.split(":")[0];
            }

            let nameFilter = this.valuesSelectded[CONSTANTS.PROPERTY] + '=' + this.valuesSelectded[CONSTANTS.VALUEPROPERTY]
            this.objectBabiaCreated.setAttribute(CONSTANTS.BABIAFILTER, {
                'from': nameDocumentFilter,
                'filter': nameFilter
            });
            this.objectBabiaCreated.setAttribute('id', nameDocumentFilter + ':' + nameFilter);
            this.addBotNameObject(nameDocumentFilter + ':' + nameFilter);
        }
    },

    addBotNameObject: function (botNameObject) {
        if (this.objectBabiaCreated.querySelector('.botNameObject')) {
            this.objectBabiaCreated.removeChild(this.objectBabiaCreated.querySelector('.botNameObject'));
        }
        let entityObjectChildren = document.createElement('a-entity');
        entityObjectChildren.classList.add('botNameObject');
        entityObjectChildren.setAttribute('text', {
            'value': botNameObject,
            'align': 'center',
            'side': 'double',
            'color': 'black',
            'shader': 'msdf',
            'font': 'https://raw.githubusercontent.com/etiennepinchon/aframe-fonts/master/fonts/berkshireswash/BerkshireSwash-Regular.json'
        });
        entityObjectChildren.setAttribute('scale', '30 30 30');
        //console.log('position.y: ' + this.el.getAttribute('position').y);
        entityObjectChildren.setAttribute('position', { x: 0, y: this.objectBabiaCreated.getAttribute('position').y - 6.9, z: 0 });
        this.objectBabiaCreated.appendChild(entityObjectChildren);
    },
});

//FUNCIONES EXTERNAS

let createNewMenuDisco = (self, objects, objectType, colorDisco) => {
    //console.log("################## menu-disco createNewMenuDisco  ##################");
    //console.log(self.numeroDiscosCreados)
    let entityMenuDisco = document.createElement('a-entity');
    entityMenuDisco.setAttribute('id', 'Menu-' + objectType);
    entityMenuDisco.setAttribute('position', { x: 0, y: 4 + (3 * self.numeroDiscosCreados), z: 0 });
    entityMenuDisco.setAttribute('menu-disco', {
        'objectsStage': objects,
        'objectType': objectType,
        'colorDisco': colorDisco,
        'eventComplement': 'events-object-configuration'
    });
    self.el.appendChild(entityMenuDisco);
    self.numeroDiscosCreados += 1;
};

let searchQuerysCreated = (babiaTypeDocument1, babiaTypeDocument2 , babiaTypeDocument3) => {
    let elementsQuerys = document.querySelectorAll(`[${babiaTypeDocument1}], [${babiaTypeDocument2}], [${babiaTypeDocument3}]`);
    let idsQuery = [];
    elementsQuerys.forEach(element => {
        if (element.id !== 'dataInicial') {
            idsQuery.push(element.id);
        }
    });
    return idsQuery;
};

let addDocumentCreatedJSON = (self, idDocument) => {
    fetch(self.valuesSelectded[CONSTANTS.VALUEPROPERTY])
        .then(response => response.json())
        .then(data => {
            const keys = Object.keys(data[0]);
            const stringKeys = [];
            const numberKeys = {};
            const uniqueValues = {};

            keys.forEach(key => {
                const value = data[0][key];
                if (typeof value === 'string') {
                    stringKeys.push(key);
                } else if (typeof value === 'number') {
                    numberKeys[key] = [];
                }
            });

            stringKeys.forEach(key => {
                const uniqueSet = new Set();
                data.forEach(obj => {
                    uniqueSet.add(obj[key]);
                });
                uniqueValues[key] = Array.from(uniqueSet);
            });

            const fields = {
                key: uniqueValues,
                size: numberKeys
            };

            self.documentsCreated[idDocument] = fields;
        })
        .catch(error => console.error('Error al cargar el archivo:', error));
};

let addDocumentCreatedCSV = (self, idDocument) => {
    fetch(self.valuesSelectded[CONSTANTS.VALUEPROPERTY])
        .then(response => response.text())
        .then(csvText => {
            const data = Papa.parse(csvText, { header: true }).data;
            const keys = Object.keys(data[0]);
            const stringKeys = [];
            const numberKeys = {};
            const uniqueValues = {};

            keys.forEach(key => {
                const value = data[0][key];
                if (!isNaN(Number(value)) && value.trim() !== '') {
                    numberKeys[key] = [];
                } else {
                    stringKeys.push(key);
                }
            });

            stringKeys.forEach(key => {
                const uniqueSet = new Set();
                data.forEach(obj => {
                    uniqueSet.add(obj[key]);
                });
                uniqueValues[key] = Array.from(uniqueSet);
            });

            const fields = {
                key: uniqueValues,
                size: numberKeys
            };
            self.documentsCreated[idDocument] = fields;
        })
        .catch(error => console.error('Error al cargar el archivo:', error));
};

