import { useState , useEffect } from "react";
import SearchSection from "../components/SearchSelection";
import TurfList from "../components/TurfList";
import BookingModal from "../components/BookingModal";
import axios from "axios";


export default function Bookings() {
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [resetList, setResetList] = useState(false);
  const [venues, setVenues] = useState([]);
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  

  const handleBookNow = (venue) => setSelectedVenue(venue);
  const handleCloseModal = () => setSelectedVenue(null);

  const getVenues = async () => {
    try {
      const response = await axios.get(backendURL + "/venue/list"); 
       

      if (response.data.success) {
        setVenues(response.data.venues);
        setFilteredVenues(response.data.venues);
      }
    } catch (error) {
      console.error("Error fetching venues:", error);
    }
  };

  useEffect(() => {
  getVenues();
}, []);


  return (
   
    <div
      className="min-h-screen bg-cover bg-center bg-fixed bg-blend-overlay"
      
    >
     

      {/* --- BACKGROUND DECOR --- */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden bg-emerald-700 z-0">
        {/* Abstract Green Blob for Sporty Vibe */}
        
      </div>
z
      <div className="min-h-screen w-full backdrop-blur-sm py-8 px-6 md:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="p-6 mb-8">
            <SearchSection
              venues={venues}
              onSearch={setFilteredVenues}
              onReset={() => setResetList(true)}
            />
          </div>

          <div className="mb-8">
            <TurfList
              venues={filteredVenues}
              onBookNow={handleBookNow}
              resetList={resetList}
            />
          </div>
        </div>
      </div>

      {selectedVenue && (
        <BookingModal venue={selectedVenue} onClose={handleCloseModal} />
      )}
    </div>
  );
}
