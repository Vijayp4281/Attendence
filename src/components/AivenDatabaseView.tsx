import React, { useState, useEffect } from 'react';
import { Database, CheckCircle2, AlertCircle, RefreshCw, Server, Key, ShieldCheck, Terminal, ExternalLink } from 'lucide-react';

export default function AivenDatabaseView() {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/db/status');
      const data = await res.json();
      setStatus(data);
    } catch (err) {
      console.error('Failed to fetch DB status', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const testConnection = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/db/test');
      const data = await res.json();
      setTestResult(data);
    } catch (err: any) {
      setTestResult({ success: false, error: err.message || 'Connection test request failed' });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-orange-600 flex items-center justify-center text-white shadow-md shadow-orange-200">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Aiven MySQL Database Integration</h1>
              <p className="text-sm text-slate-500">Connect and manage your enterprise MySQL database hosted on Aiven.io</p>
            </div>
          </div>
        </div>
        <button
          onClick={fetchStatus}
          disabled={loading}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Status</span>
        </button>
      </div>

      {/* Status Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 md:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="font-bold text-slate-800 flex items-center space-x-2">
              <Server className="w-5 h-5 text-orange-600" />
              <span>Connection Parameters</span>
            </h2>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              status?.configured ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}>
              {status?.configured ? 'Configured in Environment' : 'Pending Credentials'}
            </span>
          </div>

          {loading ? (
            <div className="py-8 text-center text-slate-400">Loading database status...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-xs">Host</span>
                <span className="font-mono font-medium text-slate-800">{status?.host}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-xs">Port</span>
                <span className="font-mono font-medium text-slate-800">{status?.port}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-xs">Database Name</span>
                <span className="font-mono font-medium text-slate-800">{status?.database}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-xs">Database User</span>
                <span className="font-mono font-medium text-slate-800">{status?.user}</span>
              </div>
            </div>
          )}

          <div className="pt-2 flex items-center justify-between">
            <p className="text-xs text-slate-500">
              SSL Mode is automatically enabled for secure Aiven cloud connections.
            </p>
            <button
              onClick={testConnection}
              disabled={testing || !status?.configured}
              className={`px-5 py-2.5 rounded-xl font-medium text-sm text-white shadow-md transition-all flex items-center space-x-2 ${
                !status?.configured 
                  ? 'bg-slate-300 cursor-not-allowed shadow-none' 
                  : 'bg-orange-600 hover:bg-orange-700 shadow-orange-200'
              }`}
            >
              <Terminal className={`w-4 h-4 ${testing ? 'animate-spin' : ''}`} />
              <span>{testing ? 'Testing Connection...' : 'Test Aiven Connection'}</span>
            </button>
          </div>

          {testResult && (
            <div className={`p-4 rounded-xl border text-sm mt-4 ${
              testResult.success ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}>
              <div className="flex items-center space-x-2 font-semibold mb-1">
                {testResult.success ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
                <span>{testResult.success ? 'Connection Successful!' : 'Connection Failed'}</span>
              </div>
              <p className="font-mono text-xs mt-1">{testResult.message || testResult.error}</p>
            </div>
          )}
        </div>

        {/* Quick Guide Card */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-slate-200 space-y-4 shadow-lg flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center border border-orange-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">Aiven.io Setup Guide</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              To connect your Aiven MySQL database, provide your connection service URI parameters in the application settings or environment variables:
            </p>
            <ul className="text-xs space-y-2 text-slate-300 list-disc pl-4 font-mono">
              <li>AIVEN_MYSQL_HOST</li>
              <li>AIVEN_MYSQL_PORT</li>
              <li>AIVEN_MYSQL_USER</li>
              <li>AIVEN_MYSQL_PASSWORD</li>
              <li>AIVEN_MYSQL_DATABASE</li>
            </ul>
          </div>

          <a 
            href="https://console.aiven.io" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center space-x-2 w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-medium text-xs transition-colors shadow-md"
          >
            <span>Open Aiven Console</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
