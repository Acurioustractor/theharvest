import { useState } from "react";
import { Loader2, ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
}

export function LazyImage({
  src,
  alt,
  className,
  loading,
  decoding,
  fetchPriority,
  onLoad,
  onError,
  ...props
}: LazyImageProps) {
  const [imageState, setImageState] = useState<{
    src: string;
    status: "loading" | "loaded" | "error";
  }>({ src, status: "loading" });

  const status = imageState.src === src ? imageState.status : "loading";
  const isLoading = status === "loading";
  const hasError = status === "error";
  const resolvedLoading = loading ?? (fetchPriority === "high" ? "eager" : "lazy");
  const resolvedFetchPriority = fetchPriority ?? (resolvedLoading === "eager" ? "high" : "auto");

  if (hasError) {
    return (
      <div className={cn("flex flex-col items-center justify-center bg-muted text-muted-foreground", className)}>
        <ImageOff className="h-8 w-8 mb-2 opacity-50" />
        <span className="text-xs">Failed to load image</span>
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        loading={resolvedLoading}
        decoding={decoding ?? "async"}
        fetchPriority={resolvedFetchPriority}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100"
        )}
        onLoad={(event) => {
          setImageState({ src, status: "loaded" });
          onLoad?.(event);
        }}
        onError={(event) => {
          setImageState({ src, status: "error" });
          onError?.(event);
        }}
        {...props}
      />
    </div>
  );
}
