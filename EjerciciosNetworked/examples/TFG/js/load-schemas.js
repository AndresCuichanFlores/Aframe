
NAF.schemas.getComponentsOriginal = NAF.schemas.getComponents;
NAF.schemas.getComponents = (template) => {
  if (!NAF.schemas.hasTemplate('#platoInit-template')) {
    NAF.schemas.add({
      template: '#platoInit-template',
      components: [
        'position',
        'rotation',
        'scale',
        'geometry',
        'animation',
        'component-synchronize',
        'material',
      ]
    });
  }

  if (!NAF.schemas.hasTemplate('#objectInit-template')) {
    NAF.schemas.add({
      template: '#objectInit-template',
      components: [
        'position',
        'rotation',
        'scale',
        'gltf-model',
        'animation',
        'component-synchronize',
        'babia-queryjson',
        'babia-querycsv',
        'babia-filter',
        'look-at',
        'id',
      ]
    });
  }

  if (!NAF.schemas.hasTemplate('#textInit-template')) {
    NAF.schemas.add({
      template: '#textInit-template',
      components: [
        'position',
        'rotation',
        'scale',
        'text',
        'look-at'
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

  if (!NAF.schemas.hasTemplate('#avatar-user-template')) {
    NAF.schemas.add({
      template: '#avatar-user-template',
      components: [
        'position',
        'rotation',
        'scale',
        'gltf-model',
        'animation-mixer',

      ]
    });
  }

  if (!NAF.schemas.hasTemplate('#panelInformation-template')) {
    NAF.schemas.add({
      template: '#panelInformation-template',
      components: [
        'position',
        'rotation',
        'geometry',
        'material',
        'text',
        'look-at'
      ]
    });
  }

  const components = NAF.schemas.getComponentsOriginal(template);
  return components;
};