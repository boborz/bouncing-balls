define(function () {
  return {
    random: function(min, max) {
      var num = Math.floor(Math.random() * (max - min)) + min;
      return num;
    },
  };
});
