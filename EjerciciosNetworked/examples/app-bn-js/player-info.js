
AFRAME.registerComponent('player-info', {
    schema: {
      name: { type: 'string', default: 'User-' + Math.round(Math.random() * 1000) },
      message: { type: 'string', default: '' }
    },

    init: function () {
      console.log("################## INIT player-info");
      this.nametag = this.el.querySelector('.nametag');
      this.ownedByLocalUser = this.el.id === 'player';
      if (this.ownedByLocalUser) {
        this.nametagInput = document.getElementById('username-overlay');
        this.nametagInput.value = this.data.name;
      }
    },

    update: function () {
      console.log("################## UPDATE player-info");
      if (this.nametag) {
        this.nametag.setAttribute('value', this.data.name);
      }
    }
});