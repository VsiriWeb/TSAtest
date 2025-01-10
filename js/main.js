

(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();

    // Initiate the WOW.js animations
    new WOW().init();

    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 45) {
            $('.navbar').addClass('sticky-top shadow-sm');
        } else {
            $('.navbar').removeClass('sticky-top shadow-sm');
        }
    });

    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        center: true,
        margin: 24,
        dots: true,
        loop: true,
        nav: false,
        responsive: {
            0: { items: 1 },
            768: { items: 2 },
            992: { items: 3 },
        },
    });
    // Dropdown on mouse hover
    const $dropdown = $(".dropdown");
    const $dropdownToggle = $(".dropdown-toggle");
    const $dropdownMenu = $(".dropdown-menu");
    const showClass = "show";

    $(window).on("load resize", function () {
        if (this.matchMedia("(min-width: 992px)").matches) {
            $dropdown.hover(
                function () {
                    const $this = $(this);
                    $this.addClass(showClass);
                    $this.find($dropdownToggle).attr("aria-expanded", "true");
                    $this.find($dropdownMenu).addClass(showClass);
                },
                function () {
                    const $this = $(this);
                    $this.removeClass(showClass);
                    $this.find($dropdownToggle).attr("aria-expanded", "false");
                    $this.find($dropdownMenu).removeClass(showClass);
                }
            );
        } else {
            $dropdown.off("mouseenter mouseleave");
        }
    });

    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({ scrollTop: 0 }, 1500, 'easeInOutExpo');
        return false;
    });

    // Facts Counter
    $('[data-toggle="counter-up"]').counterUp({
        delay: 10,
        time: 2000,
    });
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

    // Attach sendReservation to button click dynamically to avoid multiple bindings
    document.addEventListener("DOMContentLoaded", function () {
        const reservationButton = document.querySelector("button[type='button']");
        if (reservationButton) {
            reservationButton.addEventListener("click", sendReservation);
        }
    });

})(jQuery);
