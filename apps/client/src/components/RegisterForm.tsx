import { useState } from "react";
import { ApiResponse, Event } from "../types";
import { API_URL } from "../constants";

interface RegisterFormProps {
  event: Event;
  close: () => void;
}

export default function RegisterForm({ event, close }: RegisterFormProps) {
  const [ fullName, setFullName ] = useState<string | undefined>(undefined);
  const [ email, setEmail ] = useState<string | undefined>(undefined);
  const [ dateOfBirth, setDateOfBirth ] = useState<Date | undefined>(undefined);
  const [ heardFrom, setHeardFrom ] = useState<string | undefined>(undefined);
  const [ invalidInputMessage, setInvalidInputMessage ] = useState<string | null>(null);
  const [ isLoading, setIsLoading ] = useState<boolean>(false);

  const inputStyle = 'rounded p-1 border-2';
  const rangeContainerStyles = 'flex flex-row gap-1';

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!fullName || !email || !dateOfBirth || !heardFrom) {
      setInvalidInputMessage('All fields are required');
      return;
    }

    if (fullName.length < 1 || fullName.length > 20) {
      setInvalidInputMessage('Full name must be at least 1 character and less 21 characters');
      return;
    }

    if (!email.match(/.+@.+\..+/gm)) {
      setInvalidInputMessage('Invalid email format');
      return;
    }

    if (dateOfBirth > new Date()) {
      setInvalidInputMessage('Invalid date of birth date');
      return;
    }

    setIsLoading(true);
    const response = await fetch(`${API_URL}/participant`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify({
        eventId: event.id,
        fullName,
        email,
        dateOfBirth,
        heardFrom
      })
    })

    const { error }: ApiResponse<null> = await response.json();

    if (error) {
      setInvalidInputMessage(typeof error.message === 'string' ? error.message : error.message.join('. '));
    } else {
      close();
    }
    setIsLoading(false);
  }

  return (
    <div className="flex flex-col gap-8">
      <h2 className="text-center text-lg">Register for "{event.title}" event</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <label htmlFor="fullName">Full name</label>
        <input className={inputStyle} type="text" id='fullName' onChange={(e) => setFullName(e.target.value)}/>

        <label htmlFor="email">Email</label>
        <input className={inputStyle} type="text" id='email' onChange={(e) => setEmail(e.target.value)}/>

        <label htmlFor="dateOfBirth">Date of birth</label>
        <input className={inputStyle} type="date" id='dateOfBirth' onChange={(e) => setDateOfBirth(new Date(e.target.value))}/>

        
        <p>Where did you hear about this event?</p>
        <div className='col-span-2 flex flex-row justify-between'>
          <div className={rangeContainerStyles}>
            <input type="radio" id="social media" name="heardFrom" value="social media" onChange={(e) => setHeardFrom(e.target.value)}/>
            <label htmlFor="social media">Social media</label>
          </div>
          <div className={rangeContainerStyles}>
            <input type="radio" id="friends" name="heardFrom" value="friends" onChange={(e) => setHeardFrom(e.target.value)}/>
            <label htmlFor="friends">Friends</label>
          </div>
          <div className={rangeContainerStyles}>
            <input type="radio" id="found myself" name="heardFrom" value="found myself" onChange={(e) => setHeardFrom(e.target.value)}/>
            <label htmlFor="found myself">Found myself</label>
          </div>
        </div>

        <div className="col-span-2 flex justify-center">
          {isLoading ? (
            <p className="">Loading...</p>
          ) : (
            <p className="text-red-500">{invalidInputMessage}</p>
          )}
        </div>

        <div className="col-span-2 flex justify-center">
          <input type="submit" className="leading-4 p-2 hover:bg-slate-100 rounded-lg"/>
        </div>
      </form>
    </div>
  )
}
