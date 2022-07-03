const { Category } = require('./../models/Category');

const categoryCtrl = {
  getCategory: async (req, res) => {
    try {
      const categories = await Category.find();

      return res.status(200).json({ categories });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  createCategory: async (req, res) => {
    try {
      const { name } = req.body;
      if (!name)
        return res.status(400).json({ msg: 'Please provide category name.' });

      const category = await Category.findOne({ name });
      if (category)
        return res
          .status(400)
          .json({ msg: `Category with name ${name} has been created before.` });

      const newCategory = new Category({ name });

      await newCategory.save();

      return res.status(200).json({
        msg: `${newCategory.name} category created.`,
        category: newCategory,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = categoryCtrl;
