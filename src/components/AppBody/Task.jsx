import React from "react";
import { useDispatch, useSelector } from "react-redux";

import styled from "styled-components";
import {
  selectSelectedList,
  toggleTaskCompleted,
} from "../../features/task/taskSlice";
import { db } from "../../utils/firebase";

export default function Task({ taskName, taskId, isCompleted }) {
  // const id = "id" + Math.round(Math.random() * 1000);
  const dispatch = useDispatch();
  const list = useSelector(selectSelectedList);
  function handleCheck(e) {
    db.doc(`todo/${list.id}/tasks/${e.target.id}`)
      .update({
        isCompleted: e.target.checked,
      })
      .then(() => {
        dispatch(toggleTaskCompleted(e.target.id));
      })
      .catch((err) => console.log(err));
  }
  return (
    <TaskContainer>
      <input
        type="checkbox"
        id={taskId}
        checked={isCompleted}
        onChange={handleCheck}
      />
      <label htmlFor={taskId}>
        <span></span>
        {taskName}
      </label>
    </TaskContainer>
  );
}

const TaskContainer = styled.div`
  --size: 0.75rem;
  position: relative;
  > input {
    opacity: 0;
    position: absolute;
  }
  > label > span {
    width: var(--size);
    height: var(--size);
    margin-right: var(--size);
    cursor: pointer;
    border: 2px solid currentColor;
    border-radius: 50%;
    transform: scale(1);
    transition: transform 300ms ease-in-out;
  }
  > label {
    display: inline-flex;
    align-items: center;
    position: relative;
    margin-bottom: 1.5em;
  }
  ::after {
    content: "";
    position: absolute;
    right: 0;
    left: 0;
    bottom: 20px;
    height: 1px;
    background: currentColor;
    opacity: 0.1;
  }
  :hover > label > span,
  > input:focus + label > span {
    // + sign to select sibling element so when focus on checkbox it will also do the transform
    transform: scale(1.2);
    color: var(--clr-primary);
  }

  > input:checked + label > span {
    background: var(--clr-primary);
    border-color: var(--clr-primary);
    box-shadow: inset 0 0 0 3px white;
  }

  > input:checked + label {
    opacity: 0.5;
  }

  > input + label:after {
    content: "";
    position: absolute;
    left: 1.5em;
    right: 0;
    height: 3px;
    background: currentColor;
    transform: scaleX(0);
    transform-origin: right;
    transition: transform 300ms ease-in-out;
  }

  > input:checked + label::after {
    transform: scaleX(1);
    transform-origin: left;
  }
`;
