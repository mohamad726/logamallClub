const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');  // فایل پایگاه داده که باید در سرور قرار گیرد
const middlewares = jsonServer.defaults();

// استفاده از میان‌افزارها برای درخواست‌های پیش‌فرض
server.use(middlewares);
server.use(router);

server.listen(3000, () => {
  console.log('JSON Server is running');
});
