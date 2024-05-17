import { useCallback, useEffect, useState } from "react"
import { ApiResponse, Event } from "../types";
import { API_URL, BOARD_ITEMS_ROW } from "../constants";
import EventBoardCell from "./EventBoardCell";
import { ErrorUI } from "./ErrorUI";

export default function EventsBoard() {
  const [ events, setEvents ] = useState<Event[]>([]);
  const [ error, setError ] = useState<string | string[] | null>(null);
  const [ isLoading, setIsLoading ] = useState<boolean>(true);

  const [ skip, setSkip ] = useState<number>(0);
  const [ total, setTotal ] = useState<number>(0);

  const [ sortBy, setSortBy ] = useState<string | null>(null);
  const [ isSortDesc, setIsSortDesc ] = useState<boolean>(true);

  const fetchMoreEvents = useCallback(async () => {
    if (isLoading || skip >= total) return;
    
    setIsLoading(true);

    const params = new URLSearchParams({
      skip: skip.toString(),
      take: (BOARD_ITEMS_ROW * 2).toString() 
    });
    if (sortBy !== null) params.append('sortBy', sortBy);
    if (isSortDesc) params.append('desc', 'true');

    const response = await fetch(`${API_URL}/event?${params.toString()}`, {
      method: "GET"
    });

    const { data, error }: ApiResponse<{total: number, events: Event[]}> = await response.json();

    if (error) {
      setError(error.message);
    } else {
      setSkip((value) => value + (BOARD_ITEMS_ROW * 2));
      setEvents((prev) => [...prev, ...data.events.map((event) => ({ ...event, date: new Date(event.date) }))]);
      setTotal(data.total);
    }

    setIsLoading(false);
  }, [skip, isLoading, sortBy, isSortDesc]);

  useEffect(() => {
    setSkip(0);
    async function fetchEvents() {
      setIsLoading(true);
      const params = new URLSearchParams({ take: (BOARD_ITEMS_ROW * 5).toString() });
      if (sortBy !== null) params.append('sortBy', sortBy);
      if (isSortDesc) params.append('desc', 'true');

      const response = await fetch(`${API_URL}/event?${params.toString()}`, {
        method: "GET"
      });

      const { data, error }: ApiResponse<{total: number, events: Event[]}> = await response.json();

      if (error) {
        setError(error.message);
      } else {
        setEvents(data.events.map((event) => ({ ...event, date: new Date(event.date) })));
        setSkip(BOARD_ITEMS_ROW * 5);
        setTotal(data.total);
      }

      setIsLoading(false);
    }

    fetchEvents();
  }, [sortBy, isSortDesc]);

  useEffect(() => {
    function handleScroll() {
      const { scrollTop, clientHeight, scrollHeight } =
        document.documentElement;
      if (scrollTop + clientHeight >= scrollHeight - 20) {
        fetchMoreEvents();
      }
    }
    
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [fetchMoreEvents]);

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex flex-row justify-between">
        <h1 className="text-2xl">Events</h1>
        <div className="flex flex-row gap-2 items-center">
          <h3>Sort by:</h3>
          <select 
            className="border-2 rounded p-1" 
            name="sortBy" 
            id="sortBy" 
            defaultValue='none'
            onChange={(e) => setSortBy(e.target.value === 'none' ? null : e.target.value)}
          >
            <option value='none'>none</option>
            <option value='title'>title</option>
            <option value='date'>date</option>
            <option value='organizer'>organizer</option>
          </select>
          <select 
            className="border-2 rounded p-1" 
            name="desc" 
            id="desc" 
            defaultValue='desc'
            onChange={(e) => setIsSortDesc(e.target.value === 'desc')}
          >
            <option value='desc'>desc</option>
            <option value='asc'>asc</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-5">
        {error ? (
          <ErrorUI error={error}/>
        ) : (
          events.map((event) => 
            <EventBoardCell 
              key={event.id} 
              event={event} 
            />
          )
        )}
      </div>
      {isLoading && <div>Loading...</div>}
    </div>
  )
}