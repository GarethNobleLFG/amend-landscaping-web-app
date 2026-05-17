module.exports = {
  development: {
    username: "postgres",
    password: process.env.LOCAL_POSTGRES_PASSWORD,
    database: "amend_landscaping",
    host: "host.docker.internal",
    dialect: "postgres"
  }
};