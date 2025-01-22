import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './event.css'
const Event = () => {
    const navigate = useNavigate();
    
    const { id } = useParams(); // Get the event ID from the URL
    const [eventData, setEventData] = useState(null); // State to hold event details
    const homeclick = () =>{
        navigate('/')
    };
    const eventsclick = () =>{
        navigate('/Eventspage')
    };
    const loginclick = () => {
        navigate('/')
    }
    const hallclick = () => {
        navigate('/Hallpage');
      };
    const aboutusclick = () => {
        navigate('/aboutUs');
    };
    const contactclick = () => {
        navigate('/Contact us');
    };
    
    useEffect(() => {
        // Fetch the event details from the server
        const fetchEventData = async () => {
            try {
                const response = await fetch(`https://eventease2.onrender.com/api/events/${id}`); // Adjust the endpoint as necessary
                if (response.ok) {
                    const data = await response.json();
                    setEventData(data);
                } else {
                    console.error('Error fetching event data:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching event data:', error);
            }
        };

        fetchEventData();
    }, [id]);

    if (!eventData) return <div>Loading...</div>; 

    return (
        <div className="events-main">
            <div className="events-main-holder">
                <div className="header">
                    <div className="left-section">EventEase</div>
                    <div className="middle-section">
                        <div className="event-nav-home" onClick={homeclick}>
                            Home
                        </div>
                        <div className="event-nav-events" onClick={eventsclick}>Events</div>
                        <div className="event-nav-hall" onClick={hallclick}>Hall</div>
                        <div className="about" onClick={aboutusclick}>About Us </div>
                        <div className="contact" onClick={contactclick}>Contact Us</div>
                    </div>
                    <div className="right-section">
                        <div className="login" onClick={loginclick}>Login / Sign Up</div>
                        <span>{new Date().toLocaleDateString()}</span> {/* Current date */}
                    </div>
                </div>
            </div>
            <div className="event-detail-container">
                <div className="event-detail-name">
                    {eventData.collegeName} 
                </div>

                <div className="event-main-event-name">
                     {eventData.eventName} 
                </div><br></br>

                <div className="event-detail-discription-event-title">
                    Discription :
                </div>

                <div className="event-detail-description">
                    {eventData.description} 
                </div>

                <div className="event-detail-Poster-event-title">
                    Event Poster :
                </div>
                <img className="event-detail-poster" src={`https://eventease2.onrender.com/${eventData.eventPoster}`} 
                alt={`${eventData.collegeName} Poster`} /> 
                <div className="event-detail-about-event-title">
                    About Event :
                </div>
                
                <div className="event-detail-aboutevent">
                    {eventData.detailedInfo} 
                </div>

                <p className='event-detail-typeofevent-title'>Events :</p>
                <div className="event-detail-typeofevent">
                    {eventData.events && eventData.events.map((eventItem, index) => (
                        <div key={index}>{eventItem.eventName}</div> 
                    ))}
                </div>
                <p className='event-detail-webinarlink-title'>Webinar Link :</p>
                <div className="event-detail-webinar">
                    {eventData.webinarLink && (
                        <div>
                            <a href={eventData.webinarLink} target="_blank" rel="noopener noreferrer">
                                {eventData.webinarLink}</a> 
                        </div>
                    )}
                </div>
                <p className='event-detail-contact-title'>Contact Details :</p>
                <div className="event-detail-contact" >
                    {eventData.contacts && eventData.contacts.map((contact, index) => (
                        <div key={index}>
                            {contact.contactName}: {contact.contactNumber}
                        </div>
                    ))} 
                </div>
                <p className="event-detail-registration-link-title">
                    Registration Link :
                </p>
                <div className="event-detail-registration-link">
                    <a href={eventData.gformLink} target="_blank" rel="noopener noreferrer">Register Here</a> {/* Dynamic GForm Link */}
                </div>
            </div>
        </div>
    );
};

export default Event;