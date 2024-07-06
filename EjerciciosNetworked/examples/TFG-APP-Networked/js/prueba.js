
AFRAME.registerComponent('prueba', {
  init: function () {
    console.log("################## PRUEBA INIT ");
  },

  update: function () {
    //console.log("################## events-object-configuration UPDATE ");
  },

  events: {
    click: function (evt) {
      console.log("################## PRUEBA-- Evento CLICK  ##################");
    }
  },
});