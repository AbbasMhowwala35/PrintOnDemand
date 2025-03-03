const { Model } = require("objection");

class Media extends Model {
  static get tableName() {
    return "media";
  }

  static get relationMappings() {
    const Category = require("./Category");

    return {
      category: {
        relation: Model.BelongsToOneRelation,
        modelClass: Category,
        join: {
          from: "media.category_id",
          to: "category.id",
        },
      },
    };
  }
}

module.exports = Media;
