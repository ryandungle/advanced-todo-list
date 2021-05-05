import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import {
  addList,
  getTasksByListId,
  selectedList,
} from "../../features/task/taskSlice";

import InputForm from "../InputForm";
import TodoList from "./TodoList";
import { db, getCurrentTimestamp } from "../../utils/firebase";
import { useCollectionData } from "react-firebase-hooks/firestore";

function saveSelectedList(listId, listName) {
  const currentList = {
    id: listId,
    name: listName,
  };

  localStorage.setItem("currentList", JSON.stringify(currentList));
}

export default function SideMenu() {
  const [lists] = useCollectionData(
    db.collection("todo").orderBy("timeStamp", "asc"),
    {
      idField: "id",
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );
  const dispatch = useDispatch();
  const [activeListId, setActiveListId] = useState("");

  useEffect(() => {
    const currentListString = localStorage.getItem("currentList");
    if (currentListString) {
      setActiveListId(JSON.parse(currentListString).id);
    }
  }, []);

  function handleSubmit(listName) {
    db.collection("/todo")
      .add({
        name: listName,
        timeStamp: getCurrentTimestamp(),
      })
      .then((listRef) => {
        dispatch(addList({ name: listName, id: listRef.id }));
      })
      .catch((err) => console.log(err));
  }
  function handleActive(listId, name) {
    setActiveListId(listId);
    saveSelectedList(listId, name);
    dispatch(selectedList({ id: listId, name }));
    dispatch(getTasksByListId(listId));
  }

  return (
    <SideMenuContainer>
      <h2>My Lists</h2>
      <ul>
        {lists?.map((list, index) => (
          <TodoList
            key={index}
            name={list.name}
            id={list.id}
            active={activeListId === list.id}
            onClick={handleActive}
          />
        ))}
      </ul>

      <InputForm
        fieldName="new list name"
        label="create new list"
        variant="list"
        submitForm={handleSubmit}
      />
    </SideMenuContainer>
  );
}

const SideMenuContainer = styled.div`
  grid-area: lists;
  > ul {
    line-height: 1.7;
    font-size: 1.2rem;
    list-style: circle;
    padding-left: 1.1em;
  }
`;
