import { tours } from '@/data/tours';
import TourCard from './TourCard';

const ToursSection = () => {
  return (
    <section id="passeios" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-up">
          <div className="inline-block mb-4">
            <span className="text-4xl">🌊</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Nossos Passeios
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experiências únicas e inesquecíveis em João Pessoa
          </p>
        </div>

        {/* Tours Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tours.map((tour, index) => (
            <div
              key={tour.id}
              className="animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <TourCard tour={tour} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ToursSection;
