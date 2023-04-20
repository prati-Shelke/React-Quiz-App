import React from "react";
import HomePage from "./components/HomePage";
import { BrowserRouter as Router, Route, Routes,Navigate} from 'react-router-dom';
import QuestionList from "./components/QuestionList"
import TestResult from "./components/TestResult"

function App()
{
  return(
    <Router>
        <Routes>

            <Route path="*" element={<Navigate to ="/InterviewPortal" />}/>
            <Route path="/InterviewPortal" element={<HomePage />} />
            <Route path="/questionList/:tid/:qid" element={<QuestionList/>} />
            <Route path="/TestResult" element={<TestResult/>} />
        </Routes>
      </Router>
  )
}

export default App;
