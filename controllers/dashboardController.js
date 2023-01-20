const dashboard = (req, res) => {
  res.json({ email: req.user.email });
};

module.exports = dashboard;
