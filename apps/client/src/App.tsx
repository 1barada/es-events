import { useState } from "react"
import EventsBoard from "./components/EventsBoard"
import ModalWrapper from "./components/ModalWrapper";
import EventInfo from "./components/EventInfo";
import { Event } from "./types";
import RegisterForm from "./components/RegisterForm";

function App() {
  const [ event, setEvent ] = useState<Event | undefined>(undefined);
  
  const [ isEventInfoModalOpen, setIsEventInfoModalOpen ] = useState<boolean>(false);
  const [ isRegisterModalOpen, setIsRegisterModalOpen ] = useState<boolean>(false);

  function openEventInfoModal(event: Event) {
    setEvent(event);
    setIsEventInfoModalOpen(true);
  }

  function openRegisterModal(event: Event) {
    setEvent(event);
    setIsRegisterModalOpen(true);
  }

  return (
    <div className="w-full min-h-full flex justify-center items-center">
      <EventsBoard registerHandler={openRegisterModal} viewHandler={openEventInfoModal}/>

      <ModalWrapper 
        isOpen={isEventInfoModalOpen} 
        close={() => setIsEventInfoModalOpen(false)}
        disableGlobalScroll={true}
      >
        {event && <EventInfo event={event}/>}
      </ModalWrapper>

      <ModalWrapper 
        isOpen={isRegisterModalOpen} 
        close={() => setIsRegisterModalOpen(false)}
        disableGlobalScroll={true}
      >
        {event && <RegisterForm event={event} close={() => setIsRegisterModalOpen(false)}/>}
      </ModalWrapper>
    </div>
  )
}

export default App
