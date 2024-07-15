import * as CONSTANTS from './constants.js';

AFRAME.registerComponent('events-object-creation', {
    schema: {
        objectStage: { type: 'string', default: '' },
        objectType: { type: 'string', default: '' },
        nameObjectGLB: { type: 'string', default: '' },
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
        this.el.setAttribute('gltf-model', '3Dmodels/' + this.data.nameObjectGLB + '.glb');
        this.el.setAttribute('scale', '0.2 0.2 0.2');
        this.el.setAttribute('animation', {
            'property': 'rotation',
            'to': '0 360 0',
            'dur': '15000',
            'easing': 'linear',
            'loop': 'true'
        });

        let topName = this.data.objectStage;
        let botName;
        if (this.data.objectStage.includes(":")) {
            let parts = this.data.objectStage.split(":");
            topName = parts[0];
            botName = parts[1];

            //texto abajo del objeto
            let entityBotName = document.createElement('a-entity');
            entityBotName.setAttribute('networked', 'template:#textInit-template');
            entityBotName.classList.add("botNameObject");
            entityBotName.classList.add(parts[2]);
            entityBotName.setAttribute('text', {
                'value': botName,
                'align': 'center',
                'side': 'double',
                'color': 'BLACK',
                'shader': 'msdf',
                'font': 'https://raw.githubusercontent.com/etiennepinchon/aframe-fonts/master/fonts/berkshireswash/BerkshireSwash-Regular.json'
            });
            entityBotName.setAttribute('scale', '35 35 35');
            entityBotName.setAttribute('position', { x: 0, y: this.el.getAttribute('position').y - 6, z: 0 });

            this.data.objectStage = topName;
            this.el.appendChild(entityBotName);
        }
        //texto arriba del objeto
        let entityObjectChildren = document.createElement('a-entity');
        entityObjectChildren.setAttribute('networked', 'template:#textInit-template');
        entityObjectChildren.classList.add("topNameObject");
        entityObjectChildren.setAttribute('text', {
            'value': topName,
            'align': 'center',
            'side': 'double',
            'color': 'WHITE',
            'shader': 'msdf',
            'font': 'https://raw.githubusercontent.com/etiennepinchon/aframe-fonts/master/fonts/berkshireswash/BerkshireSwash-Regular.json'
        });
        entityObjectChildren.setAttribute('scale', '50 50 50');
        entityObjectChildren.setAttribute('position', { x: 0, y: this.el.getAttribute('position').y + 1.3, z: 0 });
        this.el.appendChild(entityObjectChildren);
    },

    handleClick: function (evt) {
        //console.log("################## events-object-creation click");
        let self = this;
        let disco = self.el.parentNode;
        let baseParent = disco.parentNode;
        let objectsDisco = disco.childNodes;

        //Eliminamos animancaciones del disco 
        disco.setAttribute('remove-component', 'component', 'animation');

        //Recorremos los objectos del disco
        objectsDisco.forEach(function (object) {
            if (object.classList.contains('miniDisco')) {
                object.setAttribute('remove-component', 'component', 'animation');
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
                    object.childNodes[0].setAttribute('text', 'opacity', '0.3');
                    object.setAttribute('object3d-material', 'opacity', '0.3');
                    object.classList.remove("selected");

                    //si es de typecreation pues que desaparezca
                    if (object.getAttribute('events-object-creation').objectType === CONSTANTS.TYPECREATION) {
                        object.setAttribute('remove-component', 'component', 'animation');
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
                    object.setAttribute('object3d-material', 'opacity', '1');
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
    },
});