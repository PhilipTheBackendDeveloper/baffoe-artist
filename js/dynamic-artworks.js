/**
 * Dynamic Artworks Loader for Baffoe Kwabena Studio
 * Automatically fetches artworks published via the Studio CMS (/admin)
 * and seamlessly injects them at the top of portfolios and homepages.
 */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import { firebaseConfig } from "./firebase-config.js";

let dynamicArtworksMap = new Map();

// Initialize modal container in DOM if not present
function initArtworkModal() {
  if (document.getElementById("dynamicArtModal")) return;

  const modalHtml = `
    <div id="dynamicArtModal" style="display:none; position:fixed; inset:0; z-index:99999; background:rgba(10,10,10,0.92); backdrop-filter:blur(10px); align-items:center; justify-content:center; padding:1.5rem;">
      <div style="background:#1c1b1b; border:1px solid rgba(255,255,255,0.12); border-radius:16px; max-width:900px; width:100%; max-height:90vh; overflow-y:auto; display:flex; flex-direction:column; position:relative; box-shadow:0 30px 60px rgba(0,0,0,0.8);">
        
        <button id="closeDynamicArtModal" style="position:absolute; top:16px; right:16px; z-index:10; background:#262525; border:1px solid rgba(255,255,255,0.15); color:#fff; width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:1.2rem;">&times;</button>
        
        <div id="modalArtMedia" style="background:#000; width:100%; max-height:55vh; display:flex; align-items:center; justify-content:center; overflow:hidden;">
          <img id="modalArtImg" src="" alt="Artwork" style="max-width:100%; max-height:55vh; object-fit:contain;">
        </div>

        <div style="padding:2rem;">
          <div id="modalArtTags" style="display:flex; flex-wrap:wrap; gap:0.5rem; margin-bottom:1rem;"></div>
          <h2 id="modalArtTitle" style="font-family:'Oswald',sans-serif; font-size:2rem; font-weight:700; text-transform:uppercase; margin-bottom:0.75rem; color:#f3f3f3; line-height:1.2;"></h2>
          <div id="modalArtMeta" style="font-family:'Source Code Pro',monospace; font-size:0.85rem; color:#ccff00; margin-bottom:1.25rem;"></div>
          <p id="modalArtDesc" style="font-family:'Inter',sans-serif; font-size:0.95rem; color:#b5b4b4; line-height:1.6; margin-bottom:1.75rem; white-space:pre-line;"></p>
          
          <div style="display:flex; flex-wrap:wrap; gap:1rem; align-items:center; justify-content:space-between; border-top:1px solid rgba(255,255,255,0.08); padding-top:1.25rem;">
            <div id="modalArtPrice" style="font-family:'Source Code Pro',monospace; font-weight:600; font-size:1.1rem; color:#fff;"></div>
            <a id="modalWhatsAppBtn" href="#" target="_blank" style="display:inline-flex; align-items:center; gap:0.5rem; background:#ccff00; color:#121212; padding:0.75rem 1.5rem; border-radius:6px; font-weight:700; text-decoration:none; font-family:'Inter',sans-serif; font-size:0.92rem;">
              <span>Inquire / Book on WhatsApp</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHtml);

  const modal = document.getElementById("dynamicArtModal");
  const closeBtn = document.getElementById("closeDynamicArtModal");
  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
    document.body.style.overflow = "";
  });
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
      document.body.style.overflow = "";
    }
  });
}

// Global modal opener
window.openDynamicArtworkModal = function(id) {
  const art = dynamicArtworksMap.get(id);
  if (!art) return;

  initArtworkModal();

  const modal = document.getElementById("dynamicArtModal");
  document.getElementById("modalArtImg").src = art.imageUrl;
  document.getElementById("modalArtTitle").innerText = art.title;

  const tagsDiv = document.getElementById("modalArtTags");
  tagsDiv.innerHTML = `
    <span style="background:rgba(204,255,0,0.15); color:#ccff00; padding:0.25rem 0.65rem; border-radius:4px; font-size:0.75rem; font-family:'Source Code Pro',monospace; font-weight:600;">${art.category}</span>
    <span style="background:rgba(255,255,255,0.08); color:#ddd; padding:0.25rem 0.65rem; border-radius:4px; font-size:0.75rem; font-family:'Source Code Pro',monospace;">${art.dimensions}</span>
    <span style="background:rgba(255,255,255,0.08); color:#ddd; padding:0.25rem 0.65rem; border-radius:4px; font-size:0.75rem; font-family:'Source Code Pro',monospace;">${art.year || 2026}</span>
  `;

  document.getElementById("modalArtMeta").innerText = `MEDIUM: ${art.medium.toUpperCase()}`;
  document.getElementById("modalArtDesc").innerText = art.description || "Created with signature impasto techniques and contemporary Akan symbolism in Baffoe's Accra studio.";
  document.getElementById("modalArtPrice").innerText = art.price ? `STATUS: ${art.price}` : "AVAILABLE UPON INQUIRY";

  const waText = encodeURIComponent(`Hello Baffoe, I am inquiring about your artwork "${art.title}" (${art.category}, ${art.dimensions}). Is it available?`);
  document.getElementById("modalWhatsAppBtn").href = `https://wa.me/233540455082?text=${waText}`;

  modal.style.display = "flex";
  document.body.style.overflow = "hidden";
};

// Initialize Firestore & Load Artworks
export async function loadStudioArtworks() {
  try {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const q = query(collection(db, "artworks"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    if (snapshot.empty) return;

    const artworks = [];
    snapshot.forEach((doc) => {
      const data = { id: doc.id, ...doc.data() };
      artworks.push(data);
      dynamicArtworksMap.set(doc.id, data);
    });

    initArtworkModal();

    // 1. Works Gallery Pages (works.html, works-lightbox.html, index-studio-onepage.html)
    const galleryContainers = document.querySelectorAll(".mxd-projects-grid__gallery");
    galleryContainers.forEach((container) => {
      artworks.forEach((art) => {
        const item = document.createElement("div");
        item.className = "col-12 col-xl-6 mxd-grid-item mxd-project-item dynamic-item";
        item.innerHTML = `
          <div class="mxd-project-item__inner" style="cursor:pointer;" onclick="window.openDynamicArtworkModal('${art.id}')">
            <div class="mxd-project-item__media">
              <img src="${art.imageUrl}" alt="${art.title}">
            </div>
            <div class="mxd-project-item__data">
              <div class="mxd-project-item__tags mxd-tags">
                <span class="mxd-tag mxd-tag-lime-var">${art.category}</span>
                <span class="mxd-tag mxd-tag-tint">${art.medium}</span>
                <span class="mxd-tag mxd-tag-tint">${art.dimensions}</span>
                ${art.isFeatured ? '<span class="mxd-tag mxd-tag-purple">Featured</span>' : ''}
              </div>
              <div class="mxd-project-item__title">
                <p>${art.title} — ${art.year || 2026}</p>
              </div>
            </div>
          </div>
        `;
        container.insertBefore(item, container.firstChild);
      });
    });

    // 2. Multipage Stack Cards (index-studio-multipage.html)
    const stackContainer = document.querySelector(".mxd-stack-cards");
    if (stackContainer) {
      const featuredArtworks = artworks.filter(a => a.isFeatured);
      featuredArtworks.forEach((art) => {
        const card = document.createElement("div");
        card.className = "mxd-stack-cards__card dynamic-stack-card";
        card.innerHTML = `
          <div class="card__wrapper">
            <div class="card__content">
              <div class="card__title">
                <a href="javascript:void(0)" onclick="window.openDynamicArtworkModal('${art.id}')">
                  <p>${art.title} — ${art.category}</p>
                </a>
              </div>
              <div class="card__descr">
                <p>${art.description || `${art.medium} (${art.dimensions}). Created in Baffoe's Accra studio.`}</p>
                <div class="card__btngroup">
                  <a class="btn btn-default btn-lime" href="javascript:void(0)" onclick="window.openDynamicArtworkModal('${art.id}')">
                    <span class="btn-wrap">
                      <span class="btn-text">View Artwork Details</span>
                    </span>
                  </a>
                </div>
              </div>
            </div>
            <div class="card__image">
              <img class="card__media" src="${art.imageUrl}" alt="${art.title}">
              <div class="card__cover"></div>
            </div>
          </div>
        `;
        stackContainer.insertBefore(card, stackContainer.firstChild);
      });
    }

    console.log(`[Studio CMS] Loaded ${artworks.length} dynamic artworks from Firestore.`);
  } catch (err) {
    console.warn("[Studio CMS] Firestore read error (using static portfolio fallbacks):", err.message);
  }
}

// Auto-run on DOM ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", loadStudioArtworks);
} else {
  loadStudioArtworks();
}
