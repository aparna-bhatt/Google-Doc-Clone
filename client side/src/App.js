import React from 'react'
import TextEditor from './TextEditor'
import "./styles.css";
import{BrowserRouter as Router ,Routes,Route} from "react-router-dom";

import { Navigate } from 'react-router-dom';
import {v4 as uuidV4} from 'uuid';

const App = () => {
  return (
   
    <Router>
      <Routes>
      <Route path="/" exact element={<Navigate to={`/document/${uuidV4()}`} />}>
      </Route>
      <Route path="/document/:id"  element={<TextEditor />}>
      </Route>
      </Routes>
    </Router>
   
  )
}

export default App
