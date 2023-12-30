const router = require('express').Router();
const { blog } = require('../../models');

// Create a new blog
router.post('/', async (req, res) => {
    try {
        await blog.create({
            ...eventBody,
            userId: req.session.currentUser.userId,
        });
        res.status(200).redirect('/dashboard');
    } catch (err) {
        res.status(400).json(err.message);
    }
});


// Update an blog by its `id` value
router.put('/:id', async (req, res) => {
    try {
        const blog = await Blog.update(req.body, {
            where: { id: req.params.id },
        });
        res.status(200).json(blog);
    } catch (err) {
        res.status(400).json(err);
    }
});

// Delete an blog by its `id` value
router.delete('/:id', async (req, res) => {

    try {
        const blog = await blog.destroy({
            where: { id: req.params.id },
        });
        res.status(200).json(blog);
    } catch (err) {
        res.status(400).json(err);
    }
});

module.exports = router;
