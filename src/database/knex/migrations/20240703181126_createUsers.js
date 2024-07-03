exports.up = (knex) =>
  knex.schema.createTable("users", (table) => {
    table.increments("id").primary(); // cria uma coluna do tipo increments ou seja incrementa 1 cada vez que um usuário for criado e define como chave primaria

    table // do tipo enum com nome role ,[só permite que receba os valores que estão dentro do array] , {usa os drivers nativos do database pra verificar essa coluna , passa o nome da enum como roles}
      .enum("role", ["admin", "client"], { useNative: true, enumName: "roles" })
      .notNullable() // não pode ficar vazio
      .default("client"); // todo usuário criado começa como client

    // colunas do tipo text que não podem ficar vazias
    table.text("name").notNullable();
    table.text("email").notNullable();
    table.text("password").notNullable();
    table.text("avatar").nullable();

    // pega o tempo que foi criado e quando foi atualizado
    table.timestamp("created_at").default(knex.fn.now());
    table.timestamp("updated_at").default(knex.fn.now());
  });

exports.down = (knex) => knex.schema.dropTable("users"); // eclui a tabela users
