import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import ListContent from "./components/AppBody/ListContent";
import SideMenu from "./components/SideMenu/SideMenu";
import {
  getTasksByListId,
  selectedList,
  selectSelectedList,
} from "./features/task/taskSlice";

function App() {
  const list = useSelector(selectSelectedList);
  const dispatch = useDispatch();
  useEffect(() => {
    const currentListString = localStorage.getItem("currentList");
    if (currentListString) {
      const currentList = JSON.parse(currentListString);
      dispatch(selectedList(currentList));
      dispatch(getTasksByListId(currentList.id));
    }
  }, []);
  return (
    <AppContainer>
      <h1>Stuff I need to do</h1>
      <SideMenu />
      {list && <ListContent />}
    </AppContainer>
  );
}

export default App;

const AppContainer = styled.div`
  display: grid;
  grid:
    "header header header header" auto
    "...... lists active ......." auto /
    1fr minmax(100px, 300px) minmax(250px, 500px) 1fr;
  > h1 {
    grid-area: header;
    text-align: center;
    font-size: calc(7vw + 2rem);
    font-weight: 900;
    color: rgba(0, 0, 0, 0.1);
    letter-spacing: 1px;
    margin: -0.15em 0 0 0.5em;
  }
`;
