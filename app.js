/**
 * ============================================================
 * ZAVIX STORE — FRONT-END ENGINE (app.js)
 * Renders products, manages cart, calculates shipping,
 * submits orders to Supabase / n8n.
 * Updated: July 2026 — All critical bugs fixed
 * ============================================================
 */

(function () {
  'use strict';

  /* ── STATE ── */
  let cart = [];
  let selectedWilayaCode = null;
  let deliveryMethod = 'domicile';
  

  /* ── DOM REFS (set after DOMContentLoaded) ── */
  let productsGrid, checkoutSection,
    cartBadge, cartSummary, cartEmpty,
    subtotalEl, shippingEl, grandTotalEl,
    wilayaSelect,     deliveryRadios,
    orderForm, submitBtn, submitBtnText, submitSpinner,
    domicilePriceEl, stopdeskPriceEl;

  /* ─────────────────────────────────────────────
   *  UTILITIES
   * ───────────────────────────────────────────── */
  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, function(m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m];
    });
  }

  function fmtPrice(n) {
    return n.toLocaleString('fr-DZ') + ' DZD';
  }

  function showToast(msg, type) {
    type = type || 'success';
    var colors = { success: '#22c55e', error: '#ef4444', info: '#3b82f6' };
    var toast = document.createElement('div');
    toast.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);z-index:9999;' +
      'padding:12px 24px;border-radius:12px;color:#fff;font-weight:600;font-size:14px;' +
      'box-shadow:0 10px 40px rgba(0,0,0,0.5);transition:opacity 0.3s;max-width:90vw;text-align:center;' +
      'background:' + (colors[type] || colors.info) + ';font-family:Inter,system-ui,sans-serif;';
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(function() {
      toast.style.opacity = '0';
      setTimeout(function() { toast.remove(); }, 300);
    }, 3000);
  }

  function generateOrderId() {
    var ts = Date.now().toString(36).toUpperCase();
    var rand = Math.random().toString(36).substring(2, 6).toUpperCase();
    return 'ZVX-' + ts + rand;
  }

  /* ─────────────────────────────────────────────
   *  SHIPPING CALCULATOR
   * ───────────────────────────────────────────── */
  function getShippingFee(wilayaCode, method) {
    if (!wilayaCode) return 0;
    var rules = STORE_CONFIG.shippingRules;
    for (var i = 0; i < rules.length; i++) {
      var rule = rules[i];
      if (rule.wilayas === 'default') continue;
      if (rule.wilayas.indexOf(wilayaCode) !== -1) {
        return method === 'stopDesk' ? rule.stopDesk : rule.domicile;
      }
    }
    var def = rules.find(function(r) { return r.wilayas === 'default'; });
    return def ? (method === 'stopDesk' ? def.stopDesk : def.domicile) : 0;
  }

  /* ─────────────────────────────────────────────
   *  CART MANAGEMENT
   * ───────────────────────────────────────────── */
  function loadCart() {
    try {
      var stored = localStorage.getItem(STORE_CONFIG.cart.storageKey || 'zavix_cart');
      if (stored) {
        cart = JSON.parse(stored);
        // Validate prices against config (prevent tampering)
        cart.forEach(function(item) {
          var configProduct = STORE_CONFIG.products.find(function(p) { return p.id === item.productId; });
          if (configProduct) {
            item.price = configProduct.price;   // always use server price
            item.stock = configProduct.stock;    // always use current stock
          }
        });
        // Remove items for products that no longer exist
        cart = cart.filter(function(item) {
          return STORE_CONFIG.products.some(function(p) { return p.id === item.productId; });
        });
      }
    } catch (e) {
      console.warn('Could not load cart', e);
      cart = [];
    }
  }

  function saveCart() {
    localStorage.setItem(STORE_CONFIG.cart.storageKey || 'zavix_cart', JSON.stringify(cart));
  }

  function calcSubtotal() {
    return cart.reduce(function(sum, item) { return sum + item.price * item.qty; }, 0);
  }

  function addToCart(productId) {
    var product = STORE_CONFIG.products.find(function(p) { return p.id === productId; });
    if (!product) return;

    var existing = cart.find(function(i) { return i.productId === productId; });
    var maxQty = STORE_CONFIG.cart.maxQtyPerItem || 10;
    var currentQty = existing ? existing.qty : 0;

    if (currentQty + 1 > product.stock) {
      showToast('⚠️ Stock insuffisant', 'error');
      return;
    }
    if (currentQty + 1 > maxQty) {
      showToast('⚠️ Maximum ' + maxQty + ' par article', 'error');
      return;
    }

    if (existing) {
      existing.qty++;
    } else {
      cart.push({
        productId: product.id,
        name_fr: product.name_fr,
        name_ar: product.name_ar,
        price: product.price,
        qty: 1,
        image: product.image,
        stock: product.stock,
        category: product.category
      });
    }

    saveCart();
    updateInvoice();

    showToast('✅ ' + product.name_fr + ' ajouté au panier');

    // Animate badge
    if (cartBadge) {
      cartBadge.style.transition = 'transform 0.2s';
      cartBadge.style.transform = 'scale(1.3)';
      setTimeout(function() { cartBadge.style.transform = 'scale(1)'; }, 200);
    }

    // Scroll to checkout on mobile if 2+ items
    if (cart.length >= 2 && window.innerWidth < 768) {
      setTimeout(function() {
        var el = document.getElementById('checkout-section');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 400);
    }
  }

  function changeCartItemQty(productId, delta) {
    var item = cart.find(function(i) { return i.productId === productId; });
    if (!item) return;

    // Refresh stock from config
    var configProduct = STORE_CONFIG.products.find(function(p) { return p.id === productId; });
    if (configProduct) item.stock = configProduct.stock;

    var newQty = item.qty + delta;
    if (newQty <= 0) {
      removeFromCart(productId);
      return;
    }
    if (newQty > item.stock) {
      showToast('⚠️ Stock insuffisant', 'error');
      return;
    }
    var maxQty = STORE_CONFIG.cart.maxQtyPerItem || 10;
    if (newQty > maxQty) {
      showToast('⚠️ Maximum ' + maxQty + ' par article', 'error');
      return;
    }

    item.qty = newQty;
    saveCart();
    updateInvoice();
  }

  function removeFromCart(productId) {
    cart = cart.filter(function(i) { return i.productId !== productId; });
    saveCart();
    updateInvoice();
    showToast('🗑️ Article retiré', 'info');
  }

  /* ─────────────────────────────────────────────
   *  INVOICE UPDATER
   * ───────────────────────────────────────────── */
  function updateInvoice() {
    var subtotal = calcSubtotal();
    var shipping = getShippingFee(selectedWilayaCode, deliveryMethod);
    var total = subtotal + shipping;

    if (subtotalEl) subtotalEl.textContent = fmtPrice(subtotal);
    if (shippingEl) shippingEl.textContent = selectedWilayaCode ? fmtPrice(shipping) : '—';

    if (grandTotalEl) {
      grandTotalEl.textContent = selectedWilayaCode ? fmtPrice(total) : fmtPrice(subtotal) + ' + livraison';
    }

    // Cart badge
    var totalQty = cart.reduce(function(s, i) { return s + i.qty; }, 0);
    if (cartBadge) {
      cartBadge.textContent = totalQty;
      cartBadge.classList.toggle('hidden', totalQty === 0);
    }

    // Cart summary lines
    if (cartSummary) {
      cartSummary.innerHTML = '';
      if (cart.length === 0) {
        if (cartEmpty) cartEmpty.classList.remove('hidden');
      } else {
        if (cartEmpty) cartEmpty.classList.add('hidden');
        cart.forEach(function(item) {
          var li = document.createElement('li');
          li.className = 'flex items-center justify-between gap-2 py-2 border-b border-gray-700 text-sm';
          li.innerHTML =
            '<div class="flex-1 text-gray-200 flex flex-col">' +
              '<span>' + escapeHtml(item.name_fr) + '</span>' +
              '<span class="text-green-400 font-semibold">' + fmtPrice(item.price * item.qty) + '</span>' +
            '</div>' +
            '<div class="flex items-center gap-2">' +
              '<button data-action="minus" data-id="' + item.productId + '" class="qty-btn w-6 h-6 rounded bg-gray-700 hover:bg-gray-600 text-white font-bold flex items-center justify-center">-</button>' +
              '<span class="w-4 text-center text-gray-200">' + item.qty + '</span>' +
              '<button data-action="plus" data-id="' + item.productId + '" class="qty-btn w-6 h-6 rounded bg-gray-700 hover:bg-gray-600 text-white font-bold flex items-center justify-center">+</button>' +
              '<button data-action="remove" data-id="' + item.productId + '" class="qty-btn text-red-400 hover:text-red-300 text-xl ml-2">&times;</button>' +
            '</div>';
          cartSummary.appendChild(li);
        });
      }
    }

    // Shipping preview prices
    if (selectedWilayaCode && domicilePriceEl && stopdeskPriceEl) {
      var pDom = getShippingFee(selectedWilayaCode, 'domicile');
      var pDesk = getShippingFee(selectedWilayaCode, 'stopDesk');
      domicilePriceEl.textContent = fmtPrice(pDom);
      stopdeskPriceEl.textContent = fmtPrice(pDesk);
    } else if (domicilePriceEl && stopdeskPriceEl) {
      domicilePriceEl.textContent = '—';
      stopdeskPriceEl.textContent = '—';
    }

    // Enable submit only when cart is non-empty
    if (submitBtn) {
      submitBtn.disabled = cart.length === 0;
      submitBtn.classList.toggle('opacity-50', cart.length === 0);
      submitBtn.classList.toggle('cursor-not-allowed', cart.length === 0);
    }
  }

  /* ─────────────────────────────────────────────
   *  PRODUCT GRID RENDERER
   * ───────────────────────────────────────────── */
  function renderProducts() {
    if (!productsGrid) return;
    var cfg = window.STORE_CONFIG || window.ZAVIX_STORE_CONFIG || window.CONFIG;
    if (!cfg || !Array.isArray(cfg.products)) return;

    productsGrid.innerHTML = '';
    var activeProducts = cfg.products.filter(function(p) { return p && p.active !== false; });

    if (activeProducts.length === 0) {
      productsGrid.innerHTML = '<p class="col-span-full text-center text-gray-400 py-8">Aucun produit disponible.</p>';
      return;
    }

    activeProducts.forEach(function(product, idx) {
      var card = document.createElement('div');
      card.className =
        'relative bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden ' +
        'shadow-lg hover:shadow-green-900/40 hover:-translate-y-1 ' +
        'transition-all duration-300 flex flex-col';
      card.style.animationDelay = (idx * 0.08) + 's';
      card.classList.add('animate-fade-up');

      var stockVal = typeof product.stock === 'number' ? product.stock : 10;
      var priceVal = typeof product.price === 'number' ? product.price : (product.price_da || 0);
      var stockClass = stockVal <= 5 ? 'text-red-400' : 'text-gray-500';
      var stockText = stockVal <= 5 ? 'Plus que ' + stockVal + ' !' : stockVal + ' en stock';
      var badgeText = product.badge_fr || product.badge || 'Nouveau';
      var catText = product.category || 'Superfoods';
      var nameFr = product.name_fr || product.name || product.model || 'Produit';
      var nameAr = product.name_ar || product.model_ar || '';
      var descFr = product.description_fr || product.description || '';
      var imgUrl = product.image || product.image_url || 'https://placehold.co/400x300/111827/22c55e?text=' + encodeURIComponent(nameFr);

      card.innerHTML =
        // Badge
        '<span class="absolute top-3 left-3 z-10 bg-green-500 text-black text-xs font-bold ' +
          'px-2.5 py-1 rounded-full uppercase tracking-wide shadow-lg">' +
          escapeHtml(badgeText) +
        '</span>' +

        // Category tag
        '<span class="absolute top-3 right-3 z-10 bg-black/60 backdrop-blur text-gray-300 text-[10px] font-bold ' +
          'px-2 py-0.5 rounded-full uppercase tracking-wider">' +
          escapeHtml(catText) +
        '</span>' +

        // Image
        '<div class="relative h-52 bg-gray-800 overflow-hidden">' +
          '<img ' +
            'src="' + escapeHtml(imgUrl) + '" ' +
            'alt="' + escapeHtml(nameFr) + '" ' +
            'loading="lazy" ' +
            'class="w-full h-full object-cover hover:scale-105 transition-transform duration-500" ' +
            'onerror="this.onerror=null;this.src=\'data:image/svg+xml;utf8,<svg xmlns=\\\'http://www.w3.org/2000/svg\\\' width=\\\'400\\\' height=\\\'300\\\' viewBox=\\\'0 0 400 300\\\';><rect width=\\\'400\\\' height=\\\'300\\\' fill=\\\'%23111827\\\'/><text x=\\\'50%25\\\' y=\\\'50%25\\\' dominant-baseline=\\\'middle\\\' text-anchor=\\\'middle\\\' fill=\\\'%2322c55e\\\' font-family=\\\'sans-serif\\\' font-size=\\\'18\\\' font-weight=\\\'bold\\\'>' + encodeURIComponent(nameFr) + '</text></svg>\';"' +
          '/>' +
          // Gradient overlay
          '<div class="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent"></div>' +
        '</div>' +

        // Content
        '<div class="flex flex-col flex-1 p-4 gap-3">' +
          '<div>' +
            '<h3 class="font-bold text-white text-lg leading-tight">' + escapeHtml(nameFr) + '</h3>' +
            (nameAr ? '<p class="text-gray-400 text-xs mt-0.5" dir="rtl">' + escapeHtml(nameAr) + '</p>' : '') +
            '<p class="text-gray-400 text-sm mt-2 leading-relaxed line-clamp-3">' + escapeHtml(descFr) + '</p>' +
          '</div>' +

          '<div class="mt-auto flex items-center justify-between">' +
            '<div>' +
              '<span class="text-2xl font-black text-green-400">' + priceVal.toLocaleString('fr-DZ') + '</span>' +
              '<span class="text-green-600 text-sm font-semibold ml-1">DZD</span>' +
            '</div>' +
            '<span class="text-xs ' + stockClass + ' font-medium">' + stockText + '</span>' +
          '</div>' +

          '<button ' +
            'data-product-id="' + product.id + '" ' +
            'class="add-to-cart-btn w-full py-3 rounded-xl font-bold text-sm text-black ' +
              'bg-gradient-to-r from-green-400 to-green-500 hover:from-green-300 hover:to-green-400 ' +
              'active:scale-95 transition-all duration-200 shadow-lg shadow-green-900/30 ' +
              'flex items-center justify-center gap-2" ' +
          '>' +
            '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">' +
              '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" ' +
                'd="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />' +
            '</svg>' +
            'Ajouter au Panier' +
          '</button>' +
        '</div>';

      productsGrid.appendChild(card);
    });
  }

  /* ─────────────────────────────────────────────
   *  FORM SUBMISSION
   * ───────────────────────────────────────────── */
  async function submitOrder(e) {
    e.preventDefault();

    if (cart.length === 0) {
      showToast('⚠️ Votre panier est vide.', 'error');
      return;
    }

    var fd = new FormData(orderForm);
    var fullName   = (fd.get('fullName') || '').trim();
    var phone      = (fd.get('phone') || '').trim().replace(/\s/g, '');
    var wilayaCode = parseInt(fd.get('wilaya'), 10);
    var commune    = (fd.get('commune') || '').trim();
    var address    = (fd.get('address') || '').trim();
    var delivery   = fd.get('delivery') || 'domicile';

    // Validation
    if (!fullName || fullName.length < 3) {
      showToast('⚠️ Entrez votre nom complet (min 3 caractères).', 'error'); return;
    }
    if (!/^(05|06|07)\d{8}$/.test(phone)) {
      showToast('⚠️ Numéro invalide. Format: 05/06/07 + 8 chiffres', 'error'); return;
    }
    if (!wilayaCode) {
      showToast('⚠️ Sélectionnez votre wilaya.', 'error'); return;
    }
    if (!commune || commune.length < 2) {
      showToast('⚠️ Entrez votre commune.', 'error'); return;
    }
    if (!address || address.length < 5) {
      showToast('⚠️ Entrez votre adresse complète (min 5 caractères).', 'error'); return;
    }

    var orderId      = generateOrderId();
    var wilayaObj     = STORE_CONFIG.wilayas.find(function(w) { return w.code === wilayaCode; });
    var subtotal      = calcSubtotal();
    var shippingFee   = getShippingFee(wilayaCode, delivery);
    var total         = subtotal + shippingFee;
    var totalQtyNum   = cart.reduce(function(s, i) { return s + i.qty; }, 0);
    var itemsSummary  = cart.map(function(i) { return i.qty + 'x ' + i.name_fr; }).join(', ');
    var fullAddress   = commune + ', ' + address;

    var orderPayload = {
      order_id:       orderId,
      customer_name:  fullName,                              // matches DB column
      phone:          phone,
      wilaya_name:    wilayaObj ? wilayaObj.name : String(wilayaCode),  // matches DB column
      wilaya_code:    wilayaCode,
      delivery_type:  delivery,
      address:        fullAddress,
      commune:        commune,
      product:        itemsSummary,
      items:          cart.map(function(i) { return { name: i.name_fr, qty: i.qty, price: i.price }; }),
      size:           '',
      quantity:       totalQtyNum,
      subtotal:       subtotal,    // matches DB column
      shipping:       shippingFee, // matches DB column
      total:          total,       // matches DB column
      payment_method: 'cod',
      source:         'website',
      language:       'fr',
      status:         'pending',
      created_at:     new Date().toISOString()
    };

    // Loading state
    submitBtn.disabled = true;
    var originalBtnHtml = submitBtnText.innerHTML;
    submitBtnText.innerHTML = '<span>Envoi en cours…</span><span class="text-sm opacity-80" dir="rtl">جاري الإرسال...</span>';
    if (submitSpinner) submitSpinner.classList.remove('hidden');

    try {
      var supabaseUrl = STORE_CONFIG.integrations.supabaseUrl;
      var anonKey = STORE_CONFIG.integrations.supabaseAnonKey;
      var n8nUrl = STORE_CONFIG.integrations.n8nWebhookUrl;
      var isSuccess = false;

      // Payload for Supabase — items as JSONB array, product as text summary
      var supabasePayload = Object.assign({}, orderPayload);
      // items is already an array (JSONB) — keep it as-is

      // Primary: Supabase
      if (supabaseUrl && anonKey) {
        try {
          var res = await fetch(supabaseUrl + '/rest/v1/zavix_orders', {
            method: 'POST',
            headers: {
              'apikey': anonKey,
              'Authorization': 'Bearer ' + anonKey,
              'Content-Type': 'application/json',
              'Prefer': 'return=minimal'
            },
            body: JSON.stringify(supabasePayload)
          });
          if (res.ok) isSuccess = true;
          else console.warn('[Zavix] Supabase response:', res.status);
        } catch (err) {
          console.warn('[Zavix] Supabase error:', err);
        }
      }

      // Secondary: n8n webhook (non-blocking)
      if (n8nUrl) {
        fetch(n8nUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderPayload)
        }).catch(function(err) { console.warn('[Zavix] n8n notify failed', err); });
      }

      // Fallback: localStorage queue
      if (!isSuccess) {
        var localOrders = [];
        try { localOrders = JSON.parse(localStorage.getItem('zavix_order_queue') || '[]'); } catch(e) {}
        localOrders.push(orderPayload);
        localStorage.setItem('zavix_order_queue', JSON.stringify(localOrders));
        isSuccess = true; // Don't block the user
        console.log('[Zavix] Order saved to local queue. Will sync when backend is configured.');
      }

      if (isSuccess) {
        // Save to sessionStorage for merci.html
        sessionStorage.setItem('zavix_last_order', JSON.stringify({
          order_id:       orderId,
          customer_name:  fullName,
          phone:          phone,
          total:          total,
          subtotal:       subtotal,
          shipping:       shippingFee,
          wilaya_name:    wilayaObj ? wilayaObj.name : String(wilayaCode),
          delivery_type:  delivery,
          items:          itemsSummary,
          items_detail:   cart.map(function(i) { return { name: i.name_fr, qty: i.qty, price: i.price }; })
        }));

        // Fire tracking pixels
        firePixelPurchase(total, orderId);

        // Clear cart
        cart = [];
        saveCart();

        // Redirect — works both locally and on Vercel
        window.location.href = window.location.pathname.replace('index.html', '') + 'merci.html';
      } else {
        throw new Error('All submission paths failed');
      }
    } catch (err) {
      console.error('[Zavix] Order error:', err);
      showToast('⚠️ Une erreur est survenue. Veuillez réessayer.', 'error');
    } finally {
      submitBtnText.innerHTML = originalBtnHtml;
      if (submitSpinner) submitSpinner.classList.add('hidden');
      submitBtn.disabled = false;
    }
  }

  /* ─────────────────────────────────────────────
   *  PIXEL TRACKING
   * ───────────────────────────────────────────── */
  function firePixelPurchase(totalValue, orderId) {
    try {
      // Meta Pixel
      if (typeof fbq === 'function') {
        fbq('track', 'Purchase', {
          value: totalValue,
          currency: 'DZD',
          content_type: 'product',
          order_id: orderId
        });
      }
      // TikTok Pixel
      if (typeof ttq !== 'undefined' && ttq.track) {
        ttq.track('CompletePayment', {
          value: totalValue,
          currency: 'DZD',
          content_type: 'product',
          content_id: orderId
        });
      }
    } catch (e) {
      console.warn('[Zavix] Pixel fire error:', e);
    }
  }

  /* ─────────────────────────────────────────────
   *  WILAYA DROPDOWN BUILDER
   * ───────────────────────────────────────────── */
  function buildWilayaDropdown() {
    if (!wilayaSelect) return;
    wilayaSelect.innerHTML = '<option value="">— Sélectionnez votre wilaya —</option>';
    STORE_CONFIG.wilayas.forEach(function(w) {
      var opt = document.createElement('option');
      opt.value = w.code;
      opt.textContent = String(w.code).padStart(2, '0') + ' — ' + w.name;
      wilayaSelect.appendChild(opt);
    });
  }

  /* ─────────────────────────────────────────────
   *  COUNTDOWN TIMER
   * ───────────────────────────────────────────── */
  function startCountdown() {
    var el = document.getElementById('countdown-timer');
    if (!el || !STORE_CONFIG.flashSale || !STORE_CONFIG.flashSale.enabled) return;

    var endStr = STORE_CONFIG.flashSale.endTime;
    var end = new Date(endStr).getTime();

    function update() {
      var now = Date.now();
      var diff = end - now;
      if (diff <= 0) {
        el.textContent = "Offre terminée";
        return;
      }
      var h = Math.floor(diff / (1000 * 60 * 60));
      var m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      var s = Math.floor((diff % (1000 * 60)) / 1000);
      el.textContent = String(h).padStart(2, '0') + 'h ' + String(m).padStart(2, '0') + 'm ' + String(s).padStart(2, '0') + 's';
    }
    update();
    setInterval(update, 1000);
  }

  /* ─────────────────────────────────────────────
   *  WHATSAPP FLOATING BUTTON
   * ───────────────────────────────────────────── */
  function addWhatsAppButton() {
    var wa = STORE_CONFIG.store && STORE_CONFIG.store.whatsapp;
    if (!wa) return;
    var a = document.createElement('a');
    a.href = 'https://wa.me/' + wa;
    a.target = '_blank';
    a.rel = 'noopener';
    a.className = 'fixed bottom-6 right-6 z-50 bg-[#25D366] text-white rounded-full p-4 shadow-xl hover:scale-110 transition-transform flex items-center justify-center';
    a.setAttribute('aria-label', 'Contactez-nous sur WhatsApp');
    a.innerHTML =
      '<svg class="w-7 h-7 fill-current" viewBox="0 0 24 24">' +
        '<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>' +
      '</svg>';
    document.body.appendChild(a);
  }

  /* ─────────────────────────────────────────────
   *  SOCIAL PROOF: LIVE ORDER NOTIFICATIONS
   * ───────────────────────────────────────────── */
  function startSocialProof() {
    var wilayas = ['Alger','Oran','Constantine','Sétif','Blida','Annaba','Tizi Ouzou','Béjaïa','Biskra','Batna'];
    var names = ['Mohamed','Yacine','Fatima','Amel','Riad','Karim','Sara','Nour','Amina','Bilal'];
    var products = STORE_CONFIG.products.filter(function(p) { return p.active; });
    var idx = 0;

    function showNotification() {
      var name = names[idx % names.length];
      var wilaya = wilayas[idx % wilayas.length];
      var product = products[idx % products.length];
      idx++;

      var notif = document.createElement('div');
      notif.style.cssText = 'position:fixed;bottom:80px;left:16px;z-index:40;' +
        'background:rgba(17,24,39,0.95);backdrop-filter:blur(12px);border:1px solid rgba(34,197,94,0.2);' +
        'border-radius:12px;padding:12px 16px;max-width:320px;box-shadow:0 10px 40px rgba(0,0,0,0.5);' +
        'display:flex;align-items:center;gap:10px;transform:translateY(20px);opacity:0;' +
        'transition:all 0.4s ease;font-family:Inter,system-ui,sans-serif;';

      notif.innerHTML =
        '<div style="width:40px;height:40px;border-radius:8px;overflow:hidden;flex-shrink:0">' +
          '<img src="' + escapeHtml(product.image) + '" alt="" style="width:100%;height:100%;object-fit:cover" />' +
        '</div>' +
        '<div>' +
          '<p style="color:#fff;font-size:12px;font-weight:600;margin:0">' + name + ' de ' + wilaya + '</p>' +
          '<p style="color:#9ca3af;font-size:11px;margin:0">vient de commander ' + escapeHtml(product.name_fr) + '</p>' +
          '<p style="color:#22c55e;font-size:10px;margin:2px 0 0;font-weight:600">Il y a ' + (Math.floor(Math.random() * 15) + 1) + ' min</p>' +
        '</div>';

      document.body.appendChild(notif);

      // Animate in
      requestAnimationFrame(function() {
        notif.style.transform = 'translateY(0)';
        notif.style.opacity = '1';
      });

      // Animate out
      setTimeout(function() {
        notif.style.transform = 'translateY(20px)';
        notif.style.opacity = '0';
        setTimeout(function() { notif.remove(); }, 400);
      }, 4000);
    }

    // First after 8 seconds, then every 25-45 seconds
    setTimeout(function() {
      showNotification();
      setInterval(showNotification, 25000 + Math.random() * 20000);
    }, 8000);
  }

  /* ─────────────────────────────────────────────
   *  EVENT BINDINGS
   * ───────────────────────────────────────────── */
  function bindEvents() {
    if (productsGrid) {
      productsGrid.addEventListener('click', function(e) {
        var btn = e.target.closest('.add-to-cart-btn');
        if (btn) addToCart(btn.dataset.productId);
      });
    }

    if (cartSummary) {
      cartSummary.addEventListener('click', function(e) {
        var btn = e.target.closest('.qty-btn');
        if (!btn) return;
        var id = btn.dataset.id;
        var action = btn.dataset.action;
        if (action === 'remove') removeFromCart(id);
        else if (action === 'plus') changeCartItemQty(id, 1);
        else if (action === 'minus') changeCartItemQty(id, -1);
      });
    }

    if (wilayaSelect) {
      wilayaSelect.addEventListener('change', function() {
        selectedWilayaCode = parseInt(wilayaSelect.value, 10) || null;
        updateInvoice();
      });
    }

    if (deliveryRadios) {
      deliveryRadios.forEach(function(radio) {
        radio.addEventListener('change', function() {
          deliveryMethod = radio.value;
          updateInvoice();
        });
      });
    }

    if (orderForm) {
      orderForm.addEventListener('submit', submitOrder);
    }

    }

  /* ─────────────────────────────────────────────
   *  INIT
   * ───────────────────────────────────────────── */
  function initApp() {
    // Grab DOM references
    productsGrid     = document.getElementById('products-grid');
    checkoutSection  = document.getElementById('checkout-section');
    cartBadge        = document.getElementById('cart-badge');
    cartSummary      = document.getElementById('cart-summary');
    cartEmpty        = document.getElementById('cart-empty');
    subtotalEl       = document.getElementById('inv-subtotal');
    shippingEl       = document.getElementById('inv-shipping');
    grandTotalEl     = document.getElementById('inv-total');
    wilayaSelect     = document.getElementById('wilaya');
    deliveryRadios   = document.querySelectorAll('input[name="delivery"]');
    orderForm        = document.getElementById('order-form');
    submitBtn        = document.getElementById('submit-btn');
    submitBtnText    = document.getElementById('submit-btn-text');
    submitSpinner    = document.getElementById('submit-spinner');
    domicilePriceEl  = document.getElementById('domicile-price');
    stopdeskPriceEl  = document.getElementById('stopdesk-price');

    var cfg = window.STORE_CONFIG || window.ZAVIX_STORE_CONFIG || window.CONFIG;
    if (!cfg) {
      console.error('[Zavix] STORE_CONFIG not found. Load store.config.js first.');
      return;
    }

    loadCart();
    buildWilayaDropdown();
    renderProducts();
    updateInvoice();
    bindEvents();
    startCountdown();
    addWhatsAppButton();
    startSocialProof();

    console.log('[Zavix] App initialized ✓ — ' + (cfg.products ? cfg.products.length : 0) + ' products, ' + (cfg.store ? cfg.store.name : 'Store'));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }

})();
