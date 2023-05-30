const router = require('express').Router();
const { User, Post, Comment } = require('../models');

const withAuth = require('../utils/auth');

router.get("/", async (req, res) => {
  try {
    const postData = await Post.findAll({
      include: [
        {
          model: User,
          attributes: {
            exclude: ["password"],
          },
        },
      ],
    });

    const posts = postData.map((blogPost) =>
      blogPost.get({ plain: true })
    );

    res.render("homepage", {
      posts,
      loggedIn: req.session.loggedIn,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get('/post/:id', withAuth, async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id, {
      include: [
        {
          model: Comment,
          attributes: ['id', 'comment_text', 'post_id', 'user_id'],
          include: {
            model: User, 
            attributes: ['username']
          },
        },
        {
          model: User, 
          attributes: ['username']
        },
      ],
    });

    const posts = postData.get({ plain: true });

    res.render('post', {
      posts,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});


router.get('/login', (req, res) => {
  if (req.session.logged_in) {
    res.redirect('/');
    return;
  }

  res.render('login');
});

router.get('/signup', (req, res) => {
  if (req.session.logged_in) {
    res.redirect('/');
    return;
  }

  res.render('signup');
});

module.exports = router;
