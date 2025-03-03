/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("media", (table) => {
        table.increments("id").primary();
        table.string("title").notNullable();
        table.string("filepath").notNullable();
        table.integer("download_limit").notNullable();
        table.integer("category_id").unsigned().notNullable().references("id").inTable("category").onDelete("CASCADE");
        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable("media");
};
