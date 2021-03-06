cdb.admin.mod.TorqueWizard = cdb.admin.mod.SimpleWizard.extend({

  MODULES: [],
  events: {
    'click .to_the_top': 'moveToFront'
  },

  LAYER_PROPS: ['property', 
    'torque-duration',
    'torque-frame-count',
    'torque-blend-mode',
    'torque-trails',
    'torque-is-time'
  ],

  error_msg: {
    NO_CONTENT_MSG: _t('There are no numeric or date columns on your table to make an animated visualization.<br/>If you have numbers on your table, but you don\'t see them here is likely they are set as String.'),
    LAYER_ON_TOP: _t('Animated layers should be on top of the visualiation.'),
    ONLY_ONE_TORQUE_LAYER: _t('Sorry, but for the moment only one Torque layer is allowed per visualization.')
  },

  initialize: function() {
    this.type = 'torque';
    this.layer_type = 'torque';
    cdb.admin.mod.SimpleWizard.prototype.initialize.call(this);
  },

  validColumns: function() {
    return this.options.table.columnNamesByType('number').concat(
      this.options.table.columnNamesByType('date')
    );
  },

  isLayerOnTop: function() {
    var collection = this.options.layer.collection;
    return collection.last().cid === this.options.layer.cid;
  },

  moveToFront: function(e) {
    if (e) e.preventDefault();
    this.options.layer.moveToFront();
    this.applyWizard();
  },

  torqueLayersCount: function() {
    return this.options.layer.collection.getLayersByType('torque').length;
  },

  getTorqueLayer: function() {
    return this.options.layer.collection.getLayersByType('torque')[0];
  },

  isValid: function() {
    // check if the layer is on top and there are numeric columns
    return this.validColumns().length > 0 && 
           this.isLayerOnTop() && 
           (this.torqueLayersCount() === 0 || (
              this.torqueLayersCount() === 1 && this.getTorqueLayer().cid === this.options.layer.cid)
           )
  },

  render: function() {
    if(this.isValid()) {
      cdb.admin.mod.SimpleWizard.prototype.render.call(this);
    } else {
      if (this.torqueLayersCount() !== 0) {
        this.renderError(this.error_msg.ONLY_ONE_TORQUE_LAYER);
      }
      else if (!this.isLayerOnTop()) {
        this.renderError(this.error_msg.LAYER_ON_TOP);
        $(this.$('.wrapper .no_content')[0]).append(' Please <a href="#/move" class="to_the_top">move it to the top</a>.');
      } else {
        this.renderError(this.error_msg.NO_CONTENT_MSG);
      }
    }
    return this;
  },


});


