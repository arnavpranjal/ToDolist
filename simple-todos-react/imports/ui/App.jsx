import React, { Fragment }  from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { TasksCollection } from '/imports/api/TasksCollection';
import { Task } from './Task';
import { TaskForm } from './TaskForm';
import { useState } from 'react';
import { LoginForm } from './LoginForm';

export const App = () => {
  const [hideCompleted, setHideCompleted] = useState(false);
  const user = useTracker(() => Meteor.user());
  console.log(user);
  const hideCompletedFilter = { isChecked: { $ne: true } };
  const userFilter = user ? { userId: user._id } : {};
  const pendingOnlyFilter = { ...hideCompletedFilter, ...userFilter };

  const tasks = useTracker(() => {
  if (!user) {
    return [];
  }
  return TasksCollection.find(
    hideCompleted ? pendingOnlyFilter : userFilter,
    {
      sort: { createdAt: -1 },
    }
  ).fetch();
    
});
  const pendingTasksCount = useTracker(() => {
    if (!user) {
      return 0;
    }
  TasksCollection.find(hideCompletedFilter).count()
  });

const pendingTasksTitle = `${
  pendingTasksCount ? ` (${pendingTasksCount})` : ''
}`;
  const toggleChecked = ({ _id, isChecked }) => {
    TasksCollection.update(_id, {
      $set: {
        isChecked: !isChecked
      }
    })};

   deleteTask = ({ _id }) => TasksCollection.remove(_id);
   const logout = () => Meteor.logout();
  return (
    <div className='app'>
      <header>
        <div className='app-bar'>
        <h1>📝️ To Do List</h1>
        {pendingTasksTitle}meteor add accounts-password

          <div className='app-header'>       
      <h1>Welcome to Meteor!</h1>
      </div>
        </div>
      </header>
      <div className="main">
        {user ? (
          <Fragment>
          <div className="user" onClick={logout}>
          {user.username || user.services.github.username} 🚪
      </div>
      <TaskForm user = {user}/>
      <div className="filter">
         <button onClick={() => setHideCompleted(!hideCompleted)}>
           {hideCompleted ? 'Show All' : 'Hide Completed'}
         </button>
       </div>
      <ul className="tasks">
        { tasks.map(task => <Task key={ task._id } task={ task }  onCheckboxClick={toggleChecked} onDeleteClick={deleteTask} / >)}
      </ul>
      </Fragment>) : (
        <LoginForm />
      )}

    </div>
    </div>
  );
}
