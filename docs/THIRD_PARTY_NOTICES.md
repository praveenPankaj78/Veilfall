# Third-party dependency inventory

This inventory records the direct runtime dependencies declared by the release and the license identifier published in each installed package manifest. It is a repository audit aid, not a substitute for legal review or for the complete license texts shipped by the packages in `node_modules`.

| Dependency                 |      Version | Manifest license |
| -------------------------- | -----------: | ---------------- |
| `@base-ui/react`           |        1.7.0 | MIT              |
| `@shadcn/react`            |        0.3.0 | MIT              |
| `class-variance-authority` |        0.7.1 | Apache-2.0       |
| `clsx`                     |        2.1.1 | MIT              |
| `cmdk`                     |        1.1.1 | MIT              |
| `date-fns`                 |        4.1.0 | MIT              |
| `embla-carousel-react`     |        8.5.2 | MIT              |
| `input-otp`                |        1.4.2 | MIT              |
| `lucide-react`             |       1.31.0 | ISC              |
| `react`                    |       19.2.6 | MIT              |
| `react-day-picker`         |        9.8.1 | MIT              |
| `react-dom`                |       19.2.6 | MIT              |
| `react-resizable-panels`   |        4.5.8 | MIT              |
| `react-server-dom-webpack` |       19.2.6 | MIT              |
| `recharts`                 |        3.8.0 | MIT              |
| `shadcn`                   |       4.18.0 | MIT              |
| `tailwind-merge`           |        3.6.0 | MIT              |
| `tw-animate-css`           |        1.4.0 | MIT              |
| `vinext`                   | 1.0.0-beta.5 | MIT              |

Build and development tools are separately declared in `package.json` and locked in `package-lock.json`. The restricted-beta packaging script directly uses `fflate` 0.7.5, whose installed manifest declares the MIT license. Installed package manifests and license files remain the authoritative local copies.

## Repository-owned material still requiring owner information

The inspected release-facing files do not identify individual creators or provide source and license records for the narrative, source code, or the artwork in `public/art`. They also contain no repository-supported AI-use disclosure. Those facts cannot be reconstructed safely from filenames and must be supplied or approved by the owner before public distribution.

No external webfont is configured: the release uses local/system font stacks. No attribution claim has been added for an individual, studio, artwork, or tool without repository evidence.
