'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, FormField, Input, PageShell, PaperCard, Section, Stack } from '@/components';
import { setAdminSession } from './adminApi';

export default function AdminLogin() {
  const router = useRouter();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError('');
    if (!form.username.trim() || !form.password) {
      setError('Enter your username and password.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: form.username.trim(), password: form.password })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.token) {
        setError(response.status === 401 ? 'Invalid username or password.' : 'We could not sign you in right now. Please try again.');
        return;
      }
      setAdminSession(data.token, data.admin);
      router.replace('/admin/dashboard');
    } catch {
      setError('We could not sign you in right now. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageShell variant="admin">
      <Section spacing="compact">
        <div className="mx-auto flex min-h-[calc(100svh-7rem)] w-full max-w-[520px] items-center px-4 sm:px-8">
          <PaperCard className="w-full p-6 sm:p-9">
            <Stack gap="lg">
              <div>
                <p className="eyebrow text-muted">E-CELL MET</p>
                <h1 className="display-section mt-3 text-[clamp(2.5rem,8vw,4.25rem)]">Recruitment Command Center</h1>
                <p className="body mt-4 max-w-[38rem] text-muted">Recruitment 2026-27 admin workspace.</p>
              </div>
              <form className="grid gap-5" onSubmit={submit}>
                <FormField id="admin-username" label="Username or email" required>
                  {(props) => <Input {...props} autoComplete="username" onChange={(event) => setForm({ ...form, username: event.target.value })} value={form.username} />}
                </FormField>
                <FormField id="admin-password" label="Password" required>
                  {(props) => <Input {...props} autoComplete="current-password" onChange={(event) => setForm({ ...form, password: event.target.value })} type="password" value={form.password} />}
                </FormField>
                {error ? <p className="body-small rounded-[var(--radius-control)] border border-error bg-[var(--color-error-surface)] p-3 text-error" role="alert">{error}</p> : null}
                <Button disabled={loading} isLoading={loading} type="submit">Sign in</Button>
              </form>
            </Stack>
          </PaperCard>
        </div>
      </Section>
    </PageShell>
  );
}
