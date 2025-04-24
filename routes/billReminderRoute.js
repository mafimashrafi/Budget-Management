const express = require('express');
const router = express.Router();
const Reminder = require('../models/Reminder');

app.get('/billReminder', (req, res) => {
    res.render('billReminder.ejs');
  })

// Route to create a new reminder
router.post('/reminders/:id/add', async (req, res) => {
  const { email, task, reminderDate } = req.body;
  try {
    const newReminder = new Reminder({ email, task, reminderDate });
    await newReminder.save();
    res.status(201).json({ message: 'Reminder created successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
