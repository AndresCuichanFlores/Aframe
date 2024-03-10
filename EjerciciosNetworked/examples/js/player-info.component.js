

AFRAME.registerComponent('player-info', {

  schema: {
      name: { type: 'string', default: 'User-' + Math.round(Math.random() * 1000) },
      message: { type: 'string', default: '' }
  },

  init: function () {
      console.log("################## player-info -- INIT  ##################");
      this.nametag = this.el.querySelector('.nametag');
      this.ownedByLocalUser = this.el.id === 'player';
      if (this.ownedByLocalUser) {
          this.nametagInput = document.getElementById('username-overlay');
          this.nametagInput.value = this.data.name;
      }
  },

  update: function () {
    console.log("################## player-info -- UPDATE  ##################");
      console.log('ID del cliente: ', NAF.clientId);
      if (this.nametag) {
          this.nametag.setAttribute('value', this.data.name);
      }
  }

});