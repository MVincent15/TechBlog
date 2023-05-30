const router = require("express").Router();
const { BlogPost, User, Comment } = require("../models");
const withAuth = require("../utils/auth");

/
router.get("/", async (req, res) => {
  try {
    const dbBlogPostData = await BlogPost.findAll({
      include: [
        {
          model: User,
          attributes: {
            exclude: ["password"],
          },
        },
      ],
    });

    const blogPosts = dbBlogPostData.map((blogPost) =>
      blogPost.get({ plain: true })
    );

    res.render("homepage", {
      blogPosts,
      loggedIn: req.session.loggedIn,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});


router.get("/blogpost/:id", withAuth, async (req, res) => {
  try {
    const dbBlogPostData = await BlogPost.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: {
            exclude: ["password"],
          },
        },
        { model: Comment,
        include: [{
          model: User,
          attributes: ['username']
        }] },
      ],
    });
    const blogPost = dbBlogPostData.get({ plain: true });

    res.render("blogpost", { blogPost, loggedIn: req.session.loggedIn });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get("/blogpost/:id/addcomment", withAuth, async (req, res) => {
  const blogPostId = req.params.id;
  res.render("addcomment", { blogPostId, loggedIn: req.session.loggedIn });
});


router.post("/blogpost/:id/addcomment", withAuth, async (req, res) => {
  try {
    const newComment = await Comment.create({
      user_id: req.session.user_id,
      blogpost_id: req.params.id,
      content: req.body.content,
    });
    const dbBlogPostData = await BlogPost.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: {
            exclude: ["password"],
          },
        },
        {
          model: Comment,
          include: [
            {
              model: User,
              attributes: ["username"],
            },
          ],
        },
      ],
    });

    const blogPost = dbBlogPostData.get({ plain: true });

    res.render("blogpost", { blogPost, loggedIn: req.session.loggedIn });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get("/dashboard", withAuth, async (req, res) => {
  try {
    const userBlogPostData = await BlogPost.findAll({
      where: {
        user_id: req.session.user_id
      },
      include: {
        model: User,
        attributes: {
          exclude: ['password']
        }
      }
    });
    const blogPosts = userBlogPostData.map((blogPost) =>
    blogPost.get({ plain: true })
  );
    console.log(blogPosts);

    res.render("dashboard", { blogPosts, loggedIn: req.session.loggedIn });

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get("/dashboard/addblogpost", withAuth, async (req, res) => {
  const blogPostUserId = req.session.user_id;
  res.render("addblogpost", { blogPostUserId, loggedIn: req.session.loggedIn });
});

router.post("/dashboard/addblogpost", withAuth, async (req, res) => {
  try {
    const newBlogPost = await BlogPost.create({
      user_id: req.session.user_id,
      title: req.body.title,
      content: req.body.content,
    });
    const userBlogPostData = await BlogPost.findAll({
      where: {
        user_id: req.session.user_id
      },
      include: {
        model: User,
        attributes: {
          exclude: ['password']
        }
      }
    });
    const blogPosts = userBlogPostData.map((blogPost) =>
    blogPost.get({ plain: true })
  );
    console.log(blogPosts);

    res.render("dashboard", { blogPosts, loggedIn: req.session.loggedIn });
    
   } catch (err) {
    console.log(err);
    res.status(500).json(err);
   }
  });

  router.get("/dashboard/updateblogpost/:id", withAuth, async (req, res) => {
    try {
      const dbBlogPostData = await BlogPost.findByPk(req.params.id, {
        include: [
          {
            model: User,
            attributes: {
              exclude: ["password"],
            },
          },
          { model: Comment,
          include: [{
            model: User,
            attributes: ['username']
          }] },
        ],
      });
      const blogPost = dbBlogPostData.get({ plain: true });
      res.render("updateblogpost", { blogPost, loggedIn: req.session.loggedIn });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  });

  router.put("/dashboard/updateblogpost/:id", withAuth, async (req, res) => {
    try {
      const dbBlogPostData = await BlogPost.update(req.body, {
        where: {
          id: req.params.id,
        },
      });
  
      if(!dbBlogPostData[0]) {
        res.status(404).json({message: 'No user with this id!'});
        return;
      }
   
      res.render("blogpost", { dbBlogPostData, loggedIn: req.session.loggedIn });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  });

  router.delete("/dashboard/deleteblogpost/:id", withAuth, async (req, res) => {
    try {
      const dbBlogPostData = await BlogPost.destroy({
        where: {
          id: req.params.id,
          user_id: req.session.user_id,
        },
      });

      if (!dbBlogPostData) {
        res.status(404).json({ message: 'No blogpost found with this id!' });
        return;
      }
      
      res.status(200).json(dbBlogPostData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err); 
    }
  })

router.get("/login", (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("/");
    return;
  }

  res.render("login");
});

router.get("/signup", (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("/");
    return;
  }
  res.render("signup");
});

router.get("/login-or-signup", (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("/");
    return;
  }
  res.render("login-or-signup");
})

module.exports = router;