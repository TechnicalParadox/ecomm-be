const router = require('express').Router();
const { Category, Product, Tag, ProductTags } = require('../../models');

// The `/api/categories` endpoint

router.get('/', (req, res) => {
  // find all categories
  // be sure to include its associated Products
  Category.findAll(
  {
    attributes: ['id', 'category_name'],
    include:
    [{
      model: Product,
      attributes: ['id', 'product_name', 'price', 'stock'],
      include: [{ model: Tag, attributes: ['tag_name'], through: ProductTags, as: 'product_tags'}]
    }]
  })
  .then(categoryData => { res.json(categoryData); })
  .catch(err => { console.log(err); res.status(500).json(err); });
});

router.get('/:id', (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  Category.findOne(
  {
    attributes: ['id', 'category_name'],
    where: { id: req.params.id },
    include:
    [{
      model: Product,
      attributes: ['id', 'product_name', 'price', 'stock'],
      include: [{ model: Tag, attributes: ['tag_name'], through: ProductTags, as: 'product_tags'}]
    }]
  })
  .then(categoryData =>
  {
    if (!categoryData) { res.status(404).json({ message: 'No category with that ID' }); return; }
    res.status(200).json(categoryData);
  })
  .catch(err => { console.log(err); res.status(500).json(err); });
});

router.post('/', (req, res) => {
  // create a new category
  Category.create(req.body)
  .then(categoryData => { res.status(200).json(categoryData); })
  .catch(err => { console.log(err); res.status(500).json(err); });
});

router.put('/:id', (req, res) => {
  // update a category by its `id` value
  Category.update(req.body, { where: { id: req.params.id } } )
  .then(rowsAffected =>
  {
    if (!rowsAffected) { res.status(404).json({ message: 'No category with that ID or nothing to be updated' }); return; }
    res.status(200).json(rowsAffected);
  })
  .catch(err => { console.log(err); res.status(500).json(err); });
});

router.delete('/:id', (req, res) => {
  // delete a category by its `id` value
  Category.destroy({ where: { id: req.params.id } })
  .then(rowsAffected =>
  {
    if (!rowsAffected) { res.status(404).json({ message: 'No category with that ID' }); return; }
    res.status(200).json(rowsAffected);
  })
  .catch(err => { console.log(err); res.status(500).json(err); });
});

module.exports = router;
