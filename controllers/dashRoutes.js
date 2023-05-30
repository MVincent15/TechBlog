const router = require('express').Router();
const { User, Post, Comment } = require('../models');
const sequelize = require('../config/connection');
const withAuth = require('../utils/auth');

router.get('/', withAuth, async (req, res) => {
    try {
        const postData = await Post.findByPk(req.session.user_id, {
            attributes: { exclude: ['password'] },
            include: [{
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
            ]
        });

        const posts = postData.get({ plain: true });

        res.render('dashboard', {
            posts,
            logged_in: true
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/edit/:id', withAuth, async (req, res) => {
    try {
        const postData = await Post.findByPk(req.params.id, {
            attributes: { exclude: ['password'] },
            include: [{
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
            ]
        });

        const posts = postData.get({ plain: true });

        res.render('edit', {
            posts,
            logged_in: true
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/newpost', (req, res) => {
    res.render('addPost', {
        loggedIn: true
    })
})

module.exports = router; 