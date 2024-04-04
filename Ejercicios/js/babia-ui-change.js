

AFRAME.registerComponent('babia-ui-change', {
    schema: {
        target: { type: 'string' },
        hideFields: { type: 'array' },
        hideRows: { type: 'array' },
        showOnly: { type: 'array' },
        maxPerRow: { type: 'number', default: 5 },
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
        console.log("WELCOME TO UI: Control your data.")
    },

    /**
    * Called when component is attached and when component data changes.
    * Generally modifies the entity based on the data.
    */
    update: function (oldData) {
        console.log("################## babia ui2 -- Update  ##################");
        const self = this
        let data = this.data

        // Unregister from old producer
        if (this.targetComponent) {
            console.log("################## babia ui2 -- Update 1  ##################");
            this.targetComponent.notiBuffer.unregister(this.notiBufferId)
        };

        // Find the target component
        self.targetComponent = this.findTargetComponent(data, this)
        // Find querier components
        this.findQuerierComponents(this)

        // Target component properties
        if (this.targetComponent.visProperties) {
            console.log("################## babia ui2 -- Update 2  ##################");
            console.log("this.targetComponent.visProperties: " + this.targetComponent.visProperties);
            this.targetComponentVisProperties = this.targetComponent.visProperties
        }

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
        if (data) {
            // if (!self.targetComponent.el.components['babia-network']){
            console.log("################## babia ui2 -- updateInterface1  ##################");
            getDataMetrics(self, data, self.targetComponentVisProperties)
            //}
        }

        while (self.el.firstChild)
            self.el.firstChild.remove();

        // Generate interface
        console.log('Generating interface...')
        if (document.querySelector('#babia-menu-hand')) {
            console.log("################## babia ui2 -- updateInterface2  ##################");
            let hand_ui = document.querySelector('#babia-menu-hand')
            hand_ui.parentNode.removeChild(hand_ui)
            insertInterfaceOnHand(self, self.handController)
        } else {
            console.log("################## babia ui2 -- updateInterface3  ##################");
            self.interface = generateInterface(self, self.dataMetrics, self.el)
        }

        document.addEventListener('controllerconnected', (event) => {
            console.log("################## babia ui2 -- updateInterface 4  ##################");
            while (self.el.firstChild)
                self.el.firstChild.remove();
            // event.detail.name ----> which VR controller
            controller = event.detail.name;
            let hand = event.target.getAttribute(controller).hand
            if (hand === 'left' && !document.querySelector('#babia-menu-hand')) {
                console.log("################## babia ui2 -- updateInterface5  ##################");
                self.handController = event.target.id
                insertInterfaceOnHand(self, self.handController)
            }
        });
    },

    findQuerierComponents: function () {
        console.log("################## babia ui2 -- findQuerierComponents  ##################");
        this.dataQueriers = []
        // All queriers and filterdatas of the scene
        document.querySelectorAll('[babia-queryjson]').forEach(querier => {
            // Skip querier data when the target visualizer has included filtered data too.
            if (querier.id != this.data.target || (querier.id == this.data.target && !this.targetComponent.prodComponent.attrName == 'babia-filter')) {
                this.dataQueriers.push(querier.id)
            }
        });
        document.querySelectorAll('[babia-queryes]').forEach(querier => {
            this.dataQueriers.push(querier.id)
        });
        document.querySelectorAll('[babia-querygithub]').forEach(querier => {
            this.dataQueriers.push(querier.id)
        });
        document.querySelectorAll('[babia-filter]').forEach(querier => {
            this.dataQueriers.push(querier.id)
        });

        console.log("this.dataQueriers: " + this.dataQueriers);

    },

    hideAndInsertMetrics: function (dataMetrics, property, metrics) {
        console.log("################## babia ui2 -- hideAndInsertMetrics  ##################");
        const self = this
        let toAdd = {
            property: property,
            metrics: metrics
        }

        if (self.data.hideFields.length != 0) {
            console.log("################## babia ui2 -- hideAndInsertMetrics 1  ##################");
            let metricsFiltered = []
            metrics.forEach(metric => {
                if (!self.data.hideFields.includes(metric)) {
                    metricsFiltered.push(metric)
                }
            })
            toAdd.metrics = metricsFiltered
        }

        console.dir("toAdd: ");
        console.dir(toAdd);

        if (!self.data.hideRows.includes(property)) {
            console.log("################## babia ui2 -- hideAndInsertMetrics 2 ##################");
            dataMetrics.push(toAdd)
        }
    },

    findTargetComponent: function (data, self) {
        console.log("################## babia ui2 -- findTargetComponent  ##################");
        let targetComponent;
        if (data.target) {
            // Save the reference to the querier or filterdata
            let targetElement = document.getElementById(data.target)
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




let getDataMetrics = (self, data, properties) => {
    console.log("################## babia ui2 -- getDataMetrics  ##################");
    self.dataMetrics = []

    // Create structure
    let number_properties = ['height', 'radius', 'width', 'size', 'farea', 'fheight', 'area', 'depth', 'color']
    let number_metrics = []
    let last_child

    if (self.targetComponent.attrName == 'babia-city') {
        // Get last child of the tree
        last_child = getLastChild(data)
    } else if (self.targetComponent.attrName == 'babia-boats') {
        last_child = getLastChild(data[0])
    } else {
        last_child = data[0]
    }

    Object.keys(last_child).forEach(metric => {
        if (typeof last_child[metric] == 'number') {
            number_metrics.push(metric)
        }
    });

    properties.forEach(property => {
        if (number_properties.includes(property)) {
            self.hideAndInsertMetrics(self.dataMetrics, property, number_metrics)

            // Specific case for categoric color in boats
            if (property === "color") {
                if (self.targetComponent.attrName == 'babia-boats') {
                    let categoric_colors = []
                    for (const [key, value] of Object.entries(last_child)) {
                        if (typeof value === 'string') {
                            categoric_colors.push(key)
                        }
                    }
                    // Solo si no está activado
                    if (!self.data.showOnly) {
                        self.hideAndInsertMetrics(self.dataMetrics, property, categoric_colors)
                    }
                }
            }
        } else {
            self.hideAndInsertMetrics(self.dataMetrics, property, Object.keys(data[0]))
        }
    });
}

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

    // Properties and metrics
    metrics.forEach(property => {
        let button = createProperty(property.property, posX, posY)
        self.interface.appendChild(button)

        property.metrics.forEach((metric, i) => {
            posX += 3.25
            let button = createMetric(self, property.property, metric, posX, posY)
            button.classList.add("babiaxraycasterclass")
            self.interface.appendChild(button)

            // Two lines
            if (((i + 1) % self.data.maxPerRow) == 0) {
                --posY
                posX = 0
            }
        });
        --posY
        posY = posY - self.data.linesSeparation
        if (maxX < posX) { maxX = posX }
        posX = 0
    });
    
    self.interface.width = maxX + 3;
    self.interface.height = Math.abs(posY)
    self.interface.setAttribute('position', { x: -self.interface.width / 2, y: self.interface.height, z: 0 })
    parent.appendChild(self.interface)

    return self.interface
}

let createMetric = (self, property, metric, positionX, positionY) => {
    console.log("################## babia ui2 -- createMetric  ##################");
    console.log("metric: " + metric);
    let entity = document.createElement('a-box')
    entity.property = property
    entity.metric = metric
    entity.classList.add("babiaxraycasterclass")
    entity.setAttribute('position', { x: positionX, y: positionY, z: 0 })
    entity.setAttribute('rotation', { x: 0, y: 0, z: 0 })
    entity.setAttribute('height', 0.8)
    entity.setAttribute('width', 3)
    entity.setAttribute('depth', 0.01)

    let text = document.createElement('a-entity')
    text.setAttribute('text', {
        'value': metric,
        'align': 'center',
        'width': '10',
        'color': 'black'
    })
    text.setAttribute('position', "0 0 0.01")
    entity.appendChild(text)

    if (self.targetComponent.data[property] == metric) {
        entity.setAttribute('color', '#555555')
    }

    selection_events(entity, self.targetComponent, false)

    return entity
}

let selection_events = (entity, visualizer, isData) => {
    console.log("################## babia ui2 -- selection_events  ##################");
    console.dir("entity.from: " + entity.from);
    console.dir("visualizer.data.from: " + visualizer.data.from);

    entity.addEventListener('mouseenter', function () {
        entity.children[0].setAttribute('text', { color: '#FFFFFF' })
        entity.setAttribute('color', '#333333')
    });

    if (isData) {
        console.log("################## babia ui2 -- selection_events 1  ##################");
        entity.addEventListener('mouseleave', function () {
            entity.children[0].setAttribute('text', { color: 'black' })
            if (visualizer.data.from == entity.from) {
                entity.setAttribute('color', '#555555')
            } else if (visualizer.data.from == "" || visualizer.data.from != entity.from) {
                entity.setAttribute('color', '#FFFFFF')
            }
        });
    } else {
        console.log("################## babia ui2 -- selection_events 2  ##################");
        entity.addEventListener('mouseleave', function () {
            entity.children[0].setAttribute('text', { color: 'black' })
            if (visualizer.data[entity.property] == entity.metric) {
                entity.setAttribute('color', '#555555')
            } else {
                entity.setAttribute('color', '#FFFFFF')
            }
        });
    }

    entity.addEventListener('click', function () {
        // Change parameters
        if (entity.property && entity.metric) {
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
            visualizer.el.setAttribute(visualizer.attrName, "from", entity.from)
        } else if (entity.nodes) {
            visualizer.el.setAttribute(visualizer.attrName, 'nodesFrom', entity.nodes)
        } else if (entity.links) {
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
    entity.setAttribute('color', 'black')
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
        entity.setAttribute('color', '#555555')
    } else {
        entity.setAttribute('color', '#FFFFFF')
    }

    selection_events(entity, self.targetComponent, true)

    return entity
}


