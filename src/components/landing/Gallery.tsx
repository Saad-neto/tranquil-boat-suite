import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GalleryImage {
  id: string;
  url: string;
  title: string;
  category: string;
}

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const images: GalleryImage[] = [
    {
      id: '1',
      url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1920&q=80',
      title: 'Areia Vermelha',
      category: 'Areia Vermelha',
    },
    {
      id: '2',
      url: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1920&q=80',
      title: 'Pôr do Sol',
      category: 'Pôr do Sol',
    },
    {
      id: '3',
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
      title: 'Navegação',
      category: 'Navegação',
    },
    {
      id: '4',
      url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1920&q=80',
      title: 'Águas Cristalinas',
      category: 'Areia Vermelha',
    },
    {
      id: '5',
      url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1920&q=80',
      title: 'Momento Especial',
      category: 'Experiências',
    },
    {
      id: '6',
      url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1920&q=80',
      title: 'Paraíso Paraibano',
      category: 'Areia Vermelha',
    },
    {
      id: '7',
      url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80',
      title: 'Mar Calmo',
      category: 'Navegação',
    },
    {
      id: '8',
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
      title: 'Céu Dourado',
      category: 'Pôr do Sol',
    },
  ];

  const openImage = (index: number) => {
    setSelectedImage(index);
    setIsOpen(true);
  };

  const closeImage = () => {
    setIsOpen(false);
    setTimeout(() => setSelectedImage(null), 200);
  };

  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage - 1 + images.length) % images.length);
    }
  };

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-up">
          <div className="inline-block mb-4">
            <span className="text-4xl">📸</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Galeria de Momentos
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Confira alguns dos momentos mágicos capturados durante nossos passeios
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div
              key={image.id}
              className="animate-fade-up cursor-pointer group relative overflow-hidden rounded-lg aspect-square"
              style={{ animationDelay: `${index * 0.05}s` }}
              onClick={() => openImage(index)}
            >
              <img
                src={image.url}
                alt={image.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <p className="font-semibold text-sm">{image.title}</p>
                  <p className="text-xs text-gray-300">{image.category}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Dialog */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="max-w-5xl p-0 bg-black/95 border-none">
            {selectedImage !== null && (
              <div className="relative">
                {/* Close Button */}
                <button
                  onClick={closeImage}
                  className="absolute top-4 right-4 z-50 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="h-6 w-6 text-white" />
                </button>

                {/* Navigation Buttons */}
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                >
                  <ChevronLeft className="h-8 w-8 text-white" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                >
                  <ChevronRight className="h-8 w-8 text-white" />
                </button>

                {/* Image */}
                <div className="relative">
                  <img
                    src={images[selectedImage].url}
                    alt={images[selectedImage].title}
                    className="w-full h-auto max-h-[85vh] object-contain"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                    <h3 className="text-white text-2xl font-bold mb-1">
                      {images[selectedImage].title}
                    </h3>
                    <p className="text-gray-300">
                      {images[selectedImage].category}
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                      {selectedImage + 1} / {images.length}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-lg text-muted-foreground mb-4">
            Quer viver essas experiências também?
          </p>
          <Button
            size="lg"
            onClick={() => {
              const element = document.getElementById('reservas');
              element?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-primary hover:bg-primary/90"
          >
            Fazer uma Reserva
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Gallery;
