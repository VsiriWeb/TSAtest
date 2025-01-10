(function ($) {
    "use strict";

    // Send Reservation
    async function sendReservation() {
        const name = $("#name").val().trim();
        const email = $("#email").val().trim();
        const datetime = $("#datetime").val().trim();
        const select1 = $("#select1").val().trim();
        const message = $("#message").val().trim();

        if (!name || !email || !datetime || !select1) {
            alert("Please fill in all required fields.");
            return;
        }

        const reservationData = { name, email, datetime, select1, message };

        try {
            const response = await fetch("http://localhost:5000/send-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(reservationData),
            });

            if (response.ok) {
                $("#confirmationMessage").fadeIn();
                $("#reservationForm")[0].reset();
            } else {
                const errorData = await response.json();
                alert(`Failed to send email: ${errorData.message || "Unknown error"}`);
            }
        } catch (error) {
            console.error("Error:", error);
            alert(`Error occurred: ${error.message}`);
        }
    }

    // Attach sendReservation to button click dynamically
    document.addEventListener("DOMContentLoaded", function () {
        const reservationButton = document.querySelector("button[type='button']");
        if (reservationButton) {
            reservationButton.addEventListener("click", sendReservation);
        }
    });
})(jQuery);
