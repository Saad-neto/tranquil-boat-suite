import { Instagram, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface InstagramPost {
  id: string;
  url: string;
  thumbnail: string;
  isVideo: boolean;
}

const instagramPosts: InstagramPost[] = [
  {
    id: '1',
    url: 'https://www.instagram.com/reel/DRUX1wqgH1B/',
    thumbnail: '/areia-vermelha-photo.jpg',
    isVideo: true,
  },
  {
    id: '2',
    url: 'https://www.instagram.com/reel/DTX16AkgDBu/',
    thumbnail: '/pordosoljurady.jpeg',
    isVideo: true,
  },
  {
    id: '3',
    url: 'https://www.instagram.com/reel/DRzOCB5gMZy/',
    thumbnail: '/areia03.jpg',
    isVideo: true,
  },
  {
    id: '4',
    url: 'https://www.instagram.com/reel/DRXpXIWj07Z/',
    thumbnail: '/pordosoljurady.jpeg',
    isVideo: true,
  },
  {
    id: '5',
    url: 'https://www.instagram.com/reel/DO6-TEHDIz2/',
    thumbnail: '/areia-vermelha-photo.jpg',
    isVideo: true,
  },
  {
    id: '6',
    url: 'https://www.instagram.com/reel/DO67LLBErXO/',
    thumbnail: '/areia03.jpg',
    isVideo: true,
  },
];

const InstagramGallery = () => {
  const instagramProfile = 'https://www.instagram.com/tranquilidadeboat';

  return (
    <section id="instagram" className="py-12 md:py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header - Compacto no mobile */}
        <div className="text-center mb-6 md:mb-10 animate-fade-up">
          <a
            href={instagramProfile}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-lg md:text-xl font-bold text-foreground hover:text-pink-500 transition-colors"
          >
            <Instagram className="w-6 h-6 md:w-7 md:h-7 text-pink-500" />
            @tranquilidadeboat
          </a>
          <p className="text-sm md:text-base text-muted-foreground mt-1">
            Veja nossos passeios no Instagram
          </p>
        </div>

        {/* Gallery Grid - 2 colunas mobile, 3 desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 md:gap-4 max-w-3xl mx-auto">
          {instagramPosts.map((post) => (
            <a
              key={post.id}
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden rounded-lg sm:rounded-xl bg-muted"
            >
              {/* Thumbnail */}
              <img
                src={post.thumbnail}
                alt={`Post do Instagram ${post.id}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/areia03.jpg';
                }}
              />

              {/* Play icon for videos - Sempre visível */}
              {post.isVideo && (
                <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-black/60 rounded-full p-1 sm:p-1.5">
                  <Play className="w-3 h-3 sm:w-4 sm:h-4 text-white fill-white" />
                </div>
              )}

              {/* Hover overlay - Apenas desktop */}
              <div className="hidden sm:flex absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 items-center justify-center">
                <Instagram className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </a>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center mt-6 md:mt-8">
          <Button
            asChild
            size="sm"
            className="gap-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 text-white border-0"
          >
            <a href={instagramProfile} target="_blank" rel="noopener noreferrer">
              <Instagram className="w-4 h-4" />
              Seguir no Instagram
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default InstagramGallery;
