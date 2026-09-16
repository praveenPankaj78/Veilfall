import type { CSSProperties, ImgHTMLAttributes } from 'react';

type StaticImageSource = string | { src: string };

type StaticImageProps = Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  'height' | 'src' | 'width'
> & {
  fill?: boolean;
  height?: number | string;
  priority?: boolean;
  src: StaticImageSource;
  width?: number | string;
};

function relativeSource(source: StaticImageSource) {
  const value = typeof source === 'string' ? source : source.src;

  if (/^(?:blob:|data:|https?:)/i.test(value)) return value;
  return value.startsWith('/') ? `.${value}` : value;
}

function relativeSrcSet(srcSet?: string) {
  if (!srcSet) return srcSet;
  return srcSet
    .split(',')
    .map((part) => {
      const trimmed = part.trim();
      const space = trimmed.search(/\s/);
      if (space === -1) return relativeSource(trimmed);
      return `${relativeSource(trimmed.slice(0, space))} ${trimmed.slice(space).trim()}`;
    })
    .join(', ');
}

export default function StaticImage({
  alt,
  fill = false,
  height,
  loading,
  priority = false,
  src,
  srcSet,
  style,
  width,
  ...props
}: StaticImageProps) {
  const fillStyle: CSSProperties | undefined = fill
    ? {
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        ...style,
      }
    : style;

  return (
    // Static itch.io uploads cannot use the Next.js image optimizer.
    // oxlint-disable-next-line next/no-img-element
    <img
      {...props}
      alt={alt}
      decoding="async"
      fetchPriority={priority ? 'high' : props.fetchPriority}
      height={fill ? undefined : height}
      loading={priority ? 'eager' : (loading ?? 'lazy')}
      src={relativeSource(src)}
      srcSet={relativeSrcSet(srcSet)}
      style={fillStyle}
      width={fill ? undefined : width}
    />
  );
}
