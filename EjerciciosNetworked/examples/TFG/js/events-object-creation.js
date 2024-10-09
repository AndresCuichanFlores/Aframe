import * as CONSTANTS from './constants.js';

AFRAME.registerComponent('events-object-creation', {
    schema: {
        objectStage: { type: 'string', default: '' },
        objectType: { type: 'string', default: '' },
    },

    init: function () {
        //console.log("################## events-object-creation INIT ");
        this.customizeObjectStage();
        this.handleClick = this.handleClick.bind(this);
        this.el.addEventListener('click', this.handleClick);
    },

    update: function () {
        //console.log("################## events-object-creation UPDATE ");
    },

    customizeObjectStage: function () {
        //console.log("################## menu-object customizeObjectStage ##################");

        let scalaPadre = 0.2;
        let positionHijo = {x: 0, y: 2.5, z: 0};
        if(this.data.objectType == CONSTANTS.MAINOPCION){
            let posicionActual = this.el.getAttribute('position');
            this.el.setAttribute('gltf-model', '3Dmodels/' + this.data.objectStage + '.glb');

            if(this.data.objectStage == CONSTANTS.QUERYES){
                posicionActual.y = posicionActual.y + 0.3;
                scalaPadre = 0.8;
                positionHijo.y = 0.4;
                this.el.setAttribute('scale', {x: scalaPadre, y: scalaPadre, z: scalaPadre});
            }else if(this.data.objectStage == CONSTANTS.GRAPHS){
                posicionActual.y = posicionActual.y + (-0.2);
                scalaPadre = 0.3
                positionHijo.y = 2.7;
                this.el.setAttribute('scale', {x: scalaPadre, y: scalaPadre, z: scalaPadre});
            }else if(this.data.objectStage == CONSTANTS.FILTERS){
                posicionActual.y = posicionActual.y + (-0.5);
                scalaPadre = 0.150
                positionHijo.y = 7.20;
                positionHijo.x = -3;
                this.el.setAttribute('scale', {x: scalaPadre, y: scalaPadre, z: scalaPadre});
            }
        }else if(this.data.objectType == CONSTANTS.TYPECREATION){
            let posicionActual = this.el.getAttribute('position');

            if(this.data.objectStage == CONSTANTS.BABIAQUERYJSON || this.data.objectStage == CONSTANTS.BABIAQUERYCSV){
                posicionActual.y = posicionActual.y + 0.3;
                scalaPadre = 0.8;
                positionHijo.y = 0.4;
                this.el.setAttribute('gltf-model', '3Dmodels/Queryes.glb');
                this.el.setAttribute('scale', {x: scalaPadre, y: scalaPadre, z: scalaPadre});
            }else{
                posicionActual.y = posicionActual.y + (-0.5);
                scalaPadre = 0.150
                positionHijo.y = 7.20;
                positionHijo.x = -2;
                this.el.setAttribute('gltf-model', '3Dmodels/Filters.glb');
                this.el.setAttribute('scale', {x: scalaPadre, y: scalaPadre, z: scalaPadre});
            }
        }


        let topName = this.data.objectStage;
        let botName;
        if (this.data.objectStage.includes(":")) {
            //texto abajo del objeto solo para babia filter
            let parts = this.data.objectStage.split(":");
            topName = parts[0];
            botName = parts[1];

            let entityBotName = document.createElement('a-entity');
            entityBotName.setAttribute('networked', 'template:#textInit-template');
            entityBotName.classList.add("botNameObject");
            entityBotName.classList.add(parts[2]);
            entityBotName.setAttribute('look-at', '#rig-player');
            entityBotName.setAttribute('text', {
                'value': botName,
                'align': 'center',
                'side': 'double',
                'color': 'BLACK',
                'shader': 'msdf',
                'font': 'https://raw.githubusercontent.com/etiennepinchon/aframe-fonts/master/fonts/berkshireswash/BerkshireSwash-Regular.json'
            });


            entityBotName.setAttribute('scale', '50 50 50');
            entityBotName.setAttribute('position', { x: -2, y: -3.6, z: 0 });

            this.data.objectStage = topName;
            this.el.appendChild(entityBotName);
        }

        //texto arriba del objeto
        let entityObjectChildren = document.createElement('a-entity');
        entityObjectChildren.setAttribute('networked', 'template:#textInit-template');
        entityObjectChildren.classList.add("topNameObject");
        entityObjectChildren.setAttribute('look-at', '#rig-player');
        entityObjectChildren.setAttribute('text', {
            'value': topName,
            'align': 'center',
            'side': 'double',
            'color': 'WHITE',
            'shader': 'msdf',
            'font': 'https://raw.githubusercontent.com/etiennepinchon/aframe-fonts/master/fonts/berkshireswash/BerkshireSwash-Regular.json'
        });
        entityObjectChildren.setAttribute('scale', { x: 10/scalaPadre, y: 10/scalaPadre, z: 10/scalaPadre });
        entityObjectChildren.setAttribute('position', positionHijo);
        this.el.appendChild(entityObjectChildren);
    },

    handleClick: function (evt) {
        //console.log("################## events-object-creation click");
        if (!document.querySelector('#entityEventsController').getAttribute("events-controller").activateController || document.querySelector('#entityEventsController').getAttribute("events-controller").pressbuttonxa) {
            document.querySelector('#entityEventsController').setAttribute("events-controller", "pressbuttonxa", "false");


            let self = this;
            let disco = self.el.parentNode;
            let baseParent = disco.parentNode;
            let objectsDisco = disco.childNodes;

            //Eliminamos animancaciones del disco 
            disco.setAttribute('component-synchronize', {
                'componentShare': 'remove',
                'valueShare': 'animation',
            });

            //Recorremos los objectos del disco
            objectsDisco.forEach(function (object) {
                if (object.classList.contains('miniDisco')) {
                    object.setAttribute('component-synchronize', {
                        'componentShare': 'remove',
                        'valueShare': 'animation',
                    });
                    object.setAttribute('animation', {
                        'property': 'scale',
                        'to': '0 0 0',
                        'dur': '1000',
                        'easing': 'linear',
                    });
                    object.addEventListener('animationcomplete', function (event) {
                        disco.removeChild(object)
                    })
                } else {
                    //Los objectos que no son selecionados cambiamos su apariencia
                    if (object !== self.el) {
                        object.childNodes[0].setAttribute('text', 'opacity', '0.4');
                        object.setAttribute('component-synchronize', {
                            'componentShare': 'opacity',
                            'valueShare': '0.4',
                        });
                        object.classList.remove("selected");

                        //si es de typecreation pues que desaparezca
                        if (object.getAttribute('events-object-creation').objectType === CONSTANTS.TYPECREATION) {
                            object.setAttribute('component-synchronize', {
                                'componentShare': 'remove',
                                'valueShare': 'animation',
                            });
                            object.setAttribute('animation', {
                                'property': 'scale',
                                'to': '0 0 0',
                                'dur': '1000',
                                'easing': 'linear',
                            });
                            object.addEventListener('animationcomplete', function (event) {
                                disco.removeChild(object)
                            })
                        };

                    } else {
                        //El objeto selecionado
                        object.childNodes[0].setAttribute('text', 'opacity', '1');
                        object.setAttribute('component-synchronize', {
                            'componentShare': 'opacity',
                            'valueShare': '1',
                        });
                        object.classList.add("selected");

                        if (object.getAttribute('events-object-creation').objectType === CONSTANTS.TYPECREATION) {
                            self.el.removeEventListener('click', self.handleClick);
                            self.el.removeAttribute('events-object-creation'); //se elimna solo el creador porque no se ha trasmitido el componente(en el otro no existe)
                        }
                    }
                }
            });

            //enviamos al componente creation los datos
            this.el.parentNode.parentNode.setAttribute('creation', {
                typeObjectSelected: this.data.objectType,
                valueObjectSelected: this.data.objectStage,
            });
        }
    },
});