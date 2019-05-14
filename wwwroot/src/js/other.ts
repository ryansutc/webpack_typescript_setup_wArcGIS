//other.js
function func() {
  console.log('loaded!');

  $("#success").fadeIn("slow", function () {
    var name = $("#yerName");
    name.text("Jquery!");
    console.log(name.text());
  });
}
export default func;