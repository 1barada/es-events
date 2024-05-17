import { HTMLAttributes } from 'react';
import { Event } from '../types'
import { dateStringFormat } from '../utils';
import { useNavigate } from 'react-router-dom';

interface EventBoardCellProps {
  event: Event;
  registerHandler: (event: Event) => void;
}

export default function EventBoardCell({
  event,
  registerHandler
}: EventBoardCellProps) {
  const navigate = useNavigate();

  return (
    <div className='flex flex-col rounded-lg border-gray-400 shadow-md border-x border-y'>
      <div className='rounded-t-lg text-xl font-semibold text-center bg-slate-100 p-2 border-b-[1px] border-gray-400'>{event.title}</div>
      <div className='flex flex-col gap-4 p-4'>
        <div className='grid grid-cols-2 grid-rows-[repeat(3,24px)] overflow-hidden whitespace-nowrap'>
          <div>date:</div>
          <div>{dateStringFormat(event.date)}</div>
          <div>organizer:</div>
          <div className='overflow-hidden text-ellipsis'>{event.organizer}</div>
          <div>description:</div>
          <div className='overflow-hidden text-ellipsis'>{event.description}</div>
        </div>
        <div className='flex justify-between text-blue-400 gap-16'>
          <EventBoardCellButton onClick={() => registerHandler(event)}>Register</EventBoardCellButton>
          <EventBoardCellButton onClick={() => navigate('/event/' + event.id)}>View</EventBoardCellButton>
        </div>
      </div>
    </div>
  )
}

function EventBoardCellButton(props: HTMLAttributes<HTMLButtonElement>) {
  return (
    <button {...props} className='text-blue-400 hover:text-emerald-600 rounded border-2 p-2 hover:border-slate-300 text-base leading-4 hover:bg-slate-50 text-shado'/>
  );
}
