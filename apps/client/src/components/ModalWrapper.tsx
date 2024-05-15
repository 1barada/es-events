import { useEffect } from 'react';

interface ModalWrapperProps {
  isOpen: boolean;
  disableGlobalScroll?: boolean;
  children: React.ReactNode;
  close: () => void;
}

export default function ModalWrapper({ 
  isOpen, 
  disableGlobalScroll = false, 
  children,
  close 
}: ModalWrapperProps) {
  useEffect(() => {
    if (isOpen && disableGlobalScroll) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = 'unset'
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <div className='fixed top-0 left-0 w-full h-full bg-black/30 z-50' onClick={() => close()}>
          <div className='absolute top-0 left-0 flex justify-center items-center w-full h-full'>
            <div className='bg-white rounded max-w-screen-lg p-4' onClick={(e) => e.stopPropagation()}>
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  );
}