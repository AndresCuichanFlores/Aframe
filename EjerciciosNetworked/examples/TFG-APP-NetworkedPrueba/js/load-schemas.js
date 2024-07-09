

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
        {
          component: 'material',
          property: 'color'
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

  const components = NAF.schemas.getComponentsOriginal(template);
  return components;
};