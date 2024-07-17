
NAF.schemas.getComponentsOriginal = NAF.schemas.getComponents;
NAF.schemas.getComponents = (template) => {
  if (!NAF.schemas.hasTemplate('#platoInit-template')) {
    NAF.schemas.add({
      template: '#platoInit-template',
      components: [
        'position',
        'geometry',
        'scale',
        'animation',
        'remove-component',
        {
          component: 'material',
          property: 'color'
        },
        {
          component: 'material',
          property: 'opacity'
        }
      ]
    });
  }

  if (!NAF.schemas.hasTemplate('#objectInit-template')) {
    NAF.schemas.add({
      template: '#objectInit-template',
      components: [
        'position',
        'gltf-model',
        'scale',
        'animation',
        'object3d-material',
        'remove-component',
        'babia-queryjson',
        'babia-querycsv',
        'babia-filter',
        'id'
      ]
    });
  }

  if (!NAF.schemas.hasTemplate('#textInit-template')) {
    NAF.schemas.add({
      template: '#textInit-template',
      components: [
        'position',
        'text',
        'scale',
      ]
    });
  }

  if (!NAF.schemas.hasTemplate('#graphInit-template')) {
    NAF.schemas.add({
      template: '#graphInit-template',
      components: [
        'position',
        'rotation',
        'scale',
        'babia-pie',
        'babia-doughnut',
      ]
    });
  }

  if (!NAF.schemas.hasTemplate('#avatar-man-template')) {
    NAF.schemas.add({
      template: '#avatar-man-template',
      components: [
        'position',
        'gltf-model',
        'scale',
        'animation-mixer',
        'rotation',
      ]
    });
  }

  const components = NAF.schemas.getComponentsOriginal(template);
  return components;
};