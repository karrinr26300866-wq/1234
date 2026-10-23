const API_URL = "https://commons.wikimedia.org/w/api.php";
const form = document.querySelector("#search-form");
const input = document.querySelector("#search-input");
const button = document.querySelector("#search-button");
const statusArea = document.querySelector("#status-area");
const grid = document.querySelector("#image-grid");
const title = document.querySelector("#results-title");
const subtitle = document.querySelector("#results-subtitle");
const count = document.querySelector("#result-count");
const section = document.querySelector(".results");

form.addEventListener("submit", e => {
  e.preventDefault();
  const query = input.value.trim();
  if (query) searchImages(query);
});
document.querySelectorAll("[data-query]").forEach(item => item.addEventListener("click", () => {
  input.value = item.dataset.query;
  searchImages(item.dataset.query);
}));

function showMessage(type, heading, message, icon) {
  statusArea.innerHTML = `<div class="message-card ${type}"><span class="message-icon">${icon}</span><h3>${escapeHTML(heading)}</h3><p>${escapeHTML(message)}</p></div>`;
}
function showLoading() {
  statusArea.innerHTML = `<div class="loading-message"><div class="spinner" role="status" aria-label="Loading"></div><p>Searching for images…</p></div>
  <div class="skeleton-grid" aria-hidden="true">${Array.from({length:6},()=>`<div class="skeleton-card"><div class="skeleton-image"></div><div class="skeleton-line"></div><div class="skeleton-line short"></div></div>`).join("")}</div>`;
}
async function searchImages(query) {
  section.setAttribute("aria-busy","true");
  button.disabled = true;
  button.textContent = "Searching…";
  grid.innerHTML = "";
  count.textContent = "";
  title.textContent = `Searching for “${query}”`;
  subtitle.textContent = "Please wait while we find matching images.";
  showLoading();

  const params = new URLSearchParams({
    action:"query", generator:"search", gsrsearch:query, gsrnamespace:"6", gsrlimit:"18",
    prop:"imageinfo", iiprop:"url|extmetadata", iiurlwidth:"600", format:"json", origin:"*"
  });
  try {
    const response = await fetch(`${API_URL}?${params}`);
    if (!response.ok) throw new Error(`Request failed: ${response.status}`);
    const data = await response.json();
    const pages = data.query?.pages ? Object.values(data.query.pages) : [];
    const images = pages.filter(p => p.imageinfo?.[0]).map(p => {
      const info = p.imageinfo[0];
      const metadata = info.extmetadata || {};
      return {
        title:p.title.replace(/^File:/,"").replace(/_/g," "),
        imageUrl:info.thumburl || info.url,
        pageUrl:info.descriptionurl || "https://commons.wikimedia.org/",
        artist:metadata.Artist ? stripHTML(metadata.Artist.value) : "Wikimedia Commons"
      };
    }).filter(item => item.imageUrl);

    statusArea.innerHTML = "";
    title.textContent = `Results for “${query}”`;
    if (!images.length) {
      subtitle.textContent = "Try another word or a broader topic.";
      showMessage("empty","No images found",`We couldn't find images for “${query}”. Try another search.`,"⌕");
      return;
    }
    subtitle.textContent = "A little inspiration, picked from Wikimedia Commons.";
    count.textContent = `Showing ${images.length} ${images.length === 1 ? "result" : "results"}`;
    grid.innerHTML = images.map((image,i) => `<article class="image-card" style="animation-delay:${Math.min(i*45,350)}ms">
      <a href="${escapeAttr(image.pageUrl)}" target="_blank" rel="noopener noreferrer"><img src="${escapeAttr(image.imageUrl)}" alt="${escapeAttr(image.title)}" loading="lazy"></a>
      <div class="image-card-body"><h3>${escapeHTML(image.title)}</h3><p>By ${escapeHTML(image.artist)} · <a href="${escapeAttr(image.pageUrl)}" target="_blank" rel="noopener noreferrer">View source</a></p></div></article>`).join("");
  } catch (error) {
    console.error("Image search failed:",error);
    title.textContent = "Search couldn't be completed";
    subtitle.textContent = "Check your connection and try again.";
    showMessage("error","Something went wrong","We couldn't load images right now. Check your internet connection and try again.","!");
  } finally {
    section.setAttribute("aria-busy","false");
    button.disabled = false;
    button.textContent = "Search →";
  }
}
function stripHTML(value) {
  return new DOMParser().parseFromString(value,"text/html").body.textContent.trim();
}
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}
function escapeAttr(value) { return escapeHTML(value); }
