import React,{useEffect, useState} from "react";
import { getEvents, submitEvent } from "../api/eventApi";
import { Validator } from "../utils/validator";

interface SubmitEventProps {
    onEventSubmitted: () => void;
  }

const SubmitEvent: React.FC<SubmitEventProps> = ({onEventSubmitted}) =>  {
    const [eventName, setEventName] = useState<string>('');
    const [createdBy, setCreatedBy] = useState<string>('');
    const [startAt, setStartAt] = useState('');
    const [endAt, setEndAt] = useState('');
    const [venue, setVenue] = useState<string>('');
    const [attenders, setAttenders] = useState<string[]>(['']);
    const [errors,setErrors] = useState<{[key:string]:string | null}>({
        eventName: null,
        createdBy: null,
        venue:null
    });
    const [attenderErrors, setAttenderErrors] = useState<(string | null)[]>(new Array(attenders.length).fill(null));

    useEffect(() => {
        getEvents(); // fetch users on mount
      }, []);
        // Handle form submission
        const handleSubmit = async (event: React.FormEvent) => {
            event.preventDefault();
            
            const emailError = Validator.isValidEmail(createdBy);
            const venueError = Validator.isRequired(venue);
            const eventNameError = Validator.isRequired(eventName);
            if(emailError || venueError){
                setErrors({createdBy: emailError,
                    venue: venueError,
                    eventName: eventNameError
                });
                return;
            }
        
            const newAttenderErrors = attenders.map((attender) => {
                console.log("Validating attender:", attender); // Log each attender's value
        
                // Get the result of email validation (true or false)
                const isValidEmail = Validator.isValidEmail(attender);
                console.log("Is Valid Email?", isValidEmail); // Log the result of the validation
        
                // Return the error message or null based on validation
                return isValidEmail;
            });
       
            console.log("New Attender Errors:", newAttenderErrors);
              // Combine all errors into one object
              const hasErrors =
                emailError ||
                venueError ||
                eventNameError ||
                newAttenderErrors.some((error) => error !== null);
              if (hasErrors) {
                setErrors({
                  createdBy: emailError,
                  venue: venueError,
                  eventName: eventNameError,
                });
                setAttenderErrors(newAttenderErrors);
                return;
              }

            setErrors({ createdBy: null,venue: null,eventName: null});
            setAttenderErrors(new Array(attenders.length).fill(null));

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
                    {errors.eventName && <p style={{color:'red'}}>{errors.eventName}</p>}
                </div>
                <div>
                    <label>Created By:</label>
                    <input type="text" value={createdBy} onChange={(e) => setCreatedBy(e.target.value)} required />
                    {errors.createdBy && <p style={{color:'red'}}>{errors.createdBy}</p>}
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
                    {errors.venue && <p style={{color:'red'}}>{errors.venue}</p>}
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
                                required
                            />
                            {attenderErrors[index] && (<p style={{ color: "red" }}>{attenderErrors[index]}</p>)}
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