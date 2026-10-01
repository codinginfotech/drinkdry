document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("blogFilterForm");
  const container = document.querySelector(".recipe-articles-container");

  if (!form || !container) return;

  form.addEventListener("change", async () => {
    const selectedTags = Array.from(form.querySelectorAll("input[name='tag']:checked")).map(
      (input) => input.value
    );

    // Show loader immediately
    container.innerHTML = `
      <div class="loader-container">
        <div class="loader"></div>
      </div>
    `;

    // Build blog URL for AJAX
    let blogUrl = window.location.pathname;
    if (selectedTags.length > 0) {
      blogUrl += "/tagged/" + selectedTags.map(encodeURIComponent).join("+");
    }

    try {
      const response = await fetch(`${blogUrl}?view=ajax`);
      if (!response.ok) throw new Error("Network error while fetching blogs");

      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const newContent = doc.querySelector(".recipe-articles-container");

      if (newContent) {
        container.innerHTML = newContent.innerHTML;
      } else {
        container.innerHTML = "<p>No articles found for selected filters.</p>";
      }
    } catch (error) {
      console.error("AJAX Filter Error:", error);
      container.innerHTML = "<p>Error loading articles. Please try again.</p>";
    }
  });
});