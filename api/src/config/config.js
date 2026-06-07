module.exports = {
  development: {
    username: "postgres",
    password: process.env.LOCAL_POSTGRES_PASSWORD,
    database: "amend_landscaping",
    host: "db",
    dialect: "postgres"
  },
  production: {
    use_env_variable: "DATABASE_URL",
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
};