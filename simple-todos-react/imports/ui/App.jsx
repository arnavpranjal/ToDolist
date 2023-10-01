import React  from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { TasksCollection } from '/imports/api/TasksCollection';
import { Task } from './Task';
import { TaskForm } from './TaskForm';
import { useState } from 'react';

export const App = () => {
  const [hideCompleted, setHideCompleted] = useState(false);
  const hideCompletedFilter = { isChecked: { $ne: true } };

  const tasks = useTracker(() =>
    TasksCollection.find(hideCompleted ? hideCompletedFilter : {}, {
      sort: { createdAt: -1 },
    }).fetch()
  );

  const toggleChecked = ({ _id, isChecked }) => {
    TasksCollection.update(_id, {
      $set: {
        isChecked: !isChecked
      }
    })};

  const deleteTask = ({ _id }) => TasksCollection.remove(_id);
  return (
    <div className='app'>
      <header>
        <div className='app-bar'>
        <h1>📝️ To Do List</h1>
  
          <div className='app-header'>       
      <h1>Welcome to Meteor!</h1>
      </div>
        </div>
      </header>
      <TaskForm />
      <div className="filter">
         <button onClick={() => setHideCompleted(!hideCompleted)}>
           {hideCompleted ? 'Show All' : 'Hide Completed'}
         </button>
       </div>
      <ul className="tasks">
        { tasks.map(task => <Task key={ task._id } task={ task }  onCheckboxClick={toggleChecked} onDeleteClick={deleteTask} / >)}
      </ul>
    </div>
  );
}
