
AFRAME.registerComponent('remove-component', {
  schema: {
    component: { type: 'string', default: '' },
  },

  init: function () {
    console.log("################## remove-component INIT ");
  },

  update: function () {
    console.log("################## remove-component UPDATE ");

    this.el.removeAttribute(this.data.component);
  },

});