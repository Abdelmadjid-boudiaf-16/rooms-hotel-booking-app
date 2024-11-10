import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import Image from "next/image";

export function CarouselDemo({
  imagesUrl,
  className,
}: {
  imagesUrl: string[];
  className: string;
}) {
  return (
    <Carousel
      className={cn("flex overflow-hidden", className)}
      opts={{
        align: "start",
        loop: true,
      }}
    >
      <CarouselContent className="h-full w-full">
        {imagesUrl.map((imageUrl: string, index) => (
          <CarouselItem key={index} className="h-full w-full">
            <Image
              src={imageUrl}
              alt="hotel room image "
              width={500}
              height={500}
              className="h-full w-full object-cover transition-all duration-500 hover:scale-110"
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
