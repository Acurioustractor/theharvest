import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon } from "lucide-react";
import { LazyImage } from "@/components/LazyImage";
import { useState } from "react";

interface GalleryDialogProps {
  images: string[];
  title: string;
  trigger?: React.ReactNode;
}

export function GalleryDialog({ images, title, trigger }: GalleryDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!images || images.length === 0) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-2">
            <ImageIcon className="h-4 w-4" />
            View Photos ({images.length})
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl w-full p-0 overflow-hidden bg-black/95 border-none">
        <DialogHeader className="absolute top-4 left-4 z-50 text-white">
          <DialogTitle className="text-lg font-medium drop-shadow-md">{title}</DialogTitle>
        </DialogHeader>
        <div className="relative w-full aspect-video flex items-center justify-center">
          <Carousel className="w-full h-full">
            <CarouselContent>
              {images.map((src, index) => (
                <CarouselItem key={index} className="flex items-center justify-center h-full">
                  <div className="relative w-full h-full flex items-center justify-center p-4">
                    <LazyImage
                      src={src}
                      alt={`${title} - Photo ${index + 1}`}
                      className="max-h-[80vh] max-w-full object-contain rounded-md bg-transparent"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4 bg-white/10 hover:bg-white/20 text-white border-none" />
            <CarouselNext className="right-4 bg-white/10 hover:bg-white/20 text-white border-none" />
          </Carousel>
        </div>
      </DialogContent>
    </Dialog>
  );
}
