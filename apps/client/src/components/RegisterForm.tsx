import { useEffect, useState } from "react";
import { ApiResponse, Event } from "../types";
import { API_URL } from "../constants";
import { ErrorUI } from "./ErrorUI";
import GoBackHomeButton from "./GoBackHomeButton";
import { useNavigate } from "react-router-dom";

export default function RegisterForm() {
  const navigate = useNavigate();

  const [ event, setEvent ] = useState<Event | null>(null);
  const eventId = window.location.pathname.split('/').at(-1);
  const [ isInitialLoading, setIsInitialLoading ] = useState<boolean>(true);
  
  const [ fullName, setFullName ] = useState<string | undefined>(undefined);
  const [ email, setEmail ] = useState<string | undefined>(undefined);
  const [ dateOfBirth, setDateOfBirth ] = useState<Date | undefined>(undefined);
  const [ heardFrom, setHeardFrom ] = useState<string | undefined>(undefined);
  const [ invalidInputMessage, setInvalidInputMessage ] = useState<string | null>(null);
  const [ isLoading, setIsLoading ] = useState<boolean>(false);
  const [ error, setError ] = useState<string | string[] | null>(null);

  const inputStyle = 'rounded p-1 border-2';
  const rangeContainerStyles = 'flex flex-row gap-1';

  useEffect(() => {
    async function fetchEvent() {
      setIsInitialLoading(true);

      const response = await fetch(`${API_URL}/event/${eventId}`, { method: 'GET' });
      const { data, error }: ApiResponse<Event> = await response.json();

      if (error) {
        setError(error.message);
      } else {
        setEvent(data);
      }

      setIsInitialLoading(false);
    }

    fetchEvent();
  }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setInvalidInputMessage(null);

    if (event === null || isLoading) return;

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
      console.log(dateOfBirth, new Date())
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
      navigate('/event/' + event.id);
    }
    setIsLoading(false);
  }

  return (
    <div className="max-w-screen-md my-0 mx-auto pt-5">
      {isInitialLoading ? (
        <p>Loading...</p>
      ) : (
        (error || !event) ? (
          <ErrorUI error={error || 'something went wrong'}/>
        ) : (
          <div className="flex flex-col gap-8 max-w-screen-md">
            <div className="flex flex-row justify-between">
              <GoBackHomeButton/>
              <h2 className="text-center text-lg font-bold">Register for "{event.title}" event</h2>
              <div></div>
            </div>
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

              <div className="col-span-2 flex justify-center py-10">
                <input type="submit" className="leading-4 p-2 hover:bg-slate-100 rounded-lg"/>
              </div>
            </form>
          </div>
        )
      )}
    </div>
  )
}
