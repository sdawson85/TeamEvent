import { useEffect, useState } from 'react';
import './App.css';

interface Event {
    eventName: string;
    venue: string;
    createdBy: string;
    startAt: string;
    endAt: string;
    attenders: string[];
}

function App() {
    const [forecasts, setForecasts] = useState<Event[]>();
    const [eventName, setEventName] = useState('');
    const [createdBy, setCreatedBy] = useState('');
    const [startAt, setStartAt] = useState('');
    const [endAt, setEndAt] = useState('');
    const [venue, setVenue] = useState('');
    const [attenders, setAttenders] = useState<string[]>(['']);

    useEffect(() => {
        populateWeatherData();
    }, []);

    // Fetch existing events
    const populateWeatherData = async () => {
        const response = await fetch('/TeamEvent/Index');
        if (response.ok) {
            const data = await response.json();
            setForecasts(data);
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

        // Send the new event to the backend
        const response = await fetch('/TeamEvent/AddEvent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newEvent)
        });

        if (response.ok) {
            // Fetch updated events
            populateWeatherData();
        } else {
            console.error('Error adding event');
        }
    };

    // Conditional rendering based on whether data is available
    const contents = forecasts === undefined
        ? <p><em>Loading... Please refresh once the ASP.NET backend has started. See <a href="https://aka.ms/jspsintegrationreact">https://aka.ms/jspsintegrationreact</a> for more details.</em></p>
        : <table className="table table-striped" aria-labelledby="tableLabel">
            <thead>
                <tr>
                    <th>Event Name</th>
                    <th>Venue</th>
                    <th>Created By</th>
                    <th>Start At</th>
                    <th>Ends At</th>
                    <th>Attenders</th>
                </tr>
            </thead>
            <tbody>
                {forecasts.map(forecast =>
                    <tr key={forecast.eventName}>
                        <td>{forecast.eventName}</td>
                        <td>{forecast.venue}</td>
                        <td>{forecast.createdBy}</td>
                        <td>{forecast.startAt}</td>
                        <td>{forecast.endAt}</td>
                        <td>{forecast.attenders.join(', ')}</td>
                    </tr>
                )}
            </tbody>
        </table>;

    return (
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

            {contents}
        </div>
    );
}

export default App;
