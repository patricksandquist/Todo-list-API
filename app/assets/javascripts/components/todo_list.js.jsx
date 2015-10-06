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
        </div>
      );
    }
  });

  // $(React.render(<TodoList/>, document.getElementById("TodoList")));
}(this));
