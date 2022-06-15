module.exports = {
  async redirects() {
    return [
      {
        source: "/home",
        destination: "/",
        permanent: false,
      },
      {
        source: "/manageusers",
        destination: "/",
        permanent: false,
      },
      {
        source: "/manageorders",
        destination: "/",
        permanent: false,
      },
      {
        source: "/managesupplierbuyer",
        destination: "/",
        permanent: false,
      },
    ];
  },
};
