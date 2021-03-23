function Relationships({ User, Token, ...rest }) {
  User.hasMany(Token, {
    foreignKey: "user_id",
    onDelete: "CASCADE",
  });
  Token.belongsTo(User);
}

module.exports = Relationships;
