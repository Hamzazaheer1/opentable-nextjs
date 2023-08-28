import Description from './components/Description';
import Images from './components/Images';
import Rating from './components/Rating';
import ReservationCard from './components/ReservationCard';
import RestaurantNavbar from './components/RestaurantNavbar';
import Reviews from './components/Reviews';
import Title from './components/Title';

export default function RestaurantDetails() {
  return (
    <>
      <div className="bg-white w-[70%] rounded p-3 shadow text-black">
        <RestaurantNavbar />
        <Title />
        <Rating />
        <Description />
        <Images />
        <Reviews />
      </div>
      <div className="w-[27%] relative text-reg text-black">
        <ReservationCard />
      </div>
    </>
  );
}
