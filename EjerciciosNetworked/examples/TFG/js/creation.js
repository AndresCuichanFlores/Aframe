
import * as CONSTANTS from './constants.js';

AFRAME.registerComponent('creation', {
    schema: {
        typeObjectSelected: { type: 'string', oneOf: [CONSTANTS.MAINOPCION, CONSTANTS.TYPECREATION] },
        valueObjectSelected: { type: 'string', default: '' },
    },

    init: function () {
        //console.log("################## creation INIT ");
        this.initializeParameters();
        createNewMenuDisco(this, Object.keys(this.dashboard), CONSTANTS.MAINOPCION, '#5D00FF', false);
    },

    update: function () {
        console.log("################## creation UPDATE ");
        this.valuesSelectded[this.data.typeObjectSelected] = this.data.valueObjectSelected;
        
        if (this.valuesSelectded[CONSTANTS.MAINOPCION] === CONSTANTS.QUERYES) {
            this.executeMenuQueryes();
        } else if (this.valuesSelectded[CONSTANTS.MAINOPCION] === CONSTANTS.GRAPHS) {
            this.executeMenuGraphs();
        } else if (this.valuesSelectded[CONSTANTS.MAINOPCION] === CONSTANTS.FILTERS) {
            this.executeMenuFilters();
        }
    },

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
        this.baseParent = this.el;
        this.colorDiscoType;
    },

    executeMenuQueryes: function () {
        if (this.data.typeObjectSelected === CONSTANTS.MAINOPCION) {
            this.deleteDiscoTypeCreation();
            createNewMenuDisco(this, this.dashboard[this.data.valueObjectSelected], CONSTANTS.TYPECREATION, '#00d8db', true);
        } else if (this.data.typeObjectSelected === CONSTANTS.TYPECREATION) {
            this.executeProcesoCreacion();
            this.colorDiscoType = '#00d8db';
        }
    },

    executeMenuGraphs: function () {
        if (this.data.typeObjectSelected === CONSTANTS.MAINOPCION) {
            this.deleteDiscoTypeCreation();
            createNewMenuDisco(this, this.dashboard[this.data.valueObjectSelected], CONSTANTS.TYPECREATION, '#0a9900', true);
        } else if (this.data.typeObjectSelected === CONSTANTS.TYPECREATION) {
            this.executeProcesoCreacion();
            this.colorDiscoType = '#0a9900';
        }
    },

    executeMenuFilters: function () {
        if (this.data.typeObjectSelected === CONSTANTS.MAINOPCION) {
            this.deleteDiscoTypeCreation();

            let namesFiles = [];
            let elementsQueryJSON = document.querySelectorAll('[babia-queryjson]');
            let elementsQueryCSV = document.querySelectorAll('[babia-querycsv]');
            elementsQueryJSON.forEach(element => {
                if (element.id !== 'dataInicial') {
                    namesFiles.push('babia-filter:' + element.id + ':json');
                }
            });
            elementsQueryCSV.forEach(element => {
                if (element.id !== 'dataInicial') {
                    namesFiles.push('babia-filter:' + element.id + ':csv');
                }
            });

            createNewMenuDisco(this, namesFiles, CONSTANTS.TYPECREATION, '#ffa200', true);
        } else if (this.data.typeObjectSelected === CONSTANTS.TYPECREATION) {
            this.executeProcesoCreacion();
            this.colorDiscoType = '#ffa200';
        }
    },

    executeProcesoCreacion: function () {
        let self = this;
        let discoMainOpcion = this.baseParent.querySelector('#Menu-' + CONSTANTS.MAINOPCION);
        let discoTypeCreation = this.baseParent.querySelector('#Menu-' + CONSTANTS.TYPECREATION);
        let objectSelected = this.baseParent.querySelector('#Menu-' + CONSTANTS.TYPECREATION).querySelector('.selected');

        //el disco MAINOPCION que desaparezca
        addAnimationEntity(discoMainOpcion, 'animation', 'scale', '', '0 0 0', '1000', false);

        //objeto al centro
        addAnimationEntity(objectSelected, 'animation', 'position',
            { x: objectSelected.getAttribute('position').x, y: objectSelected.getAttribute('position').y, z: 0 },
            { x: 0, y: objectSelected.getAttribute('position').y, z: 0 }, '2000', false);

        //Movimiento hacia abajo del disco
        addAnimationEntity(discoTypeCreation, 'animation', 'position', '', '0 0 0', '2000', false);

        setTimeout(() => {
            //eliminamos disco mainopction
            let entityGrah;
            let entityAUX;
            this.baseParent.removeChild(discoMainOpcion);

            //disco en invisivle
            addAnimationEntity(discoTypeCreation, 'animation__1', 'material.opacity', '', '0', '2000', false);

            //objeto mas grande, click, subimos de posicion y reducimos el titulo segun que creamos
            let titleObject = objectSelected.querySelector('.topNameObject');
            if (this.valuesSelectded[CONSTANTS.MAINOPCION] === CONSTANTS.GRAPHS) {
                entityGrah = objectSelected.childNodes[0];

                //eliminar aux 1 rojo 
                objectSelected.removeAttribute("geometry");

                //a;adir aux 2 verde
                entityAUX = document.createElement('a-entity');
                entityAUX.classList.add("objectRayCaster");
                entityAUX.setAttribute('rotation', '90 0 0');
                entityAUX.setAttribute('position', '0 4.1 0');
                entityAUX.setAttribute('geometry', {
                  'primitive': 'cylinder',
                  'radius': '1.4',
                  'height': '4',
                });
                //entityAUX.setAttribute('material', 'color', 'green');
                //entityAUX.setAttribute('material', 'opacity', '0.6');
                entityAUX.setAttribute('material', 'visible', 'false');

                discoTypeCreation.appendChild(entityAUX);

                addAnimationEntity(titleObject, 'animation', 'scale', '', '21 21 21', '2000', false);

                if (this.valuesSelectded[CONSTANTS.TYPECREATION] === CONSTANTS.BABIADOUGHNUT) {
                    addAnimationEntity(entityGrah, 'animation', 'scale', '', '2.5 2.5 2.5', '2000', false);
                    addAnimationEntity(objectSelected, 'animation__1', 'position', '', '0 4.1 0', '2000', false);
                    addAnimationEntity(titleObject, 'animation__1', 'position', '', '0 0 -4', '2000', false);
                } else {
                    entityAUX.setAttribute('geometry', 'radius', '1.2');
                    addAnimationEntity(entityGrah, 'animation', 'scale', '', '3.8 3 3.8', '2000', false);
                    addAnimationEntity(objectSelected, 'animation__1', 'position', '', '0 4 0', '2000', false);
                    addAnimationEntity(titleObject, 'animation__1', 'position', '', '0 0 -4.3', '2000', false);
                }

            } else {
                addAnimationEntity(objectSelected, 'animation', 'scale', '', '0.5 0.5 0.5', '2000', false);
                addAnimationEntity(objectSelected, 'animation__1', 'position', '', '0 2.5 0', '2000', false);
                addAnimationEntity(titleObject, 'animation', 'scale', '', '40 40 40', '2000', false);
            }

            setTimeout(() => {
                //eliminamos todas las animaciones del disco typecrreation
                objectSelected.setAttribute('component-synchronize', {
                    'componentShare': 'remove',
                    'valueShare': 'animation',
                });
                objectSelected.setAttribute('component-synchronize', {
                    'componentShare': 'remove',
                    'valueShare': 'animation__1',
                });
                discoTypeCreation.setAttribute('component-synchronize', {
                    'componentShare': 'remove',
                    'valueShare': 'geometry',
                });
                discoTypeCreation.setAttribute('component-synchronize', {
                    'componentShare': 'remove',
                    'valueShare': 'material',
                });
                discoTypeCreation.setAttribute('component-synchronize', {
                    'componentShare': 'remove',
                    'valueShare': 'animation',
                });
                discoTypeCreation.setAttribute('component-synchronize', {
                    'componentShare': 'remove',
                    'valueShare': 'animation__1',
                });

                if (entityGrah) {
                    entityGrah.removeAttribute("animation");
                    objectSelected = entityAUX;
                }
                //Se añade los menus de opciones(informacion, eliminar y configuración)
                self.addNuevosMenus();

                //Evento click para borrar o añadir nuevamente los menus de opciones
                objectSelected.addEventListener('click', function () {
                    if (!document.querySelector('#entityEventsController').getAttribute("events-controller").activateController || document.querySelector('#entityEventsController').getAttribute("events-controller").pressbuttonxa) {
                        document.querySelector('#entityEventsController').setAttribute("events-controller", "pressbuttonxa", "false");

                        if (self.baseParent.childNodes.length > 1) {
                            let discoTypeCreation = self.el.querySelector('#Menu-' + CONSTANTS.TYPECREATION);
                            while (self.baseParent.childNodes.length > 0) {
                                var child = self.baseParent.childNodes[self.baseParent.childNodes.length - 1];
                                if (child === discoTypeCreation) {
                                    break;
                                }
                                self.baseParent.removeChild(child);
                                self.numeroDiscosCreados -= 1;
                            }
                        } else {
                            self.addNuevosMenus();
                        }
                    }
                });
            }, 2000);
        }, 2200);
    },

    addNuevosMenus: function () {
        const radius = 8.5;
        const angles = [120, 240, 360];

        angles.forEach(angle => {
            const rad = angle * (Math.PI / 180);
            const posX = radius * Math.cos(rad);
            const posZ = radius * Math.sin(rad);

            if (angle === 120) {
                this.crearMenuConfiguration(posX, posZ);
            } else if (angle === 240) {
                this.crearMenuDelete(posX, posZ);
            } else if (angle === 360) {
                this.crearMenuInformation(posX, posZ);
            }
        });
    },

    //CREAR MENU INDORMACIONN
    crearMenuInformation: function (posX, posZ) {
        let entityMenuInfo = this.crearEntityMenu("Information", posX, posZ, "#ffea00");
        let entityInfoIcon = this.createInfoIcon();

        entityMenuInfo.appendChild(entityInfoIcon);
        this.baseParent.appendChild(entityMenuInfo);
    },

    createInfoIcon: function () {
        let self = this;
        let entityIconInfo = this.crearEntityObject('iconInfo', 'Information');

        entityIconInfo.addEventListener('click', function () {
            if (!document.querySelector('#entityEventsController').getAttribute("events-controller").activateController || document.querySelector('#entityEventsController').getAttribute("events-controller").pressbuttonxa) {
                document.querySelector('#entityEventsController').setAttribute("events-controller", "pressbuttonxa", "false");


                console.log('Icon conf clicked!');
                let discoMenuInfo = this.parentNode;
                let discoTypeCreation = self.el.querySelector('#Menu-' + CONSTANTS.TYPECREATION);
                let objectBabiaCreated = discoTypeCreation.childNodes[0];
                let nameAvatar = document.querySelector('#nameAvatar').getAttribute('text').value;

                if (discoMenuInfo.childNodes.length === 1) {
                    //Eliminar los demas menus   
                    for (let i = self.el.childNodes.length - 1; i >= 0; i--) {
                        var menu = self.el.childNodes[i];
                        if (menu !== discoMenuInfo && menu !== discoTypeCreation) {
                            self.el.removeChild(menu);
                        }
                    }
                    //Eliminar animaciones del disco y agregar el atributo configuration
                    discoMenuInfo.setAttribute('component-synchronize', {
                        'componentShare': 'remove',
                        'valueShare': 'animation',
                    });

                    //ENTIDAD PADRE panelInformation
                    let entityPanelInformation = document.createElement('a-entity');
                    entityPanelInformation.setAttribute('networked', 'template:#panelInformation-template');
                    entityPanelInformation.setAttribute('look-at', '#rig-player');
                    entityPanelInformation.setAttribute('id', 'panelInformation');
                    entityPanelInformation.setAttribute('position', { x: 0, y: 6, z: 0 });
                    entityPanelInformation.setAttribute('geometry', {
                        'primitive': 'box',
                        'height': '4.3',
                        'width': '7',
                        'depth': '0.1',
                    });
                    entityPanelInformation.setAttribute('material', {
                        'color': self.colorDiscoType,
                    });

                    //ENTIDAD TEXT TITULO
                    let entityTextTitulo = document.createElement('a-entity');
                    entityTextTitulo.setAttribute('networked', 'template:#panelInformation-template');
                    entityTextTitulo.setAttribute('id', 'titulo');
                    entityTextTitulo.setAttribute('position', { x: 0, y: 1.2, z: 0.06 });
                    entityTextTitulo.setAttribute('text', {
                        'value': self.data.valueObjectSelected.toUpperCase() + " COMPONENT",
                        'width': '10',
                        'align': 'center',
                        'side': 'double',
                        'color': 'WHITE',
                        'shader': 'msdf',
                        'font': 'https://raw.githubusercontent.com/etiennepinchon/aframe-fonts/master/fonts/bangers/Bangers-Regular.json'
                    });

                    //ENTIDAD TEXT DESCRIPCION
                    let extensionArchivo = "";
                    let txtDescripcion = "";

                    if (CONSTANTS.BABIAQUERYJSON === self.data.valueObjectSelected) {
                        txtDescripcion = 'Component that will retrieve data from a JSON input that can be defined as an url';
                        extensionArchivo = ".json"
                    } else if (CONSTANTS.BABIAQUERYCSV === self.data.valueObjectSelected) {
                        txtDescripcion = 'Component that will retrieve data from a CSV input that can be defined as an url.';
                        extensionArchivo = ".csv"
                    } else if (CONSTANTS.BABIAFILTER === self.data.valueObjectSelected) {
                        txtDescripcion = 'This component will select a part of the data retrieved (by a key=value) in order to represent just that part of the data.';

                        let nameFile = objectBabiaCreated.querySelector('.botNameObject').getAttribute("text").value;
                        if (nameFile.includes(":")) {
                            nameFile = nameFile.split(":")[0];
                        }
                        extensionArchivo = searchExtFileCreated(nameFile);
                    } else if (CONSTANTS.BABIAPIE === self.data.valueObjectSelected) {
                        txtDescripcion = 'This component shows a pie chart from the filterdata/querier entity where the data for the chart is located.';
                    } else if (CONSTANTS.BABIADOUGHNUT === self.data.valueObjectSelected) {
                        txtDescripcion = 'This component shows a doughnut chart from the filterdata/querier entity where the data for the chart is located.';
                    }

                    let entityTextDescripcion = document.createElement('a-entity');
                    entityTextDescripcion.setAttribute('networked', 'template:#panelInformation-template');
                    entityTextDescripcion.setAttribute('id', 'descripcion');
                    entityTextDescripcion.setAttribute('position', { x: 0, y: 0.7, z: 0.06 });
                    entityTextDescripcion.setAttribute('text', {
                        'value': txtDescripcion,
                        'width': '6.5',
                        'align': 'center',
                        'side': 'double',
                        'color': 'WHITE',
                        'shader': 'msdf',
                    });

                    //ENTIDAD TEXT CREATOR
                    let entityTextCreator = document.createElement('a-entity');
                    entityTextCreator.setAttribute('networked', 'template:#panelInformation-template');
                    entityTextCreator.setAttribute('position', { x: -1.7, y: -0.4, z: 0.06 });
                    entityTextCreator.setAttribute('text', {
                        'value': 'CREATOR:',
                        'width': '7',
                        'align': 'center',
                        'side': 'double',
                        'color': 'WHITE',
                        'shader': 'msdf',
                        'font': 'https://raw.githubusercontent.com/etiennepinchon/aframe-fonts/master/fonts/roboto/Roboto-BoldItalic.json'
                    });

                    //ENTIDAD TEXT CREATOR VALUE
                    let entityTextCreatorValue = document.createElement('a-entity');
                    entityTextCreatorValue.setAttribute('networked', 'template:#panelInformation-template');
                    entityTextCreatorValue.setAttribute('position', { x: 1.2, y: -0.4, z: 0.06 });
                    entityTextCreatorValue.setAttribute('text', {
                        'value': nameAvatar,
                        'width': '6.3',
                        'align': 'center',
                        'side': 'double',
                        'color': 'WHITE',
                        'shader': 'msdf',
                        'font': 'https://raw.githubusercontent.com/etiennepinchon/aframe-fonts/master/fonts/roboto/Roboto-Italic.json'
                    });

                    //ENTIDAD TEXT URL FILE
                    let entityTextURL = document.createElement('a-entity');
                    entityTextURL.setAttribute('networked', 'template:#panelInformation-template');
                    entityTextURL.setAttribute('position', { x: -1.7, y: -0.9, z: 0.06 });
                    entityTextURL.setAttribute('text', {
                        'value': 'URL FILE:',
                        'width': '7',
                        'align': 'center',
                        'side': 'double',
                        'color': 'WHITE',
                        'shader': 'msdf',
                        'font': 'https://raw.githubusercontent.com/etiennepinchon/aframe-fonts/master/fonts/roboto/Roboto-BoldItalic.json'
                    });

                    //ENTIDAD TEXT URL FILE VALUE
                    let txtURLValue = "";
                    let textFilterValue = "";
                    let textKeySizeValue = "";

                    if (objectBabiaCreated.querySelector('.botNameObject')) {
                        let nameFile = objectBabiaCreated.querySelector('.botNameObject').getAttribute("text").value;
                        if (nameFile.includes(":")) {
                            textFilterValue = nameFile.split(":")[1];;
                            nameFile = nameFile.split(":")[0];
                        }

                        txtURLValue = "  ./data/" + nameFile + extensionArchivo;
                    }

                    if (CONSTANTS.BABIAPIE === self.data.valueObjectSelected || CONSTANTS.BABIADOUGHNUT === self.data.valueObjectSelected) {
                        let objectBabiaCreatedComponent = objectBabiaCreated.querySelector(`[${self.data.valueObjectSelected}]`);
                        let fromFile = objectBabiaCreatedComponent.getAttribute(self.data.valueObjectSelected).from;
                        let keyFile = objectBabiaCreatedComponent.getAttribute(self.data.valueObjectSelected).key;
                        let sizeFile = objectBabiaCreatedComponent.getAttribute(self.data.valueObjectSelected).size;

                        if (fromFile.includes(":")) {
                            textFilterValue = fromFile.split(":")[1];;
                            fromFile = fromFile.split(":")[0];
                        }
                        extensionArchivo = searchExtFileCreated(fromFile);

                        txtURLValue = " ./data/" + fromFile + extensionArchivo;
                        textKeySizeValue = keyFile + "/" + sizeFile;

                        if (fromFile === "dataInicial") {
                            txtURLValue = "";
                            textKeySizeValue = "";
                        }
                    }

                    let entityTextURLValue = document.createElement('a-entity');
                    entityTextURLValue.setAttribute('networked', 'template:#panelInformation-template');
                    entityTextURLValue.setAttribute('position', { x: 1.2, y: -0.9, z: 0.06 });
                    entityTextURLValue.setAttribute('text', {
                        'value': txtURLValue,
                        'width': '6.2',
                        'align': 'center',
                        'side': 'double',
                        'color': 'WHITE',
                        'shader': 'msdf',
                        'font': 'https://raw.githubusercontent.com/etiennepinchon/aframe-fonts/master/fonts/roboto/Roboto-Italic.json'
                    });

                    if (CONSTANTS.BABIAQUERYJSON !== self.data.valueObjectSelected && CONSTANTS.BABIAQUERYCSV !== self.data.valueObjectSelected) {
                        //ENTIDAD TEXT FILTER
                        let entityTextFilter = document.createElement('a-entity');
                        entityTextFilter.setAttribute('networked', 'template:#panelInformation-template');
                        entityTextFilter.setAttribute('position', { x: -1.7, y: -1.4, z: 0.06 });
                        entityTextFilter.setAttribute('text', {
                            'value': 'FILTER:',
                            'width': '7',
                            'align': 'center',
                            'side': 'double',
                            'color': 'WHITE',
                            'shader': 'msdf',
                            'font': 'https://raw.githubusercontent.com/etiennepinchon/aframe-fonts/master/fonts/roboto/Roboto-BoldItalic.json'
                        });

                        //ENTIDAD TEXT FILTER VALUE
                        let entityTextFilterValue = document.createElement('a-entity');
                        entityTextFilterValue.setAttribute('networked', 'template:#panelInformation-template');
                        entityTextFilterValue.setAttribute('position', { x: 1.2, y: -1.4, z: 0.06 });
                        entityTextFilterValue.setAttribute('text', {
                            'value': textFilterValue,
                            'width': '6.3',
                            'align': 'center',
                            'side': 'double',
                            'color': 'WHITE',
                            'shader': 'msdf',
                            'font': 'https://raw.githubusercontent.com/etiennepinchon/aframe-fonts/master/fonts/roboto/Roboto-Italic.json'
                        });

                        if (CONSTANTS.BABIAPIE === self.data.valueObjectSelected || CONSTANTS.BABIADOUGHNUT === self.data.valueObjectSelected) {
                            //ENTIDAD TEXT KEY/SICE
                            let entityTextKeySize = document.createElement('a-entity');
                            entityTextKeySize.setAttribute('networked', 'template:#panelInformation-template');
                            entityTextKeySize.setAttribute('position', { x: -1.7, y: -1.9, z: 0.06 });
                            entityTextKeySize.setAttribute('text', {
                                'value': 'KEY/SICE:',
                                'width': '7',
                                'align': 'center',
                                'side': 'double',
                                'color': 'WHITE',
                                'shader': 'msdf',
                                'font': 'https://raw.githubusercontent.com/etiennepinchon/aframe-fonts/master/fonts/roboto/Roboto-BoldItalic.json'
                            });

                            //ENTIDAD TEXT KEY/SICE VALUE
                            let entityTextKeySizeValue = document.createElement('a-entity');
                            entityTextKeySizeValue.setAttribute('networked', 'template:#panelInformation-template');
                            entityTextKeySizeValue.setAttribute('position', { x: 1.2, y: -1.9, z: 0.06 });
                            entityTextKeySizeValue.setAttribute('text', {
                                'value': textKeySizeValue,
                                'width': '6.3',
                                'align': 'center',
                                'side': 'double',
                                'color': 'WHITE',
                                'shader': 'msdf',
                                'font': 'https://raw.githubusercontent.com/etiennepinchon/aframe-fonts/master/fonts/roboto/Roboto-Italic.json'
                            });

                            entityPanelInformation.appendChild(entityTextKeySize);
                            entityPanelInformation.appendChild(entityTextKeySizeValue);
                        }

                        entityPanelInformation.appendChild(entityTextFilter);
                        entityPanelInformation.appendChild(entityTextFilterValue);
                    }

                    //AÑADIMOS LOS HIJOS
                    entityPanelInformation.appendChild(entityTextTitulo);
                    entityPanelInformation.appendChild(entityTextDescripcion);
                    entityPanelInformation.appendChild(entityTextCreator);
                    entityPanelInformation.appendChild(entityTextCreatorValue);
                    entityPanelInformation.appendChild(entityTextURL);
                    entityPanelInformation.appendChild(entityTextURLValue);

                    discoMenuInfo.appendChild(entityPanelInformation);
                }
            }
        });

        return entityIconInfo;
    },

    //CREAR MENU DELETEEEE
    crearMenuDelete: function (posX, posZ) {
        let entityMenuDelete = this.crearEntityMenu("Delete", posX, posZ, "#ff0000");
        let entityDeleteIcon = this.createDeleteIcon();

        entityMenuDelete.appendChild(entityDeleteIcon);
        this.baseParent.appendChild(entityMenuDelete);
    },

    createDeleteIcon: function () {
        let self = this;
        let entityIconDelte = this.crearEntityObject('iconDelete', 'Delete');
        entityIconDelte.addEventListener('click', function () {
            if (!document.querySelector('#entityEventsController').getAttribute("events-controller").activateController || document.querySelector('#entityEventsController').getAttribute("events-controller").pressbuttonxa) {
                document.querySelector('#entityEventsController').setAttribute("events-controller", "pressbuttonxa", "false");


                addAnimationEntity(this.parentNode.parentNode, 'animation', 'scale', '', '0 0 0', '2000', false);
                setTimeout(() => {
                    this.sceneEl.removeChild(this.parentNode.parentNode);
                }, 2000);
            }
        });
        return entityIconDelte;
    },

    //CREAR MENU CONFIGURACION
    crearMenuConfiguration: function (posX, posZ) {
        let entityMenuConfiguration = this.crearEntityMenu("Configuration", posX, posZ, "#0400ff");
        let entityConfIcon = this.createConfIcon();

        entityMenuConfiguration.appendChild(entityConfIcon);
        this.baseParent.appendChild(entityMenuConfiguration);
    },

    createConfIcon: function () {
        let self = this;
        let entityIconConf = this.crearEntityObject('iconConf', 'Configuration');

        entityIconConf.addEventListener('click', function () {
            if (!document.querySelector('#entityEventsController').getAttribute("events-controller").activateController || document.querySelector('#entityEventsController').getAttribute("events-controller").pressbuttonxa) {
                document.querySelector('#entityEventsController').setAttribute("events-controller", "pressbuttonxa", "false");


                //console.log("CLICK ICON CONF")
                let discoMenuConfiguration = entityIconConf.parentNode;
                let discoTypeCreation = self.el.querySelector('#Menu-' + CONSTANTS.TYPECREATION);

                if (discoMenuConfiguration.childNodes.length === 1) {
                    //Eliminar los demas menus   
                    for (let i = self.baseParent.childNodes.length - 1; i >= 0; i--) {
                        var menu = self.baseParent.childNodes[i];
                        if (menu !== discoMenuConfiguration && menu !== discoTypeCreation) {
                            self.baseParent.removeChild(menu);
                        }
                    }

                    //Eliminar animaciones del disco y agregar el atributo configuration
                    discoMenuConfiguration.setAttribute('component-synchronize', {
                        'componentShare': 'remove',
                        'valueShare': 'animation',
                    });

                    discoMenuConfiguration.setAttribute('configuration', {
                        typeObjectSelected: CONSTANTS.TYPECREATION,
                        valueObjectSelected: self.valuesSelectded[CONSTANTS.TYPECREATION],
                    });
                }
            }
        });

        return entityIconConf;
    },

    crearEntityMenu: function (nameMenu, posX, posZ, colorDisco) {
        let entityMenu = document.createElement('a-entity');
        entityMenu.setAttribute('networked', 'template:#platoInit-template');
        entityMenu.setAttribute('id', 'Menu-' + nameMenu);
        entityMenu.setAttribute('scale', '0 0 0');
        entityMenu.setAttribute('material', 'color', colorDisco);
        entityMenu.setAttribute('position', { x: posX, y: 0, z: posZ });
        entityMenu.setAttribute('geometry', {
            'primitive': 'cylinder',
            'radius': '4',
            'height': '0.3',
        });

        addAnimationEntity(entityMenu, 'animation', 'rotation', '', '0 360 0', '30000', true);
        addAnimationEntity(entityMenu, 'animation__1', 'scale', '', '1 1 1', '1500', false);

        return entityMenu;
    },

    crearEntityObject: function (nameObject, title) {
        let entityObjectIcon = document.createElement('a-entity');
        entityObjectIcon.setAttribute('networked', 'template', '#objectInit-template');
        entityObjectIcon.classList.add(nameObject);
        entityObjectIcon.classList.add("objectRayCaster");
        entityObjectIcon.setAttribute('gltf-model', '3Dmodels/' + nameObject + '.glb');
        entityObjectIcon.setAttribute('scale', '0.3 0.3 0.3');
        entityObjectIcon.setAttribute('position', { x: 0, y: 1.5, z: 0 });

        //texto arriba del objeto
        let entityObjectChildren = document.createElement('a-entity');
        entityObjectChildren.setAttribute('networked', 'template:#textInit-template');
        entityObjectChildren.setAttribute('look-at', '#rig-player');
        entityObjectChildren.classList.add("topNameObject");
        entityObjectChildren.setAttribute('text', {
            'value': title,
            'align': 'center',
            'side': 'double',
            'color': 'WHITE',
            'shader': 'msdf',
            'font': 'https://raw.githubusercontent.com/etiennepinchon/aframe-fonts/master/fonts/berkshireswash/BerkshireSwash-Regular.json'
        });
        entityObjectChildren.setAttribute('scale', '30 30 30');
        entityObjectChildren.setAttribute('position', { x: 0, y: 3, z: 0 });

        entityObjectIcon.appendChild(entityObjectChildren);
        return entityObjectIcon;
    },

    deleteDiscoTypeCreation: function () {
        let discoTypeCreation = this.el.querySelector('#Menu-' + CONSTANTS.TYPECREATION);
        if (discoTypeCreation) {
            this.el.removeChild(discoTypeCreation);
            this.numeroDiscosCreados -= 1;
        }
    },
});

let searchExtFileCreated = (nameFileCreated) => {
    let extFile = "";
    let elementsQueriesJson = document.querySelectorAll(`[${CONSTANTS.BABIAQUERYJSON}]`);
    console.log("PEUBAAQUEYJSONNN")
    console.log(elementsQueriesJson)
    elementsQueriesJson.forEach(element => {
        if (element.id !== 'dataInicial' && element.id === nameFileCreated) {
            extFile = ".json";
        }
    });
    let elementsQueriesCSV = document.querySelectorAll(`[${CONSTANTS.BABIAQUERYCSV}]`);
    elementsQueriesCSV.forEach(element => {
        if (element.id !== 'dataInicial' && element.id === nameFileCreated) {
            extFile = ".csv";
        }
    });
    return extFile;
};

let createNewMenuDisco = (self, objects, objectType, colorDisco, miniDisco) => {
    //console.log("################## menu-disco createNewMenuDisco  ##################");
    //console.log(self.numeroDiscosCreados)
    let entityMenuDisco = document.createElement('a-entity');
    entityMenuDisco.setAttribute('networked', 'template:#platoInit-template');
    entityMenuDisco.setAttribute('id', 'Menu-' + objectType);
    entityMenuDisco.setAttribute('position', { x: 0, y: 3 * self.numeroDiscosCreados, z: 0 });
    entityMenuDisco.setAttribute('menu-disco', {
        'objectsStage': objects,
        'objectType': objectType,
        'colorDisco': colorDisco,
        'eventObject': 'events-object-creation'
    });

    if (miniDisco) {
        let entityMiniDisco = createMiniDisco(self.valuesSelectded[CONSTANTS.MAINOPCION]);
        entityMenuDisco.appendChild(entityMiniDisco);
    }

    self.el.appendChild(entityMenuDisco);
    self.numeroDiscosCreados += 1;
};

let createMiniDisco = (titleObject) => {
    //Mini disco
    let entityMiniDisco = document.createElement('a-entity');
    entityMiniDisco.setAttribute('networked', 'template:#platoInit-template');
    entityMiniDisco.classList.add("miniDisco");
    entityMiniDisco.setAttribute('scale', '1 1 1');
    entityMiniDisco.setAttribute('material', 'color', '#5D00FF');
    entityMiniDisco.setAttribute('position', { x: 0, y: 0.3, z: 0 });
    entityMiniDisco.setAttribute('geometry', {
        'primitive': 'cylinder',
        'radius': '1',
        'height': '0.25',
    });

    //en gltf del objecto
    let entityObject = document.createElement('a-entity');
    entityObject.setAttribute('networked', 'template:#objectInit-template');
    entityObject.setAttribute('gltf-model', '3Dmodels/response.glb');
    entityObject.setAttribute('position', { x: 0, y: 0.8, z: 0 });
    entityObject.setAttribute('scale', '0.35 0.35 0.35');

    //texto arriba del objeto
    let entityTitle = document.createElement('a-entity');
    entityTitle.setAttribute('networked', 'template:#textInit-template');
    entityTitle.setAttribute('look-at', '#rig-player');
    entityTitle.classList.add("topNameObject");
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
};

let addAnimationEntity = (entityObject, typeAnimation, property, from, to, dur, loop) => {
    entityObject.setAttribute('component-synchronize', {
        'componentShare': 'remove',
        'valueShare': typeAnimation,
    });
    entityObject.setAttribute(typeAnimation, {
        'property': property,
        'from': from,
        'to': to,
        'dur': dur,
        'easing': 'linear',
        'loop': loop
    });
};
