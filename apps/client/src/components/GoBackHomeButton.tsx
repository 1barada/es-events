import { IoArrowBack } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'

export default function GoBackHomeButton() {
  const navigate = useNavigate();

  return (
    <button 
      className="w-8 h-8 hover:bg-slate-100 p-1 rounded-full flex justify-center items-center"
      title='go back home'
      onClick={() => navigate('/')}
    >
      <IoArrowBack className="leading-3"/>
    </button>
  )
}
