window.stock = window.stock || {};

stock.frame = (function () {
  function background_img_off() {
    var bg_img = document.getElementById("bg-img");
    if(bg_img)
        bg_img.remove();
  }

  function background_img_on() {
    var bg_img = document.createElement("div");
    bg_img.setAttribute("id","bg-img")
    document.body.appendChild(bg_img)
  }

  var module = {
    background_img_off: background_img_off,
    background_img_on: background_img_on,
  };

  return module;
})();
