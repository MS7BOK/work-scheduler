document.addEventListener("DOMContentLoaded", function () {
    // Get the current date and time using dayjs
    const currentDate = dayjs();

    // Display the current day of the week, month, and date
    document.getElementById('currentDay').textContent = currentDate.format('dddd');
    document.getElementById('currentMonth').textContent = currentDate.format('MMMM');
    document.getElementById('currentDate').textContent = currentDate.format('D');

    const timeblocksContainer = document.querySelector(".timeblocks-container");
    const currentTime = currentDate.hour();

    for (let hour = 9; hour <= 17; hour++) {
        const timeblock = document.createElement("div");
        timeblock.classList.add("timeblock");

        // Calculate if the timeblock is in the past, present, or future
        const isPast = hour < currentTime;
        const isPresent = hour === currentTime;
        const timeblockStatus = isPast ? "past" : isPresent ? "present" : "future";

        // Color-coding based on the status
        const backgroundColor = {
            past: "#f0f0f0",   // Past timeblocks
            present: "#ffc107", // Current timeblock
            future: "#c2e0c6"   // Future timeblocks
        }[timeblockStatus];

        // Convert hour to 12-hour format with AM/PM
        const displayHour = (hour % 12) || 12;
        const amPm = hour >= 12 ? "PM" : "AM";

        const timeblockText = `${displayHour}:00 ${amPm} - ${(displayHour + 1) % 12 || 12}:00 ${amPm} (${timeblockStatus.charAt(0).toUpperCase() + timeblockStatus.slice(1)})`;

        // Set the background color and content of the timeblock
        timeblock.style.backgroundColor = backgroundColor;
        timeblock.innerHTML = `
            <div class="hour">${displayHour}:00 ${amPm}</div>
            <textarea class="${timeblockStatus}" placeholder="New Event"></textarea>
            <button class="save-btn">Save</button>
        `;

        timeblocksContainer.appendChild(timeblock);
    }

    timeblocksContainer.addEventListener("click", function (event) {
        if (event.target.classList.contains("save-btn")) {
            const textarea = event.target.previousElementSibling;
            const hour = textarea.parentElement.querySelector(".hour").textContent;
            const eventText = textarea.value.trim();

            if (eventText) {
                localStorage.setItem(hour, eventText);
            }
        }
    });

    // Retrieve and populate saved events from local storage
    for (let hour = 9; hour <= 17; hour++) {
        const eventText = localStorage.getItem(`${hour % 12 || 12}:00 ${hour >= 12 ? "PM" : "AM"}`);
        if (eventText) {
            const timeblockElements = document.querySelectorAll(".timeblock");
            timeblockElements.forEach((element) => {
                if (element.textContent.includes(`${hour % 12 || 12}:00 ${hour >= 12 ? "PM" : "AM"}`)) {
                    const textarea = element.querySelector("textarea");
                    textarea.value = eventText;
                }
            });
        }
    }
});
