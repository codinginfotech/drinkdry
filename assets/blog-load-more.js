document.addEventListener('DOMContentLoaded', function() {
  const loadMoreButton = document.querySelector('.load-more-button');
  const blogContainer = document.getElementById('blog-articles-container');

  if (loadMoreButton && blogContainer) {
    loadMoreButton.addEventListener('click', function(e) {
      e.preventDefault();

      const nextPageUrl = this.getAttribute('href');
      if (!nextPageUrl) return;

      loadMoreButton.textContent = 'Loading...';
      loadMoreButton.disabled = true;

      fetch(nextPageUrl)
        .then(response => response.text())
        .then(html => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, 'text/html');

          // FIX 1: Grab only the individual article child elements,
          // NOT the whole innerHTML (which caused duplicate articles)
          const newArticles = doc.querySelectorAll('#blog-articles-container .blog-articles__article');
          newArticles.forEach(article => {
            blogContainer.appendChild(article);
          });

          // FIX 2: Read next URL from the container's data-next-url attribute
          // instead of looking for the button (which may not exist on last page)
          const newContainer = doc.getElementById('blog-articles-container');
          const nextNextPageUrl = newContainer ? newContainer.getAttribute('data-next-url') : null;

          if (nextNextPageUrl) {
            loadMoreButton.setAttribute('href', nextNextPageUrl);
            loadMoreButton.textContent = 'See More';
            loadMoreButton.disabled = false;
          } else {
            // No more pages — hide the button wrapper
            const wrapper = loadMoreButton.closest('.load-more-blog');
            if (wrapper) {
              wrapper.remove();
            } else {
              loadMoreButton.remove();
            }
          }
        })
        .catch(error => {
          console.error('Error fetching more articles:', error);
          loadMoreButton.textContent = 'See More';
          loadMoreButton.disabled = false;
        });
    });
  }
});