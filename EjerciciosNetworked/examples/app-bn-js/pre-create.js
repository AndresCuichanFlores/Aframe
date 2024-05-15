


AFRAME.registerComponent('pre-create', {

    init: function () {
      console.log("################## INIT pre-create");
    },

    update: function () {
      console.log("################## UPDATE pre-create");
    },

    events: {
      click: function (evt) {
        console.log("################## click pre-create");
        NAF.utils.takeOwnership(this.el);

        var scene = this.el.sceneEl;
        scene.removeChild(this.el);

        let entityCreate = document.createElement('a-entity');
        entityCreate.setAttribute('id', 'createUI');
        entityCreate.setAttribute('networked', {'template': '#create-ui-template', 'networkId': 'createui'});
        entityCreate.setAttribute('create-ui', '');
        scene.appendChild(entityCreate);
      }
    }
  });