
AFRAME.registerComponent('menu-disco', {
    schema: {
        colorDisco: { type: 'string', default: '' },
        objectsStage: { type: 'array', default: [] },
        objectType: { type: 'string', default: '' },
    },

    init: function () {
        //console.log("################## menu-disco INIT ");
        this.customizeDiscoStage();
        this.createObjectsStage('folder1');
    },

    update: function () {
        //console.log("################## menu-disco UPDATE");
    },

    customizeDiscoStage: function () {
        //console.log("################## menu-disco customizeDiscoStage  ##################");
        this.el.setAttribute('scale', '0 0 1');
        this.el.setAttribute('material', 'color', this.data.colorDisco);
        this.el.setAttribute('geometry', {
            'primitive': 'cylinder',
            'radius': '4',
            'height': '0.3',
        });
        this.el.setAttribute('animation', {
            'property': 'rotation',
            'to': '0 360 0',
            'dur': '30000',
            'easing': 'linear',
            'loop': 'true'
        });
        this.el.setAttribute('animation__1', {
            'property': 'scale',
            'to': '1 1 1',
            'dur': '1000',
        });
    },

    createObjectsStage: function (nameObjectGLB) {
        //console.log("################## menu-disco createObjectsStage  ##################");
        let self = this;
        let radius = 3;
        let posicionNueva = { x: 0, y: 0, z: 0 };

        this.data.objectsStage.forEach(function (object, index) {
            if (self.data.objectsStage.length != 1) {
                let angle = (Math.PI * 2 / self.data.objectsStage.length) * index;
                posicionNueva = { x: radius * Math.cos(angle), y: 0, z: radius * Math.sin(angle) };
            }
            let entityObject = createObject(self, object, nameObjectGLB, posicionNueva);
            self.el.appendChild(entityObject);
        })
    },
});


let createObject = (self, object, nameObjectGLB, position) => {
    //console.log("################## menu-disco createObject  ##################");
    position.y = 1.3;

    let entityObject = document.createElement('a-entity');
    entityObject.classList.add(self.el.className);
    entityObject.setAttribute('position', position);
    entityObject.setAttribute('menu-object', {
        'objectStage': object,
        'nameObjectGLB': nameObjectGLB,
        'objectType': self.data.objectType
    });
    return entityObject;
};