
import * as CONSTANTS from './constants.js';

AFRAME.registerComponent('configurationOLD', {
    schema: {
        typeObjectSelected: {type: 'string', oneOf: [CONSTANTS.MAINOPCION, CONSTANTS.TYPECREATION, CONSTANTS.PROPERTY, CONSTANTS.VALUEPROPERTY]},
        valueObjectSelected: {type: 'string', default: ''},
    },

    init: function () {
        //console.log("################## configuration INIT ");
        this.initializeParameters();
        createNewMenuDisco(this, Object.keys(this.dashboard), CONSTANTS.MAINOPCION, '#C99E10');
    },

    update: function () {
        //console.log("################## configuration UPDATE ");

        this.valuesSelectded[this.data.typeObjectSelected] = this.data.valueObjectSelected;
        console.dir(this.valuesSelectded);

        if (this.valuesSelectded[CONSTANTS.MAINOPCION] === CONSTANTS.QUERYES) {
            this.executeMenuQueryes();
        } else if (this.valuesSelectded[CONSTANTS.MAINOPCION] === CONSTANTS.GRAPHS) {
            this.executeMenuGraphs();
        } else if (this.valuesSelectded[CONSTANTS.MAINOPCION] === CONSTANTS.FILTERS) {
            this.executeMenuFilters();
        }
    },


    documentsCreated: {},
    filtersCreated: [],

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
        }
    },

    initializeParameters: function () {
        this.valuesSelectded = {
            [CONSTANTS.MAINOPCION]: undefined,
            [CONSTANTS.TYPECREATION]: undefined,
            [CONSTANTS.PROPERTY]: undefined,
            [CONSTANTS.VALUEPROPERTY]: undefined,
        };
        this.numeroDiscosCreados = 0;
        this.independentProperty = true;
    },

    executeMenuQueryes: function () {
        if (this.data.typeObjectSelected === CONSTANTS.MAINOPCION) {
            createNewMenuDisco(this, Object.keys(this.dashboard[this.data.valueObjectSelected]), CONSTANTS.TYPECREATION, '#8080ff');
        } else if (this.data.typeObjectSelected === CONSTANTS.TYPECREATION) {
            let objectConfiguration = this.el.querySelector('#Menu-' + CONSTANTS.TYPECREATION).querySelector('.selected');
            let entityConfIcon = this.createConfIcon();
            objectConfiguration.appendChild(entityConfIcon);
            createNewMenuDisco(this, Object.keys(this.dashboard[this.valuesSelectded[CONSTANTS.MAINOPCION]][this.data.valueObjectSelected]), CONSTANTS.PROPERTY, '#fcb983');
        } else if (this.data.typeObjectSelected === CONSTANTS.PROPERTY) {
            let entidadDiscoValueProperty = this.el.querySelector('#Menu-' + CONSTANTS.VALUEPROPERTY)
            if (entidadDiscoValueProperty) {
                while (this.el.childNodes.length > 0) {
                    var child = this.el.childNodes[this.el.childNodes.length - 1];
                    this.el.removeChild(child);
                    this.numeroDiscosCreados -= 1;
                    if (child === entidadDiscoValueProperty) {
                        break;
                    }
                }
            }
            createNewMenuDisco(this, this.dashboard[this.valuesSelectded[CONSTANTS.MAINOPCION]][this.valuesSelectded[CONSTANTS.TYPECREATION]][this.data.valueObjectSelected], CONSTANTS.VALUEPROPERTY, '#9efc83');
        } else if (this.data.typeObjectSelected === CONSTANTS.VALUEPROPERTY) {
            this.updateComplementBabia()
        }
    },

    executeMenuGraphs: function () {
        if (this.data.typeObjectSelected === CONSTANTS.MAINOPCION) {
            createNewMenuDisco(this, Object.keys(this.dashboard[this.data.valueObjectSelected]), CONSTANTS.TYPECREATION, '#8080ff');
        } else if (this.data.typeObjectSelected === CONSTANTS.TYPECREATION) {
            let objectConfiguration = this.el.querySelector('#Menu-' + CONSTANTS.TYPECREATION).querySelector('.selected');
            let entityConfIcon = this.createConfIcon();
            objectConfiguration.appendChild(entityConfIcon);
            createNewMenuDisco(this, Object.keys(this.dashboard[this.valuesSelectded[CONSTANTS.MAINOPCION]][this.data.valueObjectSelected]), CONSTANTS.PROPERTY, '#fcb983');
        } else if (this.data.typeObjectSelected === CONSTANTS.PROPERTY) {
            const specialProperties = ['from', 'key', 'size'];

            if (specialProperties.includes(this.valuesSelectded[CONSTANTS.PROPERTY])) {
                this.independentProperty = false;
                let entidadDiscoValuePropertyRepetido = this.el.querySelectorAll('#Menu-' + CONSTANTS.VALUEPROPERTY);

                if (entidadDiscoValuePropertyRepetido.length == 2) {
                    this.el.removeChild(entidadDiscoValuePropertyRepetido[entidadDiscoValuePropertyRepetido.length - 1]);
                    this.numeroDiscosCreados -= 1;
                }

                if (this.valuesSelectded[CONSTANTS.PROPERTY] === 'from') {
                    let elementsQuerys = document.querySelectorAll('[babia-queryjson], [babia-querycsv], [babia-filter]');
                    let ids = [];
                    elementsQuerys.forEach(element => {
                        if (element.id) {
                            ids.push(element.id);
                        }
                    });
                    createNewMenuDisco(this, ids, CONSTANTS.VALUEPROPERTY, '#9efc83');
                } else if (this.valuesSelectded[CONSTANTS.PROPERTY] === 'key') {
                    let objectConfiguration = this.el.querySelector('#Menu-' + CONSTANTS.TYPECREATION).querySelector('.selected');
                    let nameQuerrySelect = objectConfiguration.getAttribute('babia-' + this.valuesSelectded[CONSTANTS.TYPECREATION]).from;
                    this.independentProperty = true;

                    if (nameQuerrySelect in this.documentsCreated) {
                        console.log("Esxite la query en documetnscreated");
                        createNewMenuDisco(this, Object.keys(this.documentsCreated[nameQuerrySelect].key), CONSTANTS.VALUEPROPERTY, '#85faf4');
                    } else {
                        console.log("Esxite la query en filterscreated");
                        let filter = this.filtersCreated.find(value => value.nameFilter === nameQuerrySelect);
                        createNewMenuDisco(this, Object.keys(this.documentsCreated[filter.nameDocument].key), CONSTANTS.VALUEPROPERTY, '#85faf4');
                    }

                } else if (this.valuesSelectded[CONSTANTS.PROPERTY] === 'size') {
                    let objectConfiguration = this.el.querySelector('#Menu-' + CONSTANTS.TYPECREATION).querySelector('.selected');
                    let nameQuerrySelect = objectConfiguration.getAttribute('babia-' + this.valuesSelectded[CONSTANTS.TYPECREATION]).from;
                    this.independentProperty = true;

                    if (nameQuerrySelect in this.documentsCreated) {
                        console.log("Esxite la query en documetnscreated");
                        createNewMenuDisco(this, this.documentsCreated[nameQuerrySelect].size, CONSTANTS.VALUEPROPERTY, '#85faf4');
                    } else {
                        console.log("Exite la query en filterscreated");
                        let filter = this.filtersCreated.find(value => value.nameFilter === nameQuerrySelect);
                        createNewMenuDisco(this, this.documentsCreated[filter.nameDocument].size, CONSTANTS.VALUEPROPERTY, '#85faf4');
                    }
                }
            } else {
                let entidadDiscoValueProperty = this.el.querySelectorAll('#Menu-' + CONSTANTS.VALUEPROPERTY)[0]

                if (entidadDiscoValueProperty) {
                    while (this.el.childNodes.length > 0) {
                        var child = this.el.childNodes[this.el.childNodes.length - 1];
                        this.el.removeChild(child);
                        this.numeroDiscosCreados -= 1;
                        if (child === entidadDiscoValueProperty) {
                            break;
                        }
                    }
                }
                createNewMenuDisco(this, this.dashboard[this.valuesSelectded[CONSTANTS.MAINOPCION]][this.valuesSelectded[CONSTANTS.TYPECREATION]][this.data.valueObjectSelected], CONSTANTS.VALUEPROPERTY, '#9efc83');
            }
        } else if (this.data.typeObjectSelected === CONSTANTS.VALUEPROPERTY) {
            this.updateComplementBabia()
            if (!this.independentProperty) {
                if (this.valuesSelectded[CONSTANTS.PROPERTY] === 'from') {
                    createNewMenuDisco(this, ['key', 'size'], CONSTANTS.PROPERTY, '#85faf4',);
                }
            }
        }
    },

    executeMenuFilters: function () {
        if (this.data.typeObjectSelected === CONSTANTS.MAINOPCION) {
            let elementsQuerys = document.querySelectorAll('[babia-queryjson], [babia-querycsv]');
            let ids = [];
            elementsQuerys.forEach(element => {
                if (element.id) {
                    ids.push(element.id);
                }
            });
            createNewMenuDisco(this, ids, CONSTANTS.TYPECREATION, '#8080ff');
        } else if (this.data.typeObjectSelected === CONSTANTS.TYPECREATION) {
            let objectConfiguration = this.el.querySelector('#Menu-' + CONSTANTS.TYPECREATION).querySelector('.selected');
            let entityConfIcon = this.createConfIcon();
            objectConfiguration.appendChild(entityConfIcon);
            createNewMenuDisco(this, Object.keys(this.documentsCreated[this.data.valueObjectSelected].key), CONSTANTS.PROPERTY, '#fcb983');
        } else if (this.data.typeObjectSelected === CONSTANTS.PROPERTY) {
            createNewMenuDisco(this, this.documentsCreated[this.valuesSelectded[CONSTANTS.TYPECREATION]].key[this.data.valueObjectSelected], CONSTANTS.VALUEPROPERTY, '#9efc83');
        } else if (this.data.typeObjectSelected === CONSTANTS.VALUEPROPERTY) {
            this.updateComplementBabia()
        }
    },

    updateComplementBabia: function () {
        // console.log("################## configuration createMenu   ##################");
        let objectConfiguration = this.el.querySelector('#Menu-' + CONSTANTS.TYPECREATION).querySelector('.selected');

        if (this.valuesSelectded[CONSTANTS.MAINOPCION] === CONSTANTS.QUERYES) {

            let idObjectConfiguration = this.valuesSelectded[CONSTANTS.VALUEPROPERTY].substring(this.valuesSelectded[CONSTANTS.VALUEPROPERTY].lastIndexOf('/') + 1, this.valuesSelectded[CONSTANTS.VALUEPROPERTY].lastIndexOf('.'));
            objectConfiguration.setAttribute('id', idObjectConfiguration);

            if (this.valuesSelectded[CONSTANTS.TYPECREATION] === CONSTANTS.BABIAQUERYJSON) {
                objectConfiguration.setAttribute(CONSTANTS.BABIAQUERYJSON, this.valuesSelectded[CONSTANTS.PROPERTY], this.valuesSelectded[CONSTANTS.VALUEPROPERTY]);
                objectConfiguration.setAttribute('menu-object', 'titleObject', idObjectConfiguration);
                addDocumentCreatedJSON(this, idObjectConfiguration);
            } else if (this.valuesSelectded[CONSTANTS.TYPECREATION] === CONSTANTS.BABIAQUERYCSV) {
                objectConfiguration.setAttribute(CONSTANTS.BABIAQUERYCSV, this.valuesSelectded[CONSTANTS.PROPERTY], this.valuesSelectded[CONSTANTS.VALUEPROPERTY]);
                objectConfiguration.setAttribute('menu-object', 'titleObject', idObjectConfiguration);
                addDocumentCreatedCSV(this, idObjectConfiguration);
            } else if (this.valuesSelectded[CONSTANTS.TYPECREATION] === 'elastic') {

            }
        } else if (this.valuesSelectded[CONSTANTS.MAINOPCION] === CONSTANTS.GRAPHS) {

            console.log("typeObjectSelected: " + this.data.typeObjectSelected);
            console.log("valueObjectSelected: " + this.data.valueObjectSelected);

            if (this.valuesSelectded[CONSTANTS.TYPECREATION] === 'pie') {
                objectConfiguration.setAttribute(CONSTANTS.BABIAPIE, this.valuesSelectded[CONSTANTS.PROPERTY], this.valuesSelectded[CONSTANTS.VALUEPROPERTY]);
            } else if (this.valuesSelectded[CONSTANTS.TYPECREATION] === 'doughnut') {
                objectConfiguration.setAttribute(CONSTANTS.BABIADOUGHNUT, this.valuesSelectded[CONSTANTS.PROPERTY], this.valuesSelectded[CONSTANTS.VALUEPROPERTY]);
            } else if (this.valuesSelectded[CONSTANTS.TYPECREATION] === 'elastic') {

            }

        } else if (this.valuesSelectded[CONSTANTS.MAINOPCION] === CONSTANTS.FILTERS) {
            let nameFilter = this.valuesSelectded[CONSTANTS.PROPERTY] + '=' + this.valuesSelectded[CONSTANTS.VALUEPROPERTY]
            objectConfiguration.setAttribute('babia-filter', {
                'from': this.valuesSelectded[CONSTANTS.TYPECREATION],
                'filter': nameFilter
            });
            objectConfiguration.setAttribute('id', nameFilter);
            objectConfiguration.setAttribute('menu-object', 'titleObject', nameFilter);

            addFilterCreated(this, nameFilter, this.valuesSelectded[CONSTANTS.TYPECREATION]);
        }
    },

    createConfIcon: function () {
        // console.log("################## configuration createMenu   ##################");
        let self = this;
        let entityConfIcon = document.createElement('a-entity');
        entityConfIcon.classList.add("iconConf");
        entityConfIcon.setAttribute('gltf-model', 'assets/real/iconConif.glb');
        entityConfIcon.setAttribute('scale', '1.04 1.04 1.04');
        entityConfIcon.setAttribute('position', '6 3 0');

        entityConfIcon.addEventListener('click', function () {
            console.log('Icon conf clicked!');
            if (self.el.querySelector('#Menu-' + CONSTANTS.VALUEPROPERTY)) {
                self.el.removeChild(self.el.querySelector('#Menu-' + CONSTANTS.VALUEPROPERTY));
                self.el.removeChild(self.el.querySelector('#Menu-' + CONSTANTS.PROPERTY));
                self.numeroDiscosCreados -= 2;
            } else if (self.el.querySelector('#Menu-' + CONSTANTS.PROPERTY)) {
                self.el.removeChild(self.el.querySelector('#Menu-' + CONSTANTS.PROPERTY));
                self.numeroDiscosCreados -= 1;
            } else {
                createNewMenuDisco(self, Object.keys(self.dashboard[self.valuesSelectded[CONSTANTS.MAINOPCION]][self.valuesSelectded[CONSTANTS.TYPECREATION]]), CONSTANTS.PROPERTY, '#fcb983');
            }

            self.el.setAttribute('configuration', {
                typeObjectSelected: '',
                valueObjectSelected: '',
            });
        });
        return entityConfIcon;
    },
});

let createNewMenuDisco = (self, objects, objectType, colorDisco) => {
    //console.log("################## menu-disco createNewMenuDisco  ##################");
    console.log(self.numeroDiscosCreados)

    let entityMenuDisco = document.createElement('a-entity');
    entityMenuDisco.setAttribute('id', 'Menu-' + objectType);
    entityMenuDisco.classList.add(self.el.getAttribute('id'));
    entityMenuDisco.setAttribute('position', { x: 0, y: 3 * self.numeroDiscosCreados, z: 0 });
    entityMenuDisco.setAttribute('menu-disco', {
        'objectsStage': objects,
        'objectType': objectType,
        'colorDisco': colorDisco,
        'eventComplement': 'menu-object'
    });
    self.el.appendChild(entityMenuDisco);
    self.numeroDiscosCreados += 1;
};

let addFilterCreated = (self, nameFilter, nameDocument) => {
    const fields = {
        nameFilter: nameFilter,
        nameDocument: nameDocument
    };

    self.filtersCreated.push(fields);
    console.dir(self.filtersCreated);
};

let addDocumentCreatedJSON = (self, idDocument) => {
    fetch(self.valuesSelectded[CONSTANTS.VALUEPROPERTY])
        .then(response => response.json())
        .then(data => {
            const keys = Object.keys(data[0]);
            const stringKeys = [];
            const numberKeys = [];
            const uniqueValues = {};

            keys.forEach(key => {
                const value = data[0][key];
                if (typeof value === 'string') {
                    stringKeys.push(key);
                } else if (typeof value === 'number') {
                    numberKeys.push(key);
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

            console.log('Claves de tipo string:', stringKeys);
            console.log('Claves de tipo número:', numberKeys);
            console.log('Valores únicos de las claves de tipo string:', uniqueValues);
            console.dir(self.documentsCreated);
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
            const numberKeys = [];
            const uniqueValues = {};

            console.log(data)
            keys.forEach(key => {
                const value = data[0][key];
                console.log('value ' + value);
                if (!isNaN(Number(value)) && value.trim() !== '') {
                    numberKeys.push(key);
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

            console.log('Claves de tipo string:', stringKeys);
            console.log('Claves de tipo número:', numberKeys);
            console.log('Valores únicos de las claves de tipo string:', uniqueValues);
            console.dir(self.documentsCreated);
        })
        .catch(error => console.error('Error al cargar el archivo:', error));
};

