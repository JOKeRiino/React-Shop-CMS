module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', 'f79b6072d2ca89357e077f4a7d31ccba'),
  },
});
