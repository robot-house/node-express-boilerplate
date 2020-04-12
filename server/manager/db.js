/**
 *  Queries in the db for all items
 *
 *  @param {Object} options Options needed for db query.
 *  @returns {Object} Returns the result of the db query.
 */
const dbFetchAll = async (options) => {
  let itemObject;
  let { model, select } = options;

  if (select) {
    select = arrayToString(options.select);
    itemObject = await model.find().select(select);
  } else {
    itemObject = await model.find();
  }
  return itemObject;
};

/**
 *  Queries the db for item that match given ID
 *
 *  @param {Object} options Options needed for db query.
 *  @returns {Object} Returns the result of the db query.
 */
const dbFetchById = async (options) => {
  let itemObject;
  let { model, id, select } = options;

  if (select) {
    select = arrayToString(select);
    itemObject = await model.findById(id).select(select);
  } else {
    itemObject = await model.findById(id);
  }
  return itemObject;
};

/**
 *  Queries the db for items that match given field
 *
 *  @param {Object} options Options needed for db query.
 *  @returns {Object} Returns the result of the db query.
 */
const dbFetchByfield = async (options) => {
  let itemObject;
  let { model, fieldValue, fieldName, select } = options;

  if (select) {
    select = arrayToString(select);
    itemObject = await model
      .findOne({ [fieldName]: fieldValue })
      .select(select);
  } else {
    itemObject = await model.findOne({ [fieldName]: fieldValue });
  }
  return itemObject;
};

/**
 *  Saves the given item in the db
 *
 *  @param {Object} options Options needed for db query.
 */
const dbSave = async (options) => {
  await options.item.save();
};

/**
 *  Updates a user's data.
 *  POST object must contain only fields to be updated.
 *
 *  @param {Array} array An array of strings.
 *  @returns {String} Returns a space separated concatenated string of items in array.
 */
const arrayToString = (array) => {
  let string = '';
  array.forEach((item) => (string += `${item} `));
  return string.trim();
};

module.exports = {
  dbFetchAll,
  dbFetchById,
  dbFetchByfield,
  dbSave,
};
