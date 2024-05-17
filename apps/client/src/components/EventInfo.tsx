import { useCallback, useEffect, useState } from "react";
import { ApiResponse, EventActivity, Participant } from "../types";
import { Event } from "../types";
import { ErrorUI } from "./ErrorUI";
import { API_URL } from "../constants";
import { VictoryChart, VictoryLine } from "victory";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

export default function EventInfo() {
  const eventId = window.location.pathname.split('/').at(-1);
  const navigate = useNavigate();
  const [ search, setSearch ] = useState<string | undefined>(undefined);
  const [ event, setEvent ] = useState<Event | null>(null);
  const [ isLoading, setIsLoading ] = useState<boolean>(true);
  const [ error, setError ] = useState<string | string[] | null>(null);

  useEffect(() => {
    async function fetchEvent() {
      setIsLoading(true);

      const response = await fetch(`${API_URL}/event/${eventId}`, {
        method: 'GET'
      });

      const { data, error }: ApiResponse<Event> = await response.json();

      if (error) {
        setError(error.message);
      } else {
        setEvent(data);
      }

      setIsLoading(false);
    }

    fetchEvent();
  }, []);

  return (
    <div className="pt-6">
      {(isLoading || !event) ? (
        <p>Loading...</p>
      ) : (
        error ? (
          <ErrorUI error={error}/>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex flex-row justify-between">
              <button 
                className="w-8 h-8 hover:bg-slate-100 p-1 rounded-full flex justify-center items-center"
                title='go back home'
                onClick={() => navigate('/')}
              >
                <IoArrowBack className="leading-3"/>
              </button>
              <h1 className="text-2xl font-semibold">{`"${event.title}" event participants`}</h1>
              <div className="">
                <input 
                  className="border-2 px-2 py-1 rounded text-base"
                  type="text" 
                  placeholder="search email of fullname"
                  onChange={(e) => setSearch(e.target.value)}
                  value={search}
                />
              </div>
            </div>
            <div className="grid grid-cols-[7fr_3fr] gap-8">
              <ParticipantsBoard eventId={event.id} search={search}/>
              <EventActivityDisplay eventId={event.id}/>
            </div>
          </div>
        )
      )}
    </div>
  )
}

function ParticipantsBoard({ eventId, search }: { eventId: string; search: string | undefined; }) {
  const [ participants, setParticipants ] = useState<Participant[]>([]);
  const [ isLoading, setIsLoading ] = useState<boolean>(true);
  const [ error, setError ] = useState<string | string[] | null>(null);

  const fetchParticipants = useCallback(async () => {
    const params = new URLSearchParams();
    if (search) params.append('search', search)

    const response = await fetch(`${API_URL}/participant/${eventId}?${params.toString()}`, {
      method: "GET"
    });

    const { data, error: fetchError }: ApiResponse<Participant[]> = await response.json();

    if (fetchError) setError(fetchError.message);
    else setParticipants(data);

    setIsLoading(false);
  }, [search, eventId]);

  useEffect(() => {
    fetchParticipants();
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const delayDebounceFn = setTimeout(() => {
      fetchParticipants();
    }, 500);

    return () => clearTimeout(delayDebounceFn)
  }, [search])

  return (
    <div className="grid grid-cols-3 gap-4 max-h-[500px] overflow-y-auto ">
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        error ? (
          <ErrorUI error={error}/>
        ) : (
          participants.length === 0 ? (
            <p>no participants</p>
          ) : (
            participants.map((participant) => 
              <div key={participant.id} className="flex flex-col gap-4 rounded border-2 p-2 max-h-24">
                <div className="text-lg font-semibold">{participant.fullName}</div>
                <div className="text-sm">{participant.email}</div>
              </div>
            )
          )
        )
      )}
    </div>
  );
}

function EventActivityDisplay({ eventId }: { eventId: string }) {
  const [ activity, setActivity ] = useState<EventActivity>({});
  const [ isLoading, setIsLoading ] = useState<boolean>(true);
  const [ error, setError ] = useState<string | string[] | null>(null);

  const [ week, setWeek ] = useState<string[]>([]);
  const [ chartData, setChartData ] = useState<{x: number, y: number}[]>([]);

  useEffect(() => {
    const date = new Date();
    const dayOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    let week: string[] = [];
    for (let i = 0; i < 7; i++) {
      const day = date.getDay() + (i + 1);
      week.push(dayOfWeek[day > 6 ? day - 7 : day]);
    }
    let data: {x: number, y: number}[] = [];
    for (let i = 1; i <= 7; i++) {
      const day = date.getDay() + i;
      data.push({x: i, y: activity[day > 6 ? day - 7 : day] || 0})
    }
    
    setWeek(week);
    setChartData(data);
  }, [activity])

  useEffect(() => {
    async function fetchEventActivity() {
      const response = await fetch(`${API_URL}/event/activity/${eventId}`, {
        method: "GET"
      });

      const { data, error: fetchError }: ApiResponse<EventActivity> = await response.json();

      if (fetchError) setError(fetchError.message);
      else setActivity(data);

      setIsLoading(false);
    }

    fetchEventActivity();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center">
      <h3>Last 7 days activity</h3>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        error ? (
          <ErrorUI error={error}/>
        ) : (
          Object.keys(activity).length === 0 ? (
            <p>no data</p>
          ) : (
            <div>
              <VictoryChart>
                <VictoryLine
                  style={{
                    data: { stroke: "#c43a31" },
                    parent: { border: "1px solid #ccc"}
                  }}
                  data={chartData}
                  categories={{ x: week }}
                />
              </VictoryChart>
            </div>
          )
        )
      )}
    </div>
  );
}