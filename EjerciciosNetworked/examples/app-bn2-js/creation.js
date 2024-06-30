
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
        this.baseParent = this.el;
    },

    executeMenuQueryes: function () {
        if (this.data.typeObjectSelected === CONSTANTS.MAINOPCION) {
            this.deleteDiscoTypeCreation();
            createNewMenuDisco(this, this.dashboard[this.data.valueObjectSelected], CONSTANTS.TYPECREATION, '#8080ff');
        } else if (this.data.typeObjectSelected === CONSTANTS.TYPECREATION) {
            this.executeProcesoCreacion();
        }
    },

    executeMenuGraphs: function () {
        if (this.data.typeObjectSelected === CONSTANTS.MAINOPCION) {
            this.deleteDiscoTypeCreation();
            createNewMenuDisco(this, this.dashboard[this.data.valueObjectSelected], CONSTANTS.TYPECREATION, '#8080ff');
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

            createNewMenuDisco(this, idsQuery, CONSTANTS.TYPECREATION, '#8080ff');
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
        addAnimationEntity(discoMainOpcion, 'animation','scale', '', '0 0 0', '1000', false);

        //objeto al centro
        addAnimationEntity(objectSelected, 'animation','position', 
            {x:objectSelected.getAttribute('position').x, y:objectSelected.getAttribute('position').y, z:0}, 
            {x:0, y:objectSelected.getAttribute('position').y, z:0}, '2000', false);

        //Movimiento hacia abajo del disco
        addAnimationEntity(discoTypeCreation, 'animation','position', '', '0 0 0', '2000', false);   

        setTimeout(() => {
            //eliminamos disco mainopction
            this.baseParent.removeChild(discoMainOpcion);

            //objeto mas grande, click, subimos de posicion y reducimos el titulo segun que creamos
            let titleObject = objectSelected.querySelector('.topNameObject');
            if(this.valuesSelectded[CONSTANTS.MAINOPCION] === CONSTANTS.GRAPHS){
                let entityGrah = objectSelected.childNodes[0];
                addAnimationEntity(entityGrah, 'animation','scale', '', '2 2 2', '2000', false);
                addAnimationEntity(objectSelected, 'animation__1','position', '', '0 2.5 0', '2000', false);
                addAnimationEntity(titleObject, 'animation','scale', '', '20 20 20', '2000', false);
                addAnimationEntity(titleObject, 'animation__1','position', '', '0 2 0', '2000', false);
            }else {
                addAnimationEntity(objectSelected, 'animation','scale', '', '0.5 0.5 0.5', '2000', false);
                addAnimationEntity(objectSelected, 'animation__1','position', '', '0 2.5 0', '2000', false);
                addAnimationEntity(titleObject, 'animation','scale', '', '40 40 40', '2000', false);
            }

            setTimeout(() => {
                console.log("TERMINADO LA ANIMACION DE CREACION")
                self.addNuevosMenus();

                objectSelected.addEventListener('click', function () {
                    console.log('CLICK EN ENTIDAD CREADA');
                    if(self.baseParent.childNodes.length > 1){
                        let discoTypeCreation = self.el.querySelector('#Menu-' + CONSTANTS.TYPECREATION);
                        while (self.baseParent.childNodes.length > 0) {
                            var child = self.baseParent.childNodes[self.baseParent.childNodes.length - 1];
                            if (child === discoTypeCreation) {
                                break;
                            }
                            self.baseParent.removeChild(child);
                            self.numeroDiscosCreados -= 1;
                        }
                    }else{
                        console.log('VOLVEMOS A CREAR LOS NUEVO MENUS');
                        self.addNuevosMenus();
                    }
                });
            }, 2000);    
        }, 2200);
    },

    addNuevosMenus: function () {
        const radius = 10;
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
            //console.log('Icon conf clicked!');
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
            console.log('Icon conf clicked!');
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
                discoMenuConfiguration.removeAttribute('animation');
                discoMenuConfiguration.removeAttribute('animation__1');
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
        entityMenu.setAttribute('id', 'Menu-' + nameMenu);
        entityMenu.setAttribute('scale', '0 0 0');
        entityMenu.setAttribute('material', 'color', '#9A16F7');
        entityMenu.setAttribute('position', { x: posX, y: 0, z: posZ });
        entityMenu.setAttribute('geometry', {
            'primitive': 'cylinder',
            'radius': '4',
            'height': '0.3',
        });

        addAnimationEntity(entityMenu, 'animation','rotation', '', '0 360 0', '30000', true);
        addAnimationEntity(entityMenu, 'animation__1','scale', '', '1 1 1', '1500', false);

        return entityMenu;
    },

    crearEntityObject: function (nameObject, title) {

        let entityObjectIcon = document.createElement('a-entity');
        entityObjectIcon.classList.add(nameObject);
        entityObjectIcon.setAttribute('gltf-model', 'assets/real/' + nameObject + '.glb');
        entityObjectIcon.setAttribute('scale', '0.3 0.3 0.3');
        entityObjectIcon.setAttribute('position', { x: 0, y: 1.5, z: 0 });

        //texto arriba del objeto
        let entityObjectChildren = document.createElement('a-entity');
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

let addAnimationEntity = (entityObject, typeAnimation, property, from, to, dur, loop) => {
    entityObject.removeAttribute(typeAnimation);
    entityObject.setAttribute(typeAnimation, {
        'property': property,
        'from': from,
        'to': to,
        'dur': dur,
        'easing': 'linear',
        'loop': loop
    });
};
