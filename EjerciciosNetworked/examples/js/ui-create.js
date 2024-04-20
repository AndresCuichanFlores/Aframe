
AFRAME.registerComponent('ui-create', {
    schema: {
        linesSeparation: { type: 'number', default: 0.3 },
        menuDataSelect: { type: 'string'  },
        menuGraphSelect: { type: 'string'}

    },

    init: function () {
        console.log("################## ui-create -- Init  ##################");
        this.findQuerierComponents();
        this.updateInterface();
    },

    update: function (oldData) {
        console.log("################## ui-create -- Update  ##################");
        console.log("SELECTTTTTT: ");
        console.log(this.data.menuGraphSelect);
        console.log(this.data.menuDataSelect);

    },

    dataMetrics: undefined,
    interface: undefined,
    dataMenu: {
        graph: ["babia-pie", "babia-barsmap", "babia-cyls"],
        data: []
    },


    findQuerierComponents: function () {
        console.log("################## ui-create -- findQuerierComponents  ##################");
        document.querySelectorAll('[babia-queryjson]').forEach(querier => {
            this.dataMenu.data.push(querier.id)
        });
        console.log("this.dataMenu: ");
        console.dir(this.dataMenu);
    },

    updateInterface: function () {
        console.log("################## ui-create -- updateInterface  ##################");
        this.interface = generateInterface(this, this.el)
    },

})



let generateInterface = (self, parent) => {
    console.log("################## ui-create -- generateInterface  ##################");
    let posY = 0
    let posX = 0
    let maxX = 0
    self.interface = document.createElement('a-entity');
    self.interface.classList.add("babia-menu-create");
    let keys = Object.keys(self.dataMenu);

    keys.forEach(function (key) {
        let button = createProperty(key.toUpperCase(), posX, posY);
        self.interface.appendChild(button);

        self.dataMenu[key].forEach(value => {
            posX += 3.25
            let button = createDataSelect(self, key, value, posX, posY)
            //button.classList.add("babiaxraycasterclass")
            self.interface.appendChild(button)
        });

        --posY
        posY = posY - self.data.linesSeparation
        if (maxX < posX) { maxX = posX }
        posX = 0
    });

    let button = createButton(self, parent, posX, posY);
    self.interface.appendChild(button);


    self.interface.width = maxX + 3;
    self.interface.height = Math.abs(posY)
    self.interface.setAttribute('position', { x: -self.interface.width / 2, y: self.interface.height + 2.7, z: 0 })
    parent.appendChild(self.interface)

    return self.interface
}

let createProperty = (property, positionX, positionY) => {
    console.log("################## ui-create -- createProperty  ##################");
    console.log("property: " + property);
    let entity = document.createElement('a-plane')

    entity.setAttribute('position', { x: positionX, y: positionY, z: 0 })
    entity.setAttribute('rotation', { x: 0, y: 0, z: 0 })
    entity.setAttribute('height', 0.8)
    entity.setAttribute('width', 3)
    entity.setAttribute('text', {
        'value': property,
        'align': 'center',
        'width': '10',
        'color': '#FFFFFF'
    })
    entity.setAttribute('color', '#544DDB')
    return entity
}

let createDataSelect = (self, key, value, positionX, positionY) => {
    console.log("################## ui-create  -- createDataSelect  ##################");
    let entity = document.createElement('a-box')

    entity.setAttribute('networked', 'template: #data-select-box-template');
    entity.setAttribute('networked', 'networkId:' + value);
    entity.classList.add(key);
    //entity.classList.add("babiaxraycasterclass")
    entity.setAttribute('position', { x: positionX, y: positionY, z: 0 })
    entity.setAttribute('rotation', { x: 0, y: 0, z: 0 })
    entity.setAttribute('height', 0.8)
    entity.setAttribute('width', 3)
    entity.setAttribute('depth', 0.01)

    let text = document.createElement('a-entity');
    text.classList.add("data-select-box-text");
    text.setAttribute('text', {
        'value': value,
        'align': 'center',
        'width': '10',
        'color': 'black'
    })
    text.setAttribute('position', "0 0 0.01")
    entity.appendChild(text)
    entity.setAttribute('color', '#4DA0DB')
 
    selection_events(self, key, entity)

    return entity
}

let createButton = (self, parent, positionX, positionY) => {
    console.log("################## ui-create  -- createButton  ##################");
    let entity = document.createElement('a-box')

    //entity.classList.add("babiaxraycasterclass")
    entity.setAttribute('position', { x: positionX, y: positionY, z: 0 })
    entity.setAttribute('rotation', { x: 0, y: 0, z: 0 })
    entity.setAttribute('height', 0.8)
    entity.setAttribute('width', 3)
    entity.setAttribute('depth', 0.01)

    let text = document.createElement('a-entity')
    text.setAttribute('text', {
        'value': "Create",
        'align': 'center',
        'width': '10',
        'color': 'black'
    })
    text.setAttribute('position', "0 0 0.01")
    entity.appendChild(text)
    entity.setAttribute('color', '#8D2EF2')

    //selection_events(self, key, entity)

    entity.click = false;

    entity.addEventListener('mouseenter', function () {
        if(!entity.click){
            entity.children[0].setAttribute('text', { color: '#FFFFFF' });
        }
    });

    entity.addEventListener('mouseleave', function () {
        entity.children[0].setAttribute('text', { color: 'black' })
        if(entity.click){
            entity.setAttribute('color', '#8A8A8A');
        }else{
            entity.setAttribute('color', '#8D2EF2');
        }
    });

    entity.addEventListener('click', function () {
        console.log("################## babia ui2 -- click Create button ##################");
        entity.click = true;
        entity.children[0].setAttribute('text', { color: 'black' });
        entity.setAttribute('color', '#8A8A8A'),

        console.log(self.data.menuGraphSelect);
        console.log(self.data.menuDataSelect);

        let entityGraph = document.createElement('a-entity');
        let idEntityGraph = self.data.menuGraphSelect + '-' + self.data.menuDataSelect;
        entityGraph.setAttribute(self.data.menuGraphSelect, 
            { 
                from: self.data.menuDataSelect, 
                legend: true,
                palette: 'blues',
                key: 'model',
                size: 'sales',
                title: self.data.menuDataSelect,
                titlePosition: '4.2 0 1.5'
            })

        entityGraph.setAttribute('position', '0 8 -6');
        entityGraph.setAttribute('rotation', '90 0 0');
        entityGraph.setAttribute('scale', '2 2 2');
        entityGraph.setAttribute('id', idEntityGraph);

        entityGraph.setAttribute('networked', 'template: #ui-create-babia-pie-template');
        entityGraph.setAttribute('networked', 'networkId: babiepie123');

        var scene = parent.sceneEl;
        scene.appendChild(entityGraph);


        
        /*
        let entityUiCreate = document.querySelector('#ui_data-pie');
        console.log("entityUiCreate:");
        console.dir(entityUiCreate);
        scene.removeChild(entityUiCreate);

        
        interfaceFull.setAttribute('babia-ui', 'target', idEntityGraph);
        interfaceFull.setAttribute('position', '0 0 -2');
        interfaceFull.setAttribute('scale', '0.4 0.7 0.5');
        scene.appendChild(interfaceFull);
        */

    });
    

    return entity
}

let selection_events = (self, key, entity) => {
    console.log("################## babia ui2 -- selection_events  ##################");
    entity.click = false;

    entity.addEventListener('mouseenter', function () {
        if(!entity.click){
            entity.children[0].setAttribute('text', { color: '#FFFFFF' });
        }
    });

    entity.addEventListener('mouseleave', function () {
        entity.children[0].setAttribute('text', { color: 'black' })
        if(entity.click){
            entity.setAttribute('color', '#8A8A8A');
        }else{
            entity.setAttribute('color', '#4DA0DB');
        }
    });

    entity.addEventListener('click', function () {
        console.log("################## babia ui2 -- click  FIELD ##################");
        //NAF.utils.takeOwnership(this);
        var valueSelect;

        if(key === "data"){
            self.data.menuDataSelect = entity.children[0].getAttribute('text').value;
            valueSelect = self.data.menuDataSelect;
        }else{
            self.data.menuGraphSelect = entity.children[0].getAttribute('text').value;
            valueSelect = self.data.menuGraphSelect;
        }
        console.log("SELECTTTTTT: ");
        console.log(self.data.menuGraphSelect);
        console.log(self.data.menuDataSelect);

        document.querySelectorAll('.' + key).forEach(entityValue => {   
            let dataValue = entityValue.children[0].getAttribute('text').value;
            if(valueSelect === dataValue){
                //console.log("entra")
                entity.children[0].setAttribute('text', { color: 'black' });
                entity.setAttribute('color', '#8A8A8A')
                entity.click = true;
            }else{
                entityValue.children[0].setAttribute('text', { color: 'black' });
                entityValue.setAttribute('color', '#4DA0DB');
                entityValue.click = false;
            }
        });
    });

}

