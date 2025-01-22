import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar'; // Import React Calendar
import './hall.css';
import { useNavigate } from 'react-router-dom';

const Hall = () => {
    const navigate = useNavigate();
    const homeclick = () => {
        navigate('/');
    };
    const eventsclick = () => {
        navigate('/Eventspage');
    };
    const aboutusclick = () => {
        navigate('/aboutUs');
    };
    const contactclick = () => {
        navigate('/Contact us');
    };
    const loginclick = () => {
        navigate('/Login-signup-page');
    };

    const [activeHall, setActiveHall] = useState(null); // For tracking which hall is selected
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [eventDates, setEventDates] = useState({}); // Store dates for all halls, keyed by hallName
    const [seatCount, setSeatCount] = useState(""); // State for the seat count input
    const [filteredHalls, setFilteredHalls] = useState([]); // Filtered halls based on seat count

    const halls = [
        { name: "Hall One", department: "Computer Science" },
        { name: "Hall Two", department: "Electrical Engineering" },
        { name: "Hall Three", department: "Mechanical Engineering" },
        { name: "Hall Four", department: "Civil Engineering" },
        { name: "Hall Five", department: "Business Administration" },
    ];

    const hallDetails = {
        "Hall One": { seating: 200, stageSize: "Medium Stage", projector: "Available" },
        "Hall Two": { seating: 150, stageSize: "Small Stage", projector: "Not Available" },
        "Hall Three": { seating: 300, stageSize: "Large Stage", projector: "Available" },
        "Hall Four": { seating: 250, stageSize: "Medium Stage", projector: "Available" },
        "Hall Five": { seating: 100, stageSize: "Small Stage", projector: "Not Available" },
    };

    const handleRowClick = (hallName) => {
        setActiveHall(activeHall === hallName ? null : hallName);
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    useEffect(() => {
        // Set filteredHalls to halls initially
        setFilteredHalls(halls);
    }, []);

    // Fetch event dates from the API when the component mounts
    useEffect(() => {
        const fetchEventDates = async () => {
            try {
                const response = await fetch('https://eventease2.onrender.com/api/lockeddates'); // Fetch from your local server
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const dates = await response.json();

                // Group event dates by hall name
                const groupedDates = {};
                dates.forEach(event => {
                    const hallName = event.hallName;
                    if (!groupedDates[hallName]) {
                        groupedDates[hallName] = [];
                    }
                    groupedDates[hallName].push(new Date(event.date).toISOString().split('T')[0]);
                });

                setEventDates(groupedDates); // Store locked dates by hall
            } catch (error) {
                console.error('Error fetching locked dates:', error);
            }
        };

        fetchEventDates();
    }, []);

    // Function to determine if a date has an event, but only for the active hall
    const tileClassName = ({ date }) => {
        const isoDate = date.toISOString().split('T')[0]; // Format date in ISO format
        if (activeHall && eventDates[activeHall]) {
            return eventDates[activeHall].includes(isoDate) ? 'highlight' : null; // Check if date is locked for the active hall
        }
        return null;
    };

    const handleSeatCountChange = (e) => {
        const count = e.target.value;
        setSeatCount(count);
    };

    const handleKeyDown = (e) => {
        // Listen for the "Enter" key press to filter halls
        if (e.key === "Enter") {
            filterHalls();
        }
    };

    const filterHalls = () => {
        // Check if seatCount is a valid number and filter halls by range ±50
        const count = parseInt(seatCount, 10);

        if (!isNaN(count) && count > 0) {
            const filtered = halls.filter(hall => hallDetails[hall.name].seating >= (count - 50) && hallDetails[hall.name].seating <= (count + 50));
            setFilteredHalls(filtered);
        } else {
            setFilteredHalls(halls); // If invalid input, show all halls
        }
    };

    return (
        <div className="main-holder">
            <div className="header">
                <div className="left-section">EventEase</div>
                <div className="middle-section">
                    <div className="hall-home" onClick={homeclick}>Home</div>
                    <div className="events" onClick={eventsclick}>Events</div>
                    <div className="hall-hall">Hall</div>
                    <div className="about" onClick={aboutusclick}>About Us</div>
                    <div className="contact" onClick={contactclick}>Contact Us</div>
                </div>
                <div className="right-section">
                    <div className="login" onClick={loginclick}>Login / Sign Up</div>
                    <span>{new Date().toLocaleDateString()}</span>
                </div>
            </div>

            <div className="hall-main-container">
                {/* Seat Count Input */}
                <div className="seat-count-input">
                    <label htmlFor="seat-count">Enter Seat Count: </label>
                    <input
                        type="number"
                        id="seat-count"
                        value={seatCount}
                        onChange={handleSeatCountChange}
                        onKeyDown={handleKeyDown} // Add the event handler for "Enter" key
                        placeholder="Enter maximum seat count"
                    />
                </div>

                <table className="hall-table">
                    <thead>
                        <tr>
                            <th>S.No</th>
                            <th>Hall Name</th>
                            <th>Department</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredHalls.length === 0 ? (
                            <tr>
                                <td colSpan="3">No halls available in this range of seats.</td>
                            </tr>
                        ) : (
                            filteredHalls.map((hall, index) => (
                                <React.Fragment key={index}>
                                    <tr onClick={() => handleRowClick(hall.name)}>
                                        <td>{index + 1}</td>
                                        <td>{hall.name}</td>
                                        <td>{hall.department}</td>
                                    </tr>
                                    {activeHall === hall.name && (
                                        <tr className="active-row">
                                            <td colSpan="3">
                                                <div className="details-container">
                                                    <div className="details-left-section">
                                                        <p><strong>Seating Capacity:</strong> {hallDetails[hall.name].seating} seats</p>
                                                        <p><strong>Stage Size:</strong> {hallDetails[hall.name].stageSize}</p>
                                                        <p><strong>Projector Availability:</strong> {hallDetails[hall.name].projector}</p>
                                                    </div>
                                                    <div className="details-right-section">
                                                        <Calendar 
                                                            onChange={handleDateChange} 
                                                            value={selectedDate} 
                                                            tileClassName={tileClassName} // Apply the tileClassName function
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Hall;
