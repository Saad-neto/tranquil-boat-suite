import TideWidget from './TideWidget';
import WeatherWidget from './WeatherWidget';

const WidgetsSection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-primary/5 to-background">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <div className="animate-fade-up">
            <TideWidget />
          </div>
          <div className="animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <WeatherWidget />
          </div>
        </div>
      </div>
    </section>
  );
};

export default WidgetsSection;
