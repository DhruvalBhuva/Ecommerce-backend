const slugify = require("slugify");
const Category = require("../modals/category");
const shortid = require("shortid");

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
      type: cat.type,
      parentId: cat.parentId,
      children: createCategoryList(categories, cat._id),
    });
  }

  return categoryList;
};

exports.addCategory = (req, res) => {
  const categoryObj = {
    name: req.body.name,
    // slug: slugify(req.body.name),
    slug: `${slugify(req.body.name)}-${shortid.generate()}`,
  };
  if (req.file) {
    categoryObj.categoryImage =
      "/public/" + req.file.filename;
  }

  if (req.body.parentId) {
    categoryObj.parentId = req.body.parentId;
  }

  const cat = new Category(categoryObj);
  cat.save((error, category) => {
    if (error) return res.status(400).json({ error });

    if (category) {
      return res.status(200).json({ category });
    }
  });
};

exports.getCategories = (req, res) => {
  Category.find({}).exec((error, categories) => {
    if (error) return res.status(400).json({ error });

    if (categories) {
      const categoryList = createCategoryList(categories);

      return res.status(200).json({ categoryList });
    }
  });
};

exports.updateCategories = async (req, res) => {
  const { _id, name, parentId, type } = req.body;
  const updatedCategories = [];

  // if change in single item then It'll be object, for multiple item array
  if (name instanceof Array) {
    for (let i = 0; i < name.length; i++) {
      const category = {
        name: name[i],
        type: type[i],
      };

      if (parentId[i] !== "") {
        category.parentId = parentId[i];
      }

      const updatedCategory = await Category.findOneAndUpdate(
        { _id: _id[i] },
        category,
        { new: true }
      );
      updatedCategories.push(updatedCategory);
    }
    return res.status(200).json({ updatedCategories: req.body });
  } else {
    const category = {
      name,
      type,
    };
    if (parentId !== "") {
      category.parentId = parentId;
    }

    const updatedCategory = await Category.findOneAndUpdate({ _id }, category, {
      new: true,
    });
    return res.status(200).json({ updatedCategory });
  }
};

exports.deleteCategories = async (req, res) => {
  const { idsArray } = req.body.payload;
  const deletedCategories = [];
  for (let i = 0; i < idsArray.length; i++) {
    const delteCategory = await Category.findOneAndDelete({
      _id: idsArray[i]._id,
    });
    deletedCategories.push(delteCategory);
  }

  if (deletedCategories.length === idsArray.length) {
    return res.status(200).json({ message: "Category removed" });
  } else {
    return res.status(400).json({ message: "Something wrong" });
  }
};
