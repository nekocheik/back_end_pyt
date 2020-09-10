protectedRouter.get('/event', (req, res, next) => {
  const uId = res.locals.decoded.uuid;
  Event.create({
    name: 'dfsfdsds',
    description: 'DataTypes.STRING',
    user_id: uId,
  })
    .then((event) => {
      res.status(200).json({
        event,
      });
    }).catch((error) => res.status(400).json({ error }));
});
