const router = require('express').Router();
const withAuth = require('../utils/auth.js');
const { Comment, User, Blog } = require('../models');

// GET all events for homepage
router.get('/', async (req, res) => {
  try {
    const userdata = await User.findByPk(req.session.currentUser?.userId);
    const currentUser = userdata?.get({ plain: true }).username;

    const blogsData = await Blog.findAll({
      include: [{ model: User }],
    });


    // Remove from the session returnTo varuable which contains originalUrl
    delete req.session.returnTo;

    res.render('homepage', {
      loggedIn: req.session.currentUser?.loggedIn,
      blogs: blogsData.reverse(),
      currentUser,
    });
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// GET an event for event details page
router.get('/blogs/:id', async (req, res) => {
  try {
    const userdata = await User.findByPk(req.session.currentUser?.userId);
    const currentUser = userdata?.get({ plain: true }).username;

    const blogData = await Blog.findByPk(req.params.id, {
      include: [
        { model: User },
        {
          model: Comment,
          include: [{ model: User }],
        },
        { model: User, as: 'eventGuests' },
      ],
    });
    if (!blogData) {
      res.status(404).json({ message: 'No blog with this id!' });
      return;
    }

    const blog = blogData.get({ plain: true });

    // Add to the comments array the current user id
    blog.comments = blog.comments.map((el) => ({
      ...el,
      currentUserId: req.session.currentUser?.userId,
    }));

  } catch (err) {
    res.status(500).json(err.message);
  }
});

// GET all events for user's dashboard page
router.get('/dashboard', withAuth, async (req, res) => {
  try {
    const userdata = await User.findByPk(req.session.currentUser?.userId);
    const currentUser = userdata?.get({ plain: true }).username;

    const blogData = await Blog.findAll({
      where: { userId: req.session.currentUser.userId },
      include: [{ model: User }],
    });

    res.render('dashboard', {
      loggedIn: req.session.currentUser?.loggedIn,
      idDashboard: true,
      blogs: blogData.reverse(),
      currentUser,
    });
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// Create event page
router.get('/dashboard/create', async (req, res) => {
  try {
    const userdata = await User.findByPk(req.session.currentUser?.userId);
    const currentUser = userdata?.get({ plain: true }).username;

    res.render('blogForm', {
      isCreate: true,
      loggedIn: req.session.currentUser?.loggedIn,
      idDashboard: true,
      currentUser,
    });
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// Update event page
router.get('/dashboard/update/:id', async (req, res) => {
  try {
    const userdata = await User.findByPk(req.session.currentUser?.userId);
    const currentUser = userdata?.get({ plain: true }).username;

    const blogData = await blog.findByPk(req.params.id);
    if (!blogData) {
      res.status(404).json({ message: 'No event with this id!' });
      return;
    }

    const blog = blogData.get({ plain: true });

    res.render('blogForm', {
      loggedIn: req.session.currentUser?.loggedIn,
      idDashboard: true,
      ...blog,
      currentUser
    });
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// Login page
router.get('/login', (req, res) => {
  if (req.session.currentUser?.loggedIn) {
    res.redirect('/');
    return;
  }

  res.render('login', { returnTo: req.session.returnTo });
});

module.exports = router;