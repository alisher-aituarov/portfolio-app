const { createConnection } = require("typeorm");
//
export const connection = (async function () {
  try {
    const connection = await createConnection();
    console.log("Connection with Postgres established");
    return connection;
  } catch (error) {
    throw new Error(error);
  }
})();
//
