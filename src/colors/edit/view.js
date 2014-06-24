var Backbone = require('backbone');
var _ = require('underscore');
var Syphon = require('backbone.syphon');
var Marionette = require('backbone.marionette');
var template = require('./template.hbs');

module.exports = Marionette.ItemView.extend({
  template: template,
  className: 'colors container',

  templateHelpers: function() {
    return {
      errors: this.model.validationError,
      serverError: this.model.serverError
    };
  },

  events: {
    'submit .colors__form' : 'handleSubmit'
  },

  modelEvents: {
    'all': 'render'
  },

  initialize: function (options) {
    _.bindAll(this, 'handleSaveSuccess');
    this.model = options.model;
    this.model.cleanup();
  },

  onDomRefresh: function () {
    Syphon.deserialize(this, this.model.attributes);
  },

  handleSubmit: function (event) {
    event.preventDefault();

    var data = Syphon.serialize(this);
    this.model.set(data);

    if (this.model.isValid()) {
      this.handleValid();
    }
  },

  handleValid: function () {
    this.model.save().done(this.handleSaveSuccess);
  },

  handleSaveSuccess: function() {
    Backbone.history.navigate('colors/' + this.model.id, { trigger: true });
  }
});
