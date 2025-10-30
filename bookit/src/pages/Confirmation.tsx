import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { fetchBooking as fetchMockBooking } from "@/mocks/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, Calendar, Clock, MapPin, User, Mail, Phone } from "lucide-react";
import { format } from "date-fns";
import type { Booking } from "@/mocks/data";

const Confirmation = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const { data: booking, isLoading } = useQuery<any | null>({
    queryKey: ["booking", bookingId],
    queryFn: async () => {
      if (!bookingId) return null;

      // If bookingId looks like the mock id (starts with b_), use the mock fetch
      if (bookingId.startsWith && bookingId.startsWith('b_')) {
        return fetchMockBooking(bookingId);
      }

      // Otherwise try Supabase first (if configured). If Supabase is not configured
      // or returns no data, fall back to the mock fetch to support local dev.
      try {
        const { data, error } = await supabase
          .from("bookings")
          .select("*, slots(*, experiences(*))")
          .eq("id", bookingId)
          .single();

        if (error) {
          // fall back to mock
          return fetchMockBooking(bookingId);
        }
        if (!data) return null;
        return data as Booking;
      } catch (err) {
        return fetchMockBooking(bookingId);
      }
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto max-w-2xl px-4 py-12">
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Booking not found</h1>
          <Button onClick={() => navigate("/")}>Back to Home</Button>
        </div>
      </div>
    );
  }

  const { slots, user_name, user_email, user_phone, spots_booked, total_price, promo_code, discount_amount } = booking as any || {};
  const experience = (slots && slots.experiences) as any;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-3xl px-4 py-12">
        <Card className="border-2 border-green-500/20 shadow-lg">
          <CardContent className="p-10">
            {/* Success Icon */}
            <div className="flex flex-col items-center text-center mb-8">
              <div className="bg-green-500/10 rounded-full p-4 mb-4">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <h1 className="text-3xl font-bold mb-2">Booking Confirmed!</h1>
              <p className="text-muted-foreground">
                Your booking has been successfully confirmed. Check your email for details.
              </p>
              <div className="mt-4 px-4 py-2 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Booking ID</p>
                <p className="font-mono font-semibold">{booking.id}</p>
              </div>
            </div>

            {/* Experience Details */}
            <div className="space-y-6">
              <div className="aspect-video relative rounded-lg overflow-hidden">
                <img
                  src={experience.image_url}
                  alt={experience.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">{experience.title}</h2>
                
                <div className="grid gap-3 text-sm">
                  <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                    <MapPin className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-muted-foreground">{experience.location}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                    <Calendar className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Date</p>
                      <p className="text-muted-foreground">
                        {format(new Date(slots.date), "EEEE, MMMM d, yyyy")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                    <Clock className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Time</p>
                      <p className="text-muted-foreground">{slots.start_time.substring(0, 5)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Details */}
              <div className="border-t pt-6">
                <h3 className="font-bold mb-4">Customer Information</h3>
                <div className="grid gap-3 text-sm">
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{user_name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{user_email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{user_phone}</span>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="border-t pt-6">
                <h3 className="font-bold mb-4">Payment Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Spots booked</span>
                    <span className="font-medium">{spots_booked}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Price per spot</span>
                    <span className="font-medium">₹{Number(experience.price).toLocaleString('en-IN')}</span>
                  </div>
                  {promo_code && (
                    <div className="flex justify-between text-green-600">
                      <span>Promo code ({promo_code})</span>
                      <span>-₹{Number(discount_amount).toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold pt-2 border-t">
                    <span>Total Paid</span>
                    <span className="text-secondary">₹{Number(total_price).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex gap-3">
              <Button
                variant="outline"
                size="lg"
                className="flex-1 text-lg font-semibold"
                onClick={() => navigate("/")}
              >
                Browse More
              </Button>
              <Button
                size="lg"
                className="flex-1 bg-primary hover:bg-primary/90 text-lg font-semibold"
                onClick={() => window.print()}
              >
                Print Confirmation
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Confirmation;
