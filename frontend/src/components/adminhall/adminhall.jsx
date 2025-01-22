import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import "./adminhall.css";

const Adminhall = () => {
    const [activeHall, setActiveHall] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [lockedDates, setLockedDates] = useState({});
    const [confirmPopupVisible, setConfirmPopupVisible] = useState(false);
    const [unlockPopupVisible, setUnlockPopupVisible] = useState(false);
    const [seatCount, setSeatCount] = useState(""); // State for the seat count input
    const [filteredHalls, setFilteredHalls] = useState([]); // Filtered halls based on seat count

    const halls = [
        { name: "Hall One", department: "Computer Science", seating: 200 },
        { name: "Hall Two", department: "Electrical Engineering", seating: 150 },
        { name: "Hall Three", department: "Mechanical Engineering", seating: 300 },
        { name: "Hall Four", department: "Civil Engineering", seating: 250 },
        { name: "Hall Five", department: "Business Administration", seating: 100 },
    ];

    const hallDetails = {
        "Hall One": { seating: "200 seats", stageSize: "Medium Stage", projector: "Available" },
        "Hall Two": { seating: "150 seats", stageSize: "Small Stage", projector: "Not Available" },
        "Hall Three": { seating: "300 seats", stageSize: "Large Stage", projector: "Available" },
        "Hall Four": { seating: "250 seats", stageSize: "Medium Stage", projector: "Available" },
        "Hall Five": { seating: "100 seats", stageSize: "Small Stage", projector: "Not Available" },
    };

    useEffect(() => {
        const fetchLockedDates = async () => {
            try {
                const response = await fetch('https://eventease2.onrender.com/api/lockeddates');
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                const datesByHall = {};

                data.forEach(item => {
                    const { hallName, date } = item;
                    if (!datesByHall[hallName]) {
                        datesByHall[hallName] = [];
                    }
                    datesByHall[hallName].push(new Date(date));
                });

                setLockedDates(datesByHall);
            } catch (error) {
                console.error('Error fetching locked dates:', error);
            }
        };

        fetchLockedDates();
    }, []);

    useEffect(() => {
        // Set filteredHalls to halls initially
        setFilteredHalls(halls);
    }, []);

    const handleRowClick = (hallName) => {
        setActiveHall(activeHall === hallName ? null : hallName);
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);

        if (lockedDates[activeHall] && lockedDates[activeHall].some(lockedDate => new Date(lockedDate).toDateString() === date.toDateString())) {
            setUnlockPopupVisible(true);
        } else {
            setConfirmPopupVisible(true);
        }
    };

    const handleConfirmLock = async () => {
        try {
            const response = await fetch('https://eventease2.onrender.com/api/lockeddates', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    hallName: activeHall,
                    date: selectedDate.toISOString(),
                }),
            });

            if (!response.ok) throw new Error('Failed to lock the date');

            const updatedLockedDates = { ...lockedDates };
            if (!updatedLockedDates[activeHall]) {
                updatedLockedDates[activeHall] = [];
            }

            updatedLockedDates[activeHall].push(selectedDate);
            setLockedDates(updatedLockedDates);
            setConfirmPopupVisible(false);
        } catch (error) {
            console.error('Error locking date:', error);
        }
    };

    const handleConfirmUnlock = async () => {
        try {
            const response = await fetch('https://eventease2.onrender.com/api/lockeddates', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    hallName: activeHall,
                    date: selectedDate.toISOString(),
                }),
            });

            if (!response.ok) throw new Error('Failed to unlock the date');

            const updatedLockedDates = { ...lockedDates };
            if (updatedLockedDates[activeHall]) {
                updatedLockedDates[activeHall] = updatedLockedDates[activeHall].filter(lockedDate => new Date(lockedDate).toDateString() !== selectedDate.toDateString());
                setLockedDates(updatedLockedDates);
            }
            setUnlockPopupVisible(false);
        } catch (error) {
            console.error('Error unlocking date:', error);
        }
    };

    const handleCancel = () => {
        setConfirmPopupVisible(false);
        setUnlockPopupVisible(false);
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
            const lowerLimit = count - 50;
            const upperLimit = count + 50;

            const filtered = halls.filter(hall => hall.seating >= lowerLimit && hall.seating <= upperLimit);
            setFilteredHalls(filtered);
        } else {
            setFilteredHalls(halls); // If invalid input, show all halls
        }
    };

    return (
        <div className="main-holder">
            <div className="header">
                <div className="left-section">EventEase Admin</div>
                <div className="middle-section">
                    <div className="admin-home">Home</div>
                    <div className="events">Events</div>
                    <div className="admin-hall">Hall</div>
                    <div className="about">About Us</div>
                    <div className="contact">Contact Us</div>
                </div>
                <div className="right-section">date</div>
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
                                                        <p><strong>Seating Capacity:</strong> {hallDetails[hall.name].seating}</p>
                                                        <p><strong>Stage Size:</strong> {hallDetails[hall.name].stageSize}</p>
                                                        <p><strong>Projector Availability:</strong> {hallDetails[hall.name].projector}</p>
                                                    </div>
                                                    <div className="details-right-section">
                                                        <Calendar
                                                            onChange={handleDateChange}
                                                            value={selectedDate}
                                                            tileClassName={({ date }) => {
                                                                return lockedDates[hall.name] && lockedDates[hall.name].some(lockedDate => new Date(lockedDate).toDateString() === date.toDateString()) ? 'highlight' : '';
                                                            }}
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

            {confirmPopupVisible && (
                <div className="confirmation-popup">
                    <p>Are you sure you want to lock the date {selectedDate.toDateString()} for {activeHall}?</p>
                    <button onClick={handleConfirmLock}>Confirm</button>
                    <button onClick={handleCancel}>Cancel</button>
                </div>
            )}

            {unlockPopupVisible && (
                <div className="confirmation-popup">
                    <p>Are you sure you want to unlock the date {selectedDate.toDateString()} for {activeHall}?</p>
                    <button onClick={handleConfirmUnlock}>Confirm</button>
                    <button onClick={handleCancel}>Cancel</button>
                </div>
            )}
        </div>
    );
};

export default Adminhall;
