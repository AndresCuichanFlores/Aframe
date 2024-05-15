
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

  if (!NAF.schemas.hasTemplate('#icon-create-template')) {
    NAF.schemas.add({
      template: '#icon-create-template',
      components: [
        'position',
        'rotation',
        'animation'
      ]
    });
  }

  if (!NAF.schemas.hasTemplate('#field-template')) {
    NAF.schemas.add({
      template: '#field-template',
      components: [
        'position',
        'animation',
        {
          selector: '.field-plane',
          component: 'visible'
        },
        {
          selector: '.field-plane',
          component: 'material',
          property: 'color'
        },  
        {
          selector: '.field-plane-image',
          component: 'material',
          property: 'src'
        },  
      ]
    });
  }

  if (!NAF.schemas.hasTemplate('#field-plane-image-template')) {
    NAF.schemas.add({
      template: '#field-plane-image-template',
      components: [
        'position',
        {
          component: 'material',
          property: 'color'
        },
      ]
    });
  }

  const components = NAF.schemas.getComponentsOriginal(template);
  return components;
};