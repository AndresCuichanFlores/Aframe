
AFRAME.registerComponent('create-ui', {

    init: function () {
      console.log("################## create-ui INIT");
      this.generateMainRow();
    },

    update: function () {
      console.log("################## create-ui UPDATE ");
    },

    mainRow: {
      queryes: "img/queryes.png",
      graphs: "img/graph.png",
      filters: "img/filters.png"
    },

    generateMainRow: function () {
      console.log("################## create-ui generateMainRow  ##################");
      let self = this;
      let keys = Object.keys(self.mainRow);
      let positionX = -3.5;

      keys.forEach(function (key) {
        createField(self.el, positionX, key, self.mainRow[key]);
        positionX += 3.5;
      });
    },
    
  });


  let createField = (parent, positionX, name, img) => {
    console.log("################## create-ui createRow  ##################");

    let entityfield = document.createElement('a-entity');
    entityfield.setAttribute('id', name);
    entityfield.classList.add("main-row");
    entityfield.setAttribute('networked', {'template': '#field-template', 'networkId': 'field-' + name});
    entityfield.setAttribute('position', { x: positionX, y: 6, z: -6 } );
    
    let entityChild = document.createElement('a-entity');
    entityChild.setAttribute('networked', {'template': '#field-plane-template', 'networkId': 'field-plane-' + name});
    entityfield.appendChild(entityChild);

    entityChild = document.createElement('a-entity');
    entityChild.setAttribute('networked', {'template': '#field-plane-image-template', 'networkId': 'field-plane-image-' + name});
    entityChild.setAttribute('material', 'src', img);
    entityfield.appendChild(entityChild);

    parent.appendChild(entityfield);
  };