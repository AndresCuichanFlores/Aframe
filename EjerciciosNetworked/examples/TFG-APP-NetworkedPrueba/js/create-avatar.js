import * as CONSTANTS from './constants.js';

AFRAME.registerComponent('create-avatar', {
  init: function () {
    console.log("################## create-avatar INIT ");
    const models = ['groot.glb', 'unicornio.glb', 'ditto.glb', 'dragon.glb', 'playerVR.glb', 'plane.glb'];
    const randomIndex = Math.floor(Math.random() * models.length);
    const randomModel = models[randomIndex];
    let scene = this.el.sceneEl;

    let entityRig = document.createElement('a-entity');
    entityRig.setAttribute('networked', 'template', '#auxInit-template');
    entityRig.setAttribute('id', 'rig-player');
    entityRig.setAttribute('movement-controls', 'fly', 'true');
    entityRig.setAttribute('spawn-in-circle', 'radius', '8');

    let entityAvatar = document.createElement('a-entity');
    entityAvatar.setAttribute('networked', 'template', '#auxInit-template');
    entityAvatar.setAttribute('id', 'player');
    entityAvatar.setAttribute('camera', '');
    entityAvatar.setAttribute('look-controls', '');

    let entityCursor = document.createElement('a-entity');
    entityCursor.setAttribute('cursor', 'rayOrigin', 'mouse');

    let entityAvatarGLB = this.addModelGLB(randomModel);
    let entityAvatarTitle = this.addTitleModelGLB(randomModel);

    entityAvatar.appendChild(entityAvatarTitle);
    entityAvatar.appendChild(entityAvatarGLB);
    entityRig.appendChild(entityCursor);
    entityRig.appendChild(entityAvatar);
    scene.appendChild(entityRig);
  },

  update: function () {
    //console.log("################## create-avatar UPDATE ");
  },

  addModelGLB: function (randomModel) {
    let entityAvatarGLB = document.createElement('a-entity');
    entityAvatarGLB.setAttribute('networked', 'template', '#avatar-user-template');
    entityAvatarGLB.setAttribute('animation-mixer', '',);
    entityAvatarGLB.setAttribute('visible', 'false');
    entityAvatarGLB.setAttribute('gltf-model', '3Dmodels/' + randomModel);

    if (randomModel === 'groot.glb') {
      entityAvatarGLB.setAttribute('rotation', '0 180 0');
      entityAvatarGLB.setAttribute('scale', '1 1 1');
      entityAvatarGLB.setAttribute('position', '0 -2 0.85');
    } else if (randomModel === 'unicornio.glb') {
      entityAvatarGLB.setAttribute('rotation', '0 180 0');
      entityAvatarGLB.setAttribute('scale', '0.03 0.03 0.03');
      entityAvatarGLB.setAttribute('position', '0 -2.8 1.5');
    } else if (randomModel === 'ditto.glb') {
      entityAvatarGLB.setAttribute('rotation', '0 180 0');
      entityAvatarGLB.setAttribute('scale', '1 1 1');
      entityAvatarGLB.setAttribute('position', '0 -1.7 1.3');
    } else if (randomModel === 'dragon.glb') {
      entityAvatarGLB.setAttribute('rotation', '0 90 0');
      entityAvatarGLB.setAttribute('scale', '0.01 0.01 0.01');
      entityAvatarGLB.setAttribute('position', '0 -0.88 1.8');
    } else if (randomModel === 'playerVR.glb') {
      entityAvatarGLB.setAttribute('rotation', '0 180 0');
      entityAvatarGLB.setAttribute('scale', '0.7 0.7 0.7');
      entityAvatarGLB.setAttribute('position', '0 -2.2 1.8');
    } else if (randomModel === 'plane.glb') {
      entityAvatarGLB.setAttribute('rotation', '0 180 0');
      entityAvatarGLB.setAttribute('scale', '4 4 4');
      entityAvatarGLB.setAttribute('position', '0 -0.87 2.6');
    }
    return entityAvatarGLB;
  },

  addTitleModelGLB: function (randomModel) {
    let nameUser = 'user-' + Math.round(Math.random() * 10000);
    let entityTtile = document.createElement('a-entity');
    entityTtile.setAttribute('networked', 'template:#textInit-template');
    entityTtile.setAttribute('scale', '20 20 20');
    entityTtile.setAttribute('rotation', '0 180 0');
    entityTtile.setAttribute('text', {
      'value': nameUser,
      'align': 'center',
      'side': 'double',
      'color': '#fd0000',
      'shader': 'msdf',
      'font': 'https://raw.githubusercontent.com/etiennepinchon/aframe-fonts/master/fonts/bangers/Bangers-Regular.json'
    });

    if (randomModel === 'groot.glb') {
      entityTtile.setAttribute('position', { x: 0, y: 1, z: 0.57 });
    } else if (randomModel === 'unicornio.glb') {
      entityTtile.setAttribute('position', { x: 0, y: 0.65, z: 1.2 });
    } else if (randomModel === 'ditto.glb') {
      entityTtile.setAttribute('position', { x: 0, y: 0.9, z: 1.27 });
    } else if (randomModel === 'dragon.glb') {
      entityTtile.setAttribute('position', { x: 0, y: 0.86, z: 0.76 });
    } else if (randomModel === 'playerVR.glb') {
      entityTtile.setAttribute('position', { x: 0, y: 1.2, z: 1.58 });
    } else if (randomModel === 'plane.glb') {
      entityTtile.setAttribute('position', { x: 0, y: 1.6, z: 2.2 });
    }

    return entityTtile;
  },
});
