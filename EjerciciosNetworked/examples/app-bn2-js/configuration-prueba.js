import * as CONSTANTS from './constants.js';

AFRAME.registerComponent('configuration-prueba', {
    schema: {
        typeObjectSelected: {type: 'string', oneOf: [CONSTANTS.MAINOPCION, CONSTANTS.TYPECREATION, CONSTANTS.PROPERTY, CONSTANTS.VALUEPROPERTY]},
        valueObjectSelected: {type: 'string', default: ''},
    },

    init: function () {
        //console.log("################## configuration-prueba INIT ");
        this.initializeParameters();
        this.createConfIcon();

        if (Object.keys(this.dashboard[CONSTANTS.QUERYES]).includes(this.data.valueObjectSelected)) {
            this.valuesSelectded[CONSTANTS.MAINOPCION] = CONSTANTS.QUERYES;
        } else if (Object.keys(this.dashboard[CONSTANTS.GRAPHS]).includes(this.data.valueObjectSelected)) {
            this.valuesSelectded[CONSTANTS.MAINOPCION] = CONSTANTS.GRAPHS;
        }else if (Object.keys(this.dashboard[CONSTANTS.FILTERS]).includes(this.data.valueObjectSelected)) {
            this.valuesSelectded[CONSTANTS.MAINOPCION] = CONSTANTS.FILTERS;
        }
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
        console.dir(this.valuesSelectded);
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
            [CONSTANTS.BABIAFILTER]: [],
            
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
                        //console.log("Esxite la query en documetnscreated");
                        createNewMenuDisco(this, Object.keys(this.documentsCreated[nameQuerrySelect].key), CONSTANTS.VALUEPROPERTY, '#85faf4');
                    } else {
                        //console.log("Esxite la query en filterscreated");
                        let filter = this.filtersCreated.find(value => value.nameFilter === nameQuerrySelect);
                        createNewMenuDisco(this, Object.keys(this.documentsCreated[filter.nameDocument].key), CONSTANTS.VALUEPROPERTY, '#85faf4');
                    }

                } else if (this.valuesSelectded[CONSTANTS.PROPERTY] === 'size') {
                    let objectConfiguration = this.el.querySelector('#Menu-' + CONSTANTS.TYPECREATION).querySelector('.selected');
                    let nameQuerrySelect = objectConfiguration.getAttribute('babia-' + this.valuesSelectded[CONSTANTS.TYPECREATION]).from;
                    this.independentProperty = true;

                    if (nameQuerrySelect in this.documentsCreated) {
                        //console.log("Esxite la query en documetnscreated");
                        createNewMenuDisco(this, this.documentsCreated[nameQuerrySelect].size, CONSTANTS.VALUEPROPERTY, '#85faf4');
                    } else {
                        //console.log("Exite la query en filterscreated");
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
        let nameDocumentFilter = this.el.querySelector('.botNameObject').getAttribute('text').value;
        if (nameDocumentFilter.includes(":")) {
            nameDocumentFilter = nameDocumentFilter.split(":")[0];
        }

        if (this.data.typeObjectSelected === CONSTANTS.TYPECREATION) {
            createNewMenuDisco(this, Object.keys(this.documentsCreated[nameDocumentFilter].key), CONSTANTS.PROPERTY, '#fcb983');
        } else if (this.data.typeObjectSelected === CONSTANTS.PROPERTY) {
            let entityTreeBase = this.el.parentNode.parentNode;
            if (entityTreeBase.childNodes[1]) {
                while (entityTreeBase.childNodes.length > 0) {
                    var child = entityTreeBase.childNodes[entityTreeBase.childNodes.length - 1];
                    if (child === entityTreeBase.childNodes[1]) {
                        break;
                    }
                    entityTreeBase.removeChild(child);
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
        let objectConfiguration = this.el;

        console.log("UPDATE BABIA ANTES");
        console.dir(this.documentsCreated);
        console.dir(this.filtersCreated);

        if (this.valuesSelectded[CONSTANTS.MAINOPCION] === CONSTANTS.QUERYES) {

            let idObjectConfiguration = this.valuesSelectded[CONSTANTS.VALUEPROPERTY].substring(this.valuesSelectded[CONSTANTS.VALUEPROPERTY].lastIndexOf('/') + 1, this.valuesSelectded[CONSTANTS.VALUEPROPERTY].lastIndexOf('.'));
            objectConfiguration.setAttribute('id', idObjectConfiguration);

            if (this.valuesSelectded[CONSTANTS.TYPECREATION] === CONSTANTS.BABIAQUERYJSON) {
                objectConfiguration.setAttribute(CONSTANTS.BABIAQUERYJSON, this.valuesSelectded[CONSTANTS.PROPERTY], this.valuesSelectded[CONSTANTS.VALUEPROPERTY]);
                this.addBotNameObject(idObjectConfiguration);
                addDocumentCreatedJSON(this, idObjectConfiguration);
            } else if (this.valuesSelectded[CONSTANTS.TYPECREATION] === CONSTANTS.BABIAQUERYCSV) {
                objectConfiguration.setAttribute(CONSTANTS.BABIAQUERYCSV, this.valuesSelectded[CONSTANTS.PROPERTY], this.valuesSelectded[CONSTANTS.VALUEPROPERTY]);
                this.addBotNameObject(idObjectConfiguration);
                addDocumentCreatedCSV(this, idObjectConfiguration);
            } else if (this.valuesSelectded[CONSTANTS.TYPECREATION] === 'elastic') {

            }

        } else if (this.valuesSelectded[CONSTANTS.MAINOPCION] === CONSTANTS.GRAPHS) {

            //console.log("typeObjectSelected: " + this.data.typeObjectSelected);
            //console.log("valueObjectSelected: " + this.data.valueObjectSelected);

            if (this.valuesSelectded[CONSTANTS.TYPECREATION] === 'pie') {
                objectConfiguration.setAttribute(CONSTANTS.BABIAPIE, this.valuesSelectded[CONSTANTS.PROPERTY], this.valuesSelectded[CONSTANTS.VALUEPROPERTY]);
            } else if (this.valuesSelectded[CONSTANTS.TYPECREATION] === 'doughnut') {
                objectConfiguration.setAttribute(CONSTANTS.BABIADOUGHNUT, this.valuesSelectded[CONSTANTS.PROPERTY], this.valuesSelectded[CONSTANTS.VALUEPROPERTY]);
            } else if (this.valuesSelectded[CONSTANTS.TYPECREATION] === 'elastic') {

            }

        } else if (this.valuesSelectded[CONSTANTS.MAINOPCION] === CONSTANTS.FILTERS) {
            let nameDocumentFilter = this.el.querySelector('.botNameObject').getAttribute('text').value;
            if(nameDocumentFilter.includes(":")) {
                nameDocumentFilter = nameDocumentFilter.split(":")[0];
            }

            let nameFilter = this.valuesSelectded[CONSTANTS.PROPERTY] + '=' + this.valuesSelectded[CONSTANTS.VALUEPROPERTY]
            objectConfiguration.setAttribute(CONSTANTS.BABIAFILTER, {
                'from': nameDocumentFilter,
                'filter': nameFilter
            });
            objectConfiguration.setAttribute('id', nameDocumentFilter  + ':' + nameFilter);
            this.addBotNameObject(nameDocumentFilter + ':' + nameFilter);
            addFilterCreated(this, nameFilter, nameDocumentFilter);
        }

        console.log("UPDATE BABIA DESPUES");
        console.dir(this.documentsCreated);
        console.dir(this.filtersCreated);
    },

    addBotNameObject: function (botNameObject) {
        if(this.el.querySelector('.botNameObject')){
            this.el.removeChild(this.el.querySelector('.botNameObject'));
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
        entityObjectChildren.setAttribute('scale', '35 35 35');
        //console.log('position.y: ' + this.el.getAttribute('position').y);
        entityObjectChildren.setAttribute('position', { x: 0, y: this.el.getAttribute('position').y - 7, z: 0 });
        this.el.appendChild(entityObjectChildren);
    },

    createConfIcon: function () {
        //console.log("################## configuration createConfIcon   ##################");
        let self = this;
        let entityTreeBase = this.el.parentNode.parentNode;
        let entityConfIcon = document.createElement('a-entity');
        entityConfIcon.classList.add("iconConf");
        entityConfIcon.setAttribute('gltf-model', 'assets/real/iconConif.glb');
        entityConfIcon.setAttribute('scale', '0.6 0.6 0.6');
        entityConfIcon.setAttribute('position', '4.2 0.9 0');

        entityConfIcon.addEventListener('click', function () {
            //console.log('Icon conf clicked!');

            if(entityTreeBase.childNodes[1]){
                while (entityTreeBase.childNodes.length > 0) {
                    var child = entityTreeBase.childNodes[entityTreeBase.childNodes.length - 1];
                    if (child === entityTreeBase.childNodes[0]) {
                        break;
                    }
                    entityTreeBase.removeChild(child);
                    self.numeroDiscosCreados -= 1;
                }
            }else{
                if(self.valuesSelectded[CONSTANTS.MAINOPCION] === CONSTANTS.FILTERS){
                    let nameDocumentFilter = self.el.querySelector('.botNameObject').getAttribute('text').value;
                    if (nameDocumentFilter.includes(":")) {
                        nameDocumentFilter = nameDocumentFilter.split(":")[0];
                    }
                    createNewMenuDisco(self, Object.keys(self.documentsCreated[nameDocumentFilter].key), CONSTANTS.PROPERTY, '#fcb983');
                }else{
                    createNewMenuDisco(self, Object.keys(self.dashboard[self.valuesSelectded[CONSTANTS.MAINOPCION]][self.valuesSelectded[CONSTANTS.TYPECREATION]]), CONSTANTS.PROPERTY, '#fcb983');
                }
            }
        });
        
        self.el.appendChild(entityConfIcon);
    },
});

let createNewMenuDisco = (self, objects, objectType, colorDisco) => {
    //console.log("################## menu-disco createNewMenuDisco  ##################");
    //console.log(self.numeroDiscosCreados)

    let entityMenuDisco = document.createElement('a-entity');
    entityMenuDisco.setAttribute('id', 'Menu-' + objectType);
    entityMenuDisco.setAttribute('position', { x: 0, y: 5 + (3 * self.numeroDiscosCreados), z: 0 });
    entityMenuDisco.setAttribute('menu-disco', {
        'objectsStage': objects,
        'objectType': objectType,
        'colorDisco': colorDisco,
        'eventComplement': 'avents-object-configuration'
    });
    self.el.parentNode.parentNode.appendChild(entityMenuDisco);
    self.numeroDiscosCreados += 1;
};

let addFilterCreated = (self, nameFilter, nameDocument) => {
    const fields = {
        nameFilter: nameFilter,
        nameDocument: nameDocument
    };

    self.filtersCreated.push(fields);
    //console.dir(self.filtersCreated);
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

            //console.log('Claves de tipo string:', stringKeys);
            //console.log('Claves de tipo número:', numberKeys);
            //console.log('Valores únicos de las claves de tipo string:', uniqueValues);
            //console.dir(self.documentsCreated);
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

            //console.log(data)
            keys.forEach(key => {
                const value = data[0][key];
                //console.log('value ' + value);
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

            //console.log('Claves de tipo string:', stringKeys);
            //console.log('Claves de tipo número:', numberKeys);
            //console.log('Valores únicos de las claves de tipo string:', uniqueValues);
            //console.dir(self.documentsCreated);
        })
        .catch(error => console.error('Error al cargar el archivo:', error));
};

