

NAF.schemas.getComponentsOriginal = NAF.schemas.getComponents;
NAF.schemas.getComponents = (template) => {
  if (!NAF.schemas.hasTemplate('#avatar-man-template')) {
    NAF.schemas.add({
      template: '#avatar-man-template',
      components: [
        'position',
        'rotation',
        'player-info'
      ]
    });
  }
  if (!NAF.schemas.hasTemplate('#boxMemoria-template')) {
    NAF.schemas.add({
      template: '#boxMemoria-template',
      components: [
        'position',
        {
          component: 'material',
          property: 'color'
        }
      ]
    });
  }

  const components = NAF.schemas.getComponentsOriginal(template);
  return components;
};