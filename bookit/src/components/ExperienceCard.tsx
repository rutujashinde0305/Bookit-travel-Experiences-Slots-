import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Experience {
  id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  image_url: string;
  duration: string;
  max_capacity: number;
}

interface ExperienceCardProps {
  experience: Experience;
}

export const ExperienceCard = ({ experience }: ExperienceCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300 cursor-pointer border-border/50">
      <div 
        className="relative h-48 overflow-hidden"
        onClick={() => navigate(`/experience/${experience.id}`)}
      >
        <img
          src={experience.image_url}
          alt={experience.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          onError={(e) => {
            const target = e.currentTarget as HTMLImageElement;
            // inline SVG placeholder (grey background with text)
            target.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='800'><rect width='100%' height='100%' fill='%23f3f4f6' /><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%239CA3AF' font-family='Arial' font-size='36'>Image unavailable</text></svg>";
            target.classList.add('object-contain');
          }}
        />
        <div className="absolute top-3 right-3 bg-secondary text-secondary-foreground px-3 py-1 rounded-full font-semibold shadow-lg">
          ₹{experience.price}
        </div>
      </div>
      
      <CardContent className="p-5 space-y-3">
        <h3 
          className="text-xl font-bold line-clamp-1 group-hover:text-primary transition-colors"
          onClick={() => navigate(`/experience/${experience.id}`)}
        >
          {experience.title}
        </h3>
        
        <p className="text-muted-foreground text-sm line-clamp-2">
          {experience.description}
        </p>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span className="line-clamp-1">{experience.location}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{experience.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>Up to {experience.max_capacity}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-5 pt-0">
        <Button 
          className="w-full bg-primary hover:bg-primary/90"
          onClick={() => navigate(`/experience/${experience.id}`)}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};
