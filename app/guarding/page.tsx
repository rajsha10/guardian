// app/guarding/page.tsx
import { redirect } from 'next/navigation';

export default function GuardingPage() {
  redirect('/guarding/dashboard');
}
