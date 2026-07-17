import { redirect } from "next/navigation";

export default function LegacyBookingSuccessRedirectPage() {
  redirect("/help/consultation/bookings/success");
}
