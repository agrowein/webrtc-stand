import React from 'react';
import {RouterProvider} from "react-router";
import router from "./router";
import VideoChatComponent from "./features/VideChat";

function App() {
  return (
   <>
     <VideoChatComponent />
   </>
  );
}

export default App;
