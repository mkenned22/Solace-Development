$("#submitButton").on("click", function(event) {
    // Make sure to preventDefault on a submit event.
    event.preventDefault();

    var formData = {
        msgVpn: $("#msgVpn").val().trim(),
        username: $("#username"),
        password: $("#password"),
        app: $("#app"),
        desc: $("#desc")
    };

    // Send the POST request.
    $.post("/configure", formData, function(data) {
        console.log(data);
      }
    );
  });