document.addEventListener("DOMContentLoaded", function () {
  // Add Candidate Button
  document.getElementById("addCandidate").addEventListener("click", function () {
    let name = document.getElementById("name").value.trim();
    let party = document.getElementById("party").value.trim();
    let message = document.getElementById("candidateMessage");

    if (name === "" || party === "") {
      message.style.color = "red";
      message.textContent = "⚠️ Please enter both candidate name and party!";
    } else {
      message.style.color = "green";
      message.textContent = `✅ Candidate ${name} from ${party} added successfully!`;

      // Clear input fields after submission
      setTimeout(() => {
        document.getElementById("name").value = "";
        document.getElementById("party").value = "";
        message.textContent = "";
      }, 2000);
    }
  });

  // Add Voting Date Button
  document.getElementById("addDate").addEventListener("click", function () {
    let startDate = new Date(document.getElementById("startDate").value);
    let endDate = new Date(document.getElementById("endDate").value);
    let today = new Date();
    let message = document.getElementById("dateMessage");

    if (!startDate || !endDate) {
      message.style.color = "red";
      message.textContent = "⚠️ Please select both start and end dates!";
    } else if (startDate < today) {
      message.style.color = "red";
      message.textContent = "⚠️ Start date cannot be in the past!";
    } else if (endDate <= startDate) {
      message.style.color = "red";
      message.textContent = "⚠️ End date must be after the start date!";
    } else {
      message.style.color = "green";
      message.textContent = `✅ Voting dates set from ${startDate.toDateString()} to ${endDate.toDateString()}!`;

      // Clear messages after 3 seconds
      setTimeout(() => {
        message.textContent = "";
      }, 3000);
    }
  });
});
