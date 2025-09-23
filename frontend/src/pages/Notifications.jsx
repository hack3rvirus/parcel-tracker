import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Bell, ShieldCheck, CheckCircle, AlertTriangle, RefreshCcw, Check, EyeOff, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';
import API_BASE_URL from '@/config/api';

function decodeJwt(token) {
  try {
    const payload = token.split('.')[1];
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decodeURIComponent(escape(json)));
  } catch {
    return null;
  }
}

function formatDateHeader(ts) {
  const d = new Date(ts);
  const today = new Date();
  const yest = new Date();
  yest.setDate(today.getDate() - 1);
  const sameDay = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  if (sameDay(d, today)) return 'Today';
  if (sameDay(d, yest)) return 'Yesterday';
  return d.toLocaleDateString();
}

export default function Notifications() {
  const [permission, setPermission] = useState(typeof Notification !== 'undefined' ? Notification.permission : 'default');
  const [supported, setSupported] = useState(false);
  const [token, setToken] = useState('');
  const [alerts, setAlerts] = useState([]); // local recent alerts
  const [cloudAlerts, setCloudAlerts] = useState([]);
  const [cloudFilter, setCloudFilter] = useState('all'); // all | unread | read
  const [loadingCloud, setLoadingCloud] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const { toast } = useToast();

  // Init support + load local alerts
  useEffect(() => {
    (async () => {
      try {
        setSupported('serviceWorker' in navigator && 'PushManager' in window);
      } catch {
        setSupported(false);
      }
    })();
    try {
      const stored = JSON.parse(localStorage.getItem('alerts') || '[]');
      const normalized = stored.map((a) => ({ read: false, ...a }));
      setAlerts(normalized);
    } catch {}
  }, []);

  // Foreground message listener (simplified without Firebase)
  useEffect(() => {
    let unsub = () => {};
    (async () => {
      try {
        if (supported) {
          // Listen for push events (simplified)
          unsub = () => {
            // Cleanup function
          };
        }
      } catch {}
    })();
    return () => { try { unsub(); } catch {} };
  }, [supported, toast, alerts]);

  const enablePush = async () => {
    try {
      if (!supported) {
        toast({
          title: 'Not supported',
          description: 'This browser does not support push notifications.',
          variant: "destructive"
        });
        return;
      }
      const perm = await Notification.requestPermission();
      setPermission(perm);
      if (perm !== 'granted') {
        toast({
          title: 'Permission denied',
          description: 'Enable notifications in your browser settings to receive updates.',
          variant: "destructive"
        });
        return;
      }

      // Register service worker for push notifications
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js');
          const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(import.meta.env.VITE_VAPID_PUBLIC_KEY || 'default')
          });

          setToken(JSON.stringify(subscription));
          const jwt = localStorage.getItem('token');
          const payload = jwt ? decodeJwt(jwt) : null;
          if (!payload?.uid) {
            toast({
              title: 'Not logged in',
              description: 'Log in to associate notifications with your account.',
              variant: "destructive"
            });
            return;
          }

          // Send subscription to backend
          const response = await axios.post(`${API_BASE_URL}/notifications/subscribe`, {
            subscription: subscription,
            user_id: payload.uid
          }, {
            headers: { Authorization: `Bearer ${jwt}` }
          });

          toast({
            title: 'Notifications enabled',
            description: 'You will receive delivery updates.'
          });
        } catch (e) {
          toast({
            title: 'Enable failed',
            description: e?.message || 'Could not enable notifications.',
            variant: "destructive"
          });
        }
      }
    } catch (e) {
      toast({
        title: 'Enable failed',
        description: e?.message || 'Could not enable notifications.',
        variant: "destructive"
      });
    }
  };

  const refreshCloudAlerts = async () => {
    try {
      setLoadingCloud(true);
      const jwt = localStorage.getItem('token');
      const payload = jwt ? decodeJwt(jwt) : null;
      if (!payload?.uid) {
        toast({
          title: 'Not logged in',
          description: 'Log in to fetch your cloud alerts.',
          variant: "destructive"
        });
        setLoadingCloud(false);
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/notifications`, {
        headers: { Authorization: `Bearer ${jwt}` }
      });

      const list = response.data.map(alert => ({
        id: alert.id,
        title: alert.title || 'Notification',
        body: alert.body || '',
        ts: new Date(alert.created_at).getTime(),
        read: !!alert.read,
      }));

      setCloudAlerts(list);
      setPage(1);
    } catch (e) {
      toast({
        title: 'Fetch failed',
        description: e?.message || 'Unable to load alerts.',
        variant: "destructive"
      });
    } finally {
      setLoadingCloud(false);
    }
  };

  // Local recent alerts actions
  const markLocalRead = (idx, flag = true) => {
    const next = alerts.map((a, i) => (i === idx ? { ...a, read: flag } : a));
    setAlerts(next);
    localStorage.setItem('alerts', JSON.stringify(next));
  };

  const markLocalAllRead = () => {
    const next = alerts.map((a) => ({ ...a, read: true }));
    setAlerts(next);
    localStorage.setItem('alerts', JSON.stringify(next));
  };

  // Cloud alerts actions
  const markCloudRead = async (id, flag = true) => {
    try {
      const jwt = localStorage.getItem('token');
      await axios.put(`${API_BASE_URL}/notifications/${id}`, { read: flag }, {
        headers: { Authorization: `Bearer ${jwt}` }
      });
      await refreshCloudAlerts();
    } catch (e) {
      toast({
        title: 'Update failed',
        description: e?.message || 'Could not update alert.',
        variant: "destructive"
      });
    }
  };

  const markCloudAllRead = async () => {
    try {
      setLoadingCloud(true);
      const jwt = localStorage.getItem('token');
      await axios.put(`${API_BASE_URL}/notifications/mark-all-read`, {}, {
        headers: { Authorization: `Bearer ${jwt}` }
      });
      await refreshCloudAlerts();
    } catch (e) {
      toast({
        title: 'Update failed',
        description: e?.message || 'Could not update alerts.',
        variant: "destructive"
      });
    } finally {
      setLoadingCloud(false);
    }
  };

  // Filter + paginate cloud alerts
  const filteredCloud = useMemo(() => {
    const list = cloudAlerts.filter((a) => cloudFilter === 'all' ? true : cloudFilter === 'unread' ? !a.read : !!a.read);
    return list;
  }, [cloudAlerts, cloudFilter]);

  const pageCount = Math.max(1, Math.ceil(filteredCloud.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pageSlice = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredCloud.slice(start, start + pageSize);
  }, [filteredCloud, currentPage]);

  // Group by date headers for current page slice
  const groupedCloud = useMemo(() => {
    const groups = {};
    for (const a of pageSlice) {
      const key = formatDateHeader(a.ts);
      if (!groups[key]) groups[key] = [];
      groups[key].push(a);
    }
    return Object.entries(groups).map(([label, items]) => ({ label, items }));
  }, [pageSlice]);

  const cloudCounts = useMemo(() => {
    const total = cloudAlerts.length;
    const unread = cloudAlerts.filter((a) => !a.read).length;
    const read = total - unread;
    return { total, unread, read };
  }, [cloudAlerts]);

  // Helper function for VAPID key conversion
  function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  return (
    <div className="pt-20 p-4 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Notifications</h1>
        <p className="text-muted-foreground">Manage your alerts and real-time delivery updates</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5" /> Push Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Receive instant updates when parcel status changes or deliveries are completed. Works on supported browsers.
            </p>
            <div className="flex items-center gap-3">
              <Button onClick={enablePush}>Enable Browser Push</Button>
              <span className="text-sm text-muted-foreground">Permission: <strong>{permission}</strong></span>
            </div>
            {token && (
              <div className="text-xs break-all text-muted-foreground">Token: {token}</div>
            )}
            {!supported && (
              <div className="text-sm text-yellow-700 bg-yellow-50 border border-yellow-300 rounded px-3 py-2">
                <AlertTriangle className="inline h-4 w-4 mr-1" /> Push notifications are not supported on this device/browser.
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><ShieldCheck className="h-5 w-5" /> Subscriptions & Alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <ul className="list-disc pl-6 text-sm">
              <li>Delivery status changes (Processing → In Transit → Delivered)</li>
              <li>ETA updates and route changes</li>
              <li>Failed delivery attempts and re-schedule prompts</li>
            </ul>
            <div className="text-sm text-muted-foreground">More options will appear here as your preferences expand.</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><CheckCircle className="h-5 w-5" /> Recent Alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.length === 0 ? (
              <div className="text-sm text-muted-foreground">No alerts yet. Keep this tab open to receive foreground notifications.</div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">Total: {alerts.length}</div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={markLocalAllRead}><Check className="h-4 w-4 mr-1" /> Mark all read</Button>
                    <Button size="sm" variant="outline" onClick={()=>{ setAlerts([]); localStorage.removeItem('alerts'); }}>Clear</Button>
                  </div>
                </div>
                <ul className="space-y-2">
                  {alerts.map((a, idx) => (
                    <li key={idx} className={`border rounded-md p-3 ${a.read ? '' : 'border-accent/50 bg-accent/5'}`}>
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{a.title}</div>
                        <Button size="sm" variant="ghost" onClick={()=>markLocalRead(idx, !a.read)} aria-label={a.read ? 'Mark unread' : 'Mark read'}>
                          {a.read ? <EyeOff className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                        </Button>
                      </div>
                      <div className="text-sm text-muted-foreground">{a.body}</div>
                      <div className="text-xs text-muted-foreground mt-1">{new Date(a.ts).toLocaleString()}</div>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><RefreshCcw className="h-5 w-5" /> Cloud Alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="text-sm text-muted-foreground">Your last {filteredCloud.length} alerts (showing page {Math.min(currentPage, pageCount)} of {pageCount})</div>
              <div className="flex items-center gap-2">
                <select className="border rounded-md h-9 px-3 text-sm" value={cloudFilter} onChange={(e) => { setCloudFilter(e.target.value); setPage(1); }} aria-label="Filter cloud alerts">
                  <option value="all">All ({cloudCounts.total})</option>
                  <option value="unread">Unread ({cloudCounts.unread})</option>
                  <option value="read">Read ({cloudCounts.read})</option>
                </select>
                <Button size="sm" variant="outline" onClick={markCloudAllRead} disabled={loadingCloud}><Check className="h-4 w-4 mr-1" /> Mark all read</Button>
                <Button size="sm" onClick={refreshCloudAlerts} disabled={loadingCloud}>{loadingCloud ? 'Loading…' : 'Refresh'}</Button>
              </div>
            </div>
            {/* Date-grouped list for the current page */}
            {groupedCloud.length === 0 ? (
              <div className="text-sm text-muted-foreground">No alerts for this filter.</div>
            ) : (
              <div className="space-y-4">
                {groupedCloud.map((group) => (
                  <div key={group.label}>
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">{group.label}</div>
                    <ul className="space-y-2">
                      {group.items.map((a) => (
                        <li key={a.id} className={`border rounded-md p-3 ${a.read ? '' : 'border-accent/50 bg-accent/5'}`}>
                          <div className="flex items-center justify-between">
                            <div className="font-medium">{a.title}</div>
                            <Button size="sm" variant="ghost" onClick={()=>markCloudRead(a.id, !a.read)} aria-label={a.read ? 'Mark unread' : 'Mark read'}>
                              {a.read ? <EyeOff className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                            </Button>
                          </div>
                          <div className="text-sm text-muted-foreground">{a.body}</div>
                          <div className="text-xs text-muted-foreground mt-1">{new Date(a.ts).toLocaleString()}</div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
            {/* Pagination controls */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <Button size="sm" variant="outline" onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={currentPage<=1} aria-label="Previous page">
                <ChevronLeft className="h-4 w-4" /> Prev
              </Button>
              <div className="text-sm text-muted-foreground">Page {currentPage} of {pageCount}</div>
              <Button size="sm" variant="outline" onClick={()=>setPage(p=>Math.min(pageCount,p+1))} disabled={currentPage>=pageCount} aria-label="Next page">
                Next <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
