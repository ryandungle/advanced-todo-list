import React, { useEffect, useState } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import {
  selectedList,
  selectSelectedList,
  addTask,
  selectTasks,
  setTasks,
} from "../../features/task/taskSlice";
import { db, getCurrentTimestamp } from "../../utils/firebase";
import InputForm from "../InputForm";
import Task from "./Task";

export default function ListContent() {
  const list = useSelector(selectSelectedList);
  const tasks = useSelector(selectTasks);
  const [remainingTasks, setRemainingTasks] = useState(0);

  useEffect(() => {
    setRemainingTasks(tasks?.filter((task) => !task.isCompleted));
  }, [tasks]);

  const dispatch = useDispatch();

  function handleDelete() {
    db.collection("/todo")
      .doc(list.id)
      .delete()
      .then(() => {
        console.log("delete sucessfully");
      })
      .catch((err) => console.log(err));
    dispatch(selectedList(null));
  }
  function createNewTask(taskName) {
    db.collection(`todo/${list.id}/tasks`)
      .add({
        name: taskName,
        timeStamp: getCurrentTimestamp(),
      })
      .then((taskRef) => {
        dispatch(addTask({ name: taskName, id: taskRef.id }));
      })
      .catch((err) => console.log(err));
  }

  function handleClearCompleted() {
    const completedTasks = tasks?.filter((task) => task.isCompleted);
    if (completedTasks.length > 0) {
      completedTasks.forEach((task) => {
        db.doc(`todo/${list.id}/tasks/${task.id}`)
          .delete()
          .then(() => {
            dispatch(setTasks(remainingTasks));
          });
      });
    }
  }
  return (
    <TodoContainer>
      <TodoHeader>
        <h2>{list?.name}</h2>
        <p>{remainingTasks?.length} task(s) remaining</p>
      </TodoHeader>
      <TodoBody>
        {tasks?.map((task) => (
          <Task
            key={task.id}
            taskName={task.name}
            taskId={task.id}
            isCompleted={task.isCompleted}
          />
        ))}
        <NewTaskCreator>
          <InputForm
            fieldName="new task name"
            label="create new task"
            submitForm={createNewTask}
          />
        </NewTaskCreator>
      </TodoBody>
      <TodoFooter>
        <button onClick={handleClearCompleted}>Clear completed tasks</button>
        <button onClick={handleDelete}>Delete list</button>
      </TodoFooter>
    </TodoContainer>
  );
}

const TodoContainer = styled.div`
  --spacer: 2rem;
  position: relative;
  grid-area: active;
  background: var(--clr-light);
  color: var(--clr-dark);
`;
const TodoHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #e4e4e4;
  padding: var(--spacer);
  > h2 {
    margin: 0 1em 0 0;
  }
  > p {
    margin: 0;
    font-size: 1rem;
  }
`;
const TodoBody = styled.div`
  padding: var(--spacer);
`;

const TodoFooter = styled.div`
  display: flex;
  justify-content: space-evenly;
  position: absolute;
  width: 100%;
  left: 0;
  bottom: -35px;
  color: var(--clr-light);

  > button {
    cursor: pointer;
    background: 0;
    border: 0;
    padding: 0;
    color: inherit;
    opacity: 0.8;
    font-size: 1rem;
  }
  > button:hover {
    color: var(--clr-warning);
  }
`;
const NewTaskCreator = styled.div``;
