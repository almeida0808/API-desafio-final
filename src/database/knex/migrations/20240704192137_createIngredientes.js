exports.up = (knex) =>
  knex.schema.createTable("ingredientes", (table) => {
    table.increments("id").primary();
    table
      .integer("prato_id")
      .references("id")
      .inTable("pratos")
      .onDelete("CASCADE");
    table.text("name").notNullable();

    table.timestamp("created_at").default(knex.fn.now());
    table.timestamp("updated_at").default(knex.fn.now());
  });

exports.down = (knex) => knex.schema.dropTable("ingredientes");
