// Models

var Note = Backbone.Model.extend();


// Collections

var NoteList = Backbone.Collection.extend({
  model: Note,
  url: 'api/notes',

  comparator: function(note) {
    return -note.get('id');
  }
});


$(document).ready(function() {

  // Views

  var NoteView = Backbone.View.extend({
    tagName: 'li',
    className: 'note',
    template: _.template($('#template-note').html()),
    initialize: function() {
      this.model.on('change', this.render, this);
      this.model.on('destroy', this.remove, this);
    },
    render: function() {
      this.$el.html(this.template(this.model.attributes));
      return this;
    },
    remove: function() {
      this.$el.remove();
    }
  });


  var NotesView = Backbone.View.extend({
    tagName: 'ul',
    className: 'notes',
    initialize: function() {
      this.collection.on('add', this.addOne, this);
      this.collection.on('reset', this.render, this);
    },
    render: function() {
      // console.log(this.collection.length);
      this.collection.forEach(this.addOne, this);
      return this;
    },
    addOne: function(model) {
      var noteView = new NoteView({
        model: model
      });
      this.$el.append(noteView.render().el);
    }
  });


  var NoteFormView = Backbone.View.extend({
    tagName: 'li',
    attributes: {
      class: 'note'
    },
    events: {
      'submit form': 'createNote'
    },
    template: _.template($('#template-new-note').html()),
    render: function() {
      this.$el.html(this.template());
      return this;
    },
    createNote: function(ev) {
      ev.preventDefault();
      console.log(this);
    }
  });


  // Router

  var App = Backbone.Router.extend({
    routes: {
      '': 'index'
    },

    initialize: function() {
      console.log('route: init');

      this.notes = new NoteList();
      this.notes.reset($('#notes').data('notes'));
    },

    index: function() {
      console.log('route: index');

      this.notesView = new NotesView({
        collection: this.notes
      });
      $('#notes').html(this.notesView.render().el);

      var formView = new NoteFormView();
      $('.notes').append(formView.render().el);
    }
  });


  var app = new App();
  Backbone.history.start({
    pushState: true
  });

});
