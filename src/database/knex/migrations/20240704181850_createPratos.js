exports.up = (knex) =>
  knex.schema.createTable("pratos", (table) => {
    table.increments("id").primary();
    table
      .integer("user_id")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table
      .enum("category", ["bebida", "sobremesa", "refeição"], {
        useNative: true,
        enumName: "category",
      })
      .notNullable()
      .default("bebida");

    table.text("name").notNullable();
    table.text("value").notNullable();

    table.text("imageUrl").notNullable();
    table.text("description").notNullable();

    table.timestamp("created_at").default(knex.fn.now());
    table.timestamp("updated_at").default(knex.fn.now());
  });

exports.down = (knex) => knex.schema.dropTable("pratos");
