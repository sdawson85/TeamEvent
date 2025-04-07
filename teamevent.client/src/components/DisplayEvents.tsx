import React from 'react';
import { Event } from '../models/event';

interface DisplayEventProps {
    events: Event[];
  }

const DisplayEvents : React.FC<DisplayEventProps> = ({events}) =>{
    if(events.length === 0){
        return <p>No events to display.</p>
    }

    return(
        <table className="table table-striped" aria-labelledby="tableLabel">
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
                {events.map(event =>
                    <tr key={event.eventName}>
                        <td>{event.eventName}</td>
                        <td>{event.venue}</td>
                        <td>{event.createdBy}</td>
                        <td>{event.startAt}</td>
                        <td>{event.endAt}</td>
                        <td>{event.attenders}</td>
                    </tr>
                )}
            </tbody>
        </table>
    );
};

export default DisplayEvents;

