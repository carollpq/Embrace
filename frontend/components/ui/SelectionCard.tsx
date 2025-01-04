
import Image from 'next/image';
import React from 'react'

interface SelectionCardProps {
  title: string;
  description: string;
  svg: string;
  onClick?: () => void
}

const SelectionCard : React.FC<SelectionCardProps> = ({ title, description, svg, onClick }) => {
  return (
    <div onClick={onClick} className='animflex flex-col justify-center items-center button-transition hover:cursor-pointer hover:bg-white/80 hover:text-black/80 w-[250px] h-[250px] text-black/60 font-semibold text-xl bg-white/60 rounded-[20px] drop-shadow-default'>
      <span className="text-left absolute top-7 left-8">{title}</span>
      <div className='flex flex-row px-8 flex-wrap'>
        <span className='font-semibold text-sm absolute left-8 top-16 pr-8'>{description}</span>
        <Image className="absolute bottom-0 right-0" src={svg} alt="" width={150} height={150}/>
      </div>
    </div>
  )
}

export default SelectionCard