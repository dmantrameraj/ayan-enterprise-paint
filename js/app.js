/**
 * Ayan Enterprises — Interactive Front-End Application
 */

(function () {
  const state = {
    audience: "homeowner",
    activeCategory: "all",
    activeBrand: "all",
    searchQuery: "",
    quoteList: [],
    activeShadeIndex: 3,
    shadeFamily: "all",
    customShade: null,
  };

  const ICONS = {
    palette: `<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 2a10 10 0 0 0 0 20c1.66 0 2.5-.84 2.5-2 0-.55-.2-1.05-.55-1.45-.34-.38-.52-.85-.52-1.35 0-1.1.9-2 2-2h2.07A4.5 4.5 0 0 0 22 10.7C22 5.9 17.52 2 12 2z"/><circle cx="7.5" cy="10.5" r="1.2" fill="currentColor"/><circle cx="10.5" cy="6.8" r="1.2" fill="currentColor"/><circle cx="15.5" cy="7.5" r="1.2" fill="currentColor"/><circle cx="17" cy="11.5" r="1.2" fill="currentColor"/></svg>`,
    layers: `<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 2 2 7l10 5 10-5-10-5z"/><path d="m2 12 10 5 10-5"/><path d="m2 17 10 5 10-5"/></svg>`,
    brush: `<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M18.37 2.63 14 7l-1.59-1.59a2 2 0 0 0-2.82 0L8 7l9 9 1.59-1.59a2 2 0 0 0 0-2.82L17 10l4.37-4.37a2.12 2.12 0 1 0-3-3Z"/><path d="M9 8c-2 3-4 3.5-7 4l8 10c2-1 6-5 6-7"/><path d="M14.5 17.5 4.5 15"/></svg>`,
    sparkle: `<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3Z"/></svg>`,
    whatsapp: `<svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M20.52 3.48A11.86 11.86 0 0 0 12.06 0C5.47 0 .1 5.37.1 11.96c0 2.11.55 4.17 1.6 5.98L0 24l6.22-1.63a11.92 11.92 0 0 0 5.83 1.49h.01c6.59 0 11.96-5.37 11.96-11.96 0-3.19-1.24-6.19-3.5-8.42ZM12.06 21.84h-.01a9.89 9.89 0 0 1-5.04-1.38l-.36-.21-3.69.97.99-3.6-.24-.37a9.89 9.89 0 0 1-1.52-5.29c0-5.46 4.44-9.9 9.9-9.9 2.64 0 5.13 1.03 7 2.9a9.84 9.84 0 0 1 2.9 7c0 5.46-4.44 9.88-9.93 9.88Zm5.43-7.41c-.3-.15-1.76-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.48-1.75-1.65-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.06 2.87 1.21 3.07.15.2 2.09 3.19 5.06 4.47.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35Z"/></svg>`,
  };

  function buildWaUrl(message) {
    return `https://wa.me/${BRAND_CONFIG.phoneRaw}?text=${encodeURIComponent(message)}`;
  }

  function showToast(text) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = text;
    toast.classList.add("show");
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(() => toast.classList.remove("show"), 2600);
  }

  function renderFlashcards() {
    const grid = document.getElementById("flashcardsGrid");
    if (!grid) return;
    grid.innerHTML = FLASHCARDS.map(
      (card) => `
      <article class="flashcard" data-accent="${card.accent}" data-filter="${card.filterKey}" tabindex="0" role="button" aria-label="Explore ${card.title}">
        <div>
          <div class="flashcard-top">
            <div class="flashcard-icon">${ICONS[card.icon]}</div>
            <span class="flashcard-badge">${card.badge}</span>
          </div>
          <h3>${card.title}</h3>
          <p>${card.subtitle}</p>
        </div>
        <div class="flashcard-footer">
          <span class="flashcard-stat">${card.stats}</span>
          <span>View Products →</span>
        </div>
      </article>
    `
    ).join("");

    grid.querySelectorAll(".flashcard").forEach((el) => {
      const trigger = () => {
        const key = el.getAttribute("data-filter");
        setCategoryFilter(key);
        document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" });
      };
      el.addEventListener("click", trigger);
      el.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          trigger();
        }
      });
    });
  }

  function renderSteps() {
    const grid = document.getElementById("stepsGrid");
    if (!grid) return;
    grid.innerHTML = PAINT_STEPS.map(
      (s) => `
      <article class="step-card">
        <div class="step-num">${s.step}</div>
        <h3>${s.title}</h3>
        <div class="step-subtitle">${s.subtitle}</div>
        <p>${s.description}</p>
        <ul class="step-list">
          ${s.items.map((item) => `<li>${item}</li>`).join("")}
        </ul>
      </article>
    `
    ).join("");
  }

  function renderProducts() {
    const grid = document.getElementById("productsGrid");
    if (!grid) return;

    const q = state.searchQuery.trim().toLowerCase();
    const filtered = PRODUCTS.filter((p) => {
      const matchCat = state.activeCategory === "all" || p.category === state.activeCategory;
      const matchBrand = state.activeBrand === "all" || p.brand === state.activeBrand;
      const matchSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.note.toLowerCase().includes(q) ||
        p.usps.some((u) => u.toLowerCase().includes(q));
      return matchCat && matchBrand && matchSearch;
    });

    if (!filtered.length) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; background: #fff; border-radius: 16px; padding: 36px; text-align: center; border: 1px solid var(--border-soft);">
          <h3 style="color: var(--navy-deep); margin-bottom: 8px;">No matching items found</h3>
          <p style="color: var(--ink-500); margin-bottom: 16px;">Try clearing your search or ask us directly on WhatsApp—we stock 100+ items in-store.</p>
          <a class="btn btn-whatsapp" href="${buildWaUrl(`Hi ${BRAND_CONFIG.name}, I am looking for: ${state.searchQuery || "paint & hardware items"}`)}" target="_blank" rel="noopener">Ask on WhatsApp</a>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered
      .map((p) => {
        const waText = `Hi ${BRAND_CONFIG.name}, please share today's rate and availability for: ${p.name} (${p.packs}).`;
        return `
        <article class="product-card">
          <div class="product-media ${p.fullBleed ? "full-bleed" : ""}">
            <img src="${p.image}" alt="${p.name}" loading="lazy" />
            <span class="product-brand-pill">${p.brand}</span>
            <span class="product-tier-pill">${p.tier}</span>
          </div>
          <div class="product-body">
            <h3>${p.name}</h3>
            <p class="product-note">${p.note}</p>
            <div class="usp-row">
              ${p.usps.map((u) => `<span class="usp-pill">${u}</span>`).join("")}
            </div>
            <div class="product-meta-row">
              <span class="product-packs">Packs: ${p.packs}</span>
              <span class="product-price">${p.demoPrice}</span>
            </div>
            <div class="product-actions">
              <button class="btn-card-add" type="button" data-add-id="${p.id}">+ Add to Estimate</button>
              <a class="btn-card-wa" href="${buildWaUrl(waText)}" target="_blank" rel="noopener" title="Enquire on WhatsApp" aria-label="Enquire ${p.name} on WhatsApp">
                ${ICONS.whatsapp}
              </a>
            </div>
          </div>
        </article>
      `;
      })
      .join("");

    grid.querySelectorAll("[data-add-id]").forEach((btn) => {
      btn.addEventListener("click", () => addToQuote(btn.getAttribute("data-add-id")));
    });
  }

  function setCategoryFilter(cat) {
    state.activeCategory = cat;
    document.querySelectorAll(".filter-tab").forEach((tab) => {
      tab.classList.toggle("active", tab.getAttribute("data-cat") === cat);
    });
    renderProducts();
  }

  function addToQuote(productId) {
    const product = PRODUCTS.find((p) => p.id === productId);
    if (!product) return;
    const existing = state.quoteList.find((item) => item.id === productId);
    if (existing) {
      existing.qty += 1;
    } else {
      state.quoteList.push({ ...product, qty: 1 });
    }
    updateQuoteDrawer();
    showToast(`Added "${product.name}" to your Estimate List`);
  }

  function updateQuoteDrawer() {
    const countEl = document.getElementById("quoteCount");
    const bodyEl = document.getElementById("drawerBody");
    const totalQty = state.quoteList.reduce((acc, item) => acc + item.qty, 0);
    if (countEl) countEl.textContent = String(totalQty);

    if (!bodyEl) return;
    if (!state.quoteList.length) {
      bodyEl.innerHTML = `
        <div style="text-align: center; padding: 36px 12px; color: var(--ink-500);">
          <p style="font-weight: 700; color: var(--navy-deep); margin-bottom: 6px;">Your Estimate List is empty</p>
          <p style="font-size: 0.88rem;">Add paints, chuna/mitti, brushes, or tile cleaners from the catalog to build a fast WhatsApp enquiry.</p>
        </div>
      `;
      return;
    }

    bodyEl.innerHTML = state.quoteList
      .map(
        (item) => `
      <div class="drawer-item">
        <div>
          <strong style="display:block; font-size:0.9rem; color:var(--navy-deep);">${item.name}</strong>
          <span style="font-size:0.76rem; color:var(--ink-500);">${item.brand} · ${item.packs}</span>
        </div>
        <div style="display:flex; align-items:center; gap:6px;">
          <button type="button" data-qty-dec="${item.id}" style="width:28px;height:28px;border-radius:8px;border:1px solid var(--border-strong);background:#fff;cursor:pointer;font-weight:800;">-</button>
          <span style="min-width:20px;text-align:center;font-weight:700;font-size:0.88rem;">${item.qty}</span>
          <button type="button" data-qty-inc="${item.id}" style="width:28px;height:28px;border-radius:8px;border:1px solid var(--border-strong);background:#fff;cursor:pointer;font-weight:800;">+</button>
        </div>
      </div>
    `
      )
      .join("");

    bodyEl.querySelectorAll("[data-qty-dec]").forEach((b) =>
      b.addEventListener("click", () => changeQty(b.getAttribute("data-qty-dec"), -1))
    );
    bodyEl.querySelectorAll("[data-qty-inc]").forEach((b) =>
      b.addEventListener("click", () => changeQty(b.getAttribute("data-qty-inc"), 1))
    );
  }

  function changeQty(id, delta) {
    const idx = state.quoteList.findIndex((i) => i.id === id);
    if (idx === -1) return;
    state.quoteList[idx].qty += delta;
    if (state.quoteList[idx].qty <= 0) state.quoteList.splice(idx, 1);
    updateQuoteDrawer();
  }

  function isLightHex(hex) {
    const clean = hex.replace("#", "");
    const r = parseInt(clean.substring(0, 2), 16);
    const g = parseInt(clean.substring(2, 4), 16);
    const b = parseInt(clean.substring(4, 6), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 > 148;
  }

  function getActiveShade() {
    return state.customShade || TRENDING_SHADES[state.activeShadeIndex];
  }

  function renderShades() {
    const grid = document.getElementById("swatchGrid");
    const preview = document.getElementById("wallPreviewBox");
    const shadeWaLink = document.getElementById("shadeWaLink");
    if (!grid || !preview) return;

    const active = getActiveShade();
    preview.style.backgroundColor = active.hex;
    preview.style.color = active.textDark ? "#0f172a" : "#ffffff";
    preview.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <span style="font-size:0.74rem; font-weight:800; text-transform:uppercase; letter-spacing:0.06em; padding:4px 10px; border-radius:999px; background:${active.textDark ? "rgba(15,23,42,0.1)" : "rgba(255,255,255,0.2)"};">
          Live Tinted Shade Preview
        </span>
        <strong style="font-size:0.84rem;">${active.code}</strong>
      </div>
      <div>
        <strong style="display:block; font-family:'Outfit',sans-serif; font-size:1.55rem;">${active.name}</strong>
        <span style="font-size:0.86rem; opacity:0.88;">${active.vibe} · Mixable in Asian Paints & Nerolac</span>
      </div>
    `;

    if (shadeWaLink) {
      shadeWaLink.href = buildWaUrl(`Hi ${BRAND_CONFIG.name}, I liked the shade "${active.name} (${active.code})" on your website. Is this available for tinting in Asian Paints / Nerolac?`);
    }

    const visibleShades = TRENDING_SHADES.map((s, idx) => ({ ...s, idx })).filter(
      (s) => state.shadeFamily === "all" || s.family === state.shadeFamily
    );

    grid.innerHTML = visibleShades
      .map(
        (s) => `
      <button type="button" class="swatch-btn ${!state.customShade && s.idx === state.activeShadeIndex ? "active" : ""}" data-shade-idx="${s.idx}">
        <span class="swatch-dot" style="background:${s.hex};"></span>
        <div>
          <strong>${s.name}</strong>
          <span>${s.code}</span>
        </div>
      </button>
    `
      )
      .join("");

    grid.querySelectorAll("[data-shade-idx]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.customShade = null;
        state.activeShadeIndex = Number(btn.getAttribute("data-shade-idx"));
        const picker = document.getElementById("customShadePicker");
        const hexLabel = document.getElementById("customHexLabel");
        const chosen = TRENDING_SHADES[state.activeShadeIndex];
        if (picker) picker.value = chosen.hex;
        if (hexLabel) hexLabel.textContent = chosen.hex;
        renderShades();
        updateEstimator();
      });
    });
  }

  function suggestPaintPacks(litres) {
    let rem = litres;
    const packs = [];
    for (const size of [20, 10, 4, 1]) {
      const count = Math.floor(rem / size);
      if (count > 0) {
        packs.push(`${count}× ${size}L`);
        rem -= count * size;
      }
    }
    if (rem > 0) packs.push("1× 1L");
    return packs.join(" + ");
  }

  function updateEstimator() {
    const area = Math.max(100, Number(document.getElementById("estArea")?.value || 800));
    const coverage = Number(document.getElementById("estPaintType")?.value || 120);
    const coats = Number(document.getElementById("estCoats")?.value || 2);
    const prepType = document.getElementById("estPrep")?.value || "putty";
    const paintSelect = document.getElementById("estPaintType");
    const paintLabel = paintSelect?.options[paintSelect.selectedIndex]?.text || "Emulsion";

    const paintLitres = Math.ceil((area * coats) / coverage);
    const primerLitres = Math.ceil(area / 135);
    const puttyOrChunaKg = prepType === "chuna" ? Math.ceil(area / 18) : Math.ceil(area / 14);

    document.getElementById("resPaint").textContent = `${paintLitres} L`;
    document.getElementById("resPrimer").textContent = `${primerLitres} L`;
    document.getElementById("resPrep").textContent = `${puttyOrChunaKg} kg`;
    document.getElementById("resPrepLabel").textContent = prepType === "chuna" ? "Slaked Chuna / Mitti" : "Wall Putty Needed";

    const packNote = document.getElementById("estPackNote");
    if (packNote) {
      packNote.innerHTML = `<strong>Recommended Pack (${area.toLocaleString("en-IN")} sq.ft):</strong> ${suggestPaintPacks(paintLitres)} bucket(s) for ${coats} coat(s) · Based on ${coverage} sq.ft/L`;
    }

    const waBtn = document.getElementById("estWaBtn");
    if (waBtn) {
      const shade = getActiveShade();
      const msg = `Hi ${BRAND_CONFIG.name}, I used the estimator for ${area} sq.ft (${paintLabel}, ${coats} coats, Shade: ${shade.name} ${shade.code}). Estimated need: ${paintLitres}L Paint (${suggestPaintPacks(paintLitres)}), ${primerLitres}L Primer, ${puttyOrChunaKg}kg ${prepType === "chuna" ? "Chuna/Mitti" : "Wall Putty"}. Please share a quote!`;
      waBtn.href = buildWaUrl(msg);
    }
  }

  function renderFaqs() {
    const list = document.getElementById("faqList");
    if (!list) return;
    list.innerHTML = FAQS.map(
      (f, idx) => `
      <div class="faq-item ${idx === 0 ? "open" : ""}">
        <button class="faq-q" type="button">
          <span>${f.q}</span>
          <svg class="faq-chevron" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>
        </button>
        <div class="faq-a">${f.a}</div>
      </div>
    `
    ).join("");

    list.querySelectorAll(".faq-q").forEach((btn) => {
      btn.addEventListener("click", () => {
        btn.parentElement.classList.toggle("open");
      });
    });
  }

  function bindControls() {
    // Audience switcher
    document.querySelectorAll(".audience-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.audience = btn.getAttribute("data-audience");
        document.querySelectorAll(".audience-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const leadEl = document.getElementById("heroLead");
        if (leadEl) {
          leadEl.textContent =
            state.audience === "contractor"
              ? "Bulk 20L paint buckets, 25kg/40kg Chuna & Wall Putty bags, 5L tile & toilet cleaner cans, and GST billing — ready for fast pickup or Lucknow site delivery."
              : "Authorized Asian Paints & Nerolac dealer in Indira Nagar, Lucknow — offering live computerized shade tinting, painting brushes & rollers, chuna/mitti wall prep, and tile & toilet cleaning chemicals under one roof.";
        }
        showToast(state.audience === "contractor" ? "Switched to Contractor & Bulk View" : "Switched to Homeowner View");
      });
    });

    // Category tabs
    document.querySelectorAll(".filter-tab").forEach((tab) => {
      tab.addEventListener("click", () => setCategoryFilter(tab.getAttribute("data-cat")));
    });

    // Brand select & search
    document.getElementById("brandFilter")?.addEventListener("change", (e) => {
      state.activeBrand = e.target.value;
      renderProducts();
    });
    document.getElementById("productSearch")?.addEventListener("input", (e) => {
      state.searchQuery = e.target.value;
      renderProducts();
    });

    // Estimator listeners
    const presetEl = document.getElementById("estPreset");
    const areaEl = document.getElementById("estArea");
    presetEl?.addEventListener("change", () => {
      if (presetEl.value !== "custom" && areaEl) {
        areaEl.value = presetEl.value;
      }
      updateEstimator();
    });
    areaEl?.addEventListener("input", () => {
      if (presetEl) presetEl.value = "custom";
      updateEstimator();
    });
    ["estPaintType", "estCoats", "estPrep"].forEach((id) => {
      document.getElementById(id)?.addEventListener("input", updateEstimator);
      document.getElementById(id)?.addEventListener("change", updateEstimator);
    });

    // Shade family tabs & custom shade color picker
    document.querySelectorAll(".shade-family-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.shadeFamily = btn.getAttribute("data-family");
        document.querySelectorAll(".shade-family-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        renderShades();
      });
    });

    const pickerEl = document.getElementById("customShadePicker");
    const hexLabelEl = document.getElementById("customHexLabel");
    pickerEl?.addEventListener("input", (e) => {
      const hex = e.target.value.toUpperCase();
      if (hexLabelEl) hexLabelEl.textContent = hex;
      state.customShade = {
        name: "Custom Customer Shade",
        code: hex,
        hex,
        textDark: isLightHex(hex),
        vibe: "Custom Computerized Tinting",
      };
      renderShades();
      updateEstimator();
    });

    // Quote drawer open/close
    const drawer = document.getElementById("quoteDrawer");
    const backdrop = document.getElementById("drawerBackdrop");
    const toggleDrawer = (open) => {
      drawer?.classList.toggle("open", open);
      backdrop?.classList.toggle("open", open);
    };
    document.getElementById("openQuoteDrawer")?.addEventListener("click", () => toggleDrawer(true));
    document.getElementById("closeQuoteDrawer")?.addEventListener("click", () => toggleDrawer(false));
    backdrop?.addEventListener("click", () => toggleDrawer(false));

    document.getElementById("sendDrawerWa")?.addEventListener("click", () => {
      if (!state.quoteList.length) {
        showToast("Please add at least one product first!");
        return;
      }
      const customer = document.getElementById("drawerCustomer")?.value.trim();
      const lines = state.quoteList.map((i, idx) => `${idx + 1}. ${i.name} (${i.brand}) × ${i.qty}`);
      const msg = `Hi ${BRAND_CONFIG.name}, please send a quote for these items:\n${lines.join("\n")}${
        customer ? `\n\nName/Location: ${customer}` : ""
      }`;
      window.open(buildWaUrl(msg), "_blank", "noopener");
    });

    // Contractor B2B Form -> WhatsApp
    document.getElementById("b2bForm")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("b2bName").value.trim();
      const phone = document.getElementById("b2bPhone").value.trim();
      const req = document.getElementById("b2bReq").value.trim();
      const msg = `Hi ${BRAND_CONFIG.name} Bulk Desk,\nContractor/Buyer: ${name}\nPhone: ${phone}\nRequirement: ${req}`;
      window.open(buildWaUrl(msg), "_blank", "noopener");
      showToast("Opening WhatsApp with your Bulk Enquiry!");
    });

    // Mobile Nav Toggle
    document.getElementById("mobileMenuBtn")?.addEventListener("click", () => {
      document.getElementById("navLinks")?.classList.toggle("mobile-open");
    });
    document.querySelectorAll("#navLinks a").forEach((a) => {
      a.addEventListener("click", () => document.getElementById("navLinks")?.classList.remove("mobile-open"));
    });
  }

  function initHero3dTilt() {
    const card = document.getElementById("hero3dCard");
    if (
      !card ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.matchMedia("(pointer: coarse)").matches
    ) {
      return;
    }

    card.addEventListener("pointermove", (e) => {
      if (e.pointerType === "touch") return;
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      const rotateY = (px - 0.5) * 14;
      const rotateX = (0.5 - py) * 12;

      card.classList.add("is-tilting");
      card.style.transform = `rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
      card.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
      card.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
    });

    card.addEventListener("pointerleave", () => {
      card.classList.remove("is-tilting");
      card.style.transform = "";
      card.style.setProperty("--mx", "50%");
      card.style.setProperty("--my", "35%");
    });
  }

  function initHeroReel() {
    const card = document.getElementById("hero3dCard");
    const stage = card?.querySelector(".hero-reel-stage");
    const toggleBtn = document.getElementById("reelToggleBtn");
    const toggleLabel = document.getElementById("reelToggleLabel");
    if (!card || !stage) return;

    let playing = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let dragging = false;
    let progress = 0.25; // start mid-fill and sweep smoothly
    let lastTime = performance.now();

    function setWipe(pct) {
      const clamped = Math.max(6, Math.min(94, pct));
      card.style.setProperty("--wipe", `${clamped.toFixed(2)}%`);
    }

    function updateFromPointer(clientX) {
      const rect = stage.getBoundingClientRect();
      const pct = ((clientX - rect.left) / rect.width) * 100;
      setWipe(pct);
    }

    function tick(now) {
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;

      if (playing && !dragging) {
        // 6.5-second smooth ping-pong cycle with gentle easing dwell at Before & After
        progress = (progress + dt / 6.5) % 1;
        const wave = 0.5 - 0.5 * Math.cos(progress * Math.PI * 2);
        const eased = wave * wave * (3 - 2 * wave);
        setWipe(10 + eased * 82);
      }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);

    stage.addEventListener("pointerdown", (e) => {
      dragging = true;
      stage.setPointerCapture?.(e.pointerId);
      updateFromPointer(e.clientX);
    });
    stage.addEventListener("pointermove", (e) => {
      if (dragging) updateFromPointer(e.clientX);
    });
    const stopDrag = () => {
      dragging = false;
    };
    stage.addEventListener("pointerup", stopDrag);
    stage.addEventListener("pointercancel", stopDrag);

    toggleBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      playing = !playing;
      toggleBtn.classList.toggle("paused", !playing);
      if (toggleLabel) toggleLabel.textContent = playing ? "Pause Reel" : "Play Reel";
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    renderFlashcards();
    renderSteps();
    renderProducts();
    renderShades();
    updateEstimator();
    updateQuoteDrawer();
    renderFaqs();
    bindControls();
    initHero3dTilt();
    initHeroReel();
  });
})();
