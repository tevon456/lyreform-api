function Relationships({ User, Token, Form, Submission }) {
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

  // Form Submission Relationship
  Form.hasMany(Submission, {
    foreignKey: "form_id",
    onDelete: "CASCADE",
  });
  Submission.belongsTo(Form);
}

module.exports = Relationships;
