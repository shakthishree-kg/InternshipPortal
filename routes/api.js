
const express = require('express');
const router = express.Router();
const Application = require('../models/application');

const internships = [
  {
    id: 'web-development',
    title: 'Web Development Intern',
    company: 'Tech Solutions',
    duration: '3 months',
    location: 'Remote',
    description:
      'Build responsive web applications using modern frontend and backend technologies.'
  },
  {
    id: 'data-science',
    title: 'Data Science Intern',
    company: 'Data Innovations',
    duration: '4 months',
    location: 'Hybrid',
    description:
      'Work with datasets, analyze trends, and develop data-driven solutions.'
  },
  {
    id: 'java-development',
    title: 'Java Development Intern',
    company: 'CodeWorks',
    duration: '3 months',
    location: 'On-site',
    description:
      'Learn Java programming and contribute to backend application development.'
  },
  {
    id: 'ui-ux-design',
    title: 'UI/UX Design Intern',
    company: 'Creative Studio',
    duration: '2 months',
    location: 'Remote',
    description:
      'Design intuitive interfaces and improve user experiences.'
  }
];

// Get all internships
router.get('/internships', (req, res) => {
  res.json(internships);
});

// Get one internship by ID
router.get('/internships/:id', (req, res) => {
  const internship = internships.find(
    (item) => item.id === req.params.id
  );

  if (!internship) {
    return res.status(404).json({
      error: 'Internship not found'
    });
  }

  res.json(internship);
});

// Submit a student application
router.post('/applications', async (req, res) => {
  try {
    const {
      studentName,
      email,
      rollNumber,
      selectedInternship
    } = req.body;

    if (
      !studentName?.trim() ||
      !email?.trim() ||
      !rollNumber?.trim() ||
      !selectedInternship
    ) {
      return res.status(400).json({
        error: 'Please provide all required fields.'
      });
    }

    const internshipExists = internships.some(
      (item) => item.id === selectedInternship
    );

    if (!internshipExists) {
      return res.status(400).json({
        error: 'Please select a valid internship.'
      });
    }

    const application = await Application.create({
      studentName,
      email,
      rollNumber,
      selectedInternship
    });

    res.status(201).json({
      message: 'Application submitted successfully!',
      application
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        error: error.message
      });
    }

    console.error('Application submission error:', error);

    res.status(500).json({
      error: 'Server error while submitting application.'
    });
  }
});

// Retrieve all applications
router.get('/applications', async (req, res) => {
  try {
    const applications = await Application.find()
      .sort({ createdAt: -1 })
      .lean();

    res.json(applications);
  } catch (error) {
    console.error('Application retrieval error:', error);

    res.status(500).json({
      error: 'Server error while retrieving applications.'
    });
  }
});

module.exports = router;
