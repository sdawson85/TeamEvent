import React,{useEffect, useState} from "react";
import { getEvents, submitEvent } from "../api/eventApi";

interface SubmitEventProps {
    onEventSubmitted: () => void;
  }

const SubmitEvent: React.FC<SubmitEventProps> = ({onEventSubmitted}) =>  {
    const [eventName, setEventName] = useState('');
    const [createdBy, setCreatedBy] = useState('');
    const [startAt, setStartAt] = useState('');
    const [endAt, setEndAt] = useState('');
    const [venue, setVenue] = useState('');
    const [attenders, setAttenders] = useState<string[]>(['']);

    useEffect(() => {
        getEvents(); // fetch users on mount
      }, []);
        // Handle form submission
        const handleSubmit = async (event: React.FormEvent) => {
            event.preventDefault();
            const newEvent = {
                eventName,
                createdBy,
                startAt,
                endAt,
                venue,
                attenders: attenders.filter((attender) => attender.trim() !== '') // Remove empty attenders
            };
            var response = await submitEvent(newEvent);
            // Send the new event to the backend
            
            if (response) {
                // Fetch updated events
                onEventSubmitted();
                getEvents();
            } else {
                console.error('Error adding event');
            }
        };

            // Handle the dynamic addition of attenders
    const handleAddAttender = () => {
        setAttenders([...attenders, '']);  // Add a new empty field for an attender
    };

    // Handle attender field changes
    const handleAttenderChange = (index: number, value: string) => {
        const newAttenders = [...attenders];
        newAttenders[index] = value;
        setAttenders(newAttenders);
    };
        return(
            <div>
            <h1 id="tableLabel">Team Events</h1>
            <p>This component demonstrates fetching data from the server.</p>

            {/* Event Form */}
            <form onSubmit={handleSubmit}>
                <h3>Add New Event</h3>
                <div>
                    <label>Event Name:</label>
                    <input type="text" value={eventName} onChange={(e) => setEventName(e.target.value)} required />
                </div>
                <div>
                    <label>Created By:</label>
                    <input type="text" value={createdBy} onChange={(e) => setCreatedBy(e.target.value)} required />
                </div>
                <div>
                    <label>Start At:</label>
                    <input type="datetime-local" value={startAt} onChange={(e) => setStartAt(e.target.value)} required />
                </div>
                <div>
                    <label>End At:</label>
                    <input type="datetime-local" value={endAt} onChange={(e) => setEndAt(e.target.value)} required />
                </div>
                <div>
                    <label>Venue:</label>
                    <input type="text" value={venue} onChange={(e) => setVenue(e.target.value)} required />
                </div>

                {/* Attendder Fields */}
                <div>
                    <label>Attenders:</label>
                    {attenders.map((attender, index) => (
                        <div key={index}>
                            <input
                                type="text"
                                value={attender}
                                onChange={(e) => handleAttenderChange(index, e.target.value)}
                                placeholder={`Attender ${index + 1}`}
                            />
                        </div>
                    ))}
                    <button type="button" onClick={handleAddAttender}>Add Another Attender</button>
                </div>

                <button type="submit">Submit Event</button>
            </form>
        </div>
        );
};
export default SubmitEvent;