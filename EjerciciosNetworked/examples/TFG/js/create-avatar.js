import * as CONSTANTS from './constants.js';

AFRAME.registerComponent('create-avatar', {
  init: function () {
    console.log("################## create-avatar INIT ");
    const models = ['groot.glb', 'ditto.glb', 'playerVR.glb', 'plane.glb'];
    const randomIndex = Math.floor(Math.random() * models.length);
    const randomModel = models[randomIndex];
    let scene = this.el.sceneEl;

    let entityRig = document.createElement('a-entity');
    entityRig.setAttribute('networked', 'template', '#auxInit-template');
    entityRig.setAttribute('id', 'rig-player');
    entityRig.setAttribute('movement-controls', 'fly', 'true');
    entityRig.setAttribute('spawn-in-circle', 'radius', '15');

    let entityAvatar = document.createElement('a-entity');
    entityAvatar.setAttribute('networked', 'template', '#auxInit-template');
    entityAvatar.setAttribute('id', 'player');
    entityAvatar.setAttribute('camera', '');
    entityAvatar.setAttribute('look-controls', '');

    let entityCursor = document.createElement('a-entity');
    entityCursor.setAttribute('cursor', 'rayOrigin', 'mouse');

    let entityAvatarGLB = this.addModelGLB(randomModel);
    let entityAvatarTitle = this.addTitleModelGLB(randomModel);

    //MANDO right OCULUSTS 
    let entityOculutsRight = document.createElement('a-entity');
    entityOculutsRight.setAttribute('oculus-touch-controls', 'hand', 'right');
    entityOculutsRight.setAttribute('laser-controls', 'hand', 'right');
    entityOculutsRight.setAttribute('raycaster', {
      'showLine': 'true',
      'objects': '.objectRayCaster, .babiaxraycasterclass',
    });
    entityOculutsRight.setAttribute('super-hands', {
      'colliderEvent': 'raycaster-intersection',
      'colliderEndEvent': 'raycaster-intersection-cleared',
      'colliderEventProperty': 'els',
      'colliderEndEventProperty': 'clearedEls',
    })

    //MANDO Left OCULUSTS 
    let entityOculutsLeft = document.createElement('a-entity');
    entityOculutsLeft.setAttribute('oculus-touch-controls', 'hand', 'left');
    entityOculutsLeft.setAttribute('laser-controls', 'hand', 'left');
    entityOculutsLeft.setAttribute('raycaster', {
      'showLine': 'true',
      'objects': '.objectRayCaster, .babiaxraycasterclass',
    });
    entityOculutsLeft.setAttribute('super-hands', {
      'colliderEvent': 'raycaster-intersection',
      'colliderEndEvent': 'raycaster-intersection-cleared',
      'colliderEventProperty': 'els',
      'colliderEndEventProperty': 'clearedEls',
    })

    if (AFRAME.utils.device.isMobileVR()) {
      // Comportamiento específico para VR
      entityRig.appendChild(entityOculutsRight);
      entityRig.appendChild(entityOculutsLeft);
      document.querySelector('#entityEventsController').setAttribute('events-controller', 'activateController', 'true');
    } else {
      // Comportamiento específico para PC
      document.querySelector('#entityEventsController').setAttribute('events-controller', 'activateController', 'false');
    }

    //entityRig.appendChild(this.addPanelIntruc())

    entityAvatar.appendChild(entityAvatarTitle);
    entityAvatar.appendChild(entityAvatarGLB);
    entityRig.appendChild(entityCursor);
    entityRig.appendChild(entityAvatar);

    scene.appendChild(entityRig);
  },

  update: function () {
    //console.log("################## create-avatar UPDATE ");
  },

  addPanelIntruc: function () {
    let self = this;
    //PANEL DE INSTRUCCIONES
    let entitypanelinstrucciones = document.createElement('a-entity');
    entitypanelinstrucciones.setAttribute('id', 'panelInstrucciones');
    entitypanelinstrucciones.setAttribute('position', '0 1 -5.8');
    entitypanelinstrucciones.setAttribute('rotation', '0 0 0');
    entitypanelinstrucciones.setAttribute('geometry', {
      'primitive': 'plane',
      'width': '7.2',
      'height': '4',
    });
    entitypanelinstrucciones.setAttribute('material', {
      'src': 'assets/de1.png',
      'shader': 'flat',
    })

    //TITULO
    let entitypaneTitulo = document.createElement('a-entity');
    entitypaneTitulo.setAttribute('position', '0 1.117 0.06');
    entitypaneTitulo.setAttribute('text', {
      'value': 'INSTRUCTIONS',
      'width': '10',
      'align': 'center',
      'shader': 'msdf',
      'color': '#fff700',
      'font': 'https://raw.githubusercontent.com/etiennepinchon/aframe-fonts/master/fonts/playfairdisplay/PlayfairDisplay-Bold.json',
    });

    //Intrucciones
    let entityInstruc = document.createElement('a-entity');
    entityInstruc.setAttribute('position', '0 -0.293 0.06');
    entityInstruc.setAttribute('text', {
      'value': 'To create a user interface, hold down the B and Y buttons simultaneously on the VR controllers, or press the spacebar if you are on PC.\n\n To interact with the interface, use the triggers of VR controllers, or click the mouse if you are on PC.',
      'width': '6.5',
      'align': 'center',
      'shader': 'msdf',
      'wrapCount': '45',
      'color': '#00fffb',
      'font': 'https://raw.githubusercontent.com/etiennepinchon/aframe-fonts/master/fonts/handlee/Handlee-Regular.json',
    });

    //Icon check
    let entityCheck = document.createElement('a-entity');
    entityCheck.classList.add("objectRayCaster");
    entityCheck.setAttribute('gltf-model', '3Dmodels/Scene.glb');
    entityCheck.setAttribute('position', '0 -2.194 0');
    entityCheck.setAttribute('change-on-interact', '');

    entityCheck.addEventListener('click', function () {
      console.log("CLICK entityCheck Panel Intrucciones");
      if (!document.querySelector('#entityEventsController').getAttribute("events-controller").activateController || document.querySelector('#entityEventsController').getAttribute("events-controller").pressbuttonxa) {
        document.querySelector('#entityEventsController').setAttribute("events-controller", "pressbuttonxa", "false");

        entitypanelinstrucciones.remove();
      }
    });

    entityCheck.addEventListener('mouseenter', function () {
      this.object3D.traverse((value) => {
        if (value.type === 'Mesh') {
          const material = value.material;
          material.transparent = true;
          material.opacity = 0.5;
        }
      })

    });

    entityCheck.addEventListener('mouseleave', function () {
      this.object3D.traverse((value) => {
        if (value.type === 'Mesh') {
          const material = value.material;
          material.transparent = true;
          material.opacity = 1;
        }
      })
    });

    entitypanelinstrucciones.appendChild(entityCheck)
    entitypanelinstrucciones.appendChild(entityInstruc)
    entitypanelinstrucciones.appendChild(entitypaneTitulo)

    return entitypanelinstrucciones;
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
    entityTtile.setAttribute('id', 'nameAvatar');
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
