import { MainNavigation } from '@/components/navigation/main-navigation';
import { MobileNavigation } from '@/components/navigation/mobile-navigation';
import { getCurrentUser } from '@/lib/supabase/queries';

export async function Navigation() {
  const user = await getCurrentUser();

  return (
    <>
      <MainNavigation user={user} />
      <MobileNavigation user={user} />
    </>
  );
}
