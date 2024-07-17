
AFRAME.registerComponent('prueba', {
  init: function () {
    console.log("################## PRUEBA INIT ");
    let self = this;
    let scene = self.el.sceneEl;

    let entityRig = document.createElement('a-entity');
    entityRig.setAttribute('networked', 'template', '#auxInit-template');
    entityRig.setAttribute('id', 'rig-player');
    entityRig.setAttribute('movement-controls', 'fly', 'true');

    let entityAvatar = document.createElement('a-entity');
    entityAvatar.setAttribute('networked', 'template', '#auxInit-template');
    entityAvatar.setAttribute('id', 'player');
    entityAvatar.setAttribute('camera', '');
    entityAvatar.setAttribute('position', '0 2 2');
    entityAvatar.setAttribute('look-controls', '');
    entityAvatar.setAttribute('visible', 'false');

    let entityAvatarGLB = document.createElement('a-entity');
    entityAvatarGLB.setAttribute('networked', 'template', '#avatar-man-template');
    entityAvatarGLB.setAttribute('gltf-model', '3Dmodels/ditto.glb');
    entityAvatarGLB.setAttribute('animation-mixer', '',);
    entityAvatarGLB.setAttribute('rotation', '0 180 0');
    entityAvatarGLB.setAttribute('scale', '1 1 1');

    let entityCursor = document.createElement('a-entity');
    entityCursor.setAttribute('cursor', 'rayOrigin', 'mouse');

    entityAvatar.appendChild(entityCursor);
    entityAvatar.appendChild(entityAvatarGLB);
    entityRig.appendChild(entityAvatar);
    scene.appendChild(entityRig);
  },

  update: function () {
    //console.log("################## events-object-configuration UPDATE ");
  },


});