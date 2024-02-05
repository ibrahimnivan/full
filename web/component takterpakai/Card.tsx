import React from 'react';
// import image from '../../public/example event/example.jpg'

interface CardProps {
  title: string;
  image: string;
  date: { day: string; date: string; month: string };
  fee: string | number;
  location: string;
}



const Card: React.FC<CardProps> = ({ title, date, image, fee, location }) => {
  return (
    <div className="rounded shadow-lg w-[270px] bg-white m-4">
      <img
        src={`/exampleEvent/${image}`}
        alt={title}
        className="w-full h-48 object-cover"
      />
      <div className="px-2 py-2 flex h-28 border ">
        <div className="flex w-28">
          <div className="p-3">
            <p className="text-gray-700 text-base mb-2">{date.day}</p>
            <p className="text-gray-700 text-base mb-2">{date.date}</p>
            <p className="text-gray-700 text-base mb-2">{date.month}</p>
          </div>
          <span className="mt-3 h-16 w-[2px] bg-gray-900 inline-block" />
        </div>
        <div>
          <div className="font-bold text-xl mb-2">{title}</div>
          <p className="text-gray-700 text-base mb-2">{location}</p>
          <p className="text-gray-700 text-base">
            Fee: {typeof fee === 'number' ? `$${fee.toFixed(2)}` : fee}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Card;
