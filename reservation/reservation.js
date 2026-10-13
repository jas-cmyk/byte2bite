(function () {
  var form = document.querySelector(".reservation-form");
  var confirm = document.getElementById("confirm");
  if (!form || !confirm) return;

  var qrBox = document.getElementById("confirm-qr");
  var hint = document.getElementById("confirm-hint");
  var link = document.getElementById("confirm-link");
  var again = document.getElementById("again");
  var apiUrl = (form.dataset.api || "http://localhost:3000").replace(/\/+$/, "");

  function setState(text, isError) {
    qrBox.textContent = "";
    hint.textContent = text;
    hint.classList.toggle("is-error", !!isError);
    link.style.display = "none";
    again.textContent = "Try again";
  }

  function render(data) {
    qrBox.textContent = "";
    if (data.qr) {
      var img = document.createElement("img");
      img.src = data.qr;
      img.alt = "Reservation QR code";
      img.width = 200;
      img.height = 200;
      qrBox.appendChild(img);
    }
    link.href = data.viewUrl;
    link.style.display = "inline-block";
    again.textContent = "Make another reservation";
  }

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    var payload = {
      name: document.getElementById("full-name").value.trim(),
      phone: document.getElementById("phonenumber").value.trim(),
      email: document.getElementById("email").value.trim(),
      datetime: document.getElementById("reservation-date").value,
      guests: Number(document.getElementById("guests").value),
      tableId: (document.querySelector('input[name="table"]:checked') || {}).id || "t1",
      special: document.getElementById("special-request").value.trim(),
    };

    confirm.hidden = false;
    setState("Saving reservation...", false);

    var response;
    try {
      response = await fetch(apiUrl + "/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      setState("Could not reach the server. Start it and try again.", true);
      return;
    }

    if (!response.ok) {
      var message = "Could not save the reservation.";
      try {
        var body = await response.json();
        if (body && body.error) message = body.error;
      } catch (err) {}
      setState(message, true);
      return;
    }

    form.hidden = true;
    var data = await response.json();
    setState("Reservation saved. Scan this QR to open it on any phone.", false);
    render(data);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  again.addEventListener("click", function () {
    confirm.hidden = true;
    form.hidden = false;
    form.reset();
  });
})();