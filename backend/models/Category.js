const { Model } = require('objection');

class Category extends Model {
  static get tableName() {
    return 'category'; // Make sure this matches your database table name
  }
}

module.exports = Category; 