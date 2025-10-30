import { ExperienceCard } from "@/components/ExperienceCard";
import { Layout } from "@/components/layout";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MapPin, Tag } from "lucide-react";
import { useExperiences } from "@/hooks/use-experiences";

const Experiences = () => {
  const { data: experiences, isLoading } = useExperiences();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-primary text-primary-foreground py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white">
              BookIt
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-2xl mx-auto">
              Discover unforgettable experiences around the world
            </p>
            <div className="flex items-center justify-center gap-2 text-primary-foreground/80">
              <MapPin className="h-5 w-5" />
              <span className="text-lg">Book your next adventure today</span>
            </div>
            
            {/* Promo Code Banner */}
            <div className="mt-8 flex items-center justify-center gap-4">
              <Alert variant="default" className="bg-background/80 backdrop-blur-sm max-w-xl mx-auto">
                <Tag className="h-5 w-5" />
                <AlertDescription className="text-base">
                  <span className="font-semibold">Available Promo Codes:</span>
                  {" "}Use <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">WELCOME10</code> for ₹10 off, or{" "}
                  <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">SUMMER25</code> for ₹25 off your booking!
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </div>
      </section>

      {/* Experiences Grid */}
      <section className="container mx-auto max-w-6xl px-4 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Popular Experiences</h2>
          <p className="text-muted-foreground">
            Hand-picked adventures from around the globe
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-48 w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {experiences?.map((experience) => (
              <ExperienceCard key={experience.id} experience={experience} />
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
};

export default Experiences;
