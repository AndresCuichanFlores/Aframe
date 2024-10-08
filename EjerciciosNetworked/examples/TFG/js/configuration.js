import * as CONSTANTS from './constants.js';

AFRAME.registerComponent('configuration', {
    schema: {
        typeObjectSelected: { type: 'string', oneOf: [CONSTANTS.MAINOPCION, CONSTANTS.TYPECREATION, CONSTANTS.PROPERTY, CONSTANTS.VALUEPROPERTY, CONSTANTS.SUBPROPERTY, CONSTANTS.SUBVALUEPROPERTY] },
        valueObjectSelected: { type: 'string', default: '' },
    },

    init: function () {
        //console.log("################## configuration INIT ");
        this.initializeParameters();

        if (Object.keys(this.dashboard[CONSTANTS.QUERYES]).includes(this.data.valueObjectSelected)) {
            this.valuesSelectded[CONSTANTS.MAINOPCION] = CONSTANTS.QUERYES;
            this.colorDiscoAnterior = '#00d8db';
        } else if (Object.keys(this.dashboard[CONSTANTS.GRAPHS]).includes(this.data.valueObjectSelected)) {
            this.valuesSelectded[CONSTANTS.MAINOPCION] = CONSTANTS.GRAPHS;
            this.colorDiscoAnterior = '#0a9900';
        } else if (Object.keys(this.dashboard[CONSTANTS.FILTERS]).includes(this.data.valueObjectSelected)) {
            let nameFile = this.objectBabiaCreated.querySelector('.botNameObject').getAttribute('text').value;
            this.extractDataFile(nameFile);
            this.valuesSelectded[CONSTANTS.MAINOPCION] = CONSTANTS.FILTERS;
            this.colorDiscoAnterior = '#ffa200';
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
        console.log('this.valuesSelectded');
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
                url: ['./data/cuentas.csv', './data/hacienda.csv', './data/nomina.csv', './data/lenguajesProgramacion.csv'],
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
        this.colorDiscoAnterior;
    },

    extractDataFile: function (nameFile) {
        //Sacar las keys y values del archivo escogido para filtrar
        const urlsJSON = this.dashboard[CONSTANTS.QUERYES][CONSTANTS.BABIAQUERYJSON].url;
        const urlsCSV = this.dashboard[CONSTANTS.QUERYES][CONSTANTS.BABIAQUERYCSV].url;
        const combinedUrls = [...urlsJSON, ...urlsCSV];

        for (let i = 0; i < combinedUrls.length; i++) {
            if (combinedUrls[i].includes(nameFile)) {
                const fileExtension = combinedUrls[i].split('.').pop();
                if(fileExtension === 'json'){
                    addDocumentCreatedJSON(this, nameFile);
                }else if(fileExtension === 'csv'){
                    addDocumentCreatedCSV(this, nameFile);
                }
                break;
            }
        }
    },

    executeMenuQueryes: function () {
        if (this.data.typeObjectSelected === CONSTANTS.TYPECREATION) {
            this.createNewMenuDisco(Object.keys(this.dashboard[this.valuesSelectded[CONSTANTS.MAINOPCION]][this.data.valueObjectSelected]), CONSTANTS.PROPERTY, '#85d0ff');
            this.colorDiscoAnterior = '#85d0ff';
        } else if (this.data.typeObjectSelected === CONSTANTS.PROPERTY) {
            this.createNewMenuDisco(this.dashboard[this.valuesSelectded[CONSTANTS.MAINOPCION]][this.valuesSelectded[CONSTANTS.TYPECREATION]][this.data.valueObjectSelected], CONSTANTS.VALUEPROPERTY, '#85a3ff');
            this.colorDiscoAnterior = '#85a3ff';
        } else if (this.data.typeObjectSelected === CONSTANTS.VALUEPROPERTY) {
            this.updateComplementBabia()
        }
    },

    executeMenuGraphs: function () {
        if (this.data.typeObjectSelected === CONSTANTS.TYPECREATION) {
            this.createNewMenuDisco(Object.keys(this.dashboard[this.valuesSelectded[CONSTANTS.MAINOPCION]][this.data.valueObjectSelected]), CONSTANTS.PROPERTY, '#afff7a');
            this.colorDiscoAnterior = '#afff7a';
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
                this.createNewMenuDisco(idQuerys, CONSTANTS.VALUEPROPERTY, '#fff47a');
                this.colorDiscoAnterior = '#fff47a';
            } else {
                this.createNewMenuDisco(this.dashboard[this.valuesSelectded[CONSTANTS.MAINOPCION]][this.valuesSelectded[CONSTANTS.TYPECREATION]][this.data.valueObjectSelected], CONSTANTS.VALUEPROPERTY, '#fff47a');
                this.colorDiscoAnterior = '#fff47a';
            }
        } else if (this.data.typeObjectSelected === CONSTANTS.VALUEPROPERTY) {
            if (this.valuesSelectded[CONSTANTS.PROPERTY] === CONSTANTS.FROM) {

                if (this.valuesSelectded[CONSTANTS.VALUEPROPERTY].includes(":")) {
                    let nameDocument = this.valuesSelectded[CONSTANTS.VALUEPROPERTY].split(":")[0];
                    this.extractDataFile(nameDocument);
                }else{
                    this.extractDataFile(this.data.valueObjectSelected);
                }

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
                this.createNewMenuDisco([CONSTANTS.KEY, CONSTANTS.SIZE], CONSTANTS.SUBPROPERTY, '#ffa97a');
                this.colorDiscoAnterior = '#ffa97a';
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
                this.createNewMenuDisco(Object.keys(this.documentsCreated[nameDocument][this.data.valueObjectSelected]), CONSTANTS.SUBVALUEPROPERTY, '#ff7a7a');
                this.colorDiscoAnterior = '#ff7a7a';
            } else {
                this.createNewMenuDisco(Object.keys(this.documentsCreated[this.valuesSelectded[CONSTANTS.VALUEPROPERTY]][this.data.valueObjectSelected]), CONSTANTS.SUBVALUEPROPERTY, '#ff7a7a');
                this.colorDiscoAnterior = '#ff7a7a';
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
            setTimeout(() => {
                console.log('Han pasado 0.3 segundos');
                this.createNewMenuDisco(Object.keys(this.documentsCreated[nameDocumentFilter].key), CONSTANTS.PROPERTY, '#fea681', nameDocumentFilter);
                this.colorDiscoAnterior = '#fea681';
            }, 300); 
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

            this.createNewMenuDisco(this.documentsCreated[nameDocumentFilter].key[this.data.valueObjectSelected], CONSTANTS.VALUEPROPERTY, '#fe8181');
            this.colorDiscoAnterior = '#fe8181';
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
            } else if (this.valuesSelectded[CONSTANTS.TYPECREATION] === CONSTANTS.BABIAQUERYCSV) {
                this.objectBabiaCreated.setAttribute(CONSTANTS.BABIAQUERYCSV, this.valuesSelectded[CONSTANTS.PROPERTY], this.valuesSelectded[CONSTANTS.VALUEPROPERTY]);
                this.addBotNameObject(idObjectConfiguration);
            }

        } else if (this.valuesSelectded[CONSTANTS.MAINOPCION] === CONSTANTS.GRAPHS) {

            if(Object.keys(this.subProperties).length === 0){
                this.objectBabiaCreated.childNodes[0].setAttribute(this.valuesSelectded[CONSTANTS.TYPECREATION],
                    this.valuesSelectded[CONSTANTS.PROPERTY], this.valuesSelectded[CONSTANTS.VALUEPROPERTY]);
            }else{
                this.objectBabiaCreated.childNodes[0].setAttribute(this.valuesSelectded[CONSTANTS.TYPECREATION], {
                    [this.valuesSelectded[CONSTANTS.PROPERTY]]: this.valuesSelectded[CONSTANTS.VALUEPROPERTY],
                    [CONSTANTS.KEY]: this.subProperties[CONSTANTS.KEY],
                    [CONSTANTS.SIZE]: this.subProperties[CONSTANTS.SIZE],
                });
            }
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
        entityObjectChildren.setAttribute('networked', 'template:#textInit-template');
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
        entityObjectChildren.setAttribute('position', { x: 0, y: this.objectBabiaCreated.getAttribute('position').y - 6.9, z: 0 });
        this.objectBabiaCreated.appendChild(entityObjectChildren);
    },

    createNewMenuDisco: function (objects, objectType, colorDisco, nameDocumentFilter) {
        //console.log("################## menu-disco createNewMenuDisco  ##################");
        //console.log(this.numeroDiscosCreados)
        let entityMenuDisco = document.createElement('a-entity');
        entityMenuDisco.setAttribute('networked', 'template:#platoInit-template');
        entityMenuDisco.setAttribute('id', 'Menu-' + objectType);
        entityMenuDisco.setAttribute('position', { x: 0, y: 3.5 + (2.8 * this.numeroDiscosCreados), z: 0 });
        entityMenuDisco.setAttribute('menu-disco', {
            'objectsStage': objects,
            'objectType': objectType,
            'colorDisco': colorDisco,
            'eventObject': 'events-object-configuration'
        });
        
        let entityMiniDisco;
        if(nameDocumentFilter){
            entityMiniDisco = this.createMiniDisco(nameDocumentFilter);
        }else{
            entityMiniDisco = this.createMiniDisco(this.data.valueObjectSelected);
        }

        entityMenuDisco.appendChild(entityMiniDisco);
        this.el.appendChild(entityMenuDisco);
        this.numeroDiscosCreados += 1;
    },

    createMiniDisco: function (titleObject) {
        //Mini disco
        let entityMiniDisco = document.createElement('a-entity');
        entityMiniDisco.setAttribute('networked', 'template:#platoInit-template');
        entityMiniDisco.classList.add("miniDisco");
        entityMiniDisco.setAttribute('scale', '1 1 1');
        entityMiniDisco.setAttribute('material', 'color', this.colorDiscoAnterior);
        entityMiniDisco.setAttribute('position', { x: 0, y: 0.3, z: 0 });
        entityMiniDisco.setAttribute('geometry', {
            'primitive': 'cylinder',
            'radius': '1',
            'height': '0.25',
        });

        //en gltf del objecto
        let entityObject = document.createElement('a-entity');
        entityObject.setAttribute('networked', 'template', '#objectInit-template');
        entityObject.setAttribute('gltf-model', '3Dmodels/response.glb');
        entityObject.setAttribute('position', { x: 0, y: 0.8, z: 0 });
        entityObject.setAttribute('scale', '0.35 0.35 0.35');
        
        //texto arriba del objeto
        let entityTitle = document.createElement('a-entity');
        entityTitle.setAttribute('networked', 'template:#textInit-template');
        entityTitle.classList.add("topNameObject");
        entityTitle.setAttribute('look-at', '#rig-player');
        entityTitle.setAttribute('text', {
            'value': titleObject,
            'align': 'center',
            'side': 'double',
            'color': 'black',
            'shader': 'msdf',
            'font': 'https://raw.githubusercontent.com/etiennepinchon/aframe-fonts/master/fonts/berkshireswash/BerkshireSwash-Regular.json'
        });
        entityTitle.setAttribute('scale', '8 8 8');
        entityTitle.setAttribute('position', { x: 0, y: 1.15, z: 0 });

        entityMiniDisco.appendChild(entityTitle);
        entityMiniDisco.appendChild(entityObject);

        return entityMiniDisco;
    },
});

//FUNCIONES EXTERNAS

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
    console.time('Tiempo de ejecución'); // Inicia el temporizador
    fetch('./data/' + idDocument + '.json')
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

            console.log('documentsCreated');
            console.log(self.documentsCreated);
            console.timeEnd('Tiempo de ejecución');
        })
        .catch(error => console.error('Error al cargar el archivo:', error));
};

let addDocumentCreatedCSV = (self, idDocument) => {
    fetch('./data/' + idDocument + '.csv')
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

            console.log('documentsCreated');
            console.log(self.documentsCreated);
        })
        .catch(error => console.error('Error al cargar el archivo:', error));
};

