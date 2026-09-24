'use client';

import React, { useState, useEffect } from 'react';
import { 
  Mail, Send, CheckCircle2, AlertTriangle, XCircle, RefreshCw, 
  Settings, Eye, Edit3, ShieldCheck, Database, Layers, Clock, ArrowRight, Play, FileText
} from 'lucide-react';

interface EmailTemplateRecord {
  id: string;
  event_key: string;
  subject: string;
  preheader: string;
  html_body: string;
  text_body: string;
  active: boolean;
  version: number;
  created_at: string;
  updated_at: string;
  updated_by: string;
}

interface EmailLogRecord {
  id: string;
  event_key: string;
  recipient: string;
  subject: string;
  status: 'QUEUED' | 'SENDING' | 'SENT' | 'FAILED' | 'RETRYING';
  provider_message_id?: string;
  related_type?: string;
  related_id?: string;
  error_message_safe?: string;
  retry_count: number;
  created_at: string;
  sent_at?: string;
}

interface SmtpHealthStatus {
  status: 'HEALTHY' | 'WARNING' | 'ERROR';
  message: string;
  configured: boolean;
  host: string;
  port: number;
  fromEmail: string;
  lastChecked: string;
}

export default function AdminEmailDashboardPage() {
  const [activeTab, setActiveTab] = useState<'TEMPLATES' | 'LOGS' | 'HEALTH' | 'TEST'>('TEMPLATES');

  // Templates state
  const [templates, setTemplates] = useState<EmailTemplateRecord[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplateRecord | null>(null);
  const [editSubject, setEditSubject] = useState('');
  const [editPreheader, setEditPreheader] = useState('');
  const [editHtmlBody, setEditHtmlBody] = useState('');
  const [editMode, setEditMode] = useState<'CODE' | 'PREVIEW'>('CODE');
  const [isSavingTemplate, setIsSavingTemplate] = useState(false);
  const [templateSaveSuccess, setTemplateSaveSuccess] = useState(false);

  // Logs state
  const [logs, setLogs] = useState<EmailLogRecord[]>([]);
  const [isRetryingQueue, setIsRetryingQueue] = useState(false);
  const [retryResult, setRetryResult] = useState<string | null>(null);

  // Health state
  const [health, setHealth] = useState<SmtpHealthStatus | null>(null);
  const [isCheckingHealth, setIsCheckingHealth] = useState(false);

  // Test email state
  const [testRecipient, setTestRecipient] = useState('');
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testResponse, setTestResponse] = useState<{ success?: boolean; message?: string; error?: string } | null>(null);

  const websiteApiUrl = process.env.NEXT_PUBLIC_WEBSITE_URL || '';

  const fetchTemplates = async () => {
    try {
      const res = await fetch(`${websiteApiUrl}/api/email/templates`);
      const data = await res.json();
      if (data.templates) {
        setTemplates(data.templates);
        if (!selectedTemplate && data.templates.length > 0) {
          selectTemplateForEdit(data.templates[0]);
        }
      }
    } catch (e) {
      console.error('Error fetching templates:', e);
    }
  };

  const fetchLogs = async () => {
    try {
      const res = await fetch(`${websiteApiUrl}/api/email/logs`);
      const data = await res.json();
      if (data.logs) {
        setLogs(data.logs);
      }
    } catch (e) {
      console.error('Error fetching logs:', e);
    }
  };

  const fetchHealth = async () => {
    setIsCheckingHealth(true);
    try {
      const res = await fetch(`${websiteApiUrl}/api/email/health`);
      const data = await res.json();
      if (data.health) {
        setHealth(data.health);
      }
    } catch (e) {
      console.error('Error checking health:', e);
    } finally {
      setIsCheckingHealth(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
    fetchLogs();
    fetchHealth();
  }, []);

  const selectTemplateForEdit = (tpl: EmailTemplateRecord) => {
    setSelectedTemplate(tpl);
    setEditSubject(tpl.subject || '');
    setEditPreheader(tpl.preheader || '');
    setEditHtmlBody(tpl.html_body || '');
    setTemplateSaveSuccess(false);
  };

  const handleSaveTemplate = async () => {
    if (!selectedTemplate) return;
    setIsSavingTemplate(true);
    setTemplateSaveSuccess(false);

    try {
      const res = await fetch(`${websiteApiUrl}/api/email/templates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_key: selectedTemplate.event_key,
          subject: editSubject,
          preheader: editPreheader,
          html_body: editHtmlBody,
          active: true,
          updated_by: 'admin',
        }),
      });

      const data = await res.json();
      if (res.ok && data.template) {
        setTemplateSaveSuccess(true);
        fetchTemplates();
      }
    } catch (e) {
      console.error('Save template error:', e);
    } finally {
      setIsSavingTemplate(false);
    }
  };

  const handleSendTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testRecipient) return;

    setIsSendingTest(true);
    setTestResponse(null);

    try {
      const res = await fetch(`${websiteApiUrl}/api/email/send-test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipient: testRecipient }),
      });

      const data = await res.json();
      setTestResponse(data);
      if (res.ok) {
        fetchLogs();
      }
    } catch (err: any) {
      setTestResponse({ success: false, error: err?.message || 'Network request failed' });
    } finally {
      setIsSendingTest(false);
    }
  };

  const handleRetryFailedQueue = async () => {
    setIsRetryingQueue(true);
    setRetryResult(null);
    try {
      const res = await fetch(`${websiteApiUrl}/api/email/logs`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setRetryResult(`Retried ${data.retried} emails. Successfully delivered: ${data.succeeded}`);
        fetchLogs();
      }
    } catch (e: any) {
      setRetryResult('Failed to execute retry queue');
    } finally {
      setIsRetryingQueue(false);
    }
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-6 gap-4">
        <div>
          <span className="text-xs font-bold text-[#800020] tracking-wider uppercase flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Server-Side Gmail SMTP Email Engine
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#4A2E1A] mt-1">
            Email System & Notification Control
          </h1>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-white p-1 rounded-2xl border shadow-sm flex-wrap">
          <button
            onClick={() => setActiveTab('TEMPLATES')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'TEMPLATES' ? 'bg-[#4A2E1A] text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" /> Templates ({templates.length})
          </button>
          <button
            onClick={() => { setActiveTab('LOGS'); fetchLogs(); }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'LOGS' ? 'bg-[#4A2E1A] text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5" /> Delivery Logs ({logs.length})
          </button>
          <button
            onClick={() => { setActiveTab('HEALTH'); fetchHealth(); }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'HEALTH' ? 'bg-[#4A2E1A] text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Settings className="w-3.5 h-3.5" /> SMTP Health
          </button>
          <button
            onClick={() => setActiveTab('TEST')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'TEST' ? 'bg-[#800020] text-amber-300 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Send className="w-3.5 h-3.5" /> Send Test Email
          </button>
        </div>
      </div>

      {/* TAB 1: TEMPLATES */}
      {activeTab === 'TEMPLATES' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Template List */}
          <div className="lg:col-span-4 bg-white p-4 rounded-3xl border shadow-card space-y-2 max-h-[700px] overflow-y-auto">
            <h3 className="text-xs font-bold text-gray-500 uppercase px-3 py-2">
              Supported Event Templates
            </h3>
            {templates.map((tpl) => (
              <button
                key={tpl.event_key}
                onClick={() => selectTemplateForEdit(tpl)}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all ${
                  selectedTemplate?.event_key === tpl.event_key
                    ? 'border-[#800020] bg-rose-50/40 shadow-sm'
                    : 'border-gray-100 hover:bg-gray-50'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-900">
                    {tpl.event_key}
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono">v{tpl.version}</span>
                </div>
                <p className="text-xs font-semibold text-[#4A2E1A] truncate">{tpl.subject}</p>
              </button>
            ))}
          </div>

          {/* Template Editor */}
          <div className="lg:col-span-8 bg-white p-6 rounded-3xl border shadow-card space-y-6">
            {selectedTemplate ? (
              <>
                <div className="flex justify-between items-center border-b pb-4">
                  <div>
                    <span className="text-[11px] font-mono text-blue-800 bg-blue-50 px-2 py-0.5 rounded">
                      Editing: {selectedTemplate.event_key}
                    </span>
                    <h2 className="text-lg font-bold font-serif text-[#4A2E1A] mt-1">
                      Template Version {selectedTemplate.version}
                    </h2>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditMode('CODE')}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${
                        editMode === 'CODE' ? 'bg-[#4A2E1A] text-white' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      <Edit3 className="w-3.5 h-3.5 inline mr-1" /> Edit Code
                    </button>
                    <button
                      onClick={() => setEditMode('PREVIEW')}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${
                        editMode === 'PREVIEW' ? 'bg-[#4A2E1A] text-white' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5 inline mr-1" /> Live Preview
                    </button>
                  </div>
                </div>

                {templateSaveSuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-medium text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Email template version saved successfully!
                  </div>
                )}

                {editMode === 'CODE' ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                        Email Subject Line
                      </label>
                      <input
                        type="text"
                        value={editSubject}
                        onChange={(e) => setEditSubject(e.target.value)}
                        className="w-full text-sm p-3 border rounded-xl font-medium focus:ring-2 focus:ring-[#800020]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                        Preheader Snippet
                      </label>
                      <input
                        type="text"
                        value={editPreheader}
                        onChange={(e) => setEditPreheader(e.target.value)}
                        className="w-full text-xs p-3 border rounded-xl font-medium focus:ring-2 focus:ring-[#800020]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                        HTML Email Body Template
                      </label>
                      <textarea
                        rows={12}
                        value={editHtmlBody}
                        onChange={(e) => setEditHtmlBody(e.target.value)}
                        className="w-full text-xs p-3 font-mono border rounded-xl bg-slate-900 text-slate-100 focus:ring-2 focus:ring-[#800020]"
                      />
                    </div>

                    <button
                      onClick={handleSaveTemplate}
                      disabled={isSavingTemplate}
                      className="px-6 py-3 bg-[#800020] hover:bg-[#600018] text-white font-semibold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
                    >
                      {isSavingTemplate ? 'Saving Template...' : 'Save Template Version'}
                    </button>
                  </div>
                ) : (
                  <div className="border rounded-2xl p-4 bg-gray-50 min-h-[400px]">
                    <div className="bg-white border rounded-xl p-4 mb-4">
                      <p className="text-xs text-gray-500 font-semibold">Subject: {editSubject}</p>
                      <p className="text-[11px] text-gray-400">Preheader: {editPreheader}</p>
                    </div>
                    <div
                      className="bg-white border rounded-xl p-4"
                      dangerouslySetInnerHTML={{ __html: editHtmlBody }}
                    />
                  </div>
                )}
              </>
            ) : (
              <p className="text-xs text-gray-500">Select a template to view or edit.</p>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: DELIVERY LOGS */}
      {activeTab === 'LOGS' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-gray-500 uppercase">
              Recent Transactional Email Logs ({logs.length})
            </span>
            <button
              onClick={handleRetryFailedQueue}
              disabled={isRetryingQueue}
              className="px-4 py-2 bg-[#4A2E1A] text-white text-xs font-semibold rounded-xl flex items-center gap-2 shadow-sm hover:bg-[#341F11]"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRetryingQueue ? 'animate-spin' : ''}`} />
              Retry Failed Queue
            </button>
          </div>

          {retryResult && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800 font-medium">
              {retryResult}
            </div>
          )}

          <div className="bg-white rounded-3xl shadow-card border overflow-hidden">
            <table className="w-full text-left text-xs text-[#4A2E1A]">
              <thead className="bg-[#2A180B] text-white uppercase text-[10px]">
                <tr>
                  <th className="px-6 py-4">Event Key</th>
                  <th className="px-6 py-4">Recipient</th>
                  <th className="px-6 py-4">Subject</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-400 text-xs">
                      No email delivery logs recorded yet.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-mono font-bold text-xs text-blue-900">
                        {log.event_key}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-gray-700">{log.recipient}</td>
                      <td className="px-6 py-4 text-gray-600 max-w-xs truncate">{log.subject}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                            log.status === 'SENT'
                              ? 'bg-emerald-100 text-emerald-800'
                              : log.status === 'FAILED'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {log.status}
                        </span>
                        {log.error_message_safe && (
                          <p className="text-[10px] text-rose-600 mt-1 max-w-xs truncate">
                            {log.error_message_safe}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right text-gray-400 text-[11px] font-mono">
                        {new Date(log.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: SMTP HEALTH */}
      {activeTab === 'HEALTH' && (
        <div className="bg-white p-8 rounded-3xl border shadow-card space-y-6 max-w-2xl">
          <div className="flex justify-between items-center border-b pb-4">
            <h3 className="text-lg font-serif font-bold text-[#4A2E1A]">Gmail SMTP Server Status</h3>
            <button
              onClick={fetchHealth}
              disabled={isCheckingHealth}
              className="px-3 py-1.5 text-xs font-semibold bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isCheckingHealth ? 'animate-spin' : ''}`} /> Check Connection
            </button>
          </div>

          {health ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 border">
                {health.status === 'HEALTHY' && <CheckCircle2 className="w-8 h-8 text-emerald-600" />}
                {health.status === 'WARNING' && <AlertTriangle className="w-8 h-8 text-amber-600" />}
                {health.status === 'ERROR' && <XCircle className="w-8 h-8 text-rose-600" />}

                <div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                    health.status === 'HEALTHY' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {health.status}
                  </span>
                  <p className="text-xs text-gray-700 mt-1 font-medium">{health.message}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs font-medium text-gray-600 pt-2">
                <div className="p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">SMTP Host</span>
                  {health.host}:{health.port}
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Sender Email</span>
                  {health.fromEmail}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-gray-500">Checking SMTP health...</p>
          )}
        </div>
      )}

      {/* TAB 4: SEND TEST EMAIL */}
      {activeTab === 'TEST' && (
        <div className="bg-white p-8 rounded-3xl border shadow-card space-y-6 max-w-xl">
          <h3 className="text-lg font-serif font-bold text-[#4A2E1A]">Super Admin SMTP Test Benchmark</h3>
          <p className="text-xs text-gray-600">
            Enter a recipient email address below to test live Gmail SMTP delivery with GayaSeva branded template parameters.
          </p>

          <form onSubmit={handleSendTestEmail} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Recipient Email Address
              </label>
              <input
                type="email"
                value={testRecipient}
                onChange={(e) => setTestRecipient(e.target.value)}
                required
                placeholder="your.email@gmail.com"
                className="w-full text-sm p-3 border rounded-xl focus:ring-2 focus:ring-[#800020]"
              />
            </div>

            <button
              type="submit"
              disabled={isSendingTest}
              className="w-full py-3.5 px-4 bg-[#800020] hover:bg-[#600018] text-white font-semibold text-xs rounded-xl shadow-md transition-all flex justify-center items-center gap-2"
            >
              {isSendingTest ? 'Sending Test Email...' : 'Send GayaSeva Test Email'}
            </button>
          </form>

          {testResponse && (
            <div className={`p-4 rounded-xl text-xs font-medium border ${
              testResponse.success ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}>
              {testResponse.message || testResponse.error}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
