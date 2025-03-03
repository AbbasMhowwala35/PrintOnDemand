const { Model } = require("objection");

class TokenBlacklist extends Model {
  static get tableName() {
    return "token_blacklist";
  }
}

module.exports = TokenBlacklist;
