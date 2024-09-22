
AFRAME.registerComponent('component-synchronize', {
  schema: {
    componentShare: { type: 'string', default: '' },
    valueShare: { type: 'string', default: '' },
  },

  init: function () {
    //console.log("################## object3d-material INIT ");
  },

  update: function () {
    //console.log("################## object3d-material UPDATE ");
    let self = this;

    if (self.data.componentShare == 'opacity') {
      self.el.object3D.traverse((value) => {
        if (value.type === 'Mesh') {
          const material = value.material;
          material.transparent = true;
          material.opacity = self.data.valueShare;
        }
      })

    } else if (self.data.componentShare == 'remove') {
      self.el.removeAttribute(self.data.valueShare);
    }

  },

});