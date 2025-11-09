import { MainNavigation } from '@/components/navigation/main-navigation';
import { MobileNavigation } from '@/components/navigation/mobile-navigation';
import { createClient } from '@/lib/supabase/server';

export async function Navigation() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      <MainNavigation user={user} />
      <MobileNavigation user={user} />
    </>
  );
}
