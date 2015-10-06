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
    getInitialState: function() {
      return {visible: false};
    },

    toggleHide: function() {
      this.setState({visible: !this.state.visible});
    },

    render: function () {
      return (
        <div>
          <div onClick={this.toggleHide}>{this.props.todoItem.title}</div>
          <root.DoneButton item={this.props.todoItem}/>
          <root.TodoDetailView visible={this.state.visible} item={this.props.todoItem}/>
        </div>
      );
    },
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

  root.TodoDetailView = React.createClass({
    render: function () {
      if (this.props.visible) {
        return (
          <div>
            <button onClick={this.handleDestroy}>Delete</button>
            <div>{this.props.item.body}</div>
          </div>
        );
      } else {
        return <div></div>;
      }
    },

    handleDestroy: function () {
      root.TodoStore.destroy(this.props.item.id);
    }
  });
  // $(React.render(<TodoList/>, document.getElementById("TodoList")));
}(this));
