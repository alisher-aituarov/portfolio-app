const { createConnection } = require("typeorm");

(async function () {
  try {
    const connection = await createConnection();
    console.log("Connection with Postgres established");
  } catch (error) {
    throw new Error(error);
  }
})();
