import { useParams, useNavigate } from "react-router-dom";
import { } from "@tanstack/react-query";
import { useSlot } from "@/hooks/use-slots";
import { useExperience } from "@/hooks/use-experiences";
import { useValidatePromoCode } from "@/hooks/use-promo-codes";
import { useCreateBooking } from "@/hooks/use-bookings";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Calendar, Clock, MapPin, Tag, Users } from "lucide-react";
import { format } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Toaster } from "sonner";

const bookingSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
  phone: z.string().trim().regex(/^\+91[6-9]\d{9}$/, "Phone number must start with +91 followed by a valid 10-digit Indian mobile number"),
  spots: z.number().min(1).max(20),
});

const Checkout = () => {
  const { slotId } = useParams<{ slotId: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    spots: 1,
  });
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number } | null>(null);


  const { data: slot, isLoading: slotLoading } = useSlot(slotId);
  const { data: experience } = useExperience(slot?.experience_id);

  const validatePromo = useValidatePromoCode();
  const createBooking = useCreateBooking();
  const queryClient = useQueryClient();

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    try {
      const res: any = await validatePromo.mutateAsync(promoCode.trim());
      setAppliedPromo({ code: res.code, discount: res.discount_percentage });
      toast.success(`Promo code applied! ${res.discount_percentage}% off`);
    } catch (err: any) {
      toast.error(err?.message || 'Invalid promo code');
    }
  };

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    
    // If no digits, return empty string
    if (!digits.length) return '';
    
    // Always start with +91
    if (!value.startsWith('+91')) {
      return '+91' + digits.slice(0, 10);
    }
    
    // Keep only the first 10 digits after +91
    return '+91' + digits.slice(digits.length - 10, digits.length);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedNumber = formatPhoneNumber(e.target.value);
    setFormData({ ...formData, phone: formattedNumber });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const validated = bookingSchema.parse(formData);
      if (!slot) throw new Error('Slot not found');
      if (validated.spots > slot.available_spots) throw new Error('Not enough spots available');

      const basePrice = Number(experience?.price || 0) * validated.spots;
      const discountAmount = appliedPromo ? (basePrice * appliedPromo.discount) / 100 : 0;
      const totalPrice = basePrice - discountAmount;

      const payload = {
        slot_id: slot.id,
        user_name: validated.name,
        user_email: validated.email,
        user_phone: validated.phone,
        spots_booked: validated.spots,
        promo_code: appliedPromo?.code || null,
        discount_amount: discountAmount,
        total_price: totalPrice,
        status: 'confirmed',
      };

      const booking: any = await createBooking.mutateAsync(payload);
      // Invalidate slot and experience queries so availability updates across the app
      try {
        if (slot?.id) {
          queryClient.invalidateQueries({ queryKey: ["slot", slot.id] });
        }
        if (experience?.id) {
          queryClient.invalidateQueries({ queryKey: ["experience", experience.id] });
          queryClient.invalidateQueries({ queryKey: ["slots", experience.id] });
        }
      } catch (e) {
        // ignore
      }

      navigate(`/confirmation/${booking.id}`);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to create booking');
    }
  };

  if (slotLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto max-w-4xl px-4 py-8">
          <Skeleton className="h-12 w-64 mb-8" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (!slot) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Slot not found</h1>
          <Button onClick={() => navigate("/")}>Back to Home</Button>
        </div>
      </div>
    );
  }

  const basePrice = Number(experience?.price || 0) * formData.spots;
  const discountAmount = appliedPromo ? (basePrice * appliedPromo.discount) / 100 : 0;
  const totalPrice = basePrice - discountAmount;

  return (
    <div className="min-h-screen bg-background">
      <Toaster />
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="relative mb-8">
          <div className="aspect-[16/6] md:aspect-[16/5] w-full rounded-lg overflow-hidden shadow-md">
            <img
              src={experience?.image_url}
              alt={experience?.title}
              className="w-full h-full object-cover object-center filter brightness-90"
            />
          </div>

          <div className="absolute left-4 top-4">
            <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[95%] md:w-11/12">
            <div className="bg-background/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={experience?.image_url} alt={experience?.title} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold">{experience?.title}</h2>
                    <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2"><MapPin className="h-4 w-4" />{experience?.location}</p>
                    <div className="mt-2 flex gap-3 text-sm">
                      <span className="inline-flex items-center gap-2 px-2 py-1 rounded-md bg-muted/60 text-muted-foreground">
                        <Clock className="h-4 w-4" /> {experience?.duration} min
                      </span>
                      <span className="inline-flex items-center gap-2 px-2 py-1 rounded-md bg-muted/60 text-muted-foreground">
                        <Users className="h-4 w-4" /> Max {experience?.max_capacity || '—'}
                      </span>
                      <span className="inline-flex items-center gap-2 px-2 py-1 rounded-md bg-primary text-primary-foreground font-semibold">
                        ₹{Number(experience?.price || 0).toFixed(2)} per person
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Selected Slot</div>
                    <div className="font-medium">{format(new Date(slot.date), "EEE, MMM d")}, {slot.start_time.substring(0,5)}</div>
                  </div>
                  <div className="hidden md:block border-l h-10" />
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Availability</div>
                    <div className="font-medium">{slot.available_spots} spots</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-4">Complete Your Booking</h1>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Your Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="john@example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      placeholder="+91 9876543210"
                      pattern="^\+91[6-9]\d{9}$"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="spots">Number of Spots *</Label>
                    <Input
                      id="spots"
                      type="number"
                      min="1"
                      max={slot.available_spots}
                      required
                      value={formData.spots}
                      onChange={(e) => setFormData({ ...formData, spots: parseInt(e.target.value) || 1 })}
                    />
                    <p className="text-sm text-muted-foreground">
                      {slot.available_spots} spots available
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="promo">Promo Code</Label>
                    <div className="flex gap-2">
                      <Input
                        id="promo"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                        placeholder="Enter code"
                        disabled={!!appliedPromo}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleApplyPromo}
                        disabled={!!appliedPromo || !promoCode.trim()}
                      >
                        Apply
                      </Button>
                    </div>
                    {appliedPromo && (
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <Tag className="h-4 w-4" />
                        <span>{appliedPromo.discount}% discount applied</span>
                      </div>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-lg py-6 mt-6 font-semibold"
                    disabled={createBooking.status === 'pending'}
                  >
                    {createBooking.status === 'pending' ? "Processing..." : "Confirm Booking - ₹" + totalPrice.toFixed(2)}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-2">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="aspect-video relative rounded-lg overflow-hidden">
                  <img
                    src={experience?.image_url}
                    alt={experience?.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div>
                  <h3 className="font-bold text-lg">{experience?.title}</h3>
                  <div className="space-y-2 mt-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{experience?.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{format(new Date(slot.date), "EEEE, MMM d, yyyy")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{slot.start_time.substring(0, 5)}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Price × {formData.spots}</span>
                    <span>₹{basePrice.toFixed(2)}</span>
                  </div>
                  {appliedPromo && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({appliedPromo.discount}%)</span>
                      <span>-₹{discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">₹{totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
