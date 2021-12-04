var EntitySchema = require("typeorm").EntitySchema;

module.exports = new EntitySchema({
  name: "Picture",
  tableName: "pictures",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    name: {
      type: "varchar",
    },
    path: {
      type: "string",
    },
    is_main: {
      type: "boolean",
    },
  },
});
