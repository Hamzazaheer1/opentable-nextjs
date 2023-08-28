import Header from './components/Header';
import SearchSidebar from './components/SearchSidebar';
import RestaurantCard from './components/RestaurantCard';

export default function Search() {
  return (
    <>
      <Header />
      <div className="flex py-4 m-auto w-2/3 justify-between items-start">
        <SearchSidebar />
        <div className="w-5/6 text-black">
          <RestaurantCard />
        </div>
      </div>
    </>
  );
}
