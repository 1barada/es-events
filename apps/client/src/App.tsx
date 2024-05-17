import EventsBoard from "./components/EventsBoard"
import EventInfo from "./components/EventInfo";
import RegisterForm from "./components/RegisterForm";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className="w-full min-h-full mx-auto my-0 flex justify-center items-center">
      <div className="max-w-screen-xl w-full">
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<EventsBoard/>}/>
            <Route path='/event/:id' element={<EventInfo/>}/>
            <Route path='/event/register/:id' element={<RegisterForm/>}/>
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  )
}

export default App
