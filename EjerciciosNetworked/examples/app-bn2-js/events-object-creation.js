AFRAME.registerComponent('events-object-creation', {
    schema: {
        objectStage: { type: 'string', default: '' },
        objectType: { type: 'string', default: '' },
        nameObjectGLB: { type: 'string', default: '' },
        titleObject: { type: 'string', default: '' }, //se elimina
    },

    init: function () {
        //console.log("################## menu-object INIT ");
        this.customizeObjectStage();
        this.handleClick = this.handleClick.bind(this);
        this.el.addEventListener('click', this.handleClick);
    },

    update: function () {
        //console.log("################## menu-object UPDATE ");
    },

    customizeObjectStage: function () {
        //console.log("################## menu-object customizeObjectStage ##################");
        this.el.setAttribute('id', this.data.objectStage);
        this.el.setAttribute('gltf-model', 'assets/real/' + this.data.nameObjectGLB + '.glb');
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
            console.log("El string contiene el símbolo ':'");
            let parts = this.data.objectStage.split(":");
            topName = parts[0];
            botName = parts[1];

            //texto abajo del objeto
            let entityBotName = document.createElement('a-entity');
            entityBotName.setAttribute('text', {
                'value': botName,
                'align': 'center',
                'side': 'double',
                'color': 'BLACK',
                'shader': 'msdf',
                'font': 'https://raw.githubusercontent.com/etiennepinchon/aframe-fonts/master/fonts/berkshireswash/BerkshireSwash-Regular.json'
            });
            entityBotName.setAttribute('scale', '50 50 50');
            entityBotName.setAttribute('position', { x: 0, y: this.el.getAttribute('position').y - 6.5, z: 0 });
            this.el.appendChild(entityBotName);
        }

        //texto arriba del objeto
        let entityObjectChildren = document.createElement('a-entity');
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
        console.log("################## menu-object click");

        let self = this;
        let disco = self.el.parentNode;
        let objectsDisco = disco.childNodes;
        let idTree = Array.from(self.el.classList)[0];

        if (!(document.querySelector('#' + idTree + '[creation]'))) {
            console.log('ENTROOOOOOOOOOOOOOOOOO')
            this.el.removeEventListener("click", this.handleClick);
            this.el.removeAttribute('animation');
            this.el.removeAttribute('animation__1');
            this.el.removeAttribute('events-object-creation');
            return;
        }

        //Eliminamos animancaciones del disco
        disco.removeAttribute('animation');

        //Recorremos los objectos del disco
        objectsDisco.forEach(function (object) {
            //Eliminamos animaciones y eventos del objecto
            object.removeAttribute('animation');

            //Los objectos que no son selecionados cambiamos su apariencia
            if (object !== self.el) {
                object.childNodes[0].setAttribute('text', 'opacity', '0.2');
                object.object3D.traverse((value) => {
                    if (value.type === 'Mesh') {
                        const material = value.material;
                        material.transparent = true;
                        material.opacity = 0.2;
                    }
                })
                object.classList.remove("selected");
            } else {
                object.childNodes[0].setAttribute('text', 'opacity', '1');
                object.object3D.traverse((value) => {
                    if (value.type === 'Mesh') {
                        const material = value.material;
                        material.transparent = true;
                        material.opacity = 1;
                    }
                })
                object.classList.add("selected");
            }
        });

        //enviamos al componente config los datos
        document.querySelector('#' + idTree + '[creation]').setAttribute('creation', {
            typeObjectSelected: this.data.objectType,
            valueObjectSelected: this.data.objectStage,
        });
    },
});