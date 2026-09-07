'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AdminShell } from '@/components';
import { clearAdminSession, adminFetch, adminFetchBlob, AdminAuthError, fetchAdminProfile, getAdminUser } from './adminApi';
import AdminOverview from './AdminOverview';
import CandidateList from './CandidateList';
import CandidateDetail from './CandidateDetail';
import { RecruitmentAnalytics, TeamsOverview } from './TeamsAnalytics';

const views = ['overview', 'candidates', 'teams', 'analytics'];
const initialFilters = { search: '', status: '', team: '', yearOfStudy: '', branch: '', sort: 'newest', page: 1 };

export default function AdminDashboard() {
  const router = useRouter();
  const params = useSearchParams();
  const view = views.includes(params.get('view')) ? params.get('view') : 'overview';
  const candidateId = params.get('candidate');
  const [filters, setFilters] = useState(() => ({ ...initialFilters }));
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [candidateData, setCandidateData] = useState(null);
  const [candidateLoading, setCandidateLoading] = useState(false);
  const [listData, setListData] = useState(null);
  const [listLoading, setListLoading] = useState(false);
  const [overviewError, setOverviewError] = useState('');
  const [listError, setListError] = useState('');
  const [sessionError, setSessionError] = useState('');
  const [exporting, setExporting] = useState(false);
  const [user, setUser] = useState(null);
  const lastOpenedCandidateId = useRef(null);

  useEffect(() => {
    const cachedUser = getAdminUser();
    if (cachedUser) setUser(cachedUser);
    fetchAdminProfile()
      .then((admin) => setUser(admin))
      .catch((error) => {
        if (error instanceof AdminAuthError) {
          setSessionError(error.message);
          router.replace('/admin');
        }
      });
  }, [router]);
  useEffect(() => { setFilters({ search: params.get('search') || '', status: params.get('status') || '', team: params.get('team') || '', yearOfStudy: params.get('yearOfStudy') || '', branch: params.get('branch') || '', sort: params.get('sort') || 'newest', page: Number(params.get('page')) || 1 }); }, [params]);
  const navigate = useCallback((nextView, nextFilters = filters) => { const query = new URLSearchParams(); query.set('view', nextView); Object.entries(nextFilters).forEach(([key, value]) => { if (value && value !== 'newest' && value !== 1) query.set(key, String(value)); }); router.push(`/admin/dashboard?${query.toString()}`); }, [filters, router]);
  const setFilter = useCallback((key, value) => { const next = { ...filters, [key]: value }; if (['search', 'status', 'team', 'yearOfStudy', 'branch', 'sort'].includes(key)) next.page = 1; navigate('candidates', next); }, [filters, navigate]);
  const refreshStats = useCallback(async () => { setOverviewError(''); try { const [statsResult, recentResult] = await Promise.all([adminFetch('/api/applications/stats'), adminFetch('/api/applications?limit=6&sort=newest')]); setStats(statsResult); setRecent(recentResult.applications || []); } catch (error) { if (error instanceof AdminAuthError) { setSessionError(error.message); router.replace('/admin'); } else setOverviewError('We could not load recruitment statistics right now.'); } }, [router]);
  const refreshList = useCallback(async () => { setListLoading(true); setListError(''); const query = new URLSearchParams({ page: String(filters.page || 1), limit: '25', sort: filters.sort || 'newest' }); if (filters.search) query.set('search', filters.search); if (filters.status) query.set('status', filters.status); if (filters.team) query.set('primaryTeam', filters.team); if (filters.yearOfStudy) query.set('yearOfStudy', filters.yearOfStudy); if (filters.branch) query.set('branch', filters.branch); try { setListData(await adminFetch(`/api/applications?${query.toString()}`)); } catch (error) { if (error instanceof AdminAuthError) { setSessionError(error.message); router.replace('/admin'); } else setListError('We could not load candidates right now.'); } finally { setListLoading(false); } }, [filters, router]);
  useEffect(() => { refreshStats(); }, [refreshStats]);
  useEffect(() => { if (view === 'candidates') refreshList(); }, [view, refreshList]);
  useEffect(() => { if (!candidateId) { setCandidateData(null); return; } setCandidateLoading(true); adminFetch(`/api/applications/${candidateId}`).then((data) => setCandidateData(data.application)).catch((error) => { if (error instanceof AdminAuthError) router.replace('/admin'); else setListError('Couldn’t load this candidate.'); }).finally(() => setCandidateLoading(false)); }, [candidateId, router]);
  async function logout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } finally {
      clearAdminSession();
      router.replace('/admin');
    }
  }
  function openCandidate(id) { lastOpenedCandidateId.current = id; const query = new URLSearchParams(params.toString()); query.set('candidate', id); query.set('view', 'candidates'); router.push(`/admin/dashboard?${query.toString()}`); }
  function closeCandidate() { const candidateToRestore = lastOpenedCandidateId.current; const query = new URLSearchParams(params.toString()); query.delete('candidate'); router.push(`/admin/dashboard?${query.toString()}`); window.setTimeout(() => { if (!candidateToRestore) return; const safeId = String(candidateToRestore).replace(/["\\]/g, '\\$&'); document.querySelector(`[data-candidate-id="${safeId}"]`)?.focus(); }, 120); }
  async function updateCandidate(payload) { if (!candidateId) return; try { const result = await adminFetch(`/api/applications/${candidateId}`, { method: 'PUT', body: JSON.stringify(payload) }); setCandidateData(result.application); setListData((current) => current ? { ...current, applications: current.applications.map((item) => item._id === candidateId ? { ...item, ...result.application } : item) } : current); refreshStats(); } catch (error) { if (error instanceof AdminAuthError) router.replace('/admin'); else setListError(payload.status ? 'Couldn’t update candidate status. Your previous status is unchanged.' : 'Couldn’t save internal note. Your text is still here.'); throw error; } }
  async function deleteCandidate() { if (!candidateId) return; try { await adminFetch(`/api/applications/${candidateId}`, { method: 'DELETE' }); closeCandidate(); refreshList(); refreshStats(); } catch (error) { if (error instanceof AdminAuthError) router.replace('/admin'); else setListError('Couldn’t delete this application.'); throw error; } }
  async function exportCsv() { setExporting(true); try { const query = new URLSearchParams(); if (filters.search) query.set('search', filters.search); if (filters.status) query.set('status', filters.status); if (filters.team) query.set('primaryTeam', filters.team); if (filters.yearOfStudy) query.set('yearOfStudy', filters.yearOfStudy); if (filters.branch) query.set('branch', filters.branch); const result = await adminFetchBlob(`/api/applications/export?${query.toString()}`); const url = URL.createObjectURL(result.blob); const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'ecell_applications_2026.csv'; anchor.click(); URL.revokeObjectURL(url); } catch (error) { if (error instanceof AdminAuthError) router.replace('/admin'); else setListError('Couldn’t export applications right now.'); } finally { setExporting(false); } }
  const title = { overview: 'Overview', candidates: 'Candidates', teams: 'Teams', analytics: 'Analytics' }[view];
  if (sessionError) return null;
  return <AdminShell activeView={view} adminSlot={user?.username || user?.email || 'Admin'} logoutSlot={<button className="min-h-11 text-left text-sm text-muted underline-offset-4 hover:text-foreground hover:underline" onClick={logout} type="button">Logout</button>} onNavigate={navigate} subtitle={view === 'overview' ? 'A clear view of the 2026-27 recruitment pipeline.' : undefined} title={title}><div className="flex justify-end">{view === 'candidates' && exporting ? <span className="body-small text-muted" role="status">Exporting...</span> : null}</div>{view === 'overview' ? <AdminOverview error={overviewError} loading={!stats} onRetry={refreshStats} onSelect={openCandidate} onViewCandidates={(next) => navigate('candidates', { ...initialFilters, ...(next.team ? { team: next.team } : {}) })} recent={recent} stats={stats} /> : null}{view === 'candidates' ? <CandidateList data={listData} error={listError} filters={filters} loading={listLoading} onExport={exportCsv} onRetry={refreshList} onSelect={openCandidate} setFilter={setFilter} /> : null}{view === 'teams' ? <TeamsOverview onTeam={(team) => navigate('candidates', { ...initialFilters, team })} stats={stats} /> : null}{view === 'analytics' ? <RecruitmentAnalytics stats={stats} /> : null}{candidateId ? <CandidateDetail candidate={candidateData} loading={candidateLoading} onClose={closeCandidate} onDelete={deleteCandidate} onNotes={(notes) => updateCandidate({ internalNotes: notes })} onStatus={(status) => updateCandidate({ status })} /> : null}</AdminShell>;
}
