import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './contact.css';

const Contact = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    // Navigation functions
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

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
        setFormData({
            name: '',
            email: '',
            subject: '',
            message: ''
        });
    };

    return (
        <div className="contact-page">
            {/* Navbar */}
            <div className="header">
                <div className="left-section">EventEase</div>
                <div className="middle-section">
                    <div className="contact-home" onClick={homeclick}>Home</div>
                    <div className="contact-events" onClick={eventregisterclick}>Events</div>
                    <div className="contact-hall" onClick={hallclick}>Hall</div>
                    <div className="contact-about" onClick={aboutusclick}>About Us</div>
                    <div className="contact-contact" onClick={contactclick}>Contact Us</div>
                </div>
                <div className="right-section">
                    <div className="login" onClick={loginclick}>Login / Sign Up</div>
                    <span>{new Date().toLocaleDateString()}</span>
                </div>
            </div>

            {/* Contact Section */}
            <div className="contact-header">
                <h2>Contact Us</h2>
                <p>We're here to assist you. Reach out to us with your queries and concerns.</p>
            </div>
            <div className="contact-content">
                <div className="contact-details">
                    <h3>Contact Information</h3>
                    <p><strong>Email:</strong> support@example.com</p>
                    <p><strong>Phone:</strong> +91 9652374526</p>
                    <p><strong>Address:</strong> 123 EventEase Lane, Cityville, Country</p>
                </div>
                <form onSubmit={handleSubmit} className="contact-form">
                    <h3>Send Us a Message</h3>
                    <div className="form-group">
                        <label htmlFor="name">First Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Your First Name"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Your Email"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="subject">Last Name</label>
                        <input
                            type="text"
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            placeholder="Your Last Name"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="message">Message</label>
                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Your Message"
                            required
                        />
                    </div>
                    <button type="submit" className="submit-btn">Send Message</button>
                </form>
            </div>
        </div>
    );
};

export default Contact;
