const bcrypt = require('bcryptjs');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  const hashedPassword = await bcrypt.hash('password', 10);
  // Deletes ALL existing entries
  await knex('admins').del()
  await knex('admins').insert([
    { name: 'Super Admin', email: 'admin@admin.com',username:"admin", password: hashedPassword }
  ]);
};
