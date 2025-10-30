import { useParams, useNavigate } from "react-router-dom";
import { useExperience } from "@/hooks/use-experiences";
import { useSlots } from "@/hooks/use-slots";
import type { Database } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Clock, Users, Calendar, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { toast, Toaster } from "sonner";

const ExperienceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const { data: experience, isLoading: experienceLoading } = useExperience(id);

  const { data: slots, isLoading: slotsLoading } = useSlots(id);

  const handleBookNow = () => {
    if (!selectedSlot) {
      toast.error("Please select a time slot");
      return;
    }
    navigate(`/checkout/${selectedSlot}`);
  };

  if (experienceLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto max-w-6xl px-4 py-8">
          <Skeleton className="h-96 w-full rounded-lg mb-8" />
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (!experience) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Experience not found</h1>
          <Button onClick={() => navigate("/")}>Back to Home</Button>
        </div>
      </div>
    );
  }

  // Group slots by date
  const slotsByDate = slots?.reduce<Record<string, Database["public"]["Tables"]["slots"]["Row"][]>>((acc, slot) => {
    const date = slot.date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(slot);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-background">
      <Toaster />
      {/* Back Button */}
      <div className="container mx-auto max-w-6xl px-4 pt-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Experiences
        </Button>
      </div>

      {/* Hero Image */}
      <div className="container mx-auto max-w-6xl px-4 py-6">
        <div className="relative h-96 rounded-lg overflow-hidden">
          <img
            src={experience.image_url}
            alt={experience.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.currentTarget as HTMLImageElement;
              target.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='800'><rect width='100%' height='100%' fill='%23f3f4f6' /><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%239CA3AF' font-family='Arial' font-size='36'>Image unavailable</text></svg>";
              target.classList.add('object-contain');
            }}
          />
          <div className="absolute top-4 right-4 bg-secondary text-secondary-foreground px-4 py-2 rounded-full font-bold text-xl shadow-lg">
            ₹{experience.price}
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="container mx-auto max-w-6xl px-4 pb-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-4">{experience.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-6">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span className="font-medium">{experience.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <span>{experience.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <span>Up to {experience.max_capacity} people</span>
                </div>
              </div>
            </div>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">About this experience</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {experience.description}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Booking */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-2xl font-bold">Select a Time</h2>
                
                {slotsLoading ? (
                  <div className="space-y-2">
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : slotsByDate && Object.keys(slotsByDate).length > 0 ? (
                  <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                    {Object.entries(slotsByDate || {}).map(([date, dateSlots]) => (
                      <div key={date} className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {format(new Date(date), "EEEE, MMM d")}
                        </div>
                        <div className="space-y-2">
                          {dateSlots.map((slot) => (
                            <Button
                              key={slot.id}
                              variant={selectedSlot === slot.id ? "default" : "outline"}
                              className={`w-full justify-between ${selectedSlot === slot.id ? 'ring-2 ring-primary' : ''}`}
                              onClick={() => setSelectedSlot(slot.id)}
                              disabled={slot.available_spots === 0}
                            >
                              <span className="font-medium">{slot.start_time.substring(0, 5)}</span>
                              <span className={`text-sm ${slot.available_spots < 5 ? 'text-destructive' : ''}`}>
                                {slot.available_spots === 0 
                                  ? "Sold Out" 
                                  : `${slot.available_spots} spots left`}
                              </span>
                            </Button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    No available slots at the moment
                  </p>
                )}

                <Button
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-lg py-6 mt-4 sticky bottom-0"
                  onClick={handleBookNow}
                  disabled={!selectedSlot}
                >
                  {selectedSlot ? "Book Now" : "Select a Time to Book"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperienceDetails;
