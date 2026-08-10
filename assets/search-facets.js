// assets/search-facets.js
document.addEventListener('submit', async (e) => {
  const form = e.target.closest('[data-facet-form]');
  if (!form) return;

  e.preventDefault();

  const searchParams = new URLSearchParams(new FormData(form)).toString();
  const url = `${window.location.pathname}?${searchParams}`;

  const response = await fetch(`${url}&section_id=main-search`);
  const html = await response.text();

  const parser = new DOMParser();
  const newDoc = parser.parseFromString(html, 'text/html');
  const newContent = newDoc.querySelector('#MainSearch');

  document.querySelector('#MainSearch').replaceWith(newContent);
  history.replaceState(null, '', url);
});
