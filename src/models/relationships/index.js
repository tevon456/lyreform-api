function Relationships({ User, Token, Form, ...rest }) {
  // User Token Relationship
  User.hasMany(Token, {
    foreignKey: "user_id",
    onDelete: "CASCADE",
  });
  Token.belongsTo(User);

  // User Form Relationship
  User.hasMany(Form, {
    foreignKey: "user_id",
    onDelete: "CASCADE",
  });
  Form.belongsTo(User);
}

module.exports = Relationships;
