// Existing BlogFilter class for select dropdown
class BlogFilter extends HTMLElement {
  constructor() {
    super();

    const filter = document.querySelector('select');
    filter.addEventListener('change', function() {
      window.location.href = filter.value;
    });
  }
}

customElements.define('blog-filter', BlogFilter);

// New checkbox filter functionality with loader
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("blogFilterForm");
  const container = document.querySelector(".recipe-articles-container");

  if (!form || !container) return;

  form.addEventListener("change", async () => {
    const selectedTags = Array.from(form.querySelectorAll("input[name='tag']:checked")).map(
      (input) => input.value
    );

    // Show loader immediately
    container.innerHTML = `<div class="loader-container" style="display: flex; justify-content: center; align-items: center; min-height: 300px;">
        <div class="loader" style="width: 48px; height: 48px; border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; animation: spin 1s linear infinite;"></div>
      </div>`;

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