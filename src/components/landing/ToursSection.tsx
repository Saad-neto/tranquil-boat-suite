import { tours } from '@/data/tours';
import TourCard from './TourCard';

const ToursSection = () => {
  return (
    <section id="passeios" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-up">
          <div className="inline-block mb-4">
            <span className="text-4xl">🚤</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Nosso Passeio
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A experiência completa de João Pessoa em um único dia inesquecível
          </p>
        </div>

        {/* Single Tour Card - Centered */}
        <div className="flex justify-center">
          <div className="max-w-xl w-full animate-fade-up">
            {tours.filter(tour => tour.isActive).map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ToursSection;
