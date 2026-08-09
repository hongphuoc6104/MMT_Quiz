(() => {
  // Dedicated PNGs generated from the original source-page images.
  // The quiz displays only the figure needed for the question. The untouched
  // source page remains available through an explicit verification link.
  const QUESTION_IMAGES = Object.freeze({
    'De01-5-4': 'assets/crops/De01-5-4.png?v=20260809-handshake-2',
    'De01-50-47': 'assets/crops/De01-50-47.png',
    'De03-4-95': 'assets/crops/De03-4-95.png',
    'De03-12-101': 'assets/crops/De03-12-101.png',
    'De04-5-198': 'assets/crops/De04-5-198.png',
    'De04-4-228': 'assets/crops/De04-4-228.png'
  });

  const originalRenderSourceImage = window.renderSourceImage;

  function resetImageState(wrap, link, img, caption) {
    wrap.classList.remove('has-focused-crop', 'dedicated-question-image');
    link.classList.remove('source-crop-link');
    link.style.removeProperty('aspect-ratio');
    link.removeAttribute('aria-label');
    for (const prop of ['position','width','height','max-width','max-height','left','top','margin','border','border-radius']) {
      img.style.removeProperty(prop);
    }
    if (caption) {
      caption.textContent = 'Ảnh/trang đề gốc. Bấm vào ảnh để mở kích thước đầy đủ.';
    }
  }

  function renderCaption(caption, q, fullPageSrc) {
    if (!caption) return;
    caption.textContent = '';

    const note = document.createElement('span');
    note.textContent = `Hình cần thiết của câu ${q.source_number}; không kèm các câu khác.`;
    caption.appendChild(note);

    if (fullPageSrc) {
      caption.appendChild(document.createTextNode(' · '));
      const sourceLink = document.createElement('a');
      sourceLink.className = 'source-page-link';
      sourceLink.href = fullPageSrc;
      sourceLink.target = '_blank';
      sourceLink.rel = 'noopener';
      sourceLink.textContent = 'Đối chiếu toàn trang gốc';
      sourceLink.setAttribute('aria-label', `Đối chiếu toàn trang đề gốc của ${q.set}, câu ${q.source_number}`);
      caption.appendChild(sourceLink);
    }
  }

  window.renderSourceImage = function renderDedicatedQuestionImage(q) {
    if (typeof originalRenderSourceImage === 'function') {
      originalRenderSourceImage(q);
    }

    const wrap = document.querySelector('#sourceImageWrap');
    const img = document.querySelector('#sourceImage');
    const link = document.querySelector('#sourceImageLink');
    const caption = wrap?.querySelector('figcaption');
    if (!wrap || !img || !link) return;

    resetImageState(wrap, link, img, caption);

    const cropSrc = QUESTION_IMAGES[q.id];
    if (!cropSrc) return;

    // Capture the original source-page URL before replacing the displayed image.
    const fullPageSrc = link.getAttribute('href') || img.getAttribute('src') || null;

    img.src = cropSrc;
    img.alt = `Hình cần thiết - ${q.set}, câu ${q.source_number}`;

    // Clicking the image opens only the isolated figure, never the full page.
    link.href = cropSrc;
    link.target = '_blank';
    link.rel = 'noopener';
    link.setAttribute('aria-label', `Mở riêng hình của ${q.set}, câu ${q.source_number}`);

    wrap.classList.remove('hidden');
    wrap.classList.add('dedicated-question-image');
    renderCaption(caption, q, fullPageSrc);
  };

  window.QUESTION_SOURCE_IMAGES = QUESTION_IMAGES;
})();
