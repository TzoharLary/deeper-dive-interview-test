import fs from 'fs';
import path from 'path';

export interface SupervisorOptions {
  actionName?: string;
  heartbeatIntervalMs?: number; // how often action should heartbeat
  maxNoHeartbeatMs?: number; // allowed silence before abort
  overallTimeoutMs?: number; // hard timeout for whole action
  sessionLogPath?: string; // file to append logs to
}

const DEFAULTS: Required<Pick<SupervisorOptions, 'heartbeatIntervalMs'|'maxNoHeartbeatMs'|'overallTimeoutMs'|'sessionLogPath'>> = {
  heartbeatIntervalMs: 5000,
  maxNoHeartbeatMs: 60000,
  overallTimeoutMs: 5 * 60 * 1000,
  sessionLogPath: path.resolve(process.cwd(), 'scratch', 'BASE44_SESSION.md'),
};

function ensureSessionLog(file: string) {
  const dir = path.dirname(file);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(file)) fs.writeFileSync(file, '# Base44 Automation Session\n\n');
}

function appendSessionLog(file: string, message: string) {
  try {
    ensureSessionLog(file);
    const ts = new Date().toISOString();
    fs.appendFileSync(file, `- [${ts}] ${message}\n`);
  } catch (err) {
    // best-effort logging only
    // eslint-disable-next-line no-console
    console.error('Failed to append session log', err);
  }
}

export async function runWithSupervisor<T>(
  action: (ctx: { signal: AbortSignal; heartbeat: () => void; logger: (msg: string) => void }) => Promise<T>,
  opts?: SupervisorOptions,
): Promise<T> {
  const options: Required<SupervisorOptions> = Object.assign({}, DEFAULTS, opts || {}) as any;
  const logPath = options.sessionLogPath;
  ensureSessionLog(logPath);

  appendSessionLog(logPath, `START action="${options.actionName || 'unnamed'}" maxNoHeartbeatMs=${options.maxNoHeartbeatMs} overallTimeoutMs=${options.overallTimeoutMs}`);

  const ac = new AbortController();
  let lastHeartbeat = Date.now();
  const heartbeat = () => { lastHeartbeat = Date.now(); };

  const logger = (m: string) => appendSessionLog(logPath, `[action:${options.actionName || 'unnamed'}] ${m}`);

  let watchdog: NodeJS.Timeout | null = null;
  let overallTimer: NodeJS.Timeout | null = null;

  const startWatchdog = () => {
    watchdog = setInterval(() => {
      const since = Date.now() - lastHeartbeat;
      if (since > options.maxNoHeartbeatMs) {
        const msg = `WATCHDOG aborting action (no heartbeat for ${since}ms > ${options.maxNoHeartbeatMs})`;
        appendSessionLog(logPath, msg);
        logger(msg);
        try { ac.abort(); } catch (e) { /* ignore */ }
      }
    }, Math.max(1000, Math.floor(options.heartbeatIntervalMs / 2)));
  };

  const stopWatchdog = () => {
    if (watchdog) { clearInterval(watchdog); watchdog = null; }
    if (overallTimer) { clearTimeout(overallTimer); overallTimer = null; }
  };

  // overall hard timeout
  overallTimer = setTimeout(() => {
    const msg = `HARDTIMEOUT reached (${options.overallTimeoutMs}ms). aborting.`;
    appendSessionLog(logPath, msg);
    logger(msg);
    try { ac.abort(); } catch (e) { /* ignore */ }
  }, options.overallTimeoutMs);

  startWatchdog();

  try {
    const result = await action({ signal: ac.signal, heartbeat, logger });
    appendSessionLog(logPath, `COMPLETE action="${options.actionName || 'unnamed'}"`);
    return result;
  } catch (err: any) {
    appendSessionLog(logPath, `ERROR action="${options.actionName || 'unnamed'}" error=${String(err && err.message ? err.message : err)}`);
    throw err;
  } finally {
    stopWatchdog();
  }
}

export default { runWithSupervisor };
