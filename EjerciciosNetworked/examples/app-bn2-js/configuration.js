
AFRAME.registerComponent('configuration', {
    schema: {
        typeObjectSelected: { type: 'string', oneOf: ['mainOpcion', 'typeCreation', 'property', 'valueProperty'] },
        valueObjectSelected: { type: 'string', default: '' },
    },

    init: function () {
        //console.log("################## configuration INIT ");
        this.initializeParameters();
        createNewMenuDisco(this, Object.keys(this.dashboard), 'mainOpcion', '#C99E10');
    },

    update: function () {
        //console.log("################## configuration UPDATE ");

        this.valuesSelectded[this.data.typeObjectSelected] = this.data.valueObjectSelected;
        console.dir(this.valuesSelectded);

        if (this.valuesSelectded.mainOpcion === 'queryes') {
            this.executeMenuQueryes();
        } else if (this.valuesSelectded.mainOpcion === 'graphs') {
            this.executeMenuGraphs();
        } else if (this.valuesSelectded.mainOpcion === 'filters') {
            this.executeMenuFilters();
        }
    },


    documentsCreated: {},
    filtersCreated: [],

    dashboard: {
        queryes: {
            json: {
                url: ['./data/laptops.json', './data/plants.json', './data/cafes.json'],
            },
            csv: {
                url: ['./data/cuentas.csv', './data/hacienda.csv', './data/nomina.csv'],
            },
        },

        graphs: {
            pie: {
                from: {},
                legend: ['true', 'false'],
                animation: ['true', 'false'],
                palette: ['blues', 'bussiness', 'commerce', 'flat', 'foxy', 'icecream', 'pearl', 'sunset', 'ubuntu'],
            },
            doughnut: {
                from: {},
                legend: ['true', 'false'],
                animation: ['true', 'false'],
                palette: ['blues', 'bussiness', 'commerce', 'flat', 'foxy', 'icecream', 'pearl', 'sunset', 'ubuntu'],
            },
        },

        filters: {
        }
    },

    initializeParameters: function () {
        this.valuesSelectded = {
            mainOpcion: undefined,
            typeCreation: undefined,
            property: undefined,
            valueProperty: undefined,
        };
        this.numeroDiscosCreados = 0;
        this.independentProperty = true;
    },

    executeMenuQueryes: function () {
        if (this.data.typeObjectSelected === 'mainOpcion') {
            createNewMenuDisco(this, Object.keys(this.dashboard[this.data.valueObjectSelected]), 'typeCreation', '#8080ff');
        } else if (this.data.typeObjectSelected === 'typeCreation') {
            let objectConfiguration = this.el.querySelector('#Menu-typeCreation').querySelector('.selected');
            let entityConfIcon = this.createConfIcon();
            objectConfiguration.appendChild(entityConfIcon);
            createNewMenuDisco(this, Object.keys(this.dashboard[this.valuesSelectded['mainOpcion']][this.data.valueObjectSelected]), 'property', '#fcb983');
        } else if (this.data.typeObjectSelected === 'property') {
            let entidadDiscoValueProperty = this.el.querySelector('#Menu-valueProperty')
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
            createNewMenuDisco(this, this.dashboard[this.valuesSelectded['mainOpcion']][this.valuesSelectded['typeCreation']][this.data.valueObjectSelected], 'valueProperty', '#9efc83');
        } else if (this.data.typeObjectSelected === 'valueProperty') {
            this.updateComplementBabia()
        }
    },

    executeMenuGraphs: function () {
        if (this.data.typeObjectSelected === 'mainOpcion') {
            createNewMenuDisco(this, Object.keys(this.dashboard[this.data.valueObjectSelected]), 'typeCreation', '#8080ff');
        } else if (this.data.typeObjectSelected === 'typeCreation') {
            let objectConfiguration = this.el.querySelector('#Menu-typeCreation').querySelector('.selected');
            let entityConfIcon = this.createConfIcon();
            objectConfiguration.appendChild(entityConfIcon);
            createNewMenuDisco(this, Object.keys(this.dashboard[this.valuesSelectded['mainOpcion']][this.data.valueObjectSelected]), 'property', '#fcb983');
        } else if (this.data.typeObjectSelected === 'property') {
            const specialProperties = ['from', 'key', 'size'];

            if (specialProperties.includes(this.valuesSelectded.property)) {
                this.independentProperty = false;
                let entidadDiscoValuePropertyRepetido = this.el.querySelectorAll('#Menu-valueProperty');

                if (entidadDiscoValuePropertyRepetido.length == 2) {
                    this.el.removeChild(entidadDiscoValuePropertyRepetido[entidadDiscoValuePropertyRepetido.length - 1]);
                    this.numeroDiscosCreados -= 1;
                }

                if (this.valuesSelectded.property === 'from') {
                    let elementsQuerys = document.querySelectorAll('[babia-queryjson], [babia-querycsv], [babia-filter]');
                    let ids = [];
                    elementsQuerys.forEach(element => {
                        if (element.id) {
                            ids.push(element.id);
                        }
                    });
                    createNewMenuDisco(this, ids, 'valueProperty', '#9efc83');
                } else if (this.valuesSelectded.property === 'key') {
                    let objectConfiguration = this.el.querySelector('#Menu-typeCreation').querySelector('.selected');
                    let nameQuerrySelect = objectConfiguration.getAttribute('babia-' + this.valuesSelectded.typeCreation).from;
                    this.independentProperty = true;

                    if (nameQuerrySelect in this.documentsCreated) {
                        console.log("Esxite la query en documetnscreated");
                        createNewMenuDisco(this, Object.keys(this.documentsCreated[nameQuerrySelect].key), 'valueProperty', '#85faf4');
                    } else {
                        console.log("Esxite la query en filterscreated");
                        let filter = this.filtersCreated.find(value => value.nameFilter === nameQuerrySelect);
                        createNewMenuDisco(this, Object.keys(this.documentsCreated[filter.nameDocument].key), 'valueProperty', '#85faf4');
                    }

                } else if (this.valuesSelectded.property === 'size') {
                    let objectConfiguration = this.el.querySelector('#Menu-typeCreation').querySelector('.selected');
                    let nameQuerrySelect = objectConfiguration.getAttribute('babia-' + this.valuesSelectded.typeCreation).from;
                    this.independentProperty = true;

                    if (nameQuerrySelect in this.documentsCreated) {
                        console.log("Esxite la query en documetnscreated");
                        createNewMenuDisco(this, this.documentsCreated[nameQuerrySelect].size, 'valueProperty', '#85faf4');
                    } else {
                        console.log("Exite la query en filterscreated");
                        let filter = this.filtersCreated.find(value => value.nameFilter === nameQuerrySelect);
                        createNewMenuDisco(this, this.documentsCreated[filter.nameDocument].size, 'valueProperty', '#85faf4');
                    }
                }
            } else {
                let entidadDiscoValueProperty = this.el.querySelectorAll('#Menu-valueProperty')[0]

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
                createNewMenuDisco(this, this.dashboard[this.valuesSelectded['mainOpcion']][this.valuesSelectded['typeCreation']][this.data.valueObjectSelected], 'valueProperty', '#9efc83');
            }
        } else if (this.data.typeObjectSelected === 'valueProperty') {
            this.updateComplementBabia()
            if (!this.independentProperty) {
                if (this.valuesSelectded.property === 'from') {
                    createNewMenuDisco(this, ['key', 'size'], 'property', '#85faf4',);
                }
            }
        }
    },

    executeMenuFilters: function () {
        if (this.data.typeObjectSelected === 'mainOpcion') {
            let elementsQuerys = document.querySelectorAll('[babia-queryjson], [babia-querycsv]');
            let ids = [];
            elementsQuerys.forEach(element => {
                if (element.id) {
                    ids.push(element.id);
                }
            });
            createNewMenuDisco(this, ids, 'typeCreation', '#8080ff');
        } else if (this.data.typeObjectSelected === 'typeCreation') {
            let objectConfiguration = this.el.querySelector('#Menu-typeCreation').querySelector('.selected');
            let entityConfIcon = this.createConfIcon();
            objectConfiguration.appendChild(entityConfIcon);
            createNewMenuDisco(this, Object.keys(this.documentsCreated[this.data.valueObjectSelected].key), 'property', '#fcb983');
        } else if (this.data.typeObjectSelected === 'property') {
            createNewMenuDisco(this, this.documentsCreated[this.valuesSelectded.typeCreation].key[this.data.valueObjectSelected], 'valueProperty', '#9efc83');
        } else if (this.data.typeObjectSelected === 'valueProperty') {
            this.updateComplementBabia()
        }
    },

    updateComplementBabia: function () {
        // console.log("################## configuration createMenu   ##################");
        let objectConfiguration = this.el.querySelector('#Menu-typeCreation').querySelector('.selected');

        if (this.valuesSelectded['mainOpcion'] === 'queryes') {

            let idObjectConfiguration = this.valuesSelectded['valueProperty'].substring(this.valuesSelectded['valueProperty'].lastIndexOf('/') + 1, this.valuesSelectded['valueProperty'].lastIndexOf('.'));
            objectConfiguration.setAttribute('id', idObjectConfiguration);

            if (this.valuesSelectded['typeCreation'] === 'json') {
                objectConfiguration.setAttribute('babia-queryjson', this.valuesSelectded['property'], this.valuesSelectded['valueProperty']);
                objectConfiguration.setAttribute('menu-object', 'titleObject', idObjectConfiguration);
                addDocumentCreatedJSON(this, idObjectConfiguration);
            } else if (this.valuesSelectded['typeCreation'] === 'csv') {
                objectConfiguration.setAttribute('babia-querycsv', this.valuesSelectded['property'], this.valuesSelectded['valueProperty']);
                objectConfiguration.setAttribute('menu-object', 'titleObject', idObjectConfiguration);
                addDocumentCreatedCSV(this, idObjectConfiguration);
            } else if (this.valuesSelectded['typeCreation'] === 'elastic') {

            }
        } else if (this.valuesSelectded['mainOpcion'] === 'graphs') {

            console.log("typeObjectSelected: " + this.data.typeObjectSelected);
            console.log("valueObjectSelected: " + this.data.valueObjectSelected);

            if (this.valuesSelectded['typeCreation'] === 'pie') {
                objectConfiguration.setAttribute('babia-pie', this.valuesSelectded.property, this.valuesSelectded.valueProperty);
            } else if (this.valuesSelectded['typeCreation'] === 'doughnut') {
                objectConfiguration.setAttribute('babia-doughnut', this.valuesSelectded.property, this.valuesSelectded.valueProperty);
            } else if (this.valuesSelectded['typeCreation'] === 'elastic') {

            }

        } else if (this.valuesSelectded['mainOpcion'] === 'filters') {
            let nameFilter = this.valuesSelectded.property + '=' + this.valuesSelectded.valueProperty
            objectConfiguration.setAttribute('babia-filter', {
                'from': this.valuesSelectded.typeCreation,
                'filter': nameFilter
            });
            objectConfiguration.setAttribute('id', nameFilter);
            objectConfiguration.setAttribute('menu-object', 'titleObject', nameFilter);

            addFilterCreated(this, nameFilter, this.valuesSelectded.typeCreation);
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
            if (self.el.querySelector('#Menu-valueProperty')) {
                self.el.removeChild(self.el.querySelector('#Menu-valueProperty'));
                self.el.removeChild(self.el.querySelector('#Menu-property'));
                self.numeroDiscosCreados -= 2;
            } else if (self.el.querySelector('#Menu-property')) {
                self.el.removeChild(self.el.querySelector('#Menu-property'));
                self.numeroDiscosCreados -= 1;
            } else {
                createNewMenuDisco(self, Object.keys(self.dashboard[self.valuesSelectded['mainOpcion']][self.valuesSelectded.typeCreation]), 'property', '#fcb983');
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
    fetch(self.valuesSelectded.valueProperty)
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
    fetch(self.valuesSelectded.valueProperty)
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

