import Image from 'next/image';

// Pictorial block, a properly styled, optimized image with optional caption.
// Authored as:  > [!IMAGE] /path.png | Caption text | 1200x800
// width/height default to 1600×900 if not supplied (keeps layout stable).
export default function Figure({
  src, alt, caption, width, height,
}: {
  src: string;
  alt: string;
  caption?: string;
  width: number;
  height: number;
}) {
  return (
    <figure className="my-8">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-cs">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes="(max-width: 768px) 100vw, 720px"
          className="h-auto w-full"
        />
      </div>
      {caption && (
        <figcaption className="mt-2.5 text-center font-mono text-[11.5px] leading-relaxed text-slate-500">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
