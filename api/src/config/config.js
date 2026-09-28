module.exports = {
  development: {
    username: "postgres",
    password: "password",
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