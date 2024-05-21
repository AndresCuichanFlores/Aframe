
AFRAME.registerComponent('configuration', {
    schema: {
        typeObjectSelected: { type: 'string', oneOf: ['mainOpcion', 'typeCreation', 'property', 'valueProperty'] },
        valueObjectSelected: { type: 'string', default: '' },
    },

    init: function () {
        //console.log("################## configuration INIT ");
        createNewMenuDisco(this, Object.keys(this.dashboard), 'mainOpcion', '#C99E10');
    },

    update: function () {
        console.log("################## configuration UPDATE ");
        console.log("typeObjectSelected: " + this.data.typeObjectSelected);
        console.log("valueObjectSelected: " + this.data.valueObjectSelected);

        this.valuesSelectded[this.data.typeObjectSelected] = this.data.valueObjectSelected;

        if (this.data.typeObjectSelected === 'mainOpcion') {
            createNewMenuDisco(this, Object.keys(this.dashboard[this.data.valueObjectSelected]), 'typeCreation', '#8080ff');
        } else if (this.data.typeObjectSelected === 'typeCreation') {
            let objectConfiguration = this.el.querySelector('#Menu-typeCreation').querySelector('.selected');
            let entityConfIcon = createConfIcon(this);
            objectConfiguration.appendChild(entityConfIcon);
            createNewMenuDisco(this, Object.keys(this.dashboard[this.valuesSelectded['mainOpcion']][this.data.valueObjectSelected]), 'property', '#fcb983');
        } else if (this.data.typeObjectSelected === 'property') {
            let entidadDiscoValueProperty = this.el.querySelector('#Menu-valueProperty')
            if (entidadDiscoValueProperty) {
                this.el.removeChild(entidadDiscoValueProperty);
                this.numeroDiscosCreados -= 1;
            }
            createNewMenuDisco(this, this.dashboard[this.valuesSelectded['mainOpcion']][this.valuesSelectded['typeCreation']][this.data.valueObjectSelected], 'valueProperty', '#9efc83');
        } else if (this.data.typeObjectSelected === 'valueProperty') {
            this.updateComplementBabia()
        }

        console.dir(this.valuesSelectded);
    },

    valuesSelectded: {
        mainOpcion: undefined,
        typeCreation: undefined,
        property: undefined,
        valueProperty: undefined
    },

    dashboard: {
        queryes: {
            json: {
                url: ['./data/dataBD.json', './data/dataBD2.json', './data/dataBD3.json'],
                data: ['irelia', 'nautilus']
            },
            csv: {
                url: ['./data/cuentas.csv', './data/hacienda.csv', './data/nomina.csv'],
                data: []
            },
            elastic: {
                url: ['./data/dataBD.elastic', './data/dataBD2.elastic', './data/dataBD3.elastic'],
                data: []
            }
        },

        graphs: {
            pie: {
                url: ['./data/dataBD.json', './data/dataBD2.json', './data/dataBD3.json'],
                data: []
            },
            bars: {
                url: ['./data/dataBD.csv', './data/dataBD2.csv', './data/dataBD3.csv'],
                data: []
            },
            cyls: {
                url: ['./data/dataBD.csv', './data/dataBD2.csv', './data/dataBD3.csv'],
                data: []
            }
        },

        filters: {
            pie: {
                url: ['./data/dataBD.json', './data/dataBD2.json', './data/dataBD3.json'],
                data: []
            },
            bars: {
                url: ['./data/dataBD.csv', './data/dataBD2.csv', './data/dataBD3.csv'],
                data: []
            },
            cyls: {
                url: ['./data/dataBD.csv', './data/dataBD2.csv', './data/dataBD3.csv'],
                data: []
            }
        }
    },

    numeroDiscosCreados: 0,

    updateComplementBabia: function () {
        // console.log("################## configuration createMenu   ##################");
        let objectConfiguration = this.el.querySelector('#Menu-typeCreation').querySelector('.selected');

        let idObjectConfiguration = this.valuesSelectded['valueProperty'].substring(this.valuesSelectded['valueProperty'].lastIndexOf('/') + 1, this.valuesSelectded['valueProperty'].lastIndexOf('.'));
        objectConfiguration.setAttribute('id', idObjectConfiguration);

        if (this.valuesSelectded['mainOpcion'] === 'queryes') {
            if (this.valuesSelectded['typeCreation'] === 'json') {
                objectConfiguration.setAttribute('babia-queryjson', this.valuesSelectded['property'], this.valuesSelectded['valueProperty']);

                objectConfiguration.setAttribute('menu-object', 'titleObject', idObjectConfiguration);

            } else if (this.valuesSelectded['typeCreation'] === 'csv') {
                objectConfiguration.setAttribute('babia-querycsv', this.valuesSelectded['property'], this.valuesSelectded['valueProperty']);

                objectConfiguration.setAttribute('menu-object', 'titleObject', idObjectConfiguration);
                
            } else if (this.valuesSelectded['typeCreation'] === 'elastic') {

            }
        } else if (this.valuesSelectded['mainOpcion'] === 'graphs') {

        } else if (this.valuesSelectded['mainOpcion'] === 'filters') {

        }
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

let createConfIcon = (self) => {
    //console.log("################## menu-disco createNewMenuDisco  ##################");
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
    });
    return entityConfIcon;
};
