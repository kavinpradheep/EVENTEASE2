import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './allevents.css';

const Events = () => {
    const navigate = useNavigate();

    const homeclick = () => {
        navigate('/');
    };

    const loginclick = () => {
        navigate('/Login-signup-page');
    };

    const eventregisterclick = () => {
        navigate('/EventRegisterpage');
    };
    
    const hallclick = () => {
        navigate('/Hallpage');
    };

    const aboutusclick = () => {
        navigate('/aboutUs');
    };

    const contactclick = () => {
        navigate('/Contact us');
    };

    // Update view more click to navigate with event ID
    const viewmoreclick = (eventId) => {
        navigate(`/event/${eventId}`); // Adjust the route to include the event ID
    };

    const [events, setEvents] = useState([]); // State to hold events data

    // Fetch events data from the backend
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch('https://eventease2.onrender.com/api/events');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();

                // Filter out events with a date less than today
                const filteredEvents = data.filter(event => {
                    const eventDate = new Date(event.eventDate);
                    return eventDate >= new Date(); // Ensure eventDate is later than or equal to current date
                });

                setEvents(filteredEvents); // Set the filtered events
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };

        fetchEvents(); // Fetch events on component mount
    }, []); 

    return (
        <div className="events-main">
            <div className="events-main-holder">
                <div className="header">
                    <div className="left-section">EventEase</div>
                    <div className="middle-section">
                        <div className="event-nav-home" onClick={homeclick}>
                            Home
                        </div>
                        <div className="event-nav-events">Events</div>
                        <div className="hall" onClick={hallclick}>Hall</div>
                        <div className="about" onClick={aboutusclick}>About Us</div>
                        <div className="contact" onClick={contactclick}>Contact Us</div>
                    </div>
                    <div className="right-section">
                        <div className="login" onClick={loginclick}>Login / Sign Up</div>
                        <span>{new Date().toLocaleDateString()}</span> {/* Current date */}
                    </div>
                </div>
                <div className="eventregister-popup">
                    <div className="eventregister-popup-container">
                        <img src={"/public/asserts/event_register_popup.jpg"} alt="Event Registration Popup" />
                        <h3>Showcase your Event</h3>
                        <button className='publish' onClick={eventregisterclick}>
                            PUBLISH
                        </button>
                    </div>
                </div>
                <div className="event-container">
                    {events.length === 0 ? (
                        <p>No upcoming events available.</p> 
                    ) : (
                        events.map((event) => (
                            <div className="event-container-event" key={event._id}>
                                <img 
                                    src={`https://eventease2.onrender.com/${event.eventPoster}`} 
                                    alt={`${event.eventName} Poster`} 
                                /><br></br>
                                <p>{event.collegeName}</p>
                                <h3>{event.eventName}</h3>
                                <h3>Event date: {new Date(event.eventDate).toLocaleDateString()}</h3>
                                <h4>Registration</h4>
                                <div className="event-register-date">
                                    <p>Opens: {new Date(event.registrationOpen).toLocaleDateString()}</p>
                                    <p>Ends: {new Date(event.registrationClose).toLocaleDateString()}</p>
                                </div>
                                <div 
                                    className="view-more" 
                                    onClick={() => viewmoreclick(event._id)} 
                                    style={{ cursor: 'pointer', color: 'blue' }} // Optional styling
                                >
                                    View More
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Events;
