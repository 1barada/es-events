import { useState } from "react"
import EventsBoard from "./components/EventsBoard"
import ModalWrapper from "./components/ModalWrapper";
import EventInfo from "./components/EventInfo";
import { Event } from "./types";
import RegisterForm from "./components/RegisterForm";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  const [ event, setEvent ] = useState<Event | undefined>(undefined);
  
  const [ isRegisterModalOpen, setIsRegisterModalOpen ] = useState<boolean>(false);

  function openRegisterModal(event: Event) {
    setEvent(event);
    setIsRegisterModalOpen(true);
  }

  return (
    <div className="w-full min-h-full mx-auto my-0 flex justify-center items-center">
      <div className="max-w-screen-xl w-full">
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<EventsBoard registerHandler={openRegisterModal}/>}/>
            <Route path='/event/:id' element={<EventInfo/>}/>
          </Routes>
        </BrowserRouter>
        <ModalWrapper 
          isOpen={isRegisterModalOpen} 
          close={() => setIsRegisterModalOpen(false)}
          disableGlobalScroll={true}
        >
          {event && <RegisterForm event={event} close={() => setIsRegisterModalOpen(false)}/>}
        </ModalWrapper>
      </div>
    </div>
  )
}

export default App
