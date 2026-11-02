import React, { useState } from 'react';

interface ResetRequest { requestId: string; mobile: string; createdAt: string }

export default function StudentResetDesk({ adminEmail }: { adminEmail: string }) {
  const [password, setPassword] = useState('');
  const [recoveryAdminSecret, setRecoveryAdminSecret] = useState('');
  const [requests, setRequests] = useState<ResetRequest[]>([]);
  const [selected, setSelected] = useState('');
  const [note, setNote] = useState('');
  const [credential, setCredential] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  async function call(path: string, extra: object = {}) {
    setBusy(true); setMessage('');
    try {
      const response = await fetch(`/api/auth/student-reset/admin/${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ adminEmail, adminPassword: password, recoveryAdminSecret, ...extra }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Unable to process request.');
      return result;
    } catch (err: any) { setMessage(err.message); return null; }
    finally { setBusy(false); }
  }
  async function load() {
    setCredential('');
    const result = await call('list');
    if (result) { setRequests(result.requests); setMessage(result.requests.length ? '' : 'No pending requests.'); }
  }
  async function issue(e: React.FormEvent) {
    e.preventDefault(); setCredential('');
    const result = await call('issue', { requestId: selected, verificationNote: note });
    if (result) {
      setCredential(result.credential); setRequests(requests.filter(r => r.requestId !== selected)); setSelected(''); setNote(''); setPassword(''); setRecoveryAdminSecret('');
      setMessage('Give this credential to the verified student using your trusted process. It expires in 30 minutes and is shown only once.');
    }
  }
  return (
    <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 mt-6">
      <h3 className="text-lg font-bold text-slate-900">Student Password Reset Requests</h3>
      <p className="text-sm text-slate-600">Verify identity through an established school contact or another trusted process before issuing a credential. No message is sent by the system.</p>
      <label className="block text-sm font-medium">Admin password
        <input className="block mt-1 w-full border rounded-lg p-2" type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" />
      </label>
      <label className="block text-sm font-medium">Reset authorization secret
        <input className="block mt-1 w-full border rounded-lg p-2" type="password" value={recoveryAdminSecret} onChange={e => setRecoveryAdminSecret(e.target.value)} autoComplete="off" />
      </label>
      <button type="button" disabled={busy || !password || !recoveryAdminSecret} onClick={load} className="bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-bold disabled:opacity-50">Load Requests</button>
      {requests.length > 0 && <form onSubmit={issue} className="space-y-3">
        <label className="block text-sm">Pending request
          <select className="block w-full border rounded-lg p-2 mt-1" required value={selected} onChange={e => setSelected(e.target.value)}>
            <option value="">Select a request</option>
            {requests.map(r => <option key={r.requestId} value={r.requestId}>{r.mobile} - {new Date(r.createdAt).toLocaleString()}</option>)}
          </select>
        </label>
        <label className="block text-sm">How was identity verified?
          <textarea className="block w-full border rounded-lg p-2 mt-1" required minLength={10} maxLength={500} value={note} onChange={e => setNote(e.target.value)} placeholder="Record the school contact or trusted verification method" />
        </label>
        <button disabled={busy || !password || !recoveryAdminSecret} className="bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-bold disabled:opacity-50">Issue One-Time Credential</button>
      </form>}
      {message && <p className="text-sm text-slate-700" role="status">{message}</p>}
      {credential && <div className="bg-blue-50 rounded-lg p-3 break-all text-sm"><strong>One-time credential:</strong> <span className="font-mono select-all">{credential}</span></div>}
    </section>
  );
}
