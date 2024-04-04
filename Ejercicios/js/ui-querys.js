AFRAME.registerComponent('ui-querys', {
    schema: {
        target: { type: 'string' },
        linesSeparation: { type: 'number', default: 0.3 },
        customQuerierLabel: { type: 'string', default: 'Data' }
    },

    /**
    * Set if component needs multiple instancing.
    */
    multiple: false,

    /**
    * Called once when component is attached. Generally for initial setup.
    */
    init: function () {
        console.log("################## babia ui2 -- Init  ##################");
    },

    /**
    * Called when component is attached and when component data changes.
    * Generally modifies the entity based on the data.
    */
    update: function (oldData) {
        console.log("################## babia ui2 -- Update  ##################");
        const self = this
        let data = this.data

        // Find the target component
        self.targetComponent = this.findTargetComponent(data, this)
        // Find querier components
        this.findQuerierComponents(this)


        // Register to target component notiBuffer
        if (this.targetComponent.notiBuffer) {
            console.log("################## babia ui2 -- Update 3  ##################");
            console.dir("this.targetComponent.notiBuffer: ");
            console.dir(this.targetComponent.notiBuffer);
            this.notiBufferId = this.targetComponent.notiBuffer
                .register(this.updateInterface.bind(this))
        }
    },

    targetComponent: undefined,
    targetComponentVisProperties: undefined,
    dataMetrics: undefined,
    interface: undefined,
    dataQueriers: undefined,
    handController: undefined,
    
    updateInterface: function (data) {
        console.log("################## babia ui2 -- updateInterface  ##################");
        console.log("data: ");
        console.dir(data);
        let self = this;

        while (self.el.firstChild)
            self.el.firstChild.remove();

        // Generate interface
        console.log('Generating interface...')
        console.log("################## babia ui2 -- updateInterface3  ##################");
        self.interface = generateInterface(self, self.dataMetrics, self.el)
    },

    findQuerierComponents: function () {
        console.log("################## babia ui2 -- findQuerierComponents  ##################");
        this.dataQueriers = []
        document.querySelectorAll('[babia-queryjson]').forEach(querier => {
            // Skip querier data when the target visualizer has included filtered data too.
            if (querier.id != this.data.target || (querier.id == this.data.target && !this.targetComponent.prodComponent.attrName == 'babia-filter')) {
                this.dataQueriers.push(querier.id)
            }
        });

        console.log("this.dataQueriers: " + this.dataQueriers);
    },

    findTargetComponent: function (data, self) {
        console.log("################## babia ui2 -- findTargetComponent  ##################");
        let targetComponent;
        if (data.target) {
            // Save the reference to the querier or filterdata
            let targetElement = document.getElementById(data.target)
            console.log(targetElement);
            if (targetElement != null) {
                if (targetElement.components['babia-bars']) {
                    targetComponent = targetElement.components['babia-bars']
                } else if (targetElement.components['babia-barsmap']) {
                    targetComponent = targetElement.components['babia-barsmap']
                } else if (targetElement.components['babia-cyls']) {
                    targetComponent = targetElement.components['babia-cyls']
                } else if (targetElement.components['babia-cylsmap']) {
                    targetComponent = targetElement.components['babia-cylsmap']
                } else if (targetElement.components['babia-pie']) {
                    targetComponent = targetElement.components['babia-pie']
                } else if (targetElement.components['babia-doughnut']) {
                    targetComponent = targetElement.components['babia-doughnut']
                } else if (targetElement.components['babia-bubbles']) {
                    targetComponent = targetElement.components['babia-bubbles']
                } else if (targetElement.components['babia-city']) {
                    targetComponent = targetElement.components['babia-city']
                } else if (targetElement.components['babia-boats']) {
                    targetComponent = targetElement.components['babia-boats']
                } else if (targetElement.components['babia-network']) {
                    targetComponent = targetElement.components['babia-network']
                } else {
                    console.error("Visualizer not found.")
                    return
                }
            } else {
                console.error("Target not exist.")
                return
            }
        } else {
            console.error("Error: Target not inserted. ")
            return
        }
        console.dir("targetComponen: ");
        console.dir(targetComponent);
        return targetComponent;
    }
})



let generateInterface = (self, metrics, parent) => {
    console.log("################## babia ui2 -- generateInterface  ##################");
    self.interface = document.createElement('a-entity')
    self.interface.id = "babia-menu"
    let posY = 0
    let posX = 0
    let maxX = 0

    // Data files
    if (self.dataQueriers.length > 1) {
        let button = createProperty(self.data.customQuerierLabel, posX, posY)
        self.interface.appendChild(button)
        self.dataQueriers.forEach(data => {
            posX += 3.25
            let button = createDataSelect(self, data, posX, posY)
            button.classList.add("babiaxraycasterclass")
            self.interface.appendChild(button)
        });
    }
    --posY
    posY = posY - self.data.linesSeparation
    if (maxX < posX) { maxX = posX }
    posX = 0

    self.interface.width = maxX + 3;
    self.interface.height = Math.abs(posY)

    console.log("self.interface.width: " + self.interface.width);
    console.log("self.interface.height: " + self.interface.height);

    self.interface.setAttribute('position', { x: -self.interface.width / 2, y: self.interface.height + 2.7, z: 0 })
    parent.appendChild(self.interface)

    return self.interface
}


let selection_events = (entity, visualizer, isData) => {
    console.log("################## babia ui2 -- selection_events  ##################");
    console.dir("entity.from: " + entity.from);
    console.dir("visualizer.data.from: " + visualizer.data.from);

    entity.addEventListener('mouseenter', function () {
        if (visualizer.data.from == "" || visualizer.data.from != entity.from) {
            entity.children[0].setAttribute('text', { color: '#FFFFFF' });
            entity.setAttribute('color', '#4DA0DB');
        }

    });

    if (isData) {
        console.log("################## babia ui2 -- selection_events 1  ##################");
        entity.addEventListener('mouseleave', function () {
            entity.children[0].setAttribute('text', { color: 'black' })
            if (visualizer.data.from == entity.from) {
                entity.setAttribute('color', '#8A8A8A')
            } else if (visualizer.data.from == "" || visualizer.data.from != entity.from) {
                entity.setAttribute('color', '#4DA0DB')
            }
        });
    } else {
        console.log("################## babia ui2 -- selection_events 2  ##################");
        entity.addEventListener('mouseleave', function () {
            entity.children[0].setAttribute('text', { color: 'black' })
            if (visualizer.data[entity.property] == entity.metric) {
                entity.setAttribute('color', '#8A8A8A')
            } else {
                entity.setAttribute('color', '#FFFFFF')
            }
        });
    }

    entity.addEventListener('click', function () {
        // Change parameters
        if (entity.property && entity.metric) {
            console.log("################## babia ui2 -- click 1  ##################");
            // When change from width/depth to area or vice-versa to boats component
            if (visualizer.attrName == 'babia-boats' && entity.property == "area") {
                visualizer.el.removeAttribute(visualizer.attrName, 'width')
                visualizer.el.removeAttribute(visualizer.attrName, 'depth')
            } else if (visualizer.attrName == 'babia-boats' && (entity.property == "width" || entity.property == "depth") && visualizer.el.getAttribute('babia-boats').area) {
                visualizer.el.removeAttribute(visualizer.attrName, 'area')
                if (entity.property == "width") {
                    visualizer.el.setAttribute(visualizer.attrName, 'depth', entity.metric)
                } else {
                    visualizer.el.setAttribute(visualizer.attrName, 'width', entity.metric)
                }
            }
            visualizer.el.setAttribute(visualizer.attrName, entity.property, entity.metric)
            // Change selected querier in visualializer (from)
        } else if (entity.from) {
            console.log("################## babia ui2 -- click 2  ##################");
            console.dir(visualizer);
            visualizer.el.setAttribute(visualizer.attrName, "from", entity.from)
        } else if (entity.nodes) {
            console.log("################## babia ui2 -- click 3  ##################");
            visualizer.el.setAttribute(visualizer.attrName, 'nodesFrom', entity.nodes)
        } else if (entity.links) {
            console.log("################## babia ui2 -- click 4  ##################");
            visualizer.el.setAttribute(visualizer.attrName, 'linksFrom', entity.links)
        }
    });
}

let createProperty = (property, positionX, positionY) => {
    console.log("################## babia ui2 -- createProperty  ##################");
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

let createDataSelect = (self, id, positionX, positionY, networkType) => {
    console.log("################## babia ui2 -- createDataSelect  ##################");
    console.log("id: " + id);
    let entity = document.createElement('a-box')
    if (networkType == 'nodes') {
        entity.nodes = id
    } else if (networkType == 'links') {
        entity.links = id
    } else {
        entity.from = id;
    }

    entity.classList.add("babiaxraycasterclass")
    entity.setAttribute('position', { x: positionX, y: positionY, z: 0 })
    entity.setAttribute('rotation', { x: 0, y: 0, z: 0 })
    entity.setAttribute('height', 0.8)
    entity.setAttribute('width', 3)
    entity.setAttribute('depth', 0.01)

    let text = document.createElement('a-entity')
    text.setAttribute('text', {
        'value': id,
        'align': 'center',
        'width': '10',
        'color': 'black'
    })
    text.setAttribute('position', "0 0 0.01")
    entity.appendChild(text)

    if (self.targetComponent.prodComponent && self.targetComponent.prodComponent.el.id == id) {
        entity.setAttribute('color', '#8A8A8A')
    } else {
        entity.setAttribute('color', '#4DA0DB')
    }

    selection_events(entity, self.targetComponent, true)

    return entity
}


