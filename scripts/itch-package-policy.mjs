// This is a distribution boundary, not encryption or a DRM mechanism.
// Keep source, tooling, configuration and maps out of the browser upload.
const runtimePath =
  /^(?:index\.html|favicon\.svg|assets\/[\w-]+-[\w-]{8,}\.(?:js|css|woff2?)|art\/[\w-]+\.(?:png|webp|jpe?g|avif)|THIRD_PARTY_NOTICES\.txt)$/;
const forbiddenContent = [
  [
    /['"](?:package:itch|check:story|check:itch-package)['"]\s*:/,
    'development package metadata',
  ],
  [/\bsourceMappingURL\s*=/i, 'source-map reference'],
  [/\bsourceURL\s*=/i, 'source debug reference'],
  [/"sourcesContent"\s*:/, 'embedded source map'],
  [/@vite\/client|@react-refresh|\/src\/main\.[jt]sx?/, 'development entry'],
  [/[A-Z]:[\\/]+Users[\\/]|\/(?:Users|home)\/[\w.-]+\//i, 'local user path'],
  [/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/, 'private key'],
];

export function validateItchPackage(files) {
  const names = Object.keys(files);
  for (const name of names) {
    if (!runtimePath.test(name))
      throw new Error(`Unexpected file in itch package: ${name}`);
    if (!/\.(?:html|js|css|svg|txt)$/.test(name)) continue;
    const text = new TextDecoder().decode(files[name]);
    for (const [pattern, reason] of forbiddenContent)
      if (pattern.test(text)) throw new Error(`Rejected ${name}: ${reason}.`);
  }
  for (const name of ['index.html', 'favicon.svg'])
    if (!files[name]?.length)
      throw new Error(`The itch build is missing ${name}.`);
  for (const extension of ['js', 'css'])
    if (
      !names.some(
        (name) => name.startsWith('assets/') && name.endsWith(`.${extension}`),
      )
    )
      throw new Error(`The itch build has no compiled ${extension} asset.`);
  if (!names.some((name) => name.startsWith('art/')))
    throw new Error('The itch build has no artwork.');
  const html = new TextDecoder().decode(files['index.html']);
  if (/\b(?:href|src)=["']\/(?!\/)/i.test(html))
    throw new Error('index.html contains a root-absolute asset reference.');
  return { fileCount: names.length };
}
