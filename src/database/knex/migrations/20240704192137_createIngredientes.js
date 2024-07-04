exports.up = (knex) =>
  knex.schema.createTable("ingredientes", (table) => {
    table.increments("id").primary(); // cria o id da nota
    table
      .integer("prato_id")
      .references("id")
      .inTable("pratos")
      .onDelete("CASCADE"); // pega o id do usuário que criou a nota

    table.text("name").notNullable();

    table.timestamp("created_at").default(knex.fn.now());
    table.timestamp("updated_at").default(knex.fn.now());
  });

exports.down = (knex) => knex.schema.dropTable("ingredientes");
