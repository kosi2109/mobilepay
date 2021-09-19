var videoId = document.getElementById("preview");
var scanner = new Instascan.Scanner({
  video: videoId,
});
const scaned = document.getElementById("scaned");
const phone = document.getElementById("phone");
Instascan.Camera.getCameras()
  .then(function (cameras) {
    if (cameras.length > 0) {
      if (cameras[1]) {
        scanner.start(cameras[1]);
      } else {
        scanner.start(cameras[0]);
      }
    } else {
      window.alert("No camera found");
    }
  })
  .catch(function (e) {
    window.alert(e);
  });

scanner.addListener("scan", function (content) {
  if (content) {
    phone.value = "" + content;
    scaned.click();
    scanner.stop();
  }

  // const username = obj.username;
  // const passwords = obj.password;
  // const name = document.getElementById("username");
  // const password = document.getElementById("password");
  // if (content) {
  //   scanner.stop();
  //   name.value = username;
  //   password.value = passwords;
  //   document.getElementById("tablesubmit").click();
  // }
});
