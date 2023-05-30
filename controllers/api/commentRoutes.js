const router = require('express').Router();
const { User, Post, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

router.get('/', async (req, res) => {
    try {
        const commentData = await Comment.findAll({
            attributes: {
                exclude: ['password']
            }
        });

        req.json(commentData);

    } catch (err) {
        res.status(400).json(err);
    }
});

router.post('/', withAuth, async (req, res) => {
    try {
        if (req.session) {
            const newComment = await Comment.create({
                comment_text: req.body.comment_text,
                post_id: req.body.post_id,
                user_id: req.session.user_id,
            });
    
            res.status(200).json(newComment);
        }
       
    } catch (err) {
        res.status(400).json(err);
    }
});

module.exports = router;