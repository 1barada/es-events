import { HTMLAttributes } from 'react';
import { Event } from '../types'

interface EventBoardCellProps {
  event: Event;
  registerHandler: (event: Event) => void;
  viewHandler: (event: Event) => void;
}

export default function EventBoardCell({
  event,
  registerHandler,
  viewHandler
}: EventBoardCellProps) {
  return (
    <div className='flex flex-col rounded border-2 border-gray-400 p-4 gap-6'>
      <div>
        <div className='text-lg font-semibold'>{event.title}</div>
        <div>{event.description}</div>
      </div>
      <div className='flex justify-between text-blue-400 gap-16'>
        <EventBoardCellButton onClick={() => registerHandler(event)}>Register</EventBoardCellButton>
        <EventBoardCellButton onClick={() => viewHandler(event)}>View</EventBoardCellButton>
      </div>
    </div>
  )
}

function EventBoardCellButton(props: HTMLAttributes<HTMLButtonElement>) {
  return (
    <button {...props} className='text-blue-400 hover:text-blue-600'/>
  );
}
