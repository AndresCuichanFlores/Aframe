
AFRAME.registerComponent('configuration-ui', {

    init: function () {
        console.log("################## configuration-ui -- Init  ##################");
    },

    update: function (oldData) {
        console.log("################## configuration-ui -- Update  ##################");

    },


    queryesPropertis: {
        json: ["URL"],
        csv: [],
        bbdd: []
    },
    queryesFiles: {
        json: ["dataBD", "dataBD2", "dataBD3"],
      },
  
    fileLocation: './dataJSON/',
    parentInterface: undefined,


    generateIconConf: function () {
        console.log("################## configuration-ui generateMainRow  ##################");
        let self = this;
        let parent = self.el.parentNode;

        if(parent.children[1]){
            parent.removeChild(parent.children[1]);
        }else{
            let entityfield = document.createElement('a-entity');
            entityfield.setAttribute('networked', 'template', '#iconConif-template');
            entityfield.setAttribute('position', { x: 1.3, y: 1.3, z: -6} );

            entityfield.addEventListener('click', function () {
                console.log("################## configuration-ui -- click  FIELD ##################");
                self.generateMainRow();
            });
            parent.appendChild(entityfield);
        }
    },

    generateMainRow: function () {
        console.log("################## configuration-ui generateMainRow  ##################");
        let self = this;
        var scene = self.el.sceneEl;        

        self.parentInterface = document.createElement('a-entity');
        self.parentInterface.setAttribute('id', 'configurationUI');
        self.parentInterface.setAttribute('position', '-4.5 5.5 -6');

        let positionX = 0;
        let positionY = 0;
        let text = '';

        for (var i = 0; i < 3; i++) {
            if(self.queryesPropertis.json[i]){
                text = self.queryesPropertis.json[i];
            }else{
                text = '';
            }

            let field = createFieldConf(self, positionX, positionY, text, 'Main');
            self.parentInterface.appendChild(field);
            positionX += 3;
        }

        self.el.parentNode.appendChild(self.parentInterface);
    },

    generateResultRow: function () {
        console.log("################## field-conf-events generateResultRow  ##################");
        let self = this;     

        let positionX = 1.5;
        let positionY = -1.5;
        let text = '';

        for (var i = 0; i < 3; i++) {
            if(self.queryesFiles.json[i]){
                text = self.queryesFiles.json[i];
            }else{
                text = '';
            }

            let field = createFieldConf(self, positionX, positionY, text, 'Result');
            self.parentInterface.appendChild(field);
            positionX += 3;
        }

        //SAVE ICON
        let entityfield = document.createElement('a-entity');
        entityfield.setAttribute('networked', 'template', '#iconSave-template');
        entityfield.setAttribute('position', { x: 4.7, y: -3.5, z: 0} );
        self.parentInterface.appendChild(entityfield);
    },

    events: {
        mouseenter: function (evt) {
            //console.log("################## mouseenter configuration-ui");

        },
        mouseleave: function (evt) {
            //console.log("################## mouseleave configuration-ui");
        },
        click: function (evt) {
            console.log("################## click configuration-ui");

            this.generateIconConf();

            
        }
    }
})

let createFieldConf = (self, positionX, positionY, valueText, row) => {
    console.log("################## configuration-ui createFieldConf  ##################");

    let entityFieldConf = document.createElement('a-entity');
    entityFieldConf.classList.add("fieldConf" + row);
    entityFieldConf.setAttribute('position', { x: positionX, y: positionY, z: 0 });
    //entityFieldConf.setAttribute('field-conf-events', '');

    let entityFieldConfBorder = document.createElement('a-entity');
    entityFieldConfBorder.classList.add("fieldConfBorder");
    entityFieldConfBorder.setAttribute('rounded', {
        'width': '2.15', 
        'height': '1.15',
        'topRightRadius': '0.5', 
        'topLeftRadius': '0.5', 
        'bottomRightRadius': '0.5',
        'bottomLeftRadius': '0.5'
    });
    entityFieldConfBorder.setAttribute('material', {
        'shader': 'flat', 
        'color': 'white',
    });
    entityFieldConfBorder.setAttribute('position', '-0.067 -0.072 -0.005');
    entityFieldConfBorder.setAttribute('visible', 'false');

    let entityFieldConfPlane = document.createElement('a-entity');
    entityFieldConfPlane.classList.add("fieldConfPlane");
    entityFieldConfPlane.setAttribute('rounded', {
        'width': '2', 
        'height': '1',
        'topRightRadius': '0.5', 
        'topLeftRadius': '0.5', 
        'bottomRightRadius': '0.5',
        'bottomLeftRadius': '0.5'
    });
    entityFieldConfPlane.setAttribute('material', {
        'shader': 'flat', 
        'color': 'black',
    });

    let entityFieldConfPlaneText = document.createElement('a-entity');
    entityFieldConfPlaneText.classList.add("fieldConfPlaneText");
    entityFieldConfPlaneText.setAttribute('text', {
        'value': valueText, 
        'align': 'center',
        'side': 'double', 
        'color': 'WHITE', 
        'shader': 'msdf',
        'font': 'https://raw.githubusercontent.com/etiennepinchon/aframe-fonts/master/fonts/berkshireswash/BerkshireSwash-Regular.json'
    });
    entityFieldConfPlaneText.setAttribute('scale', '8 8 8');
    entityFieldConfPlaneText.setAttribute('position', '0.984 0.222 0');
    
    entityFieldConfPlane.appendChild(entityFieldConfPlaneText);
    entityFieldConf.appendChild(entityFieldConfBorder);
    entityFieldConf.appendChild(entityFieldConfPlane);

    selectionEvents(self, entityFieldConf);

    return entityFieldConf;
};

let selectionEvents = (self, entity) => {
    console.log("################## configuration-ui -- selectionEvents  ##################");


    entity.addEventListener('mouseenter', function () {
        entity.setAttribute('animation', { 'property': 'scale', 'to': '1.2 1.2 1.2', 'dur': '200' });

    });

    entity.addEventListener('mouseleave', function () {
        entity.setAttribute('animation', { 'property': 'scale', 'to': '1 1 1', 'dur': '200' });
    });

    entity.addEventListener('click', function () {
        console.log("################## configuration-ui -- click  FIELD ##################");
        let classSelect = entity.getAttribute('class');

        entity.children[0].setAttribute('visible', 'true');
        document.querySelectorAll('.' + classSelect).forEach(entityField => {
            if (entity.children[0] !== entityField.children[0]) {
                entityField.children[0].setAttribute('visible', 'false');
            }
        });

        if (entity.getAttribute('class') === 'fieldConfMain') {
            self.generateResultRow();
        }

    });
}