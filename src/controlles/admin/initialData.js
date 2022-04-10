const Category = require("../../modals/category");
const Product = require("../../modals/product");

const createCategoryList = (categories, parentId = null) => {
  const categoryList = [];
  let category;
  if (parentId == null) {
    category = categories.filter((cat) => cat.parentId == undefined);
  } else {
    category = categories.filter((cat) => cat.parentId == parentId);
  }

  for (let cat of category) {
    categoryList.push({
      _id: cat._id,
      name: cat.name,
      slug: cat.slug,
      parentId: cat.parentId,
      type: cat.type,
      children: createCategoryList(categories, cat._id),
    });
  }

  return categoryList;
};

exports.initialData = async (req, res) => {
  // find() return all items
  const categories = await Category.find({}).exec();

  /**
   * .select() ==> used to retrive selected items
   * .populate()  ==> used as foriugn key and select items form other model
   */
  const products = await Product.find({})
    .select("_id name price quantity slug description category productPictures")
    .populate({ path: "category", select: "_id name" })
    .exec();

  res.status(200).json({
    categories: createCategoryList(categories),
    products,
  });
};
