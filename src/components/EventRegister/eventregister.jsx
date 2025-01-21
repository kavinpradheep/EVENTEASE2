import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './eventregister.css';
import colleges from '../../../backend/colleges';

const Eventregister = () => {
  const navigate = useNavigate();
  const homeclick = () => {
    navigate('/');
  };
  const eventsclick = () => {
    navigate('/Eventspage');
  };
  const loginclick = () => {
    navigate('/login-signup-page');
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

  const [eventCount, setEventCount] = useState(1);
  const [events, setEvents] = useState([{ eventName: '' }]);
  const [contactCount, setContactCount] = useState(1);
  const [contacts, setContacts] = useState([{ contactName: '', contactNumber: '' }]);

  const [eventData, setEventData] = useState({
    collegeName: '',
    eventName: '',
    eventDate: '',
    gformLink: '',
    webinarLink: '',
    registrationOpen: '',
    registrationClose: '',
    description: '',
    detailedInfo: '',
  });

  const [eventPoster, setEventPoster] = useState(null);
  const [isPublishing, setIsPublishing] = useState(false); // State to track the publishing status

  const handleChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setEventPoster(e.target.files[0]);
  };

  const handleEventCountChange = (count) => {
    setEventCount(count);
    const newEvents = Array.from({ length: count }, (_, index) => ({
      eventName: events[index]?.eventName || '',
    }));
    setEvents(newEvents);
  };

  const handleInputChange = (index, field, value) => {
    const updatedEvents = [...events];
    updatedEvents[index][field] = value;
    setEvents(updatedEvents);
  };

  const handleContactCountChange = (count) => {
    setContactCount(count);
    const newContacts = Array.from({ length: count }, (_, index) => ({
      contactName: contacts[index]?.contactName || '',
      contactNumber: contacts[index]?.contactNumber || '',
    }));
    setContacts(newContacts);
  };

  const handleContactInputChange = (index, field, value) => {
    const updatedContacts = [...contacts];
    updatedContacts[index][field] = value;
    setContacts(updatedContacts);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsPublishing(true); // Start the publishing process

    const formData = new FormData();

    // Append event data to FormData
    formData.append('collegeName', eventData.collegeName);
    formData.append('eventName', eventData.eventName);
    formData.append('eventDate', eventData.eventDate);
    formData.append('gformLink', eventData.gformLink);
    formData.append('webinarLink', eventData.webinarLink);
    formData.append('registrationOpen', eventData.registrationOpen);
    formData.append('registrationClose', eventData.registrationClose);
    formData.append('description', eventData.description);
    formData.append('detailedInfo', eventData.detailedInfo);

    if (eventPoster) {
      formData.append('eventPoster', eventPoster);
    } else {
      alert("Please upload an event poster.");
      setIsPublishing(false); // Stop publishing process if no poster
      return;
    }

    formData.append('events', JSON.stringify(events));
    formData.append('contacts', JSON.stringify(contacts));

    try {
      const response = await fetch('http://localhost:5000/api/registerEvent', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (response.status === 201) {
        alert('Event registered successfully');
        navigate('/Eventspage');
      } else {
        alert(result.error || "Error registering event");
      }
    } catch (error) {
      console.error('Error registering event:', error);
      alert('Error registering event');
    } finally {
      setIsPublishing(false); // Stop publishing process when done
    }
  };

  return (
    <div className="main">
      <div className="header">
        <div className="left-section">EventEase</div>
        <div className="middle-section">
          <div className="event-nav-home" onClick={homeclick}>Home</div>
          <div className="event-nav-events" onClick={eventsclick}>Events</div>
          <div className="event-nav-hall" onClick={hallclick}>Hall</div>
          <div className="about" onClick={aboutusclick}>About Us</div>
          <div className="contact" onClick={contactclick}>Contact Us</div>
        </div>
        <div className="right-section">
          <div className="login" onClick={loginclick}>Login / Sign Up</div>
        </div>
      </div>

      <div className="register-container">
        <div className="register-container-left">
          <h1>Publish Event</h1>
          <div className="rcl-h41">
            <p>Upload the event details</p>
            <hr />
            <p>Corrections can't be made after publishing</p>
          </div>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            {/* College Name Dropdown */}
            <p>College Name</p>
            <select 
              name="collegeName" 
              value={eventData.collegeName} 
              onChange={handleChange} 
              className="register-eventname" 
              required
            >
              <option value="" disabled>Select College</option>
              {colleges.map((college, index) => (
                <option key={index} value={college}>{college}</option>
              ))}
            </select>

            <p>Event Name</p>
            <input type="text" name="eventName" value={eventData.eventName} onChange={handleChange}
              className="register-eventname" placeholder="Main Event Name" required />

            <p>Event Date</p>
            <input type="date" name="eventDate" value={eventData.eventDate}
              onChange={handleChange} className="register-eventname" required />

            <p>Gform details</p>
            <input type="url" name="gformLink" value={eventData.gformLink} onChange={handleChange}
              className="register-eventname" placeholder="Enter G-form Link" required />

            <p>Webinar Link</p>
            <input type="url" name="webinarLink" value={eventData.webinarLink} onChange={handleChange}
              className="register-eventname" placeholder="Enter Webinar Link" required />

            <div className="register-event-gformdetails">
              <div>
                <p>Registration open</p>
                <input type="date" name="registrationOpen" value={eventData.registrationOpen}
                  onChange={handleChange} className="register-gformdetails-date" required />
              </div>
              <div>
                <p>Registration close</p>
                <input type="date" name="registrationClose" value={eventData.registrationClose}
                  onChange={handleChange} className="register-gformdetails-date" required />
              </div>
            </div>

            <p>Event Poster</p>
            <input type="file" name="eventPoster" accept="image/*" onChange={handleImageChange} className="register-poster" required />
            
            <p>Enter short description</p>
            <textarea  className='register-event-description' name="description" 
              value={eventData.description} 
              onChange={handleChange} 
              placeholder="Short description" 
              required 
            />
            
            <p>Enter detailed information</p>
            <textarea className='register-about-event' name="detailedInfo" value={eventData.detailedInfo} 
              onChange={handleChange} 
              placeholder="Detailed information about the event" 
              required 
            />

            <p>How many sub-events do you want to register?</p>
            <input
              type="number"
              value={eventCount}
              onChange={(e) => handleEventCountChange(parseInt(e.target.value) || 1)} // Ensure at least 1
              min="1"
              className="event-count-input"
            />

            {Array.from({ length: eventCount }).map((_, index) => (
              <div key={index}>
                <h3 className='register-event-count'>Sub-event {index + 1} Name</h3>
                <label>
                  <input
                    type="text"
                    value={events[index]?.eventName || ''}
                    onChange={(e) => handleInputChange(index, 'eventName', e.target.value)}
                    required
                    className="register-eventname"
                    placeholder="Sub-event Name"
                  />
                </label>
              </div>
            ))}

            <p>How many contacts should be given?</p>
            <input
              type="number"
              value={contactCount}
              onChange={(e) => handleContactCountChange(parseInt(e.target.value) || 1)} // Ensure at least 1
              min="1"
              className="contact-count-input"
            />

            {Array.from({ length: contactCount }).map((_, index) => (
              <div key={index}>
                <h3 className='register-contact-count'>Contact {index + 1}</h3>
                <div className='contact-container'>
                  <input
                    type="text"
                    value={contacts[index]?.contactName || ''}
                    onChange={(e) => handleContactInputChange(index, 'contactName', e.target.value)}
                    required
                    className="register-contactname"
                    placeholder="Contact Name"
                  />
                  <input
                    type="tel"
                    value={contacts[index]?.contactNumber || ''}
                    onChange={(e) => handleContactInputChange(index, 'contactNumber', e.target.value)}
                    required
                    className="register-contactnumber"
                    placeholder="Contact Number"
                  />
                </div>
              </div>
            ))}

            <button type="submit" className="register-submit" disabled={isPublishing}>
              {isPublishing ? 'Publishing...' : 'Publish'}
            </button>
          </form>
        </div>
        <div className="register-container-right">
          <h1>publisher verification 
          work in progress</h1>
        </div>
      </div>
    </div>
  );
};

export default Eventregister;