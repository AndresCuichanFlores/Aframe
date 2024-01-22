/* global AFRAME, NAF */
AFRAME.registerComponent('color-changer', {
  events: {
    click: function (evt) {
      console.log("CLICKKKKKKKKKKKKKKKKK")
      this.el.setAttribute('material', { color: this.getRandomColor() });
      NAF.utils.takeOwnership(this.el);

      /*
      this.el.setAttribute('animation', { 
        property: 'position',
        to: '-8 1 -12',
        loop: 4,
        dur: 4000,
        easing: 'linear',
        dir: 'alternate' 
      });
      */

    }
  },

  getRandomColor: function() {
    return `hsl(${Math.random() * 360}, 100%, 50%)`;
  }
});
