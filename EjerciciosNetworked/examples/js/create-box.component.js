

//LOGICA Colores
console.log("************** logica colores 1")
var gblColoresAleatoriosPares = [];
var gblColoresOriginal = ['green', 'red', 'blue', 'pink', 'white', 'orange'];
gblColoresOriginal = gblColoresOriginal.concat(gblColoresOriginal);
while (gblColoresOriginal.length > 0) {
    // Obtener un índice aleatorio del array original
    var indiceAleatorio = Math.floor(Math.random() * gblColoresOriginal.length);
    // Extraer el elemento del array original y agregarlo al nuevo array
    gblColoresAleatoriosPares.push(gblColoresOriginal.splice(indiceAleatorio, 1)[0]);
}
console.table(gblColoresAleatoriosPares);

//LOGICA clicks
var gblClicks = 0;
var entidadActualPrimerClick; 
var entidadNuevaPrimerClick; 




//FUNCIONES
function obtenerColorAleatorio() {
    //console.log("************** funcion");
    return gblColoresAleatoriosPares.shift();
}



//COMPONENTE
AFRAME.registerComponent('create-box', {
    schema: {
        colorEntidadNueva: { type: 'string', default: "obtenerColorAleatorio()" }
    },
  
    init: function () {
        console.log("################## create-box -- INIT  ##################");
        this.colorEntidadNueva = obtenerColorAleatorio();
        //console.log("################## create-box -- colorEntidadNueva  ################## ", this.colorEntidadNueva);
    },

    update: function () {
        //console.log("################## create-box -- UPDATE  ##################");
    },

    events: {
        click: function (evt) {
            if (gblClicks < 2) {
                console.log("################## create-box -- Evento CLICK  ##################");
                var entidadActual = this.el;
                //console.log(entidadActual.getAttribute('material').color);
                var entidadNueva = document.createElement('a-entity');
                entidadNueva.setAttribute('position', entidadActual.getAttribute('position'));
                //entidadNueva.setAttribute('mixin', "objectRayEventos");
                //entidadNueva.setAttribute('class', 'objectRay');
                entidadNueva.setAttribute('material', 'color', this.colorEntidadNueva);
                entidadNueva.setAttribute('networked', 'template:#boxMemoria-template');

                var scene = entidadActual.sceneEl;
                entidadActual.setAttribute('visible', 'false');
                scene.appendChild(entidadNueva);

                if(gblClicks === 0){
                    console.log("################## create-box -- 1` Click  ##################");
                    entidadActualPrimerClick = entidadActual;
                    entidadNuevaPrimerClick = entidadNueva;            
                }else{
                    console.log("################## create-box -- 2` Click  ##################");

                    setTimeout(function() {
                        console.log("################## create-box -- 3 segundos  ##################");
                        if(entidadNuevaPrimerClick.getAttribute('material').color === entidadNueva.getAttribute('material').color){
                            console.log("################## create-box -- colores iguales  ##################");
                            scene.removeChild(entidadActual);
                            scene.removeChild(entidadActualPrimerClick);
                        }else{
                            console.log("################## create-box -- colores distintos  ##################");
                            scene.removeChild(entidadNueva);
                            scene.removeChild(entidadNuevaPrimerClick);

                            entidadActual.setAttribute('visible', 'true');
                            entidadActualPrimerClick.setAttribute('visible', 'true');
                        }
                        gblClicks = 0;
                    }, 5000); 
                }
                gblClicks++;
            }
        }
    },

});
