import { component$, Slot } from '@builder.io/qwik';
import { useLocation } from '@builder.io/qwik-city';
import { AppLayout } from '~/components/ui/app-layout';

export default component$(() => {
  const loc = useLocation();
  const isLoginPage = loc.url.pathname === '/';

  // If on homepage (/), render standalone page (no sidebar or admin header)
  if (isLoginPage) {
    return <Slot />;
  }

  // For all other pages (/dashboard, etc.), wrap in AppLayout
  return (
    <AppLayout>
      <Slot />
    </AppLayout>
  );
});
