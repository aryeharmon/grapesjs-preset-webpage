import {
  cmdImport,
  cmdDeviceDesktop,
  cmdDeviceTablet,
  cmdDeviceMobile,
  cmdClear
} from './../consts';

export default (editor, config) => {
  const pn = editor.Panels;
  const eConfig = editor.getConfig();
  const crc = 'create-comp';
  const mvc = 'move-comp';
  const swv = 'sw-visibility';
  const expt = 'export-template';
  const osm = 'open-sm';
  const otm = 'open-tm';
  const ola = 'open-layers';
  const obl = 'open-blocks';
  const ful = 'fullscreen';
  const prv = 'preview';

  eConfig.showDevices = 0;

  pn.getPanels().reset([{
    id: 'commands',
    buttons: [{}],
  },{
    id: 'options',
    buttons: [{
      id: swv,
      command: swv,
      context: swv,
      className: 'fa fa-square-o',
    },{
      id: prv,
      context: prv,
      command: e => e.runCommand(prv),
      className: 'fa fa-eye',
    },{
      id: ful,
      command: ful,
      context: ful,
      className: 'fa fa-arrows-alt',
    },{
      id: expt,
      className: 'fa fa-code',
      command: e => e.runCommand(expt),
    },{
      id: 'save',
      className: 'fa fa-floppy-o',
      command: function() {

        var data = {
          css: editor.getCss(),
          html: editor.getHtml(),
          editor_settings: editor_settings,
          _id: window.page ? window.page._id : 'ggggggg',
        }

        window.$.ajax({
          type: "POST",
          url: base_url + '/storage/html',
          data: data,
          success: function(data) {
            window.toastr.success('saved template.');
          },
          dataType: 'json'
        });

      },
    },{
      id: 'hard-save',
      className: 'fa fa-hdd-o',
      command: function() {

        var name = prompt("Enter a revision name", "");

        var data = {
          css: editor.getCss(),
          html: editor.getHtml(),
          editor_settings: editor_settings,
          name: name,
          hard: 1,
          _id: window.page ? window.page._id : 'ggggggg',
        }

        window.$.ajax({
          type: "POST",
          url: base_url + '/storage/html',
          data: data,
          success: function(data) {
            window.toastr.success('saved template.');
          },
          dataType: 'json'
        });

      },
    },{
      id: 'color',
      className: 'fa fa-eyedropper',
      command: e => e.runCommand('maincolor'),
    },{
      id: 'undo',
      className: 'fa fa-undo',
      command: e => e.runCommand('core:undo'),
    },{
      id: 'redo',
      className: 'fa fa-repeat',
      command: e => e.runCommand('core:redo'),
    },{
      id: cmdImport,
      className: 'fa fa-download',
      command: e => e.runCommand(cmdImport),
    },{
      id: cmdClear,
      className: 'fa fa-trash',
      command: e => e.runCommand(cmdClear),
    },{
      id: 'allow_input_layout',
      className: 'fa fa-map-pin updateable-button',
      command: function() {
        window.allow_input_layout = !window.allow_input_layout;

        if (window.allow_input_layout) {
          window.toastr.success('Allow updateable enabled.');
          $('.updateable-button').css('color', 'red');
        } else {
          window.toastr.warning('Allow updateable disabled.');
          $('.updateable-button').css('color', 'inherit');
        }
      },
    }],
  },{
    id: 'views',
    buttons  : [{
      id: osm,
      command: osm,
      className: 'fa fa-paint-brush',
    },{
      id: otm,
      command: otm,
      className: 'fa fa-cog',
    },{
      id: ola,
      command: ola,
      className: 'fa fa-bars',
    },{
      id: obl,
      active: true,
      command: obl,
      className: 'fa fa-th-large',
    }],
  }]);

  // Add devices buttons
  const panelDevices = pn.addPanel({id: 'devices-c'});
  panelDevices.get('buttons').add([{
    id: cmdDeviceDesktop,
    command: cmdDeviceDesktop,
    className: 'fa fa-desktop',
    active: 1,
  },{
    id: cmdDeviceTablet,
    command: cmdDeviceTablet,
    className: 'fa fa-tablet',
  },{
    id: cmdDeviceMobile,
    command: cmdDeviceMobile,
    className: 'fa fa-mobile',
  }]);

  // On component change show the Style Manager
  config.showStylesOnChange && editor.on('component:selected', () => {
    const openLayersBtn = pn.getButton('views', ola);

    // Don't switch when the Layer Manager is on or
    // there is no selected component
    if ((!openLayersBtn || !openLayersBtn.get('active')) && editor.getSelected()) {
      const openSmBtn = pn.getButton('views', osm);
      openSmBtn && openSmBtn.set('active', 1);
    }
  });
}
