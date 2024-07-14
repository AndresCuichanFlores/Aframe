
import * as CONSTANTS from './constants.js';

AFRAME.registerComponent('creation', {
    schema: {
        typeObjectSelected: { type: 'string', oneOf: [CONSTANTS.MAINOPCION, CONSTANTS.TYPECREATION] },
        valueObjectSelected: { type: 'string', default: '' },
    },

    init: function () {
        console.log("################## creation INIT ");
        this.initializeParameters();
        createNewMenuDisco(this, Object.keys(this.dashboard), CONSTANTS.MAINOPCION, '#0061FF', false);
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
        
        //console.dir(this.valuesSelectded);
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
    },

    executeMenuQueryes: function () {
        if (this.data.typeObjectSelected === CONSTANTS.MAINOPCION) {
            this.deleteDiscoTypeCreation();
            createNewMenuDisco(this, this.dashboard[this.data.valueObjectSelected], CONSTANTS.TYPECREATION, '#5D00FF', true);
        } else if (this.data.typeObjectSelected === CONSTANTS.TYPECREATION) {
            this.executeProcesoCreacion();
        }
    },

    executeMenuGraphs: function () {
        if (this.data.typeObjectSelected === CONSTANTS.MAINOPCION) {
            this.deleteDiscoTypeCreation();
            createNewMenuDisco(this, this.dashboard[this.data.valueObjectSelected], CONSTANTS.TYPECREATION, '#5D00FF', true);
        } else if (this.data.typeObjectSelected === CONSTANTS.TYPECREATION) {
            this.executeProcesoCreacion();
        }
    },

    executeMenuFilters: function () {
        if (this.data.typeObjectSelected === CONSTANTS.MAINOPCION) {
            this.deleteDiscoTypeCreation();
            let elementsQuerys = document.querySelectorAll('[babia-queryjson], [babia-querycsv]');
            let idsQuery = [];
            elementsQuerys.forEach(element => {
                if (element.id !== 'dataInicial') {
                    idsQuery.push('babia-filter:' + element.id);
                }
            });

            createNewMenuDisco(this, idsQuery, CONSTANTS.TYPECREATION, '#5D00FF', true);
        } else if (this.data.typeObjectSelected === CONSTANTS.TYPECREATION) {
            this.executeProcesoCreacion();
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
            this.baseParent.removeChild(discoMainOpcion);

            //disco en invisivle
            addAnimationEntity(discoTypeCreation, 'animation__1', 'material.opacity', '', '0', '2000', false);

            //objeto mas grande, click, subimos de posicion y reducimos el titulo segun que creamos
            let titleObject = objectSelected.querySelector('.topNameObject');
            if (this.valuesSelectded[CONSTANTS.MAINOPCION] === CONSTANTS.GRAPHS) {
                entityGrah = objectSelected.childNodes[0];
                addAnimationEntity(entityGrah, 'animation', 'scale', '', '2 2 2', '2000', false);
                addAnimationEntity(titleObject, 'animation', 'scale', '', '20 20 20', '2000', false);

                if (this.valuesSelectded[CONSTANTS.TYPECREATION] === CONSTANTS.BABIADOUGHNUT) {
                    addAnimationEntity(objectSelected, 'animation__1', 'position', '', '0 3.5 0', '2000', false);
                    addAnimationEntity(titleObject, 'animation__1', 'position', '', '0 3 0', '2000', false);
                } else {
                    addAnimationEntity(objectSelected, 'animation__1', 'position', '', '0 3 0', '2000', false);
                    addAnimationEntity(titleObject, 'animation__1', 'position', '', '0 2 0', '2000', false);
                }
            } else {
                addAnimationEntity(objectSelected, 'animation', 'scale', '', '0.5 0.5 0.5', '2000', false);
                addAnimationEntity(objectSelected, 'animation__1', 'position', '', '0 2.5 0', '2000', false);
                addAnimationEntity(titleObject, 'animation', 'scale', '', '40 40 40', '2000', false);
            }

            setTimeout(() => {
                //eliminamos todas las animaciones del disco typecrreation
                objectSelected.setAttribute('remove-component', 'component', 'animation');
                objectSelected.setAttribute('remove-component', 'component', 'animation__1');
                discoTypeCreation.setAttribute('remove-component', 'component', 'geometry');
                discoTypeCreation.setAttribute('remove-component', 'component', 'material');
                discoTypeCreation.setAttribute('remove-component', 'component', 'animation');
                discoTypeCreation.setAttribute('remove-component', 'component', 'animation__1');

                if (entityGrah) {
                    entityGrah.removeAttribute("animation");
                }
                //añadimos nuevos menus de creacion
                self.addNuevosMenus();

                objectSelected.addEventListener('click', function () {
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

    crearMenuInformation: function (posX, posZ) {
        let entityMenuInfo = this.crearEntityMenu("Information", posX, posZ);
        let entityInfoIcon = this.createInfoIcon();

        entityMenuInfo.appendChild(entityInfoIcon);
        this.baseParent.appendChild(entityMenuInfo);
    },

    createInfoIcon: function () {
        let self = this;
        let entityIconInfo = this.crearEntityObject('iconInfo', 'Information');
        entityIconInfo.addEventListener('click', function () {
            //console.log('Icon conf clicked!');
        });

        return entityIconInfo;
    },

    crearMenuDelete: function (posX, posZ) {
        let entityMenuDelete = this.crearEntityMenu("Delete", posX, posZ);
        let entityDeleteIcon = this.createDeleteIcon();

        entityMenuDelete.appendChild(entityDeleteIcon);
        this.baseParent.appendChild(entityMenuDelete);
    },

    createDeleteIcon: function () {
        let self = this;
        let entityIconDelte = this.crearEntityObject('iconDelete', 'Delete');
        entityIconDelte.addEventListener('click', function () {
            addAnimationEntity(this.parentNode.parentNode, 'animation', 'scale', '', '0 0 0', '2000', false);
            setTimeout(() => {
                this.sceneEl.removeChild(this.parentNode.parentNode);
            }, 2000);
        });

        return entityIconDelte;
    },

    crearMenuConfiguration: function (posX, posZ) {
        let entityMenuConfiguration = this.crearEntityMenu("Configuration", posX, posZ);
        let entityConfIcon = this.createConfIcon();

        entityMenuConfiguration.appendChild(entityConfIcon);
        this.baseParent.appendChild(entityMenuConfiguration);
    },

    createConfIcon: function () {
        let self = this;
        let entityIconConf = this.crearEntityObject('iconConf', 'Configuration');

        entityIconConf.addEventListener('click', function () {
            console.log("CLICK ICON CONF")
            let discoMenuConfiguration = entityIconConf.parentNode;
            let discoTypeCreation = self.el.querySelector('#Menu-' + CONSTANTS.TYPECREATION);


            console.log(discoMenuConfiguration.childNodes)

            if (discoMenuConfiguration.childNodes.length === 1) {
                console.log("ENTRAMOOOOO");
                //Eliminar los demas menus   
                for (let i = self.baseParent.childNodes.length - 1; i >= 0; i--) {
                    var menu = self.baseParent.childNodes[i];
                    if (menu !== discoMenuConfiguration && menu !== discoTypeCreation) {
                        self.baseParent.removeChild(menu);
                    }
                }

                //Eliminar animaciones del disco y agregar el atributo configuration
                discoMenuConfiguration.setAttribute('remove-component', 'component', 'animation');
                
                discoMenuConfiguration.setAttribute('configuration', {
                    typeObjectSelected: CONSTANTS.TYPECREATION,
                    valueObjectSelected: self.valuesSelectded[CONSTANTS.TYPECREATION],
                });
            }
        });

        return entityIconConf;
    },

    crearEntityMenu: function (nameMenu, posX, posZ) {
        let entityMenu = document.createElement('a-entity');
        entityMenu.setAttribute('networked', 'template:#platoInit-template');
        entityMenu.setAttribute('id', 'Menu-' + nameMenu);
        entityMenu.setAttribute('scale', '0 0 0');
        entityMenu.setAttribute('material', 'color', '#FFC500');
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
        'eventComplement': 'events-object-creation'
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
    entityMiniDisco.setAttribute('material', 'color', '#FB6542');
    entityMiniDisco.setAttribute('position', { x: 0, y: 0.3, z: 0 });
    entityMiniDisco.setAttribute('geometry', {
        'primitive': 'cylinder',
        'radius': '1',
        'height': '0.3',
    });
    entityMiniDisco.setAttribute('animation', {
        property: 'rotation',
        to: '0 -360 0',
        dur: 30000,
        easing: 'linear',
        loop: true
    });

    //en gltf del objecto
    let entityObject = document.createElement('a-entity');
    entityObject.setAttribute('networked', 'template:#objectInit-template');
    entityObject.setAttribute('gltf-model', '3Dmodels/folder3.glb');
    entityObject.setAttribute('position', { x: 0, y: 0.6, z: 0 });
    entityObject.setAttribute('scale', '0.15 0.15 0.15');

    //texto arriba del objeto
    let entityTitle = document.createElement('a-entity');
    entityTitle.setAttribute('networked', 'template:#textInit-template');
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
    entityTitle.setAttribute('position', { x: 0, y: 1, z: 0 });

    entityMiniDisco.appendChild(entityTitle);
    entityMiniDisco.appendChild(entityObject);

    return entityMiniDisco;
};

let addAnimationEntity = (entityObject, typeAnimation, property, from, to, dur, loop) => {
    entityObject.setAttribute('remove-component', 'component', 'typeAnimation');
    entityObject.setAttribute(typeAnimation, {
        'property': property,
        'from': from,
        'to': to,
        'dur': dur,
        'easing': 'linear',
        'loop': loop
    });
};
