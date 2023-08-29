import Link from 'next/link';
import { RestaurantCardType } from '../page';
import Price from './Price';

interface Props {
  restaurant: RestaurantCardType;
}

export default function RestaurantCard({ restaurant }: Props) {
  return (
    <div className="w-64 h-72 m-3 rounded overflow-hidden text-black border cursor-pointer">
      <Link href={`/restaurant/${restaurant.slug}`}>
        <img src={restaurant.main_image} alt="" className="w-full h-36" />
        <div className="p-1">
          <h3 className="font-bold text-2xl mb-2">{restaurant.name}</h3>
          <div className="flex items-start">
            <div className="flex mb-2">{restaurant.cuisine.name}</div>
            <p className="ml-2">{restaurant.location.name}</p>
          </div>
          <div className="flex text-reg font-light capitalize">
            <p className=" mr-3">{restaurant.name}</p>
            <Price price={restaurant.price} />
            <p className="ml-2">{restaurant.location.name}</p>
          </div>
          <p className="text-sm mt-1 font-bold">Booked 3 times today</p>
        </div>
      </Link>
    </div>
  );
}
