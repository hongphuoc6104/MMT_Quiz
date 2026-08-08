(() => {
  // Percent-based crop boxes over the six source pages that contain diagrams.
  // x/y/w/h are percentages of the original page image, so the crop remains
  // correct even when the page is responsively scaled on phones/tablets.
  const DIAGRAM_CROPS = {
    'De01-5-4':   { x: 8, y: 43, w: 84, h: 28 }, // TCP three-way handshake (A1, A2)
    'De01-50-47': { x: 8, y: 45, w: 84, h: 31 }, // TCP data exchange (Y)
    'De03-4-95':  { x: 7, y: 43, w: 86, h: 34 }, // HDLC two-way exchange (X, Y)
    'De03-12-101':{ x: 8, y: 32, w: 84, h: 24 }, // Sliding receiving window 4-7
    'De04-5-198': { x: 4, y: 20, w: 76, h: 31 }, // Collision-domain network diagram
    'De04-4-228': { x: 3, y: 23, w: 62, h: 28 }  // Collision/broadcast-domain diagram
  };

  const originalRenderSourceImage = window.renderSourceImage;

  function clearCropStyles(wrap, link, img) {
    wrap.classList.remove('has-focused-crop');
    link.classList.remove('source-crop-link');
    link.style.removeProperty('aspect-ratio');
    link.removeAttribute('aria-label');
    img.style.removeProperty('position');
    img.style.removeProperty('width');
    img.style.removeProperty('height');
    img.style.removeProperty('max-width');
    img.style.removeProperty('max-height');
    img.style.removeProperty('left');
    img.style.removeProperty('top');
    img.style.removeProperty('margin');
    img.style.removeProperty('border');
    img.style.removeProperty('border-radius');
  }

  window.renderSourceImage = function renderFocusedSourceImage(q) {
    if (typeof originalRenderSourceImage === 'function') {
      originalRenderSourceImage(q);
    }

    const wrap = document.querySelector('#sourceImageWrap');
    const img = document.querySelector('#sourceImage');
    const link = document.querySelector('#sourceImageLink');
    if (!wrap || !img || !link) return;

    clearCropStyles(wrap, link, img);

    const crop = DIAGRAM_CROPS[q.id];
    if (!crop || wrap.classList.contains('hidden') || !img.getAttribute('src')) return;

    wrap.classList.add('has-focused-crop');
    link.classList.add('source-crop-link');
    link.setAttribute('aria-label', `Mở toàn trang đề gốc của ${q.set}, câu ${q.source_number}`);

    const caption = wrap.querySelector('figcaption');
    if (caption) {
      caption.textContent = `Chỉ hiển thị phần hình cần cho câu ${q.source_number}. Bấm hình để đối chiếu toàn trang gốc.`;
    }

    const applyCrop = () => {
      if (!img.naturalWidth || !img.naturalHeight) return;

      // The link is the crop viewport. The original image is enlarged and shifted
      // underneath it; link.href still points to the untouched full-page source.
      const cropAspect = (crop.w * img.naturalWidth) / (crop.h * img.naturalHeight);
      link.style.aspectRatio = String(cropAspect);
      img.style.position = 'absolute';
      img.style.width = `${10000 / crop.w}%`;
      img.style.height = 'auto';
      img.style.maxWidth = 'none';
      img.style.maxHeight = 'none';
      img.style.left = `${-(crop.x * 100 / crop.w)}%`;
      img.style.top = `${-(crop.y * 100 / crop.h)}%`;
      img.style.margin = '0';
      img.style.border = '0';
      img.style.borderRadius = '0';
    };

    img.addEventListener('load', applyCrop, { once: true });
    if (img.complete) requestAnimationFrame(applyCrop);
  };

  window.SOURCE_DIAGRAM_CROPS = Object.freeze({ ...DIAGRAM_CROPS });
})();
