/* Inline production bootstrap: percentages reflect decoded game-file bytes. */
void (async () => {
  if (location.protocol === 'file:') return;
  const message = document.getElementById('boot-message');
  const progress = document.getElementById('boot-progress');
  const percent = document.getElementById('boot-percent');
  const retry = document.getElementById('boot-retry');
  const controller = new AbortController();
  const urls = [];
  let timeout;
  let ready = false;
  function fail(reason) {
    if (ready) return;
    controller.abort();
    clearTimeout(timeout);
    message.textContent = reason;
    retry.hidden = false;
  }
  function resetTimeout() {
    clearTimeout(timeout);
    timeout = setTimeout(
      () =>
        fail(
          'Loading stopped responding. Check your connection and retry. Your save has not been removed.',
        ),
      30000,
    );
  }
  window.addEventListener(
    'veilfall-ready',
    () => {
      ready = true;
      clearTimeout(timeout);
      urls.forEach((url) => URL.revokeObjectURL(url));
    },
    { once: true },
  );
  try {
    const files = window.veilfallDownloads;
    const total = files.reduce((sum, file) => sum + file.bytes, 0);
    let received = 0;
    resetTimeout();
    const downloads = await Promise.all(
      files.map(async (file) => {
        const response = await fetch(file.url, { signal: controller.signal });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const reader = response.body.getReader();
        const chunks = [];
        for (;;) {
          const { value, done } = await reader.read();
          if (done) break;
          chunks.push(value);
          received += value.byteLength;
          resetTimeout();
          const valuePercent = Math.min(
            100,
            Math.floor((received / total) * 100),
          );
          progress.value = valuePercent;
          percent.textContent = `${valuePercent}%`;
        }
        const url = URL.createObjectURL(
          new Blob(chunks, {
            type: file.type === 'script' ? 'text/javascript' : 'text/css',
          }),
        );
        urls.push(url);
        return { ...file, blobUrl: url };
      }),
    );
    progress.value = 100;
    percent.textContent = '100% — starting game…';
    message.textContent = 'Game files downloaded. Preparing your adventure…';
    for (const file of downloads.filter((file) => file.type === 'style')) {
      await new Promise((resolve, reject) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = file.blobUrl;
        link.onload = resolve;
        link.onerror = reject;
        document.head.append(link);
      });
    }
    for (const file of downloads.filter((file) => file.type === 'script')) {
      await import(file.blobUrl);
    }
  } catch {
    fail(
      'The game files could not load. Check your connection and retry. Your save has not been removed.',
    );
    urls.forEach((url) => URL.revokeObjectURL(url));
  }
})();
