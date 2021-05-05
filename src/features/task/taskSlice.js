import { createSlice } from "@reduxjs/toolkit";
import { db } from "../../utils/firebase";

export const taskSlice = createSlice({
  name: "task",
  initialState: {
    lists: null,
    selectedList: null,
    tasks: [],
  },

  reducers: {
    addList: (state, action) => {
      state.lists.push(action.payload);
    },
    removeList: (state) => {
      state.lists = null;
    },
    selectedList: (state, action) => {
      state.selectedList = action.payload;
    },
    setTasks: (state, action) => {
      state.tasks = action.payload;
    },
    addTask: (state, action) => {
      state.tasks.push(action.payload);
    },
  },
});

export const {
  addList,
  removeList,
  selectedList,
  addTask,
  setTasks,
} = taskSlice.actions;
export const selectTaskLists = (state) => state.task.lists;
export const selectSelectedList = (state) => state.task.selectedList;
export const selectTasks = (state) => state.task.tasks;

export const getTasksByListId = (listId) => (dispatch) => {
  db.collection(`todo/${listId}/tasks`)
    .orderBy("timeStamp", "asc")
    .get()
    .then((snapshot) => {
      if (snapshot.docs.length > 0) {
        const tasks = snapshot.docs.map((doc) => {
          return {
            id: doc.id,
            name: doc.data().name,
            timeStamp: doc.data().timeStamp.toDate().getTime(),
            isCompleted: doc.data().isCompleted,
          };
        });
        dispatch(setTasks(tasks));
      } else {
        dispatch(setTasks([]));
      }
    });
};

export const toggleTaskCompleted = (taskId) => (dispatch, getState) => {
  const tasks = selectTasks(getState());
  const newTasks = tasks.map((task) => {
    if (task.id === taskId) {
      return {
        ...task,
        isCompleted: !task.isCompleted,
      };
    }
    return task;
  });
  dispatch(setTasks(newTasks));
};

export default taskSlice.reducer;
