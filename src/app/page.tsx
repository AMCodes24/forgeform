import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LandingPage } from "@/components/landing/LandingPage";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      <Navbar user={user} />
      <LandingPage user={user} />
      <Footer />
    </>
  );
}
