
AFRAME.registerComponent('ui-create', {
    schema: {
        linesSeparation: { type: 'number', default: 0.3 }
    },

    init: function () {
        console.log("################## ui-create -- Init  ##################");
    },

    update: function (oldData) {
        console.log("################## ui-create -- Update  ##################");
        this.findQuerierComponents();
        this.updateInterface();
    },

    dataMetrics: undefined,
    interface: undefined,
    dataMenu: {
        graph: ["babia-pie", "babia-barsmap", "babia-cyls"],
        data: []
    },
    dataMenuSelect: {
        graph: undefined,
        data: undefined
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
    self.interface.id = "babia-menu-create";
    let keys = Object.keys(self.dataMenu);

    keys.forEach(function (key) {
        let button = createProperty(key.toUpperCase(), posX, posY);
        self.interface.appendChild(button);

        self.dataMenu[key].forEach(value => {
            posX += 3.25
            let button = createDataSelect(self, key, value, posX, posY)
            button.classList.add("babiaxraycasterclass")
            self.interface.appendChild(button)
        });

        --posY
        posY = posY - self.data.linesSeparation
        if (maxX < posX) { maxX = posX }
        posX = 0
    });

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

    entity.classList.add(key);
    entity.classList.add("babiaxraycasterclass")
    entity.setAttribute('position', { x: positionX, y: positionY, z: 0 })
    entity.setAttribute('rotation', { x: 0, y: 0, z: 0 })
    entity.setAttribute('height', 0.8)
    entity.setAttribute('width', 3)
    entity.setAttribute('depth', 0.01)

    let text = document.createElement('a-entity')
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
        console.log("################## babia ui2 -- click  ##################");
        self.dataMenuSelect[key] = entity.children[0].getAttribute('text').value;
        console.dir(self.dataMenuSelect);

        document.querySelectorAll('.' + key).forEach(entityValue => {
            let dataValue = entityValue.children[0].getAttribute('text').value;
            if(self.dataMenuSelect[key] === dataValue){
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

