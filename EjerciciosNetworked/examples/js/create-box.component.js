

AFRAME.registerComponent('create-box', {

    init: function () {
        console.log("################## create-box -- INIT  ##################");
    },

    update: function () {
        //console.log("################## create-box -- UPDATE  ##################");
    },

    events: {
        click: function (evt) {
            console.log("################## create-box -- CLICK  ##################");
            var el = document.createElement('a-entity');
            el.setAttribute('position', this.el.getAttribute('position'));
            el.setAttribute('mixin', "objectRayEventos");
            el.setAttribute('class', 'objectRay');
            el.setAttribute('material', 'color', obtenerColorAleatorio());
            el.setAttribute('networked', 'template:#boxMemoria-template');
            var scene = this.el.sceneEl;
            scene.removeChild(this.el);
            scene.appendChild(el);
        }
    },

});


//LOGICA

var coloresAleatoriosPares = [];
var colores = ['green', 'red', 'blue', 'pink', 'white', 'orange'];
colores = colores.concat(colores);
while (colores.length > 0) {
    // Obtener un índice aleatorio del array original
    var indiceAleatorio = Math.floor(Math.random() * colores.length);
    // Extraer el elemento del array original y agregarlo al nuevo array
    coloresAleatoriosPares.push(colores.splice(indiceAleatorio, 1)[0]);
}
console.log(coloresAleatoriosPares);

function obtenerColorAleatorio() {
    return coloresAleatoriosPares.shift();
}