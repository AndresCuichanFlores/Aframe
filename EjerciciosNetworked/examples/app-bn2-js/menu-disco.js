
AFRAME.registerComponent('menu-disco', {
    schema: {
        color: {type:'string', default: '#C99E10'},
        modoNext: {type:'string', default: ''},
        objectsStage: {type:'array', default:[]},
        objectStageSelect: {type:'string', default:''},
    },

    init: function () {
        //console.log("################## menu-disco INIT ");
        this.customizeDiscoStage();
        this.createObjectsStage('folder1');
    },

    update: function () {
        console.log("################## menu-disco UPDATE");

        let baseDisco = this.el.parentNode.parentNode;

        if (this.data.objectStageSelect) {
            if (this.data.modoNext === 'vertical') {
                let position = this.el.getAttribute('position');
                let posicionNueva = {x: 0, y: position.y + 3, z: 0};
                let menuDisco = createNewMenuDisco(this.dashboard[this.data.objectStageSelect], posicionNueva, 'horizontal', '#04d56c');
                this.el.appendChild(menuDisco);
            } else if (this.data.modoNext === 'horizontal') {
                this.createProperties(this.properties[this.data.objectStageSelect]);


               

            } else if (this.data.modoNext === 'configuracion') {
                let position = this.el.getAttribute('position');
                let posicionNueva = {x: 0, y: position.y + 3, z: 0};
                let menuDisco = createNewMenuDisco(this.valuesPropeties[this.data.objectStageSelect], posicionNueva, 'propertySelect', '#c87cfa');
                this.el.appendChild(menuDisco);

                
            }else if (this.data.modoNext === 'propertySelect') {

                baseDisco.children[0].setAttribute('babia-queryjson', 'url', this.data.objectStageSelect);
            }
        }

    },



    dashboard: {
        queryes: ['json', 'csv', 'elastic'],
        graphs: ['pie', 'bars', 'cyls', 'doughnut'],
        filters: []
    },

    properties:{
        json: ['url', 'data'],
        csv: ['url', 'data'],
        elastic: []
    },

    valuesPropeties:{
        url: ['./data/dataBD.json', './data/dataBD2.json', './data/dataBD3.json'],
        cvs: [],
        elastic: []
    },


    customizeDiscoStage: function () {
        console.log("################## menu-disco customizeDiscoStage  ##################");

        this.el.setAttribute('geometry', {
            'primitive': 'cylinder', 
            'radius': '4',
            'height': '0.3', 
        });
        this.el.setAttribute('scale', '0 0 1');
        this.el.setAttribute('material', 'color', this.data.color);
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
        console.log("################## menu-disco createObjectsStage  ##################");
        let self = this;
        let radius = 3;
        let posicionNueva = {x: 0, y: 0, z: 0};

        this.data.objectsStage.forEach(function (object, index) {
            if(self.data.objectsStage.length != 1){
                let angle = (Math.PI * 2 / self.data.objectsStage.length) * index;
                posicionNueva = {x: radius * Math.cos(angle), y: 0, z: radius * Math.sin(angle)};
            }
            let entityObject = createObject(object, nameObjectGLB, posicionNueva);
            self.el.appendChild(entityObject);
        })
        
    },

    createProperties: function (objects) {
        console.log("################## menu-disco createProperties   ##################");
        var radio = 8;
        let parent = this.el;

        objects.forEach(function (object, index) {
            let angle = (Math.PI / 2) * index;
            let posicionNueva = {
                x: radio * Math.cos(angle),
                y: 0,
                z: radio * Math.sin(angle)
            };
            let entityNewMenuDisco = createNewMenuDisco(object, posicionNueva, 'configuracion', '#0abbcf');
            parent.appendChild(entityNewMenuDisco);
            
        })
    },

});

let createNewMenuDisco = (objects, position, modoNext, colorDisco) => {
    //console.log("################## menu-disco createNewMenuDisco  ##################");

    let entityMenuDisco = document.createElement('a-entity');
    entityMenuDisco.setAttribute('position', position);
    entityMenuDisco.setAttribute('menu-disco', {
        'objectsStage': objects,
        'modoNext': modoNext,
        'color': colorDisco,
    });
    return entityMenuDisco;
};

let createObject = (object, nameObjectGLB, position) => {
    //console.log("################## menu-disco createObject  ##################");

    position.y = 1;
    let entityObject = document.createElement('a-entity');
    entityObject.setAttribute('position', position);
    entityObject.setAttribute('menu-object', {
        'objectStage': object,
        'nameObjectGLB': nameObjectGLB 
    });
    return entityObject;
};