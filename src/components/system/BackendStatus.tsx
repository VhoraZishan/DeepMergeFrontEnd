import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fetchJson } from "@/lib/utils";

export function BackendStatus() {
  const [health, setHealth] = useState<null | boolean>(null);
  const [examples, setExamples] = useState<null | number>(null);
  const [ws, setWs] = useState<null | number>(null);
  const [busy, setBusy] = useState(false);

  const checkHealth = async () => {
    setBusy(true);
    try {
      const res = await fetchJson<{ status: string }>("/healthz");
      setHealth(res.status === "ok");
    } catch {
      setHealth(false);
    } finally {
      setBusy(false);
    }
  };

  const checkExamples = async () => {
    setBusy(true);
    try {
      const res = await fetchJson<{ examples: string[] }>("/api/v1/ai/examples");
      setExamples(Array.isArray(res.examples) ? res.examples.length : 0);
    } catch {
      setExamples(0);
    } finally {
      setBusy(false);
    }
  };

  const checkWs = async () => {
    setBusy(true);
    try {
      const res = await fetchJson<{ active_connections: number }>("/ws/status");
      setWs(typeof res.active_connections === "number" ? res.active_connections : 0);
    } catch {
      setWs(0);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 mb-3">
      <Badge variant={health == null ? "outline" : health ? "default" : "destructive"}>
        Health: {health == null ? "?" : health ? "ok" : "fail"}
      </Badge>
      <Badge variant="outline">AI examples: {examples == null ? "?" : examples}</Badge>
      <Badge variant="outline">WS connections: {ws == null ? "?" : ws}</Badge>
      <Button size="sm" variant="outline" onClick={checkHealth} disabled={busy}>Ping</Button>
      <Button size="sm" variant="outline" onClick={checkExamples} disabled={busy}>Examples</Button>
      <Button size="sm" variant="outline" onClick={checkWs} disabled={busy}>WS Status</Button>
    </div>
  );
}


