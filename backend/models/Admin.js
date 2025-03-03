const { Model } = require('objection');

class Admin extends Model {
  static get tableName() {
    return 'admins'; // Make sure this matches your database table name
  }
}

module.exports = Admin; 