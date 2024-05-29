
AFRAME.registerComponent('configuration', {
    schema: {
        typeObjectSelected: { type: 'string', oneOf: ['mainOpcion', 'typeCreation', 'property', 'valueProperty','subProperty','subValueProperty'] },
        valueObjectSelected: { type: 'string', default: '' },
    },

    init: function () {
        //console.log("################## configuration INIT ");

        this.valuesSelectded = {
            mainOpcion: undefined,
            typeCreation: undefined,
            property: undefined,
            valueProperty: undefined,
            subProperties: [
                {
                    subProperty: undefined,
                    subValueProperty: undefined
                }
            ]
        };

        this.numeroDiscosCreados = 0;
        this.independentProperty = true;

        createNewMenuDisco(this, Object.keys(this.dashboard), 'mainOpcion', '#C99E10');
    },

    update: function () {
        console.log("################## configuration UPDATE ");
        console.log("typeObjectSelected: " + this.data.typeObjectSelected);
        console.log("valueObjectSelected: " + this.data.valueObjectSelected);

        if(this.data.typeObjectSelected !== 'subProperty' || this.data.typeObjectSelected !== 'subValueProperty'){
            this.valuesSelectded[this.data.typeObjectSelected] = this.data.valueObjectSelected;
        }


        if(this.valuesSelectded.mainOpcion === 'queryes'){
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


        } else if(this.valuesSelectded.mainOpcion === 'graphs'){

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


                if(this.valuesSelectded.property === 'from'){
                    let elementsQuerys = document.querySelectorAll('[babia-queryjson], [babia-querycsv]');
                    let ids = [];
                    elementsQuerys.forEach(element => {
                        if (element.id) { // Verificar si el elemento tiene un ID
                            ids.push(element.id);
                        }
                    });
                    createNewMenuDisco(this, ids, 'valueProperty', '#9efc83');
                    this.independentProperty = false;
                }else{
                    this.independentProperty = true;
                    createNewMenuDisco(this, this.dashboard[this.valuesSelectded['mainOpcion']][this.valuesSelectded['typeCreation']][this.data.valueObjectSelected], 'valueProperty', '#9efc83');
                }
                
            } else if (this.data.typeObjectSelected === 'valueProperty') {

                if(this.independentProperty){
                    this.updateComplementBabia()
                }else{
                    
                    if(this.valuesSelectded.property === 'from'){
                        createNewMenuDisco(this, Object.keys(this.dashboard[this.valuesSelectded['mainOpcion']][this.valuesSelectded['typeCreation']][this.valuesSelectded['property']][this.data.valueObjectSelected]), 'subProperty', '#85faf4');
                    }
                }


            } else if (this.data.typeObjectSelected === 'subProperty') {

                this.valuesSelectded.subProperties[this.valuesSelectded.subProperties.length -1][this.data.typeObjectSelected] = this.data.valueObjectSelected;

                let entidadDiscosubProperty = this.el.querySelector('#Menu-subValueProperty');
                if(entidadDiscosubProperty){
                    this.el.removeChild(entidadDiscosubProperty);
                    this.numeroDiscosCreados -= 1;
                }

                createNewMenuDisco(this,this.dashboard[this.valuesSelectded['mainOpcion']][this.valuesSelectded['typeCreation']][this.valuesSelectded['property']][this.valuesSelectded['valueProperty']][this.data.valueObjectSelected], 'subValueProperty', '#85faf4');

            } else if (this.data.typeObjectSelected === 'subValueProperty') {

                this.valuesSelectded.subProperties[this.valuesSelectded.subProperties.length -1][this.data.typeObjectSelected] = this.data.valueObjectSelected;

                let subPropertyNames = this.valuesSelectded.subProperties.map(sub => sub.subProperty);
                let valuesToCheck = Object.keys(this.dashboard[this.valuesSelectded['mainOpcion']][this.valuesSelectded['typeCreation']][this.valuesSelectded['property']][this.valuesSelectded['valueProperty']])
                let containsAll = valuesToCheck.every(value => subPropertyNames.includes(value));

                if(containsAll){
                    console.log("CONTIENE TODOSS");
                    this.updateComplementBabia()

                }else{
                    this.valuesSelectded.subProperties.push({
                        subProperty: undefined,
                        subValueProperty: undefined
                    });

                    //createNewMenuDisco(this,this.dashboard[this.valuesSelectded['mainOpcion']][this.valuesSelectded['typeCreation']][this.valuesSelectded['property']][this.valuesSelectded['valueProperty']][this.data.valueObjectSelected], 'subValueProperty', '#85faf4');
                }
            }

        }

        console.dir(this.valuesSelectded);
    },

    dashboard: {
        queryes: {
            json: {
                url: ['./data/laptops.json', './data/plants.json', './data/cafes.json'],
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
                from: {
                    laptops: {
                        key: ['brand', 'model', 'processor', 'os'],
                        size: ['ram_gb', 'storage_gb','screen_size_inch', 'price_usd']
                    },
                    plants: {
                        key: ['name', 'type', 'light', 'color'],
                        size: ['height_cm', 'water_frequency_days', 'growth_rate_cm_per_year', 'price_usd']
                    },
                    cafes: {
                        key: ['brand', 'type', 'origin', 'roast'],
                        size: ['weight_g', 'caffeine_mg_per_serving', 'price_usd', 'rating']
                    },
                    cuentas: {
                        key: ['model', 'motor', 'color'],
                        size: ['doors', 'sales']
                    },
                    hacienda: {
                        key: ['model', 'motor', 'color'],
                        size: ['doors', 'sales']
                    },
                    nomina: {
                        key: ['model', 'motor', 'color'],
                        size: ['doors', 'sales']
                    }
                },

                legend: ['true', 'false'],
                animation: ['true', 'false'],
                palette: ['blues', 'bussiness', 'commerce', 'flat', 'foxy', 'icecream', 'pearl', 'sunset', 'ubuntu' ],
            },
            doughnut: {
                from: {
                    dataBD: {
                        key: ['model', 'motor', 'color'],
                        size: ['doors', 'sales']
                    },
                    dataBD2: {
                        key: ['model', 'motor', 'color'],
                        size: ['doors', 'sales']
                    },
                    dataBD3: {
                        key: ['model', 'motor', 'color'],
                        size: ['doors', 'sales']
                    },
                    cuentas: {
                        key: ['model', 'motor', 'color'],
                        size: ['doors', 'sales']
                    },
                    hacienda: {
                        key: ['model', 'motor', 'color'],
                        size: ['doors', 'sales']
                    },
                    nomina: {
                        key: ['model', 'motor', 'color'],
                        size: ['doors', 'sales']
                    }
                },

                legend: ['true', 'false'],
                animation: ['true', 'false'],
                palette: ['blues', 'bussiness', 'commerce', 'flat', 'foxy', 'icecream', 'pearl', 'sunset', 'ubuntu' ],
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

    updateComplementBabia: function () {
        // console.log("################## configuration createMenu   ##################");
        let objectConfiguration = this.el.querySelector('#Menu-typeCreation').querySelector('.selected');



        if (this.valuesSelectded['mainOpcion'] === 'queryes') {

            let idObjectConfiguration = this.valuesSelectded['valueProperty'].substring(this.valuesSelectded['valueProperty'].lastIndexOf('/') + 1, this.valuesSelectded['valueProperty'].lastIndexOf('.'));
            objectConfiguration.setAttribute('id', idObjectConfiguration);

            if (this.valuesSelectded['typeCreation'] === 'json') {
                objectConfiguration.setAttribute('babia-queryjson', this.valuesSelectded['property'], this.valuesSelectded['valueProperty']);
                objectConfiguration.setAttribute('menu-object', 'titleObject', idObjectConfiguration);

            } else if (this.valuesSelectded['typeCreation'] === 'csv') {
                objectConfiguration.setAttribute('babia-querycsv', this.valuesSelectded['property'], this.valuesSelectded['valueProperty']);
                objectConfiguration.setAttribute('menu-object', 'titleObject', idObjectConfiguration);
                
            } else if (this.valuesSelectded['typeCreation'] === 'elastic') {

            }
        } else if (this.valuesSelectded['mainOpcion'] === 'graphs') {

            if (this.valuesSelectded['typeCreation'] === 'pie') {

                objectConfiguration.setAttribute('babia-pie', this.valuesSelectded.property, this.valuesSelectded.valueProperty);

                if(!this.independentProperty){
                    //borrar esto, solo es para comprobar y verlo mejor
                    objectConfiguration.removeAttribute('gltf-model');
                    objectConfiguration.setAttribute('rotation', '90 0 0');
                    objectConfiguration.setAttribute('scale', '1 1 1');
                    objectConfiguration.setAttribute('position', '8 0 0');

                    let dynamicAttributes = {};
                    this.valuesSelectded.subProperties.forEach(property => {
                        dynamicAttributes[property.subProperty] = property.subValueProperty;
                    });
                    objectConfiguration.setAttribute('babia-pie', dynamicAttributes);
                }

            } else if (this.valuesSelectded['typeCreation'] === 'doughnut') {

                objectConfiguration.setAttribute('babia-doughnut', this.valuesSelectded.property, this.valuesSelectded.valueProperty);

                if(!this.independentProperty){
                    //borrar esto, solo es para comprobar y verlo mejor
                    objectConfiguration.removeAttribute('gltf-model');
                    objectConfiguration.setAttribute('rotation', '90 0 0');
                    objectConfiguration.setAttribute('scale', '1 1 1');
                    objectConfiguration.setAttribute('position', '8 0 0');

                    let dynamicAttributes = {};
                    this.valuesSelectded.subProperties.forEach(property => {
                        dynamicAttributes[property.subProperty] = property.subValueProperty;
                    });
                    objectConfiguration.setAttribute('babia-doughnut', dynamicAttributes);
                }

            } else if (this.valuesSelectded['typeCreation'] === 'elastic') {

            }

        } else if (this.valuesSelectded['mainOpcion'] === 'filters') {

        }
    },

    createConfIcon: function () {
        // console.log("################## configuration createMenu   ##################");
        let entityConfIcon = document.createElement('a-entity');
        entityConfIcon.classList.add("iconConf");
        entityConfIcon.setAttribute('gltf-model', 'assets/real/iconConif.glb');
        entityConfIcon.setAttribute('scale', '1.04 1.04 1.04');
        entityConfIcon.setAttribute('position', '6 3 0');

        let self = this;
    
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
    
            //enviamos al componente config los datos
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

