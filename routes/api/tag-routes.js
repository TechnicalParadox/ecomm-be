const router = require('express').Router();
const { Tag, Product, ProductTag, Category } = require('../../models');

// The `/api/tags` endpoint

router.get('/', (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  Tag.findAll(
  {
    attributes: ['id', 'tag_name'],
    include:
    [{
      model: Product,
      attributes: ['id', 'product_name', 'price', 'stock'],
      include: [{ model: Category, attributes: ['category_name', 'id'] }],
      through: ProductTag, as: 'tagged_products'
    }]
  })
  .then(tagData => { res.status(200).json(tagData); })
  .catch(err => { console.log(err); res.status(500).json(err); });
});

router.get('/:id', (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  Tag.findOne(
  {
    attributes: ['id', 'tag_name'],
    where: { id: req.params.id },
    include:
    [{
      model: Product,
      attributes: ['id', 'product_name', 'price', 'stock'],
      include: [{ model: Category, attributes: ['category_name', 'id'] }],
      through: ProductTag, as: 'tagged_products'
    }]
  })
  .then(tagData =>
  {
    if (!tagData) { res.status(404).json({ message: 'No tag with that ID' }); return; }
    res.status(200).json(tagData);
  })
  .catch(err => { console.log(err); res.status(500).json(err); });
});

router.post('/', (req, res) => {
  // create a new tag
  Tag.create(req.body)
  .then(tagData => { res.status(200).json(tagData); })
  .catch(err => { console.log(err); res.status(500).json(err); });
});

router.put('/:id', (req, res) => {
  // update a tag's name by its `id` value
  Tag.update(req.body, { where: { id: req.params.id } })
  .then(rowsAffected =>
  {
    if (!rowsAffected) { res.status(404).json({ message: 'No tag with that ID or nothing to be updated' }); return; }
    res.status(200).json(rowsAffected);
  })
  .catch(err => { console.log(err); res.status(500).json(err); });
});

router.delete('/:id', (req, res) => {
  // delete on tag by its `id` value
  Tag.destroy({ where: { id: req.params.id } })
  .then(rowsAffected =>
  {
    if (!rowsAffected) { res.status(404).json({ message: 'No tag with that ID' }); return; }
    res.status(200).json(rowsAffected);
  })
});

module.exports = router;
