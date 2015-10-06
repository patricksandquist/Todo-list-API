/* global React */
(function(root) {
  'use strict';

  root.TodoList = React.createClass({
    getInitialState: function () {
      return {todoList: []};
    },

    componentDidMount: function () {
      root.TodoStore.addChangedHandler(this.updateToDoList);
      root.TodoStore.fetch();
    },

    render: function () {
      return (
        <div>
          {this.state.todoList.map(function(todoItem) {
            return <root.TodoListItem todoItem={todoItem} key={todoItem.id}/>;
          })}
          <root.TodoForm/>
        </div>
      );
    },

    updateToDoList: function () {
      this.setState({todoList: root.TodoStore.all()});
    },

    componentWillUnmount: function () {
      root.TodoStore.removeChangedHandler(this.updateToDoList);
    }
  });

  root.TodoListItem = React.createClass({
    render: function () {
      return (
        <div>
          <div>{this.props.todoItem.title}</div>
          <div>{this.props.todoItem.body}</div>
          <button onClick={this.handleDestroy}>Delete</button>
          <root.DoneButton item={this.props.todoItem}/>
        </div>
      );
    },

    handleDestroy: function () {
      root.TodoStore.destroy(this.props.todoItem.id);
    }
  });

  root.TodoForm = React.createClass({
    // mixins: [React.addons.LinkedStateMixin],

    getInitialState: function() {
      return {title: "", body: ""};
    },

    createTodo: function(e) {
      e.preventDefault();
      var todoObject = {title: this.state.title, body: this.state.body};
      root.TodoStore.create(todoObject);
      this.setState({title: "", body: ""});
    },

    handleTitleChange: function(e) {
      this.setState({title: e.target.value});
    },

    handleBodyChange: function(e) {
      this.setState({body: e.target.value});
    },

    render: function () {
      return (
        <form onSubmit={this.createTodo}>
          <input type='text' value={this.state.title} onChange={this.handleTitleChange}></input>
          <input type='text' value={this.state.body} onChange={this.handleBodyChange}></input>
          <input type='submit' value='Create todo!'></input>
        </form>
      );
    }
  });

  root.DoneButton = React.createClass({
    render: function() {
      var done = (this.props.item.done ? "Undo" : "Done");
      return <button onClick={this.handleDone}>{done}</button>;
    },

    handleDone: function() {
      root.TodoStore.toggleDone(this.props.item.id);
    }
  });
  // $(React.render(<TodoList/>, document.getElementById("TodoList")));
}(this));
