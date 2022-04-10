const Product = require("../modals/product");
const shortId = require("shortid");
const slugify = require("slugify");
const Category = require("../modals/category");

exports.createProduct = (req, res) => {
  // res.status(200).json({ file: req.files, body: req.body });

  const { name, price, description, category, quantity } = req.body;

  let productPictures = [];

  if (req.files.length > 0) {
    productPictures = req.files.map((file) => {
      return { img: file.filename };
    });
  }
  const product = new Product({
    name,
    slug: slugify(name),
    price,
    description,
    productPictures,
    category,
    quantity,
    createdBy: req.user.id,
  });

  product.save((error, products) => {
    if (error) return res.status(400).json({ error });

    if (products) {
      res.status(201).json({ products });
    }
  });
};

exports.getProductsBySlug = (req, res) => {
  // To fetch URL parameter of req
  const { slug } = req.params;
  Category.findOne({ slug: slug })
    .select("_id")
    .exec((error, category) => {
      if (error) return res.status(400).json({ error });

      if (category) {
        Product.find({ category: category._id }).exec((error, products) => {
          if (error) return res.status(400).json({ error });

          if (category.type) {
            if (products.length > 0) {
              res.status(200).json({
                products,
                productsByPrice: {
                  under5k: products.filter((product) => product.price <= 5000),
                  under10k: products.filter(
                    (product) => product.price > 5000 && product.price <= 10000
                  ),
                  under15k: products.filter(
                    (product) => product.price > 10000 && product.price <= 15000
                  ),
                  above15k: products.filter((product) => product.price > 15000),
                },
              });
            }
          }else{
            res.status(200).json({ products })
          }
        });
      }
    });
};

exports.getProductDetailsById = (req, res) => {
  const { productId } = req.params;

  if (productId) {
    Product.findOne({ _id: productId }).exec((error, product) => {
      if (error) return res.status(400).json({ error });

      if (product) {
        res.status(200).json({ product });
      }
    });
  } else {
    return res.status(400).json({ error: "Params Required" });
  }
};
