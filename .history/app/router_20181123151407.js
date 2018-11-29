module.exports = app => {
  const { router, controller } = app;
  const jwt = app.middleware.jwt();
  router.post('/login', controller.user.login);
  router.get('/', controller.home.index);
  router.post('/tags', jwt, controller.tags.create);
  router.get('/tags', controller.tags.get);
  router.get('/tags/:id', controller.tags.get);
  router.put('/tags/:id', jwt, controller.tags.findByIdAndUpdate);
  router.delete('/tags/:id', jwt, controller.tags.deleteTag);
  router.get('/user', jwt, controller.user.getUserInfo);
  router.post('/articles', jwt, controller.article.create);
  router.get('/articles', controller.article.getArticles);
  router.get('/articles/:_id', controller.article.getArticle);
  router.put('/articles/:_id', jwt, controller.article.findByIdAndUpdate);
  router.delete('/articles/:id', jwt, controller.article.deleteArticle);
  router.get('/articles/tags/:tag', controller.article.findByTag);
  router.get('/articles/category/:category', controller.article.findByCategory);

  /* upload*/
  router.post('/img/upload', jwt, controller.images.upload);
  router.post('/categories', jwt, controller.categories.create);
  router.get('/categories', controller.categories.getCategories);
  router.get('/categories/count', controller.categories.getAggregateCategories);

  router.put('/categories/:id', jwt, controller.categories.findByIdAndUpdate);
  router.delete('/categories/:id', jwt, controller.categories.deleteCategory);
};
