
AFRAME.registerComponent('object3d-material', {
  schema: {
    opacity: { type: 'string', default: '' },
  },

  init: function () {
    //console.log("################## object3d-material INIT ");
  },

  update: function () {
    //console.log("################## object3d-material UPDATE ");

    let self = this;
    this.el.object3D.traverse((value) => {
      if (value.type === 'Mesh') {
        const material = value.material;
        material.transparent = true;
        material.opacity = self.data.opacity;
      }
    })
  },

});