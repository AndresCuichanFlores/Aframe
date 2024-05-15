
AFRAME.registerComponent('menu-object', {
    schema: {
        objectStage: {type:'string', default: ''},
        nameObjectGLB: {type:'string', default: ''},
    },

    init: function () {
        //console.log("################## menu-object INIT ");
        this.customizeObjectStage();

        this.handleClick = this.handleClick.bind(this); 
        this.el.addEventListener('click', this.handleClick); 
    },

    update: function () {
        console.log("################## menu-object UPDATE ");
    },


    customizeObjectStage: function () {
        console.log("################## menu-object customizeObjectStage ##################");

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
        entityObjectChildren.setAttribute('position', {x: 0, y: this.el.getAttribute('position').y + 1.5, z: 0});
    
        this.el.appendChild(entityObjectChildren);
    },

    handleClick: function (evt) {
        console.log("################## menu-object click");

        let self = this;
        let parent = self.el.parentNode;
        let children = parent.childNodes;
        var i = 0;

        parent.removeAttribute('animation');
        parent.setAttribute('rotation', '0 0 0');

        this.el.removeAttribute('animation');
        this.el.setAttribute('animation', {
            property: 'rotation',
            to: '0 0 0',
            dur: '2000',
            easing: 'linear',
        });
        this.el.setAttribute('animation__1', {
            property: 'position',
            to: {x: 0, y: this.el.getAttribute('position').y, z: 0},
            dur: '2000',
            easing: 'linear',
        });

        while (i < children.length) {
            var child = children[i];
            if (child !== self.el) {
                parent.removeChild(child);
            } else {
                i++;
            }
        }

        parent.setAttribute('menu-disco', {
            objectStageSelect: this.data.objectStage,
        });

        this.el.removeEventListener('click', this.handleClick);
    },

   
});