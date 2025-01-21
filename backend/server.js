import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer'; // Import nodemailer
import { body, validationResult } from 'express-validator';

// Initialize Express app
const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // Serve static files from uploads folder

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Ensure 'uploads/' folder exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Name file with timestamp and its original extension
  },
});

const upload = multer({ storage });

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/eventEaseDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'kavinpradheep2005@gmail.com', // Your Gmail address
    pass: 'qkvk qhym drns htud', // Your Gmail password or App password
  },
});

// Subscriber schema
const subscriberSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  subscribedAt: { type: Date, default: Date.now },
});

const Subscriber = mongoose.model('Subscriber', subscriberSchema);

// Subscription API route
app.post('/api/subscribe', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    // Check if the email already exists in the database
    const existingSubscriber = await Subscriber.findOne({ email });
    if (existingSubscriber) {
      return res.status(400).json({ error: 'Email already subscribed' });
    }

    // Save subscriber details to the database
    const newSubscriber = new Subscriber({ email });
    await newSubscriber.save();

    // Define the email content
    const mailOptions = {
      from: '"EventEase" <kavinpradheep2005@gmail.com>',
      to: email,
      subject: 'Welcome to EventEase!',
      text: 'Thank you for subscribing to EventEase! Stay tuned for upcoming events and updates.',
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Subscription successful! Email sent.' });
  } catch (error) {
    console.error('Error sending email or saving subscriber:', error);
    res.status(500).json({ error: 'Failed to send email or save subscriber.' });
  }
});

// Admin schema
const adminSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
});

const Admin = mongoose.model('Admin', adminSchema);

// Admin login route
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: 'Admin not found' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT Token
    const token = jwt.sign({ id: admin._id }, 'your_jwt_secret', { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// User schema
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  password: String,
});

const User = mongoose.model('User', userSchema);

// Signup route with validation
app.post(
  '/api/signup',
  [
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, email, password } = req.body;

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
      });

      await newUser.save();
      res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Event schema
const eventSchema = new mongoose.Schema({
  collegeName: String,
  eventDate: Date,
  gformLink: String,
  registrationOpen: Date,
  registrationClose: Date,
  eventPoster: String, // Store the file path as a string
  description: String,  // Short description
  detailedInfo: String,  // Detailed information about the event
  eventName: String,  // Main Event Name (New field)
  webinarLink: String, // Webinar Link (New field)
  events: [
    {
      eventName: String, // Sub-events (typeOfEvent equivalent)
    },
  ],
  contacts: [
    {
      contactName: String,
      contactNumber: String, // Will be used to display contact details on frontend
    },
  ],
});

const Event = mongoose.model('Event', eventSchema);

// Locked Dates Schema
const lockedDateSchema = new mongoose.Schema({
  hallName: String,
  date: Date,
});

const LockedDate = mongoose.model('LockedDate', lockedDateSchema);

// Cleanup outdated events
const cleanupPastEvents = async () => {
  try {
    const currentDate = new Date();
    await Event.deleteMany({ eventDate: { $lt: currentDate } }); // Remove events with a date in the past
    console.log('Outdated events removed successfully');
  } catch (err) {
    console.error('Error cleaning up past events:', err);
  }
};

// Fetch all events route
app.get('/api/events', async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Fetch locked dates route
app.get('/api/lockeddates', async (req, res) => {
  try {
    const lockedDates = await LockedDate.find(); // Fetch locked dates from the database
    res.status(200).json(lockedDates);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Fetch event details by ID route
app.get('/api/events/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.status(200).json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Event registration route (Modified to send emails to subscribers)
app.post('/api/registerEvent', upload.single('eventPoster'), async (req, res) => {
  const {
    collegeName,
    eventDate,
    gformLink,
    registrationOpen,
    registrationClose,
    description,
    detailedInfo,
    eventName,
    webinarLink,
    events,
    contacts,
  } = req.body;

  const eventPoster = req.file ? req.file.path : ''; // Ensure eventPoster is uploaded

  try {
    // Create and save the new event
    const newEvent = new Event({
      collegeName,
      eventDate,
      gformLink,
      registrationOpen,
      registrationClose,
      eventPoster,
      description,
      detailedInfo,
      eventName,
      webinarLink,
      events: JSON.parse(events),
      contacts: JSON.parse(contacts),
    });

    await newEvent.save();

    // Fetch all subscribers from the database
    const subscribers = await Subscriber.find(); // Assuming Subscriber model contains email addresses

    // If there are subscribers, send notification emails
    if (subscribers.length > 0) {
      const mailOptions = {
        from: '"EventEase" <kavinpradheep2005@gmail.com>',
        subject: 'New Event Published!',
        text: `A new event, "${eventName}", has been published! Check it out for more details: ${description}`,
      };

      // Send email to each subscriber
      for (let subscriber of subscribers) {
        mailOptions.to = subscriber.email; // Subscriber email

        // Send email notification
        await transporter.sendMail(mailOptions);
      }
    }

    res.status(201).json({ message: 'Event registered and notifications sent to subscribers!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to register event or send notifications.' });
  }
});

// Lock event dates route
app.post('/api/lockeddates', async (req, res) => {
  const { hallName, date } = req.body;

  try {
      const alreadyLocked = await LockedDate.findOne({ hallName, date });
      if (alreadyLocked) {
          return res.status(400).json({ message: 'Date is already locked.' });
      }
      const lockedDate = new LockedDate({ hallName, date });
      await lockedDate.save();
      res.status(201).json({ message: 'Date locked successfully.' });
  } catch (error) {
      res.status(500).json({ message: 'Error locking date.', error });
  }
});

// Unlock event dates route
app.delete('/api/lockeddates', async (req, res) => {
  const { hallName, date } = req.body;

  try {
      const result = await LockedDate.deleteOne({ hallName, date });
      if (result.deletedCount === 0) {
          return res.status(404).json({ message: 'Date not found.' });
      }
      res.status(200).json({ message: 'Date unlocked successfully.' });
  } catch (error) {
      res.status(500).json({ message: 'Error unlocking date.', error });
  }
});


// Start the server
app.listen(5000, () => {
  console.log('Server running on port 5000');
});