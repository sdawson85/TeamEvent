import { Event } from "../models/event";

export const getEvents = async() : Promise<Event[]> => {
    const response = await fetch('/TeamEvent/Index');
    return response.json();
}

export const submitEvent = async(event: Omit<Event,"id">):Promise<boolean> =>{
   
    const response = await fetch('/TeamEvent/AddEvent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
    });
    console.log("STATUS:", response.status);

    return response.ok;
    
}
