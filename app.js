document.getElementById("form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const form = this;
  const message = document.getElementById("message");
  const button = form.querySelector("button[type='submit']");

  button.disabled = true;
  button.textContent = "Submitting...";

  const data = {
    name: form.name.value,
    email: form.email.value,
    phone: form.phone.value,
    dob: form.dob.value,
    state: form.state.value
  };

  try {
    const response = await fetch("/api/apply", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Submission failed");
    }

    message.textContent =
      "Application received. Your reference number is " +
      result.reference +
      ". Please save it for your records.";

    form.reset();
  } catch (error) {
    console.error(error);

    message.textContent =
      "Unable to submit your application right now. Please try again.";
  }

  button.disabled = false;
  button.textContent = "Submit Application";
});
