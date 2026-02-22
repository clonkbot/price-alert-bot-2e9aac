import React, { useState, useEffect } from 'react';

interface Alert {
  id: string;
  symbol: string;
  targetPrice: number;
  currentPrice: number;
  condition: 'above' | 'below';
  isTriggered: boolean;
  createdAt: Date;
}

const MOCK_PRICES: Record<string, number> = {
  BTC: 67234.50,
  ETH: 3456.78,
  SOL: 178.92,
  DOGE: 0.1234,
  XRP: 0.5678,
  ADA: 0.4521,
  DOT: 7.89,
  LINK: 14.56,
};

function App() {
  const [alerts, setAlerts] = useState<Alert[]>([
    { id: '1', symbol: 'BTC', targetPrice: 70000, currentPrice: 67234.50, condition: 'above', isTriggered: false, createdAt: new Date() },
    { id: '2', symbol: 'ETH', targetPrice: 3200, currentPrice: 3456.78, condition: 'below', isTriggered: true, createdAt: new Date() },
    { id: '3', symbol: 'SOL', targetPrice: 200, currentPrice: 178.92, condition: 'above', isTriggered: false, createdAt: new Date() },
  ]);

  const [newSymbol, setNewSymbol] = useState('BTC');
  const [newPrice, setNewPrice] = useState('');
  const [newCondition, setNewCondition] = useState<'above' | 'below'>('above');
  const [time, setTime] = useState(new Date());
  const [glitchText, setGlitchText] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const glitchTimer = setInterval(() => {
      setGlitchText(true);
      setTimeout(() => setGlitchText(false), 150);
    }, 4000);
    return () => clearInterval(glitchTimer);
  }, []);

  const addAlert = () => {
    if (!newPrice) return;
    const alert: Alert = {
      id: Date.now().toString(),
      symbol: newSymbol,
      targetPrice: parseFloat(newPrice),
      currentPrice: MOCK_PRICES[newSymbol] || 0,
      condition: newCondition,
      isTriggered: false,
      createdAt: new Date(),
    };
    setAlerts([alert, ...alerts]);
    setNewPrice('');
  };

  const removeAlert = (id: string) => {
    setAlerts(alerts.filter(a => a.id !== id));
  };

  const activeAlerts = alerts.filter(a => !a.isTriggered).length;

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono relative overflow-hidden">
      {/* Scanline effect */}
      <div className="pointer-events-none fixed inset-0 z-50">
        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.15),rgba(0,0,0,0.15)_1px,transparent_1px,transparent_2px)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-900/5 to-transparent animate-scan" />
      </div>

      {/* CRT vignette */}
      <div className="pointer-events-none fixed inset-0 z-40 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />

      {/* Noise overlay */}
      <div className="pointer-events-none fixed inset-0 z-30 opacity-[0.03] bg-noise" />

      <div className="relative z-10 p-4 md:p-8 max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-8 md:mb-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                <div className="absolute inset-0 w-3 h-3 bg-green-400 rounded-full animate-ping opacity-75" />
              </div>
              <h1 className={`text-2xl md:text-4xl font-bold tracking-tighter ${glitchText ? 'glitch' : ''}`}>
                PRICE_ALERT.BOT
              </h1>
            </div>
            <div className="text-green-600 text-sm md:text-base">
              <span className="opacity-50">[SYS]</span> {time.toLocaleTimeString()} UTC
            </div>
          </div>

          {/* ASCII banner */}
          <pre className="text-green-700 text-[6px] md:text-[8px] leading-tight hidden md:block mb-6 select-none">
{`
 ██████╗ ██████╗ ██╗ ██████╗███████╗     █████╗ ██╗     ███████╗██████╗ ████████╗
 ██╔══██╗██╔══██╗██║██╔════╝██╔════╝    ██╔══██╗██║     ██╔════╝██╔══██╗╚══██╔══╝
 ██████╔╝██████╔╝██║██║     █████╗      ███████║██║     █████╗  ██████╔╝   ██║
 ██╔═══╝ ██╔══██╗██║██║     ██╔══╝      ██╔══██║██║     ██╔══╝  ██╔══██╗   ██║
 ██║     ██║  ██║██║╚██████╗███████╗    ██║  ██║███████╗███████╗██║  ██║   ██║
 ╚═╝     ╚═╝  ╚═╝╚═╝ ╚═════╝╚══════╝    ╚═╝  ╚═╝╚══════╝╚══════╝╚═╝  ╚═╝   ╚═╝
`}
          </pre>

          {/* Stats bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 p-4 border border-green-900 bg-green-950/20">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-green-300">{alerts.length}</div>
              <div className="text-[10px] md:text-xs text-green-600 uppercase tracking-widest">Total Alerts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-yellow-400">{activeAlerts}</div>
              <div className="text-[10px] md:text-xs text-green-600 uppercase tracking-widest">Active</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-red-400">{alerts.filter(a => a.isTriggered).length}</div>
              <div className="text-[10px] md:text-xs text-green-600 uppercase tracking-widest">Triggered</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-green-400">8</div>
              <div className="text-[10px] md:text-xs text-green-600 uppercase tracking-widest">Tokens</div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* New Alert Panel */}
          <div className="lg:col-span-1">
            <div className="border border-green-800 bg-black/80 p-4 md:p-6">
              <div className="flex items-center gap-2 mb-6">
                <span className="text-green-600">&gt;</span>
                <h2 className="text-lg font-bold tracking-wide">NEW_ALERT</h2>
                <div className="flex-1 h-px bg-green-900" />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-green-600 text-xs mb-2 uppercase tracking-widest">Token</label>
                  <select
                    value={newSymbol}
                    onChange={(e) => setNewSymbol(e.target.value)}
                    className="w-full bg-black border border-green-800 text-green-400 p-3 focus:outline-none focus:border-green-400 transition-colors"
                  >
                    {Object.keys(MOCK_PRICES).map(symbol => (
                      <option key={symbol} value={symbol}>{symbol}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-green-600 text-xs mb-2 uppercase tracking-widest">Current Price</label>
                  <div className="text-xl font-bold text-green-300">
                    ${MOCK_PRICES[newSymbol]?.toLocaleString()}
                  </div>
                </div>

                <div>
                  <label className="block text-green-600 text-xs mb-2 uppercase tracking-widest">Condition</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setNewCondition('above')}
                      className={`p-3 border transition-all ${
                        newCondition === 'above'
                          ? 'border-green-400 bg-green-400/10 text-green-300'
                          : 'border-green-900 text-green-700 hover:border-green-700'
                      }`}
                    >
                      ABOVE
                    </button>
                    <button
                      onClick={() => setNewCondition('below')}
                      className={`p-3 border transition-all ${
                        newCondition === 'below'
                          ? 'border-red-400 bg-red-400/10 text-red-300'
                          : 'border-green-900 text-green-700 hover:border-green-700'
                      }`}
                    >
                      BELOW
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-green-600 text-xs mb-2 uppercase tracking-widest">Target Price</label>
                  <input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    placeholder="0.00"
                    inputMode="decimal"
                    className="w-full bg-black border border-green-800 text-green-400 p-3 focus:outline-none focus:border-green-400 transition-colors placeholder:text-green-900"
                  />
                </div>

                <button
                  onClick={addAlert}
                  disabled={!newPrice}
                  className="w-full py-4 bg-green-400 text-black font-bold uppercase tracking-widest hover:bg-green-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                >
                  <span className="relative z-10">[+] Create Alert</span>
                  <div className="absolute inset-0 bg-green-300 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300" />
                </button>
              </div>

              {/* Radar animation */}
              <div className="mt-8 flex justify-center">
                <div className="relative w-32 h-32 md:w-40 md:h-40">
                  <div className="absolute inset-0 border border-green-900 rounded-full" />
                  <div className="absolute inset-4 border border-green-900 rounded-full" />
                  <div className="absolute inset-8 border border-green-900 rounded-full" />
                  <div className="absolute inset-0 origin-center animate-radar">
                    <div className="absolute top-1/2 left-1/2 w-1/2 h-0.5 bg-gradient-to-r from-green-400/80 to-transparent origin-left" />
                  </div>
                  {activeAlerts > 0 && (
                    <>
                      <div className="absolute top-4 right-8 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <div className="absolute bottom-6 left-6 w-2 h-2 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Alerts List */}
          <div className="lg:col-span-2">
            <div className="border border-green-800 bg-black/80 p-4 md:p-6 min-h-[500px]">
              <div className="flex items-center gap-2 mb-6">
                <span className="text-green-600">&gt;</span>
                <h2 className="text-lg font-bold tracking-wide">ACTIVE_ALERTS</h2>
                <div className="flex-1 h-px bg-green-900" />
                <span className="text-green-700 text-sm">[{alerts.length}]</span>
              </div>

              {alerts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-green-700">
                  <pre className="text-center mb-4">
{`
   ___
  |   |
  | _ |
  |___|
`}
                  </pre>
                  <p>No alerts configured</p>
                  <p className="text-sm opacity-50">Create your first alert to start monitoring</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {alerts.map((alert, index) => (
                    <div
                      key={alert.id}
                      className={`border p-4 transition-all duration-300 ${
                        alert.isTriggered
                          ? 'border-red-800 bg-red-950/20'
                          : 'border-green-900 hover:border-green-700 bg-green-950/10'
                      }`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="flex items-center gap-4">
                          <div className={`relative ${alert.isTriggered ? '' : 'animate-pulse'}`}>
                            <div className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center border ${
                              alert.isTriggered ? 'border-red-700 text-red-400' : 'border-green-700 text-green-400'
                            }`}>
                              <span className="font-bold text-sm">{alert.symbol}</span>
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className={`text-xs px-2 py-0.5 ${
                                alert.condition === 'above'
                                  ? 'bg-green-900/50 text-green-400'
                                  : 'bg-red-900/50 text-red-400'
                              }`}>
                                {alert.condition.toUpperCase()}
                              </span>
                              <span className="text-lg font-bold text-white">
                                ${alert.targetPrice.toLocaleString()}
                              </span>
                            </div>
                            <div className="text-sm text-green-600">
                              Current: ${alert.currentPrice.toLocaleString()}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {alert.isTriggered ? (
                            <span className="text-red-400 text-sm font-bold animate-pulse flex items-center gap-1">
                              <span className="w-2 h-2 bg-red-400 rounded-full" />
                              TRIGGERED
                            </span>
                          ) : (
                            <span className="text-green-600 text-sm flex items-center gap-1">
                              <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
                              MONITORING
                            </span>
                          )}
                          <button
                            onClick={() => removeAlert(alert.id)}
                            className="w-10 h-10 flex items-center justify-center border border-green-900 text-green-700 hover:border-red-700 hover:text-red-400 hover:bg-red-950/30 transition-all"
                          >
                            X
                          </button>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="mt-3 h-1 bg-green-950">
                        <div
                          className={`h-full transition-all duration-1000 ${
                            alert.isTriggered ? 'bg-red-500' : 'bg-green-500'
                          }`}
                          style={{
                            width: `${Math.min(100, Math.abs((alert.currentPrice / alert.targetPrice) * 100))}%`
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Terminal log */}
              <div className="mt-8 border-t border-green-900 pt-4">
                <div className="text-green-700 text-xs space-y-1">
                  <p><span className="text-green-500">[{time.toLocaleTimeString()}]</span> System online. Monitoring {activeAlerts} alert(s)...</p>
                  <p><span className="text-green-500">[{time.toLocaleTimeString()}]</span> Price feed connected. Latency: 12ms</p>
                  <p className="animate-pulse"><span className="text-green-500">[{time.toLocaleTimeString()}]</span> Awaiting price updates..._</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 md:mt-16 pb-8 text-center">
          <div className="text-green-800 text-xs">
            Requested by @masked_masa · Built by @clonkbot
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
