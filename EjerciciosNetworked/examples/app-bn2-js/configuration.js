
AFRAME.registerComponent('configuration', {

    init: function () {
        console.log("################## tree-menu INIT ");

    },

    update: function () {
        console.log("################## tree-menu UPDATE ");
        
    },


    dashboard: {
        queryes: ['json', 'csv', 'elastic'],
        graphs: ['pie', 'bars', 'cyls', 'doughnut'],
        filters: []
    },

    createMenu: function (objects, speedCreationDisco, positionX, positionY, positionZ) {
        console.log("################## tree-menu createMenu   ##################");


    },

});
