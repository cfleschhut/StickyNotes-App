// Settings

_.templateSettings = {
  interpolate: /\{\{(.+?)\}\}/g
};


// Models

var Note = Backbone.Model.extend({
  // defaults: {
  //   id: null,
  //   title: null,
  //   created_at: null,
  //   updated_at: null
  // }
});


// Collections

var NoteList = Backbone.Collection.extend({
  model: Note,
  url: 'api/notes'

  // comparator: function(note) {
  //   return -note.get('id');
  // }
});


$(document).ready(function() {

  // Views

  var NoteView = Backbone.View.extend({
    tagName: 'li',
    className: 'note',
    template: _.template($('#template-note').html()),
    events: {
      'click .note-permalink': 'navigate'
    },
    initialize: function() {
      this.model.on('change', this.render, this);
      this.model.on('destroy', this.remove, this);
    },
    render: function() {
      this.$el.html(this.template(this.model.attributes));
      this.updateTime(this.$el.find('time'));
      return this;
    },
    remove: function() {
      this.$el.remove();
    },
    navigate: function(ev) {
      ev.preventDefault();
      Backbone.history.navigate($(ev.target).attr('href'), {
        trigger: true
      });
    },
    updateTime: function(time) {
      var element = time,
        datetime = element.attr('datetime');
      var update = function() {
        var new_value = moment(datetime).fromNow();
        console.log(new_value);
        element.html(new_value);
      };
      update();
      setInterval(update, 1000);
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

      var newNoteForm = this.$el.find('#note-new');
      if(newNoteForm.length) {
        newNoteForm.after(noteView.render().el);
        return;
      }
      this.$el.prepend(noteView.render().el);
    }
  });


  var NoteFormView = Backbone.View.extend({
    tagName: 'li',
    attributes: {
      class: 'note',
      id: 'note-new'
    },
    template: _.template($('#template-new-note').html()),
    events: {
      'keyup textarea': 'validateTextarea',
      'submit form': 'createNote'
    },
    submitBtn: null,
    render: function() {
      this.$el.html(this.template());
      return this;
    },
    validateTextarea: function(ev) {
      var textarea = ev.target;
      this.submitBtn = this.$el.find('input[type=submit]');

      if(!textarea.value.match(/^\s*$/)) {
        this.submitBtnEnable();
      } else {
        this.submitBtnDisable();
      }
    },
    submitBtnEnable: function() {
      this.submitBtn
        .prop('disabled', false)
        .removeClass('button-disabled');
    },
    submitBtnDisable: function() {
      this.submitBtn
        .prop('disabled', true)
        .addClass('button-disabled');
    },
    resetForm: function() {
      $('#note-new form')[0].reset();
      this.submitBtnDisable();
    },
    createNote: function(ev) {
      ev.preventDefault();
      var that = this,
        attributes = {
          title: $(ev.target).find('textarea').val()
        };
      this.collection.create(attributes, {
        wait: true,
        success: function() {
          console.log('success');
          that.resetForm();
        },
        error: function() {
          console.log('error');
        }
      });
    }
  });


  // Router

  var App = Backbone.Router.extend({
    routes: {
      '': 'index',
      'notes/:id': 'show'
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

      var formView = new NoteFormView({
        collection: this.notes
      });
      $('.notes').prepend(formView.render().el);
    },

    show: function(id) {
      console.log('route: show');

      var view = new NoteView({
        tagName: 'div',
        model: this.notes.get(id)
      });
      $('#notes').html(view.render().el);
    }
  });


  window.app = new App();
  Backbone.history.start({
    pushState: true
  });

});
