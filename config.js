exports.DATABASE_URL = process.env.DATABASE_URL ||
                       global.DATABASE_URL ||
                      'mongodb://localhost/blog-test';
                      //'mongodb://testUser:Hi5Michael@ds149577.mlab.com:49577/temptestdb';
exports.PORT = process.env.PORT || 8080;