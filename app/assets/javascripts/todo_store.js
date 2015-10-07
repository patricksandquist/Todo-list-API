(function(root) {
  'use strict';
  var _todos = [];
  var _callbacks = [];

  root.TodoStore = {
    changed: function() {
      _callbacks.forEach(function(callback) {
        callback();
      });
    },

    addChangedHandler: function(callback) {
      _callbacks.push(callback);
    },

    removeChangedHandler: function(callback) {
      var index = _callbacks.indexOf(callback);
      if (index !== -1) {
        _callbacks = _callbacks.splice(index, 1);
      }
    },

    all: function() {
        return _todos.slice();
    },

    fetch: function() {
      $.getJSON('/api/todos', function(todos) {
        _todos = todos;
        root.TodoStore.changed();
      });
    },

    create: function(todo) {
      $.post('/api/todos', {todo: todo}, function(response){
        _todos.push(response);
        root.TodoStore.changed();
      }).fail(function(response) {
        alert(response.responseJSON);
      });
    },

    find: function(id) {
      var foundIdx = -1;
      _todos.forEach(function(todo, idx){
        if(id === todo.id) {
          foundIdx = idx;
        }
      });
        return foundIdx;
    },

    destroy: function(id) {
      var idx = this.find(id);
      var todo = _todos[idx];
      if(idx !== -1){
        $.ajax({
          url: 'api/todos/' + id,
          type: 'delete',
          data: {todo: todo},
          success: function(){
            _todos.splice(idx, 1);
            root.TodoStore.changed();
          }
        }).fail(function(response) {
          alert(response.responseJSON);
        });
      }
    },

    toggleDone: function(id) {
      var idx = this.find(id);
      var todo = _todos[idx];
      todo.done = !todo.done;
      if (idx !== -1) {
        $.ajax({
          url: 'api/todos/' + id,
          type: 'patch',
          data: {todo: todo},
          success: function(){
            _todos[idx] = todo;
            root.TodoStore.changed();
          }
        });
      }
    }
  };

}(this));
