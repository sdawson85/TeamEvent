import { useEffect, useState } from 'react';
import './App.css';
import DisplayEvents from './components/DisplayEvents';
import SubmitEvent from './components/SubmitEvent';
import { getEvents } from './api/eventApi';
import { Event } from './models/event';

const App: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);

  // Function to load events
  const loadEvents = async () => {
    try {
      const data = await getEvents(); 
      setEvents(data); 
    } catch (error) {
      console.error("Error loading events:", error);
     
    }
  };

  
  useEffect(() => {
    loadEvents(); 
  }, []); 

  return (
    <div style={{ padding: "20px" }}>
      <SubmitEvent onEventSubmitted={loadEvents} />
      <hr />
      <DisplayEvents events={events} />
    </div>
  );
};

export default App;
