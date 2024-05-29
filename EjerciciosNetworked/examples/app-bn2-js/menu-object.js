
AFRAME.registerComponent('menu-object', {
    schema: {
        objectStage: { type: 'string', default: '' },
        objectType: { type: 'string', default: '' },
        nameObjectGLB: { type: 'string', default: '' },
        removeEventClick: { type: 'boolean', default: 'false' },
        titleObject: { type: 'string', default: '' },
    },

    init: function () {
        //console.log("################## menu-object INIT ");
        this.customizeObjectStage();
        this.handleClick = this.handleClick.bind(this);
        this.el.addEventListener('click', this.handleClick);
    },

    update: function () {
        console.log("################## menu-object UPDATE ");
        if(this.data.removeEventClick){
            this.el.removeEventListener('click', this.handleClick);
        }

        if(this.data.titleObject){
            if(this.el.querySelector('.titleObject')){
                this.el.querySelector('.titleObject').setAttribute('text', 'value' , this.data.titleObject);
            }else{
                let entityObjectChildren = document.createElement('a-entity');
                entityObjectChildren.classList.add('titleObject');
                entityObjectChildren.setAttribute('text', {
                    'value': this.data.titleObject,
                    'align': 'center',
                    'side': 'double',
                    'color': 'black',
                    'shader': 'msdf',
                    'font': 'https://raw.githubusercontent.com/etiennepinchon/aframe-fonts/master/fonts/berkshireswash/BerkshireSwash-Regular.json'
                });
                entityObjectChildren.setAttribute('scale', '50 50 50');
                entityObjectChildren.setAttribute('position', { x: 0, y: this.el.getAttribute('position').y - 7.0, z: 0 });
                this.el.appendChild(entityObjectChildren);
            }
        }
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

        let entityObjectChildren = document.createElement('a-entity');
        entityObjectChildren.setAttribute('text', {
            'value': this.data.objectStage,
            'align': 'center',
            'side': 'double',
            'color': 'WHITE',
            'shader': 'msdf',
            'font': 'https://raw.githubusercontent.com/etiennepinchon/aframe-fonts/master/fonts/berkshireswash/BerkshireSwash-Regular.json'
        });
        entityObjectChildren.setAttribute('scale', '50 50 50');
        entityObjectChildren.setAttribute('position', { x: 0, y: this.el.getAttribute('position').y + 1.5, z: 0 });
        this.el.appendChild(entityObjectChildren);
    },

    handleClick: function (evt) {
        console.log("################## menu-object click");


        let self = this;
        let disco = self.el.parentNode;
        let objectsDisco = disco.childNodes;
        let idTree = Array.from(self.el.classList)[0];

        //Eliminamos animancaciones del disco
        disco.removeAttribute('animation');

        //Recorremos los objectos del disco
        objectsDisco.forEach(function (object) {
            //Eliminamos animaciones y eventos del objecto
            object.removeAttribute('animation');
            object.setAttribute('animation', {
                property: 'rotation',
                to: '0 0 0',
                dur: '2000',
                easing: 'linear',
            });

            console.log(self.data.objectType);



            if( (self.data.objectType !== 'property') && (self.data.objectType !== 'subProperty')){
                console.log('ENTRAAAAAAAAA')
                object.setAttribute('menu-object', 'removeEventClick', 'true');
            }

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
            }else{
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
        document.querySelector('#' + idTree + '[configuration]').setAttribute('configuration', {
            typeObjectSelected: this.data.objectType,
            valueObjectSelected: this.data.objectStage,
        });
    },

});