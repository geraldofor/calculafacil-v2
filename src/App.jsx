import { useState, useEffect, createContext, useContext } from "react";
import { createClient } from "@supabase/supabase-js";

// ============================================================
// SUPABASE
// ============================================================
const SUPABASE_URL = "https://pudujexcbvyakjkwuvqk.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1ZHVqZXhjYnZ5YWtqa3d1dnFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5ODA0OTQsImV4cCI6MjA4MzU1NjQ5NH0.avgmyWtX0CmkqAUzkdy0bslc1q-ZzC4ZPpxsjwG48aQ";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============================================================
// CONTEXTO GLOBAL
// ============================================================
const AppContext = createContext();

const useApp = () => useContext(AppContext);

// EMAIL DO DONO — acesso full admin
const ADMIN_EMAIL = "geraldofor@gmail.com";

const MOCK_USERS = [
  { id: 1, name: "Geraldo", email: "geraldofor@gmail.com", role: "admin", plan: "admin", status: "active", trialDays: null, company: null, createdAt: "2025-01-01" },
  { id: 2, name: "Ana Silva", email: "ana@agencia.com", role: "user", plan: "individual", status: "active", trialDays: 0, company: null, createdAt: "2025-03-01", paidUntil: "2025-04-01" },
  { id: 3, name: "Carlos Souza", email: "carlos@viagens.com", role: "user", plan: "trial", status: "trial", trialDays: 3, company: null, createdAt: "2025-03-17" },
  { id: 4, name: "TravelPro LTDA", email: "admin@travelpro.com", role: "company_admin", plan: "empresarial", status: "active", trialDays: 0, company: "TravelPro LTDA", seats: 5, createdAt: "2025-02-01", paidUntil: "2025-04-01" },
];

const MOCK_PAYMENTS = [
  { id: 1, user: "Ana Silva", email: "ana@agencia.com", plan: "Individual", valor: 49.99, status: "pago", data: "2025-03-01", metodo: "PIX" },
  { id: 2, user: "TravelPro LTDA", email: "admin@travelpro.com", plan: "Empresarial 5x", valor: 249.95, status: "pago", data: "2025-03-01", metodo: "Cartão" },
  { id: 3, user: "Pedro Matos", email: "pedro@abc.com", plan: "Individual", valor: 49.99, status: "pendente", data: "2025-03-18", metodo: "PIX" },
  { id: 4, user: "Maria Costa", email: "maria@xyz.com", plan: "Individual", valor: 49.99, status: "cancelado", data: "2025-02-15", metodo: "Cartão" },
];

// Aeroportos
const AIRPORTS = {
  // Brasil
  GRU: "São Paulo (Guarulhos)", CGH: "São Paulo (Congonhas)", VCP: "Campinas (Viracopos)",
  GIG: "Rio de Janeiro (Galeão)", SDU: "Rio de Janeiro (Santos Dumont)",
  BSB: "Brasília", SSA: "Salvador", FOR: "Fortaleza", REC: "Recife",
  MAO: "Manaus", POA: "Porto Alegre", CWB: "Curitiba", BEL: "Belém",
  NAT: "Natal", MCZ: "Maceió", AJU: "Aracaju", THE: "Teresina",
  SLZ: "São Luís", JPA: "João Pessoa", PMW: "Palmas", PVH: "Porto Velho",
  RBR: "Rio Branco", MCP: "Macapá", BOA: "Boa Vista", CGB: "Cuiabá",
  CGR: "Campo Grande", FLN: "Florianópolis", IGU: "Foz do Iguaçu",
  GYN: "Goiânia", UDI: "Uberlândia", CNF: "Confins (BH)",
  PLU: "Pampulha (BH)", VIX: "Vitória", BPS: "Porto Seguro",
  IOS: "Ilhéus", JDO: "Juazeiro do Norte", IMP: "Imperatriz",
  MNX: "Manicoré", STM: "Santarém", OPS: "Sinop",
  // EUA
  MIA: "Miami", JFK: "New York (JFK)", EWR: "New York (Newark)",
  LAX: "Los Angeles", ORD: "Chicago (O'Hare)", MDW: "Chicago (Midway)",
  ATL: "Atlanta", DFW: "Dallas", IAH: "Houston", SFO: "San Francisco",
  BOS: "Boston", LGA: "New York (LaGuardia)", DCA: "Washington (Reagan)",
  IAD: "Washington (Dulles)", MCO: "Orlando", FLL: "Fort Lauderdale",
  TPA: "Tampa", PHX: "Phoenix", SEA: "Seattle", DEN: "Denver",
  LAS: "Las Vegas", MSP: "Minneapolis", DTW: "Detroit", CLT: "Charlotte",
  PHL: "Philadelphia", BWI: "Baltimore", SAN: "San Diego", PDX: "Portland",
  SLC: "Salt Lake City", HNL: "Honolulu",
  // Canadá
  YYZ: "Toronto", YUL: "Montreal", YVR: "Vancouver", YYC: "Calgary",
  YEG: "Edmonton", YOW: "Ottawa", YHZ: "Halifax",
  // Europa
  LHR: "Londres (Heathrow)", LGW: "Londres (Gatwick)", STN: "Londres (Stansted)",
  CDG: "Paris (Charles de Gaulle)", ORY: "Paris (Orly)",
  FRA: "Frankfurt", MUC: "Munique", DUS: "Düsseldorf", HAM: "Hamburgo",
  MAD: "Madrid", BCN: "Barcelona", PMI: "Palma de Mallorca",
  LIS: "Lisboa", OPO: "Porto",
  AMS: "Amsterdam", BRU: "Bruxelas", ZRH: "Zurique", GVA: "Genebra",
  VIE: "Viena", PRG: "Praga", WAW: "Varsóvia", BUD: "Budapeste",
  FCO: "Roma (Fiumicino)", MXP: "Milão (Malpensa)", VCE: "Veneza",
  ATH: "Atenas", IST: "Istambul", SAW: "Istambul (Sabiha)",
  HEL: "Helsinque", ARN: "Estocolmo", CPH: "Copenhague", OSL: "Oslo",
  DUB: "Dublin", EDI: "Edimburgo", MAN: "Manchester",
  // América Latina
  EZE: "Buenos Aires (Ezeiza)", AEP: "Buenos Aires (Aeroparque)",
  SCL: "Santiago", LIM: "Lima", BOG: "Bogotá", MDE: "Medellín",
  GYE: "Guayaquil", UIO: "Quito", MVD: "Montevidéu", ASU: "Assunção",
  GRU2: "São Paulo", PTY: "Cidade do Panamá", MEX: "Cidade do México",
  CUN: "Cancún", GDL: "Guadalajara", MTY: "Monterrey",
  HAV: "Havana", SDQ: "Santo Domingo", SJU: "San Juan",
  SJO: "San José (Costa Rica)", GUA: "Guatemala City",
  // Caribe
  PUJ: "Punta Cana", MBJ: "Montego Bay", NAS: "Nassau", AUA: "Aruba",
  CUR: "Curaçao", BGI: "Barbados", UVF: "Santa Lúcia",
  // Oriente Médio e África
  DXB: "Dubai", AUH: "Abu Dhabi", DOH: "Doha", RUH: "Riad",
  JED: "Jeddah", KWI: "Kuwait", BAH: "Bahrein", AMM: "Amã",
  BEY: "Beirute", TLV: "Tel Aviv", CAI: "Cairo",
  JNB: "Joanesburgo", CPT: "Cidade do Cabo", NBO: "Nairóbi",
  ADD: "Adis Abeba", LOS: "Lagos", ACC: "Acra", CMN: "Casablanca",
  // Ásia e Oceania
  NRT: "Tokyo (Narita)", HND: "Tokyo (Haneda)", KIX: "Osaka",
  PEK: "Pequim", PVG: "Xangai", HKG: "Hong Kong",
  SIN: "Singapura", BKK: "Bangkok", KUL: "Kuala Lumpur",
  CGK: "Jacarta", MNL: "Manila", ICN: "Seul", TPE: "Taipei",
  DEL: "Nova Delhi", BOM: "Mumbai", MAA: "Chennai", BLR: "Bangalore",
  SYD: "Sydney", MEL: "Melbourne", BNE: "Brisbane", PER: "Perth",
  AKL: "Auckland",
};

const AIRLINES = {
  LA: "LATAM", G3: "Gol", AD: "Azul", CM: "Copa Airlines", AC: "Air Canada",
  AA: "American Airlines", UA: "United Airlines", DL: "Delta Air Lines",
  BA: "British Airways", IB: "Iberia", TP: "TAP Portugal", AF: "Air France",
  KL: "KLM", LH: "Lufthansa", OS: "Austrian", LX: "Swiss",
  EK: "Emirates", QR: "Qatar Airways", TK: "Turkish Airlines", EY: "Etihad",
  NH: "ANA", JL: "Japan Airlines", SQ: "Singapore Airlines",
};

// ============================================================
// UTILITÁRIOS DE CÁLCULO
// ============================================================
function parseAmadeusFare(text) {
  const result = { baseFareUSD: 0, taxesBRL: 0, exchangeRate: 0, fareFamily: "", airline: "", baggage: "" };
  const lines = text.split("\n").map(l => l.trim());

  for (const line of lines) {
    // Exchange rate
    const rateMatch = line.match(/RATE\s+USED\s+1USD[=:](\d+[\.,]\d+)BRL/i);
    if (rateMatch) result.exchangeRate = parseFloat(rateMatch[1].replace(",", "."));

    // Base fare
    const baseMatch = line.match(/BASE\s+FARE\s+USD\s+([\d,\.]+)/i);
    if (baseMatch) result.baseFareUSD = parseFloat(baseMatch[1].replace(/,/g, ""));

    // Taxes
    const taxMatch = line.match(/TAXES?\s+BRL\s+([\d,\.]+)/i);
    if (taxMatch) result.taxesBRL = parseFloat(taxMatch[1].replace(/,/g, ""));

    // Fare family
    const familyMatch = line.match(/FARE\s+FAMILY\s*[:=]\s*\w+[-:]\d+[-:]\d+[:=](\w+)/i);
    if (familyMatch) result.fareFamily = familyMatch[1];

    // Baggage from fare family or description
    if (line.includes("EXECFLEX") || line.includes("BUSINESS")) result.fareFamily = result.fareFamily || line.match(/\b(EXECFLEX|BUSINESS|ECONOMY|FLEX|LIGHT)\b/i)?.[1];
    
    // Airline from flight lines
    const airlineMatch = line.match(/^\s*\d+\s+([A-Z]{2})\s*\d+/);
    if (airlineMatch && AIRLINES[airlineMatch[1]]) result.airline = AIRLINES[airlineMatch[1]];
  }

  return result;
}

function calcTarifa({ baseFareUSD, taxesBRL, exchangeRate, ravPct, feeBRL, markup = false }) {
  const tarifaBRL = baseFareUSD * exchangeRate;
  const totalParcial = tarifaBRL + taxesBRL;
  const ravVal = totalParcial * (ravPct / 100);
  const totalFinal = totalParcial + ravVal + feeBRL;
  const totalMarkup = markup ? totalParcial + feeBRL : null;
  return { tarifaBRL, totalParcial, ravVal, totalFinal, totalMarkup };
}

// ============================================================
// COMPONENTES UI BASE
// ============================================================
const Badge = ({ children, color = "blue" }) => {
  const colors = {
    blue: "bg-blue-100 text-blue-800", green: "bg-green-100 text-green-800",
    yellow: "bg-yellow-100 text-yellow-800", red: "bg-red-100 text-red-800",
    gray: "bg-gray-100 text-gray-600", purple: "bg-purple-100 text-purple-800",
  };
  return <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${colors[color]}`}>{children}</span>;
};

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 ${className}`}>{children}</div>
);

const Input = ({ label, ...props }) => (
  <div className="flex flex-col gap-1">
    {label && <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</label>}
    <input {...props} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
  </div>
);

const Textarea = ({ label, ...props }) => (
  <div className="flex flex-col gap-1">
    {label && <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</label>}
    <textarea {...props} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-mono resize-none" />
  </div>
);

const Button = ({ children, variant = "primary", onClick, className = "", disabled = false }) => {
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-gray-100 hover:bg-gray-200 text-gray-800",
    danger: "bg-red-500 hover:bg-red-600 text-white",
    success: "bg-green-600 hover:bg-green-700 text-white",
    ghost: "hover:bg-gray-100 text-gray-700",
  };
  return (
    <button onClick={onClick} disabled={disabled}
      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${variants[variant]} ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${className}`}>
      {children}
    </button>
  );
};

const Terminal = ({ children }) => (
  <div className="bg-gray-950 rounded-xl p-4 font-mono text-sm text-green-400 whitespace-pre-wrap min-h-[100px] overflow-x-auto">
    {children}
  </div>
);

const Tab = ({ tabs, active, onChange }) => (
  <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
    {tabs.map(t => (
      <button key={t} onClick={() => onChange(t)}
        className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${active === t ? "bg-white shadow text-blue-700" : "text-gray-500 hover:text-gray-800"}`}>
        {t}
      </button>
    ))}
  </div>
);

// ============================================================
// LANDING PAGE
// ============================================================
function LandingPage({ onLogin, onRegister }) {
  const zapLink = "https://wa.me/5585812059005";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-5 border-b border-white/10">
        <div>
          <div className="text-xl font-black tracking-tight text-white">⚡ Calcula Fácil</div>
          <div className="text-xs text-blue-300">Sistema Facilitador de Processos</div>
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={onLogin} className="text-white hover:bg-white/10">Entrar</Button>
          <button onClick={onRegister} className="px-4 py-2 bg-blue-500 hover:bg-blue-400 rounded-lg text-sm font-bold transition-all">
            Começar Grátis →
          </button>
        </div>
      </header>

      {/* Hero */}
      <div className="text-center py-24 px-6">
        <div className="inline-block px-3 py-1 bg-blue-500/20 border border-blue-400/30 rounded-full text-blue-300 text-xs font-semibold mb-6">
          🚀 Exclusivo para Consolidadoras e Agências
        </div>
        <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
          Calcule tarifas GDS<br/>
          <span className="text-blue-400">sem erros, sem perdas.</span>
        </h1>
        <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-10">
          RAV, FEE, reemissões e decodificação de itinerários — tudo automatizado para Amadeus, Galileo e Sabre.
          Economize tempo e elimine erros que custam dinheiro.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <button onClick={onRegister} className="px-8 py-4 bg-blue-500 hover:bg-blue-400 rounded-xl font-bold text-lg transition-all shadow-lg shadow-blue-500/30">
            ✨ 5 dias grátis — sem cartão
          </button>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-5xl mx-auto px-6 pb-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: "🧮", title: "Cálculo de Tarifas", desc: "Amadeus, Galileo e Sabre. RAV e FEE calculados automaticamente com precisão." },
          { icon: "✈️", title: "Conversor de Itinerários", desc: "Cole o código GDS e receba o itinerário formatado para WhatsApp em segundos." },
          { icon: "🔄", title: "Cálculo de Reemissão", desc: "Compare valores ET* e calcule reemissões com validação automática." },
        ].map(f => (
          <div key={f.title} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
            <div className="text-3xl mb-3">{f.icon}</div>
            <h3 className="font-bold text-lg mb-2">{f.title}</h3>
            <p className="text-slate-400 text-sm">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Pricing */}
      <div className="max-w-4xl mx-auto px-6 pb-16">
        <h2 className="text-3xl font-black text-center mb-12">Planos simples e diretos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <div className="text-blue-300 font-bold text-sm mb-2">INDIVIDUAL</div>
            <div className="text-4xl font-black mb-1">R$ 49,99<span className="text-lg font-normal text-slate-400">/mês</span></div>
            <div className="text-green-400 text-sm font-semibold mb-6">✓ 5 dias grátis para testar</div>
            {["Todos os GDS (Amadeus, Galileo, Sabre)", "Cálculos ilimitados", "Histórico completo", "Suporte via WhatsApp"].map(i => (
              <div key={i} className="flex items-center gap-2 text-sm text-slate-300 mb-2"><span className="text-green-400">✓</span>{i}</div>
            ))}
            <button onClick={onRegister} className="w-full mt-6 py-3 bg-blue-500 hover:bg-blue-400 rounded-xl font-bold transition-all">Começar grátis</button>
          </div>
          <div className="bg-blue-600/20 border border-blue-400/40 rounded-2xl p-8">
            <div className="text-blue-300 font-bold text-sm mb-2">EMPRESARIAL</div>
            <div className="text-4xl font-black mb-1">R$ 49,99<span className="text-lg font-normal text-slate-400">/usuário/mês</span></div>
            <div className="text-green-400 text-sm font-semibold mb-6">✓ 5 dias grátis para testar</div>
            {["Múltiplos usuários", "Painel de gestão de equipe", "Controle de acessos", "Suporte prioritário", "Faturamento unificado"].map(i => (
              <div key={i} className="flex items-center gap-2 text-sm text-slate-300 mb-2"><span className="text-green-400">✓</span>{i}</div>
            ))}
            <button onClick={() => window.open(zapLink, "_blank")} className="w-full mt-6 py-3 bg-white text-blue-900 hover:bg-blue-100 rounded-xl font-bold transition-all">Falar com vendas</button>
          </div>
        </div>
      </div>

      {/* Contato / Suporte */}
      <div className="max-w-4xl mx-auto px-6 pb-24">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-black mb-3">💬 Fale Conosco</h2>
          <p className="text-slate-300 mb-6">Dúvidas, suporte ou informações sobre planos? Estamos no WhatsApp!</p>
          <a href={zapLink} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-green-500 hover:bg-green-400 rounded-xl font-bold text-lg transition-all shadow-lg shadow-green-500/30">
            <span>📲</span> Chamar no WhatsApp
          </a>
        </div>
      </div>

      {/* Botão WhatsApp flutuante */}
      <a href={zapLink} target="_blank" rel="noopener noreferrer"
        className="fixed bottom-6 right-6 w-14 h-14 bg-green-500 hover:bg-green-400 rounded-full flex items-center justify-center shadow-lg shadow-green-500/40 transition-all z-50 text-2xl">
        📲
      </a>
    </div>
  );
}

// ============================================================
// AUTH (LOGIN / REGISTRO)
// ============================================================
function AuthPage({ mode = "login", onAuth, onSwitch, onBack }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", company: "", seats: 1 });
  const [isCompany, setIsCompany] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      if (mode === "login") {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: form.email.trim(),
          password: form.password,
        });
        if (error) { setError("E-mail ou senha incorretos."); setLoading(false); return; }

        // Busca perfil do usuário
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user.id)
          .single();

        // Verifica trial
        let trialDaysLeft = 0;
        if (profile?.plan === "trial" && profile?.trial_start) {
          const diff = (new Date() - new Date(profile.trial_start)) / (1000 * 60 * 60 * 24);
          trialDaysLeft = Math.max(0, 5 - Math.floor(diff));
        }

        onAuth({
          id: data.user.id,
          name: profile?.full_name || form.email.split("@")[0],
          email: data.user.email,
          role: profile?.role || "user",
          plan: profile?.plan || "trial",
          trialDays: trialDaysLeft,
          company: profile?.company,
          seats: profile?.seats || 1,
          blocked: profile?.blocked || false,
        });
      } else {
        // Cadastro
        const { data, error } = await supabase.auth.signUp({
          email: form.email.trim(),
          password: form.password,
          options: {
            data: {
              full_name: form.name,
              company: isCompany ? form.company : null,
              seats: isCompany ? form.seats : 1,
            }
          }
        });
        if (error) { setError(error.message); setLoading(false); return; }

        onAuth({
          id: data.user?.id,
          name: form.name,
          email: form.email,
          role: form.email.trim().toLowerCase() === ADMIN_EMAIL ? "admin" : "user",
          plan: "trial",
          trialDays: 5,
          company: isCompany ? form.company : null,
          seats: isCompany ? form.seats : 1,
        });
      }
    } catch (e) {
      setError("Erro inesperado. Tente novamente.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
        <button onClick={onBack} className="text-sm text-gray-400 hover:text-gray-600 mb-6 flex items-center gap-1">← Voltar</button>
        <div className="text-center mb-8">
          <div className="text-2xl font-black text-gray-900">⚡ Calcula Fácil</div>
          <div className="text-gray-500 mt-1">{mode === "login" ? "Entre na sua conta" : "Crie sua conta grátis"}</div>
        </div>

        <div className="flex flex-col gap-4">
          {mode === "register" && (
            <>
              <Input label="Nome completo" placeholder="Seu nome" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              <div className="flex items-center gap-2">
                <input type="checkbox" id="company" checked={isCompany} onChange={e => setIsCompany(e.target.checked)} className="w-4 h-4" />
                <label htmlFor="company" className="text-sm text-gray-600">Cadastrar como empresa</label>
              </div>
              {isCompany && (
                <div className="flex gap-3">
                  <Input label="Nome da empresa" placeholder="Razão Social" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} />
                  <Input label="Nº de acessos" type="number" min="2" value={form.seats} onChange={e => setForm({ ...form, seats: parseInt(e.target.value) })} />
                </div>
              )}
            </>
          )}
          <Input label="E-mail" type="email" placeholder="seu@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          <Input label="Senha" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />

          {mode === "register" && isCompany && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-sm text-blue-700">
              💰 Total: <strong>R$ {(49.99 * form.seats).toFixed(2)}/mês</strong> ({form.seats} acesso{form.seats > 1 ? "s" : ""} × R$ 49,99)
              <br/><span className="text-green-600 font-semibold">✓ 5 dias grátis para testar</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600">
              ⚠️ {error}
            </div>
          )}

          <Button onClick={handleSubmit} disabled={loading} className="w-full justify-center py-3 text-base mt-2">
            {loading ? "Aguarde..." : mode === "login" ? "Entrar" : "Criar conta e começar grátis"}
          </Button>

          <p className="text-center text-sm text-gray-500">
            {mode === "login" ? "Não tem conta? " : "Já tem conta? "}
            <button onClick={onSwitch} className="text-blue-600 font-semibold hover:underline">
              {mode === "login" ? "Cadastre-se grátis" : "Entrar"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MÓDULO: CÁLCULO DE TARIFAS
// ============================================================
function ModuloTarifas() {
  const [gds, setGds] = useState("AMADEUS");
  const [cotacao, setCotacao] = useState("");
  const [voo, setVoo] = useState("");
  const [cabine, setCabine] = useState("");
  const [bagagem, setBagagem] = useState("");
  const [multaRem, setMultaRem] = useState("");
  const [multaReemb, setMultaReemb] = useState("");
  const [rav, setRav] = useState("7");
  const [fee, setFee] = useState("0");
  const [parcelas, setParcelas] = useState("10x sem juros");
  const [markup, setMarkup] = useState(false);
  const [markupPct, setMarkupPct] = useState("10");
  const [resultado, setResultado] = useState(null);
  const [copied, setCopied] = useState(false);

  // Parser robusto para os 3 GDS
  const parseCotacao = (text, gdsType) => {
    const raw = text.toUpperCase();
    let tUSD = 0, tBRL = 0, totalBRL = 0, exchangeRate = 0, fareFamily = "";

    if (gdsType === "AMADEUS") {
      // USD 1899.00 → tarifa base USD (primeira ocorrência de USD no início de linha)
      const usdM = raw.match(/^USD\s+([\d,\.]+)/m);
      tUSD = usdM ? parseFloat(usdM[1].replace(",", ".")) : 0;
      // Fallback: USD em qualquer posição
      if (!tUSD) {
        const usdAny = raw.match(/\bUSD\s+([\d,\.]+)/);
        tUSD = usdAny ? parseFloat(usdAny[1].replace(",", ".")) : 0;
      }
      // Fallback NUC
      if (!tUSD) {
        const nucM = raw.match(/NUC\s*([\d,\.]+)/i);
        tUSD = nucM ? parseFloat(nucM[1].replace(",", ".")) : 0;
      }

      // Todas as linhas BRL no início de linha
      // Formato: BRL  9958.35  AC YVR... (tarifa - tem conteúdo depois)
      //          BRL    90.52-BR ...      (taxa detalhada - tem sufixo -XX)
      //          BRL 10408.12             (total - linha sozinha)
      const allBrlLines = [...raw.matchAll(/^BRL\s+([\d,\.]+)(.*)/gm)];
      
      // Total = última linha BRL que está sozinha (sem sufixo)
      const totalLines = allBrlLines.filter(m => m[2].trim() === "");
      if (totalLines.length > 0) {
        totalBRL = parseFloat(totalLines[totalLines.length - 1][1].replace(",", "."));
      }

      // Tarifa BRL = primeira linha BRL que tem conteúdo depois MAS não começa com -
      // ex: BRL 9958.35  AC YVR1002.50AC...
      const tarifaLine = allBrlLines.find(m => m[2].trim() !== "" && !m[2].trim().startsWith("-"));
      if (tarifaLine) {
        tBRL = parseFloat(tarifaLine[1].replace(",", "."));
      }

      // Se não encontrou tarifa BRL separada, calcula: total - taxas
      // Taxas = soma das linhas BRL com sufixo -XX
      if (!tBRL && totalBRL > 0 && tUSD > 0) {
        const rateM2 = raw.match(/RATE\s+USED\s+1\s*USD\s*[=:]\s*([\d,\.]+)\s*BRL/i);
        const rate2 = rateM2 ? parseFloat(rateM2[1].replace(",", ".")) : 0;
        if (rate2 > 0) tBRL = tUSD * rate2;
      }

      // RATE USED 1USD=5.244BRL
      const rateM = raw.match(/RATE\s+USED\s+1\s*USD\s*[=:]\s*([\d,\.]+)\s*BRL/i);
      if (rateM) exchangeRate = parseFloat(rateM[1].replace(",", "."));
      // Câmbio fallback via tarifa
      if (!exchangeRate && tUSD > 0 && tBRL > 0) exchangeRate = tBRL / tUSD;

      // FARE FAMILY:FC1:1-3:STANDARD
      const famM = raw.match(/FARE\s+FAMILY\s*:\s*\w+\s*:\s*[\d\-]+\s*:\s*(\w+)/i);
      if (famM) fareFamily = famM[1];

    } else if (gdsType === "GALILEO") {
      // FQG linha: BRL tarifa taxas total
      const galM = raw.match(/FQG\s*\d+\s+BRL\s+([\d\.]+)\s+([\d\.]+)\s+([\d\.]+)/i);
      if (galM) { tBRL = parseFloat(galM[1]); totalBRL = parseFloat(galM[3]); }
      // BSR 1USD-5.28
      const bsrM = raw.match(/BSR\s*1USD\s*[-=]\s*([\d\.]+)/i);
      if (bsrM && tBRL > 0) { exchangeRate = parseFloat(bsrM[1]); tUSD = tBRL / exchangeRate; }

    } else if (gdsType === "SABRE") {
      // USD direto
      const usdM = raw.match(/USD\s*([\d\.]+)/i);
      tUSD = usdM ? parseFloat(usdM[1]) : 0;
      // BRL tarifa
      const brlM = raw.match(/BRL\s*([\d\.]+)/i);
      tBRL = brlM ? parseFloat(brlM[1]) : 0;
      // BRL total com ADT
      const totM = raw.match(/BRL\s*([\d\.]+)\s+ADT/i);
      totalBRL = totM ? parseFloat(totM[1]) : 0;
      if (!totalBRL) totalBRL = tBRL;
      if (tUSD > 0 && tBRL > 0) exchangeRate = tBRL / tUSD;
    }

    // Se totalBRL não detectado, usa tBRL
    if (!totalBRL && tBRL > 0) totalBRL = tBRL;
    // Taxas = total - tarifa BRL
    const taxesBRL = totalBRL > tBRL ? totalBRL - tBRL : 0;

    return { tUSD, tBRL, totalBRL, taxesBRL, exchangeRate, fareFamily };
  };

  const calcular = () => {
    const p = parseCotacao(cotacao, gds);
    if (!p.tUSD && !p.totalBRL) return;

    let tUSD = p.tUSD, tBRL = p.tBRL, totalBRL = p.totalBRL;
    let tUSDOriginal = tUSD, tBRLOriginal = tBRL, totalBRLOriginal = totalBRL;
    let comMarkup = false;

    if (markup && parseFloat(markupPct) > 0) {
      const mp = parseFloat(markupPct) / 100;
      tUSD = tUSD / (1 - mp);
      const rate = p.exchangeRate || (tBRLOriginal / tUSDOriginal) || 1;
      tBRL = tUSD * rate;
      const taxas = totalBRLOriginal - tBRLOriginal;
      totalBRL = tBRL + taxas;
      comMarkup = true;
    }

    const ravVal  = totalBRL * (parseFloat(rav) / 100);
    const feeVal  = parseFloat(fee) || 0;
    const totalFinal = totalBRL + ravVal + feeVal;

    setResultado({
      p, tUSD, tBRL, totalBRL, ravVal, feeVal, totalFinal,
      tUSDOriginal, tBRLOriginal, totalBRLOriginal, comMarkup
    });
  };

  const formatOutput = () => {
    if (!resultado) return "";
    const { p, tUSD, tBRL, totalBRL, ravVal, feeVal, totalFinal,
            tUSDOriginal, tBRLOriginal, comMarkup } = resultado;
    const cab  = cabine  || p.fareFamily || "-";
    const comp = voo     || "-";
    const bag  = bagagem || "-";
    const rate = p.exchangeRate ? `1 USD = R$ ${p.exchangeRate.toFixed(4)}` : "-";

    let out = `Cia/Voo: ${comp}\nCabine: ${cab}\nBagagem: ${bag}\n${"─".repeat(46)}\n`;

    if (comMarkup) {
      out += `Tarifa Base USD (original): USD ${tUSDOriginal.toFixed(2).padStart(10)}\n`;
      out += `Markup (${markupPct}%):              USD ${(tUSD - tUSDOriginal).toFixed(2).padStart(10)}\n`;
      out += `Tarifa USD (c/ markup):    USD ${tUSD.toFixed(2).padStart(10)}\n`;
      out += `Tarifa BRL (c/ markup):    BRL ${tBRL.toFixed(2).padStart(10)}\n`;
    } else {
      out += `Tarifa Base (USD):  USD ${tUSD.toFixed(2).padStart(12)}\n`;
      out += `Tarifa BRL:         BRL ${tBRL.toFixed(2).padStart(12)}\n`;
    }

    out += `Taxas:              BRL ${(totalBRL - tBRL).toFixed(2).padStart(12)}\n`;
    out += `Total Parcial:      BRL ${totalBRL.toFixed(2).padStart(12)}\n`;
    out += `RAV (${rav}%):          BRL ${ravVal.toFixed(2).padStart(12)}\n`;
    out += `FEE:                BRL ${feeVal.toFixed(2).padStart(12)}\n`;
    out += `${"─".repeat(46)}\n`;
    out += `TOTAL FINAL:        BRL ${totalFinal.toFixed(2).padStart(12)}\n`;
    out += `${"─".repeat(46)}\n`;
    out += `Pagamento: ${parcelas}\n\n`;
    out += `[ REGRAS E PENALIDADES ]\n`;
    out += `Reemissão: USD ${multaRem  || "N/A"}\n`;
    out += `Reembolso: USD ${multaReemb || "N/A"}\n\n`;
    out += `* Cotação: ${rate}`;

    return out;
  };

  const copiar = () => {
    navigator.clipboard.writeText(formatOutput());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const limpar = () => {
    setCotacao(""); setResultado(null); setVoo("");
    setCabine(""); setBagagem(""); setMultaRem(""); setMultaReemb("");
  };

  const p = cotacao ? parseCotacao(cotacao, gds) : null;
  const temDados = p && (p.tUSD > 0 || p.totalBRL > 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-gray-900">Cálculo de Tarifas</h2>
        <Tab tabs={["AMADEUS", "GALILEO", "SABRE"]} active={gds} onChange={setGds} />
      </div>

      <Card>
        <Textarea label="Cole a cotação GDS aqui" value={cotacao}
          onChange={e => setCotacao(e.target.value)} rows={7}
          placeholder={
            gds === "AMADEUS"
              ? "USD 1857.00  26MAY26FOR IB X/MAD...\nBRL  9804.96  14.00 297.00...\nBRL   105.76-BR  756.50NUC...\nBRL 10139.24\nRATE USED 1USD=5.28BRL\nFARE FAMILY:FC1:1-2:COMFORT"
              : gds === "GALILEO"
              ? "FQG 1 BRL 1234.56 334.28 1568.84\nBSR 1USD-5.28"
              : "USD 1234.56\nBRL 6521.67\nBRL 6856.84 ADT"
          } />
      </Card>

      {temDados && (
        <Card className="bg-blue-50 border-blue-200">
          <div className="text-xs font-bold text-blue-600 mb-2">✓ Dados detectados automaticamente</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div><span className="text-gray-500">Base USD:</span> <strong>$ {p.tUSD.toFixed(2)}</strong></div>
            <div><span className="text-gray-500">Total BRL:</span> <strong>R$ {p.totalBRL.toFixed(2)}</strong></div>
            <div><span className="text-gray-500">Taxas:</span> <strong>R$ {p.taxesBRL.toFixed(2)}</strong></div>
            <div><span className="text-gray-500">Câmbio:</span> <strong>{p.exchangeRate ? `R$ ${p.exchangeRate.toFixed(4)}` : "—"}</strong></div>
          </div>
          {p.fareFamily && <div className="text-xs text-blue-600 mt-2">Cabine detectada: <strong>{p.fareFamily}</strong></div>}
        </Card>
      )}

      <Card>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Input label="Voo / Cia" value={voo} onChange={e => setVoo(e.target.value)} placeholder="Ex: TAP, Iberia" />
          <Input label="Cabine" value={cabine} onChange={e => setCabine(e.target.value)} placeholder={p?.fareFamily || "Ex: COMFORT"} />
          <Input label="Bagagem" value={bagagem} onChange={e => setBagagem(e.target.value)} placeholder="Ex: 01PC de 23kg" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          <Input label="FEE (BRL)" type="number" value={fee} onChange={e => setFee(e.target.value)} />
          <Input label="RAV %" type="number" value={rav} onChange={e => setRav(e.target.value)} />
          <Input label="Parcelamento" value={parcelas} onChange={e => setParcelas(e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <Input label="Multa Reemissão (USD)" value={multaRem} onChange={e => setMultaRem(e.target.value)} placeholder="Antes / Depois" />
          <Input label="Multa Reembolso (USD)" value={multaReemb} onChange={e => setMultaReemb(e.target.value)} placeholder="Antes / Depois" />
        </div>

        <div className="border-t border-gray-100 mt-4 pt-4">
          <div className="flex items-center gap-2 mb-3">
            <input type="checkbox" id="markup" checked={markup} onChange={e => setMarkup(e.target.checked)} className="w-4 h-4" />
            <label htmlFor="markup" className="text-sm text-gray-600 cursor-pointer">Aplicar Markup (tarifas net-net sem parcelamento)</label>
          </div>
          {markup && (
            <div className="flex items-end gap-4">
              <div className="w-48">
                <Input label="Markup %" type="number" step="0.01" value={markupPct} onChange={e => setMarkupPct(e.target.value)} placeholder="Ex: 10" />
              </div>
              <div className="text-xs text-gray-400 pb-2">Ex: 10% = divide por 0.90</div>
            </div>
          )}
        </div>
      </Card>

      <div className="flex gap-3">
        <Button onClick={calcular} disabled={!temDados}>🧮 Gerar</Button>
        <Button variant="secondary" onClick={copiar} disabled={!resultado}>{copied ? "✓ Copiado!" : "📋 Copiar"}</Button>
        <Button variant="secondary" onClick={limpar}>🗑 Limpar</Button>
      </div>

      {!temDados && cotacao.length > 10 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-sm text-yellow-700">
          ⚠️ Não consegui detectar os dados. Verifique se a cotação contém <strong>USD</strong>, <strong>BRL total</strong> e <strong>RATE USED</strong>.
        </div>
      )}

      {resultado && <Terminal>{formatOutput()}</Terminal>}
    </div>
  );
}

// ============================================================
// MÓDULO: CONVERSOR DE ITINERÁRIOS
// ============================================================
function ModuloConversor() {
  const [gds, setGds] = useState("AMADEUS");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("Aguardando itinerário...");
  const [copied, setCopied] = useState(false);

  const decodificar = () => {
    if (!input.trim()) return;
    const lines = input.trim().split("\n");
    const voos = [];

    for (const line of lines) {
      // Aceita letra de classe COLADA (LA4631W) ou SEPARADA (LA4631 W)
      // e asterisco após aeroportos (FORCGH*HK1) ou espaço (FORCGH HK1)
      const match = line.match(
        /^\s*\d+\.?\s+([A-Z0-9]{2})\s*(\d{3,5})[A-Z]?\s+[A-Z]\s+(\d{1,2}[A-Z]{3})\s+[A-Z0-9]\s+([A-Z]{3})([A-Z]{3})\*?\s*\w+\s+(\d{3,4})\s+(\d{3,4})/
      );

      if (match) {
        const [, cia, num, data, orig, dest, dep4, arr4] = match;

        const origNome = AIRPORTS[orig] || orig;
        const destNome = AIRPORTS[dest] || dest;
        const ciaNome  = AIRLINES[cia]  || cia;

        const fmt = (t) => t.length === 3
          ? `0${t[0]}:${t.slice(1)}`
          : `${t.slice(0,2)}:${t.slice(2)}`;

        const ciaLabel  = ciaNome.padEnd(12);
        const numLabel  = num.padStart(4, "0");
        const origLabel = `${origNome} (${orig})`;
        const destLabel = `${destNome} (${dest})`;

        voos.push(
          `${ciaLabel} ${numLabel} ➔ ${data.toUpperCase()} ➔ ${origLabel.padEnd(30)} ${fmt(dep4)} ➔ ${destLabel.padEnd(30)} ${fmt(arr4)}`
        );
      }
    }

    if (voos.length > 0) {
      setOutput(
        `*ITINERÁRIO DE VOO*\n` +
        `${"─".repeat(90)}\n` +
        voos.join("\n") +
        `\n${"─".repeat(90)}\n` +
        `_Gerado pelo Calcula Fácil_`
      );
    } else {
      setOutput(
        `⚠️ Não foi possível decodificar. Verifique o formato GDS.\n\n` +
        `Exemplos aceitos:\n` +
        `Amadeus: 1 LA8150 Z 14MAY 3 FORLIS HK2  0840  2000  HRS /E\n` +
        `Amadeus: 1 LA4631W 08MAY F FORCGH*HK1 1755 2135 /E\n` +
        `Sabre:   1 LA8150Z 14MAY Q FORLIS HK2 0840 2000\n` +
        `Galileo: 1. LA8150 Z 14MAY3 FORLIS HK2 0840 2000`
      );
    }
  };

  const copiarZap = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-gray-900">Conversor de Itinerários</h2>
        <Tab tabs={["AMADEUS", "SABRE", "GALILEO"]} active={gds} onChange={setGds} />
      </div>

      <Card>
        <Textarea label="Cole as linhas de voo do GDS aqui" value={input} onChange={e => setInput(e.target.value)}
          rows={6} placeholder={
            gds === "AMADEUS"
              ? "Ex: 1 LA8150 Z 14MAY 3 FORLIS HK2  0840  2000  HRS /E"
              : gds === "SABRE"
              ? "Ex: 1 LA8150Z 14MAY Q FORLIS HK2 0840 2000 HRS /E"
              : "Ex: 1. LA8150 Z 14MAY3 FORLIS HK2 0840 2000"
          } />
      </Card>

      <div className="flex gap-3">
        <Button onClick={decodificar}>→ Decodificar</Button>
        <Button variant="secondary" onClick={copiarZap}>{copied ? "✓ Copiado!" : "📲 Copiar ZAP"}</Button>
      </div>

      <Terminal>{output}</Terminal>

      <Card className="bg-gray-50">
        <div className="text-xs font-bold text-gray-500 mb-3">DICIONÁRIO — AEROPORTOS PRINCIPAIS</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          {Object.entries(AIRPORTS).slice(0, 20).map(([code, name]) => (
            <div key={code} className="flex gap-1">
              <span className="font-mono font-bold text-blue-600">{code}</span>
              <span className="text-gray-600">{name}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ============================================================
// MÓDULO: REEMISSÃO
// ============================================================
function ModuloReemissao() {
  const [gds, setGds] = useState("AMADEUS");
  const [et, setEt] = useState("");
  const [result, setResult] = useState("Cole o resumo Amadeus (ET*) e clique em CALCULAR");
  const [copied, setCopied] = useState(false);

  const [form, setForm] = useState({
    cotacao: "5.5410", feeUSD: "25.00", ravPercent: "7.00", ravMinimo: "200",
    ticketOriginal: "", passageiro: "", passageiros: "",
    rota: "", roteiro: "", loc: "",
    dataEmissao: new Date().toISOString().split("T")[0],
    aplicarMarkup: false, markup: "10",
  });

  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const extractVal = (texto, pattern) => {
    const match = texto.match(pattern);
    if (!match || !match[1]) return 0;
    const parsed = parseFloat(match[1].trim().replace(/,/g, ""));
    return isNaN(parsed) ? 0 : parsed;
  };

  const formatVal = (val) => {
    if (Math.abs(val) < 0.01) return "0,00";
    return val.toFixed(2).replace(".", ",");
  };

  const formatDateBR = (d) => {
    if (!d) return "";
    const [y, m, dia] = d.split("-");
    return `${dia}/${m}/${y}`;
  };

  const calcular = () => {
    const texto = et.trim().toUpperCase();
    if (!texto) return;

    const cotacao    = parseFloat(form.cotacao.replace(",", "."));
    const feeUSD     = parseFloat(form.feeUSD.replace(",", "."));
    const ravPercent = parseFloat(form.ravPercent.replace(",", ".")) / 100;
    const ravMinimo  = parseFloat(form.ravMinimo.replace(",", "."));

    let oldBaseFareUSD      = extractVal(texto, /OLD\s+BASE\s+FARE\s+USD\s+([\-\d,.]+)/i);
    let newBaseFareUSD      = extractVal(texto, /NEW\s+BASE\s+FARE\s+USD\s+([\-\d,.]+)/i);
    let fareBalanceBRL      = extractVal(texto, /FARE\s+BALANCE\s+BRL\s+([\-\d,.]+)/i);
    const taxBalanceBRL     = extractVal(texto, /TAX\s+BALANCE\s+BRL\s+([\-\d,.]+)/i);
    const residualValueBRL  = extractVal(texto, /RESIDUAL\s+VALUE\s+BRL\s+([\-\d,.]+)/i);
    const penaltyBRL        = extractVal(texto, /PENALTY\s+BRL\s+([\-\d,.]+)/i);
    const ticketDiffBRL     = extractVal(texto, /TICKET\s+DIFFERENCE\s+BRL\s+([\-\d,.]+)/i);
    const totalAddColBRL    = extractVal(texto, /TOTAL\s+ADD\s+COLL\s+BRL\s+([\-\d,.]+)/i);
    const nonRefundableTax  = extractVal(texto, /NON\s+REFUNDABLE\s+TAX\s+BRL\s+([\-\d,.]+)/i);

    // MARKUP
    let oldOriginal = oldBaseFareUSD, newOriginal = newBaseFareUSD;
    let comMarkup = false;
    if (form.aplicarMarkup && parseFloat(form.markup) > 0) {
      const mp = parseFloat(form.markup) / 100;
      oldBaseFareUSD = oldBaseFareUSD / (1 - mp);
      newBaseFareUSD = newBaseFareUSD / (1 - mp);
      fareBalanceBRL = (newBaseFareUSD - oldBaseFareUSD) * cotacao;
      comMarkup = true;
    }

    // CÁLCULOS
    let baseCalcBRL = fareBalanceBRL;
    if (Math.abs(fareBalanceBRL) < 0.01 && ticketDiffBRL > 0) baseCalcBRL = ticketDiffBRL;

    let difTaxas = taxBalanceBRL;
    if (residualValueBRL < 0) difTaxas = taxBalanceBRL + Math.abs(residualValueBRL);

    let totalAddCollGDS = Math.abs(totalAddColBRL) > 0.01
      ? totalAddColBRL
      : ticketDiffBRL > 0 ? ticketDiffBRL + penaltyBRL + Math.abs(residualValueBRL) : taxBalanceBRL + penaltyBRL + Math.abs(residualValueBRL);

    const feeBRL = feeUSD * cotacao;
    let ravVal = 0;
    if (baseCalcBRL > 0) {
      ravVal = baseCalcBRL * ravPercent;
      if (ravVal < ravMinimo) ravVal = ravMinimo;
    }

    const totalPorPax = baseCalcBRL + difTaxas + penaltyBRL + feeBRL + ravVal;
    const totalAddCalc = baseCalcBRL + difTaxas + penaltyBRL;
    const diffValid = Math.abs(totalAddCalc - totalAddCollGDS);
    const pad = 12;

    let out = `       CÁLCULO DE REMARCAÇÃO - ADT\n`;
    out += `       Data: ${formatDateBR(form.dataEmissao)}\n`;
    out += `       Cotação USD: R$ ${cotacao.toFixed(4).replace(".", ",")}\n`;
    out += `       FEE: U$ ${feeUSD.toFixed(2).replace(".", ",")}\n`;

    if (comMarkup) {
      out += `       MARKUP: ${form.markup}% aplicado\n`;
      out += `       OLD FARE: USD ${oldOriginal.toFixed(2)} → USD ${oldBaseFareUSD.toFixed(2)}\n`;
      out += `       NEW FARE: USD ${newOriginal.toFixed(2)} → USD ${newBaseFareUSD.toFixed(2)}\n`;
    }
    out += `       ---------------------------------------\n\n`;

    if (form.passageiros.trim()) {
      const paxLines = form.passageiros.trim().split("\n");
      out += `PASSAGEIRO:  ${paxLines[0]}\n`;
      paxLines.slice(1).forEach(l => out += `             ${l}\n`);
      out += "\n";
    } else if (form.passageiro) {
      out += `PASSAGEIRO: ${form.passageiro}\n\n`;
    }

    if (form.roteiro.trim()) {
      const rotLines = form.roteiro.trim().split("\n");
      out += `ROTA:   ${rotLines[0]}\n`;
      rotLines.slice(1).forEach(l => out += `        ${l}\n`);
      out += "\n";
    } else if (form.rota) {
      out += `ROTA: ${form.rota}\n\n`;
    }

    if (form.loc)            out += `LOC.: ${form.loc}\n`;
    if (form.ticketOriginal) out += `TICKET ORIGINAL: ${form.ticketOriginal}\n`;

    out += `----------------------------------------\n\n`;
    out += `Diferença de tarifa (R$)     R$ ${formatVal(baseCalcBRL).padStart(pad)}\n`;
    out += `Diferença de taxas           R$ ${formatVal(difTaxas).padStart(pad)}\n`;
    out += `Multa                        R$ ${formatVal(penaltyBRL).padStart(pad)}\n`;
    out += `FEE                          R$ ${formatVal(feeBRL).padStart(pad)}\n`;
    if (ravVal > 0) out += `RAV - ${(ravPercent * 100).toFixed(0)}%                     R$ ${formatVal(ravVal).padStart(pad)}\n`;
    out += `----------------------------------------\n`;
    out += `TOTAL POR PAX                R$ ${formatVal(totalPorPax).padStart(pad)}\n`;
    out += `========================================\n`;
    out += `***VALORES POR PAX SUJEITOS A ALTERAÇÃO***\n\n`;

    out += `\nCONFERÊNCIA GDS:\n`;
    out += `TICKET DIFFERENCE            R$ ${formatVal(ticketDiffBRL).padStart(pad)}\n`;
    out += `PENALTY                      R$ ${formatVal(penaltyBRL).padStart(pad)}\n`;

    if (residualValueBRL < 0) {
      out += `RESIDUAL (abs)               R$ ${formatVal(Math.abs(residualValueBRL)).padStart(pad)}\n`;
      out += `----------------------------------------\n`;
      out += `TOTAL ADD COLL (GDS)         R$ ${formatVal(totalAddCollGDS).padStart(pad)}\n`;
      out += diffValid < 0.01 ? `✅ VALIDAÇÃO: BATE COM O GDS\n` : `⚠️  DIFERENÇA: R$ ${formatVal(diffValid)}\n`;
    }

    out += `========================================\n`;
    if (residualValueBRL < 0) out += `* Taxas incluem compensação de residual negativo\n`;
    if (nonRefundableTax > 0) out += `* Non Refundable Tax (R$ ${formatVal(nonRefundableTax)}) não entra no cálculo\n`;
    out += `Total Add Collect (GDS):     R$ ${formatVal(totalAddCollGDS).padStart(10)}\n`;
    out += `***VALORES POR PAX SUJEITOS A ALTERAÇÃO***\n`;
    out += `* Emissão: ${formatDateBR(form.dataEmissao)}`;

    setResult(out);
  };

  const copiar = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const limpar = () => {
    setEt("");
    setForm(f => ({ ...f, ticketOriginal: "", passageiro: "", passageiros: "", rota: "", roteiro: "", loc: "", aplicarMarkup: false }));
    setResult("Cole o resumo Amadeus (ET*) e clique em CALCULAR");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-gray-900">Comparação de Bilhetes — Reemissão</h2>
        <Tab tabs={["AMADEUS", "GALILEO (OCR)", "SABRE"]} active={gds} onChange={setGds} />
      </div>

      <Card>
        <Textarea label="Resumo ET* — Cole aqui (Formato: 795.00, 1,234.56, -24.00)"
          value={et} onChange={e => setEt(e.target.value)} rows={7}
          placeholder={"Cole o conteúdo do resumo ET* aqui...\n\nExemplo:\nOLD BASE FARE       USD       795.00\nNEW BASE FARE       USD       795.00\nFARE BALANCE        BRL         0.00\nTAX BALANCE         BRL        24.00\nPENALTY             BRL       200.00\nTICKET DIFFERENCE   BRL       224.00\nTOTAL ADD COLL      BRL       224.00"} />
      </Card>

      <Card>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Input label="Cotação do Dólar (R$)" type="number" step="0.0001" value={form.cotacao} onChange={e => upd("cotacao", e.target.value)} />
          <Input label="FEE (USD)" type="number" step="0.01" value={form.feeUSD} onChange={e => upd("feeUSD", e.target.value)} />
          <Input label="% RAV" type="number" step="0.01" value={form.ravPercent} onChange={e => upd("ravPercent", e.target.value)} />
          <Input label="RAV Mínimo (R$)" type="number" value={form.ravMinimo} onChange={e => upd("ravMinimo", e.target.value)} />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <Input label="Ticket Original" value={form.ticketOriginal} onChange={e => upd("ticketOriginal", e.target.value)} placeholder="Número do bilhete" />
          <Input label="Passageiro (simples)" value={form.passageiro} onChange={e => upd("passageiro", e.target.value)} placeholder="Nome completo" />
          <Input label="Rota (simples)" value={form.rota} onChange={e => upd("rota", e.target.value)} placeholder="Ex: GRU-MIA-JFK" />
          <Input label="Data" type="date" value={form.dataEmissao} onChange={e => upd("dataEmissao", e.target.value)} />
        </div>

        <div className="grid grid-cols-3 gap-4 mt-4">
          <Textarea label="Passageiros (múltiplos)" value={form.passageiros} onChange={e => upd("passageiros", e.target.value)}
            rows={3} placeholder={"1.SOBRENOME/NOME TITLE\n2.SOBRENOME/NOME TITLE"} />
          <Textarea label="Roteiro (voos GDS)" value={form.roteiro} onChange={e => upd("roteiro", e.target.value)}
            rows={3} placeholder={"3 LA8084 L 23JAN 5 GRULHR HK2 2340 1405+1\n4 LX317 H 27JAN 2 LHRZRH HK2 0900 1155"} />
          <Input label="LOC (Localizador)" value={form.loc} onChange={e => upd("loc", e.target.value)} placeholder="Ex: B2C7JN" />
        </div>

        <div className="border-t border-gray-100 mt-4 pt-4">
          <div className="flex items-center gap-2 mb-3">
            <input type="checkbox" id="markupReem" checked={form.aplicarMarkup} onChange={e => upd("aplicarMarkup", e.target.checked)} className="w-4 h-4" />
            <label htmlFor="markupReem" className="text-sm text-gray-600 cursor-pointer">Aplicar Markup na tarifa (tarifas net-net)</label>
          </div>
          {form.aplicarMarkup && (
            <div className="flex items-end gap-4">
              <div className="w-48">
                <Input label="Markup %" type="number" step="0.01" value={form.markup} onChange={e => upd("markup", e.target.value)} placeholder="Ex: 10" />
              </div>
              <div className="text-xs text-gray-400 pb-2">Aplica fórmula: tarifa ÷ (1 - markup%)</div>
            </div>
          )}
        </div>
      </Card>

      <div className="flex gap-3">
        <Button onClick={calcular}>🧮 Calcular</Button>
        <Button variant="secondary" onClick={copiar} disabled={result === "Cole o resumo Amadeus (ET*) e clique em CALCULAR"}>{copied ? "✓ Copiado!" : "📋 Copiar"}</Button>
        <Button variant="secondary" onClick={limpar}>🗑 Limpar</Button>
      </div>

      <Terminal>{result}</Terminal>
    </div>
  );
}

// ============================================================
// CONFIGURAÇÕES DO SISTEMA — salva no Supabase
// ============================================================
function ConfiguracoesSistema() {
  const [cfg, setCfg] = useState({
    preco_individual: "49.99", preco_empresarial: "49.99", dias_trial: "5",
    rav_padrao: "7", fee_padrao: "157.76", rav_minimo: "200",
    mp_public_key: "", mp_access_token: "",
  });
  const [saving, setSaving] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    supabase.from("configuracoes").select("*").single().then(({ data }) => {
      if (data) setCfg(c => ({ ...c, ...data }));
    });
  }, []);

  const salvar = async (campos, label) => {
    setSaving(label);
    setMsg("");
    const { error } = await supabase.from("configuracoes")
      .upsert({ id: 1, ...campos }, { onConflict: "id" });
    setSaving("");
    setMsg(error ? "❌ Erro ao salvar." : `✅ ${label} salvo!`);
    setTimeout(() => setMsg(""), 3000);
  };

  const upd = (k, v) => setCfg(c => ({ ...c, [k]: v }));

  return (
    <>
      <h2 className="text-2xl font-black text-gray-900">Configurações do Sistema</h2>
      {msg && <div className={`p-3 rounded-xl text-sm font-semibold ${msg.startsWith("✅") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>{msg}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h3 className="font-bold text-gray-800 mb-4">💰 Planos e Preços</h3>
          <div className="space-y-3">
            <Input label="Preço Individual (R$/mês)" value={cfg.preco_individual} onChange={e => upd("preco_individual", e.target.value)} />
            <Input label="Preço por Acesso Empresarial (R$/mês)" value={cfg.preco_empresarial} onChange={e => upd("preco_empresarial", e.target.value)} />
            <Input label="Dias de Trial Gratuito" value={cfg.dias_trial} onChange={e => upd("dias_trial", e.target.value)} />
          </div>
          <Button className="mt-4" disabled={saving === "Preços"} onClick={() => salvar({ preco_individual: cfg.preco_individual, preco_empresarial: cfg.preco_empresarial, dias_trial: cfg.dias_trial }, "Preços")}>
            {saving === "Preços" ? "Salvando..." : "Salvar Preços"}
          </Button>
        </Card>
        <Card>
          <h3 className="font-bold text-gray-800 mb-4">🧮 Padrões de Cálculo</h3>
          <div className="space-y-3">
            <Input label="RAV Padrão (%)" value={cfg.rav_padrao} onChange={e => upd("rav_padrao", e.target.value)} />
            <Input label="FEE Padrão (BRL)" value={cfg.fee_padrao} onChange={e => upd("fee_padrao", e.target.value)} />
            <Input label="RAV Mínimo Reemissão (R$)" value={cfg.rav_minimo} onChange={e => upd("rav_minimo", e.target.value)} />
          </div>
          <Button className="mt-4" disabled={saving === "Padrões"} onClick={() => salvar({ rav_padrao: cfg.rav_padrao, fee_padrao: cfg.fee_padrao, rav_minimo: cfg.rav_minimo }, "Padrões")}>
            {saving === "Padrões" ? "Salvando..." : "Salvar Padrões"}
          </Button>
        </Card>
        <Card>
          <h3 className="font-bold text-gray-800 mb-4">🔐 Conta Master</h3>
          <div className="space-y-3">
            <Input label="E-mail Master" defaultValue="geraldofor@gmail.com" disabled />
            <Input label="Nome" defaultValue="Geraldo" />
          </div>
          <Button className="mt-4">Atualizar</Button>
        </Card>
        <Card>
          <h3 className="font-bold text-gray-800 mb-4">💳 Mercado Pago</h3>
          <div className="space-y-3">
            <Input label="Public Key" value={cfg.mp_public_key} onChange={e => upd("mp_public_key", e.target.value)} placeholder="APP_USR-..." />
            <Input label="Access Token" value={cfg.mp_access_token} onChange={e => upd("mp_access_token", e.target.value)} placeholder="APP_USR-..." />
          </div>
          <Button className="mt-4" disabled={saving === "Chaves"} onClick={() => salvar({ mp_public_key: cfg.mp_public_key, mp_access_token: cfg.mp_access_token }, "Chaves")}>
            {saving === "Chaves" ? "Salvando..." : "Salvar Chaves"}
          </Button>
        </Card>
      </div>
    </>
  );
}

// ============================================================
// PAINEL ADMIN
// ============================================================
function PainelAdmin({ onLogout }) {
  const [tab, setTab] = useState("Dashboard");
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [novoUser, setNovoUser] = useState({ name: "", email: "", plan: "trial", company: "", seats: 1 });
  const [savingUser, setSavingUser] = useState(false);
  const [userMsg, setUserMsg] = useState("");

  // Carrega usuários reais do Supabase
  const carregarUsuarios = async () => {
    setLoadingUsers(true);
    const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
    if (!error && data) setUsers(data);
    setLoadingUsers(false);
  };

  useEffect(() => { if (tab === "Usuários") carregarUsuarios(); }, [tab]);

  // Bloquear/desbloquear usuário
  const toggleBloquear = async (id, bloqueado) => {
    await supabase.from("profiles").update({ blocked: !bloqueado }).eq("id", id);
    carregarUsuarios();
  };

  // Criar novo usuário via convite
  const criarUsuario = async () => {
    setSavingUser(true);
    setUserMsg("");
    try {
      const { error } = await supabase.auth.admin.inviteUserByEmail(novoUser.email, {
        data: { full_name: novoUser.name, company: novoUser.company, seats: novoUser.seats }
      });
      if (error) {
        // Fallback: cria direto na tabela profiles com signUp
        const { error: signUpError } = await supabase.auth.signUp({
          email: novoUser.email,
          password: Math.random().toString(36).slice(-10) + "A1!",
          options: { data: { full_name: novoUser.name } }
        });
        if (signUpError) { setUserMsg("Erro: " + signUpError.message); setSavingUser(false); return; }
      }
      setUserMsg("✅ Convite enviado para " + novoUser.email);
      setNovoUser({ name: "", email: "", plan: "trial", company: "", seats: 1 });
      setTimeout(() => { setShowModal(false); setUserMsg(""); carregarUsuarios(); }, 2000);
    } catch (e) {
      setUserMsg("Erro inesperado.");
    }
    setSavingUser(false);
  };

  // Dados mock para dashboard financeiro (será substituído por dados reais)
  const totalReceita = MOCK_PAYMENTS.filter(p => p.status === "pago").reduce((a, p) => a + p.valor, 0);
  const totalPendente = MOCK_PAYMENTS.filter(p => p.status === "pendente").reduce((a, p) => a + p.valor, 0);
  const totalCancelado = MOCK_PAYMENTS.filter(p => p.status === "cancelado").reduce((a, p) => a + p.valor, 0);
  const totalUsuarios = users.filter(u => u.role !== "admin").length;
  const ativos = users.filter(u => u.plan === "individual" || u.plan === "empresarial" || u.plan === "admin").length;
  const trials = users.filter(u => u.plan === "trial").length;

  const trialDaysLeft = (trialStart) => {
    if (!trialStart) return 0;
    const diff = (new Date() - new Date(trialStart)) / (1000 * 60 * 60 * 24);
    return Math.max(0, 5 - Math.floor(diff));
  };

  const menus = [
    { id: "Dashboard", icon: "📊", grupo: "admin" },
    { id: "Usuários", icon: "👥", grupo: "admin" },
    { id: "Pagamentos", icon: "💰", grupo: "admin" },
    { id: "Configurações", icon: "⚙️", grupo: "admin" },
    { id: "Tarifas", icon: "🧮", grupo: "ferramentas" },
    { id: "Conversor", icon: "✈️", grupo: "ferramentas" },
    { id: "Reemissão", icon: "🔄", grupo: "ferramentas" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modal Novo Usuário */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
            <h3 className="font-black text-lg text-gray-900 mb-4">➕ Novo Usuário</h3>
            <div className="space-y-3">
              <Input label="Nome completo" value={novoUser.name} onChange={e => setNovoUser({...novoUser, name: e.target.value})} placeholder="Nome do usuário" />
              <Input label="E-mail" type="email" value={novoUser.email} onChange={e => setNovoUser({...novoUser, email: e.target.value})} placeholder="email@exemplo.com" />
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Plano</label>
                <select value={novoUser.plan} onChange={e => setNovoUser({...novoUser, plan: e.target.value})}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="trial">Trial (5 dias)</option>
                  <option value="individual">Individual</option>
                  <option value="empresarial">Empresarial</option>
                </select>
              </div>
              {novoUser.plan === "empresarial" && (
                <div className="flex gap-3">
                  <Input label="Empresa" value={novoUser.company} onChange={e => setNovoUser({...novoUser, company: e.target.value})} placeholder="Nome da empresa" />
                  <Input label="Acessos" type="number" min="1" value={novoUser.seats} onChange={e => setNovoUser({...novoUser, seats: parseInt(e.target.value)})} />
                </div>
              )}
              {userMsg && <div className={`text-sm p-3 rounded-lg ${userMsg.startsWith("✅") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>{userMsg}</div>}
            </div>
            <div className="flex gap-3 mt-5">
              <Button onClick={criarUsuario} disabled={savingUser || !novoUser.email}>
                {savingUser ? "Enviando..." : "📧 Enviar Convite"}
              </Button>
              <Button variant="secondary" onClick={() => { setShowModal(false); setUserMsg(""); }}>Cancelar</Button>
            </div>
          </div>
        </div>
      )}

      {/* Header Admin */}
      <header className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-700">
        <div className="flex items-center gap-4">
          <span className="text-xl font-black">⚡ Calcula Fácil</span>
          <span className="bg-purple-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">ADMIN MASTER</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-slate-300 text-sm">● Geraldo — geraldofor@gmail.com</span>
          <button onClick={onLogout} className="text-xs bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded-lg transition-all">Sair</button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-56 bg-white border-r border-gray-200 min-h-[calc(100vh-60px)] p-4">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3 px-3">Administração</div>
          {menus.filter(m => m.grupo === "admin").map(m => (
            <button key={m.id} onClick={() => setTab(m.id)}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium mb-1 transition-all flex items-center gap-2
                ${tab === m.id ? "bg-blue-600 text-white shadow" : "text-gray-600 hover:bg-gray-100"}`}>
              <span>{m.icon}</span>{m.id}
            </button>
          ))}
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3 px-3 mt-5">Ferramentas</div>
          {menus.filter(m => m.grupo === "ferramentas").map(m => (
            <button key={m.id} onClick={() => setTab(m.id)}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium mb-1 transition-all flex items-center gap-2
                ${tab === m.id ? "bg-green-600 text-white shadow" : "text-gray-600 hover:bg-gray-100"}`}>
              <span>{m.icon}</span>{m.id}
            </button>
          ))}
          <div className="mt-6 bg-purple-50 border border-purple-200 rounded-xl p-3 text-xs text-purple-700">
            <div className="font-bold mb-1">🔐 Acesso Full</div>
            <div className="text-purple-500">geraldofor@gmail.com</div>
          </div>
        </aside>

        <main className="flex-1 p-6 space-y-6">

          {/* DASHBOARD */}
          {tab === "Dashboard" && (
            <>
              <h2 className="text-2xl font-black text-gray-900">Dashboard</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Receita Mensal", valor: `R$ ${totalReceita.toFixed(2)}`, cor: "text-green-600", bg: "bg-green-50 border-green-200", icon: "💰" },
                  { label: "Total Usuários", valor: totalUsuarios, cor: "text-blue-600", bg: "bg-blue-50 border-blue-200", icon: "👥" },
                  { label: "Assinantes Ativos", valor: ativos, cor: "text-green-600", bg: "bg-green-50 border-green-200", icon: "✅" },
                  { label: "Em Trial", valor: trials, cor: "text-yellow-600", bg: "bg-yellow-50 border-yellow-200", icon: "⏳" },
                ].map(m => (
                  <div key={m.label} className={`rounded-2xl border p-5 ${m.bg}`}>
                    <div className="text-2xl mb-1">{m.icon}</div>
                    <div className={`text-3xl font-black ${m.cor}`}>{m.valor}</div>
                    <div className="text-xs text-gray-500 mt-1">{m.label}</div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-4">
                <Card className="text-center"><div className="text-xs text-gray-400 mb-1">RECEBIDO</div><div className="text-2xl font-black text-green-600">R$ {totalReceita.toFixed(2)}</div></Card>
                <Card className="text-center"><div className="text-xs text-gray-400 mb-1">PENDENTE</div><div className="text-2xl font-black text-yellow-500">R$ {totalPendente.toFixed(2)}</div></Card>
                <Card className="text-center"><div className="text-xs text-gray-400 mb-1">CANCELADO</div><div className="text-2xl font-black text-red-400">R$ {totalCancelado.toFixed(2)}</div></Card>
              </div>
              <Card>
                <h3 className="font-bold text-gray-800 mb-4">📋 Últimos Pagamentos</h3>
                <table className="w-full text-sm">
                  <thead><tr className="text-xs text-gray-400 border-b pb-2">
                    <th className="text-left py-2">Usuário</th><th className="text-left py-2">Plano</th>
                    <th className="text-left py-2">Valor</th><th className="text-left py-2">Método</th>
                    <th className="text-left py-2">Data</th><th className="text-left py-2">Status</th>
                  </tr></thead>
                  <tbody>{MOCK_PAYMENTS.map(p => (
                    <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50 transition-all">
                      <td className="py-2"><div className="font-medium">{p.user}</div><div className="text-xs text-gray-400">{p.email}</div></td>
                      <td>{p.plan}</td><td className="font-bold text-gray-800">R$ {p.valor.toFixed(2)}</td>
                      <td className="text-gray-500">{p.metodo}</td><td className="text-gray-400">{p.data}</td>
                      <td><Badge color={p.status === "pago" ? "green" : p.status === "pendente" ? "yellow" : "red"}>{p.status}</Badge></td>
                    </tr>
                  ))}</tbody>
                </table>
              </Card>
            </>
          )}

          {/* USUÁRIOS */}
          {tab === "Usuários" && (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-gray-900">Gestão de Usuários</h2>
                <Button onClick={() => setShowModal(true)}>+ Novo Usuário</Button>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <Card className="text-center"><div className="text-2xl font-black text-blue-600">{users.length}</div><div className="text-xs text-gray-500">Total</div></Card>
                <Card className="text-center"><div className="text-2xl font-black text-green-600">{ativos}</div><div className="text-xs text-gray-500">Ativos</div></Card>
                <Card className="text-center"><div className="text-2xl font-black text-yellow-500">{trials}</div><div className="text-xs text-gray-500">Em Trial</div></Card>
              </div>
              <Card>
                {loadingUsers ? (
                  <div className="text-center text-gray-400 py-8">Carregando usuários...</div>
                ) : (
                  <table className="w-full text-sm">
                    <thead><tr className="text-xs text-gray-400 border-b">
                      <th className="text-left py-2">Usuário</th><th className="text-left py-2">Plano</th>
                      <th className="text-left py-2">Status</th><th className="text-left py-2">Empresa</th>
                      <th className="text-left py-2">Cadastro</th><th className="text-left py-2">Ações</th>
                    </tr></thead>
                    <tbody>{users.map(u => (
                      <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50 transition-all">
                        <td className="py-2"><div className="font-medium">{u.full_name || "—"}</div><div className="text-xs text-gray-400">{u.email}</div></td>
                        <td><Badge color={u.role === "admin" ? "purple" : u.plan === "individual" ? "blue" : u.plan === "empresarial" ? "green" : "yellow"}>{u.plan}</Badge></td>
                        <td>
                          {u.blocked ? <Badge color="red">Bloqueado</Badge>
                          : u.plan === "trial" ? <Badge color="yellow">Trial ({trialDaysLeft(u.trial_start)}d)</Badge>
                          : <Badge color="green">Ativo</Badge>}
                        </td>
                        <td className="text-gray-500">{u.company || "—"}</td>
                        <td className="text-gray-400">{new Date(u.created_at).toLocaleDateString("pt-BR")}</td>
                        <td>
                          {u.role !== "admin" && (
                            <div className="flex gap-2">
                              <Button variant={u.blocked ? "success" : "danger"} className="text-xs py-1 px-2"
                                onClick={() => toggleBloquear(u.id, u.blocked)}>
                                {u.blocked ? "Desbloquear" : "Bloquear"}
                              </Button>
                            </div>
                          )}
                          {u.role === "admin" && <Badge color="purple">MASTER</Badge>}
                        </td>
                      </tr>
                    ))}</tbody>
                  </table>
                )}
              </Card>
            </>
          )}

          {/* PAGAMENTOS */}
          {tab === "Pagamentos" && (
            <>
              <h2 className="text-2xl font-black text-gray-900">Controle Financeiro</h2>
              <div className="grid grid-cols-3 gap-4">
                <Card className="text-center bg-green-50 border-green-200"><div className="text-xs text-gray-400 mb-1">RECEBIDO</div><div className="text-3xl font-black text-green-600">R$ {totalReceita.toFixed(2)}</div></Card>
                <Card className="text-center bg-yellow-50 border-yellow-200"><div className="text-xs text-gray-400 mb-1">PENDENTE</div><div className="text-3xl font-black text-yellow-500">R$ {totalPendente.toFixed(2)}</div></Card>
                <Card className="text-center bg-red-50 border-red-200"><div className="text-xs text-gray-400 mb-1">CANCELADO</div><div className="text-3xl font-black text-red-400">R$ {totalCancelado.toFixed(2)}</div></Card>
              </div>
              <Card>
                <table className="w-full text-sm">
                  <thead><tr className="text-xs text-gray-400 border-b">
                    <th className="text-left py-2">Data</th><th className="text-left py-2">Usuário</th>
                    <th className="text-left py-2">Plano</th><th className="text-left py-2">Valor</th>
                    <th className="text-left py-2">Método</th><th className="text-left py-2">Status</th>
                  </tr></thead>
                  <tbody>{MOCK_PAYMENTS.map(p => (
                    <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-2 text-gray-400">{p.data}</td>
                      <td><div className="font-medium">{p.user}</div><div className="text-xs text-gray-400">{p.email}</div></td>
                      <td>{p.plan}</td><td className="font-bold">R$ {p.valor.toFixed(2)}</td><td>{p.metodo}</td>
                      <td><Badge color={p.status === "pago" ? "green" : p.status === "pendente" ? "yellow" : "red"}>{p.status}</Badge></td>
                    </tr>
                  ))}</tbody>
                </table>
              </Card>
            </>
          )}

          {/* CONFIGURAÇÕES */}
          {tab === "Configurações" && <ConfiguracoesSistema />}

          {/* FERRAMENTAS */}
          {tab === "Tarifas" && <ModuloTarifas />}
          {tab === "Conversor" && <ModuloConversor />}
          {tab === "Reemissão" && <ModuloReemissao />}

        </main>
      </div>
    </div>
  );
}

// ============================================================
// DASHBOARD USUÁRIO
// ============================================================
function Dashboard({ user, onLogout, onGoAdmin }) {
  const [modulo, setModulo] = useState("Tarifas");
  const isCompanyAdmin = user.role === "company_admin";
  const isAdmin = user.email && user.email.toLowerCase() === ADMIN_EMAIL;
  const isTrial = user.plan === "trial";
  const trialDaysLeft = user.trialDays || 5;

  const menus = ["Tarifas", "Conversor", "Reemissão"];
  if (isCompanyAdmin) menus.push("Equipe");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-slate-900 text-white px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-lg font-black">⚡ Calcula Fácil</span>
          <span className="text-xs text-slate-400">Sistema Facilitador de Processos</span>
        </div>
        <div className="flex items-center gap-4">
          {isTrial && (
            <div className="bg-yellow-500/20 border border-yellow-400/40 rounded-lg px-3 py-1 text-yellow-300 text-xs font-semibold">
              ⏳ Trial: {trialDaysLeft} dias restantes
            </div>
          )}
          <span className="text-sm text-slate-300">● {user.name}</span>
          <Button variant="ghost" onClick={onLogout} className="text-white hover:bg-white/10 text-xs">Sair</Button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-48 bg-white border-r border-gray-100 min-h-[calc(100vh-52px)] p-4">
          {menus.map(m => (
            <button key={m} onClick={() => setModulo(m)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium mb-1 transition-all ${modulo === m ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}>
              {m === "Tarifas" && "🧮 "}{m === "Conversor" && "✈️ "}{m === "Reemissão" && "🔄 "}{m === "Equipe" && "👥 "}{m}
            </button>
          ))}

          {isAdmin && (
            <div className="mt-4 border-t border-gray-100 pt-4">
              <button onClick={onGoAdmin}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-bold mb-1 transition-all bg-purple-50 text-purple-700 hover:bg-purple-100 flex items-center gap-2">
                🔐 Painel Admin
              </button>
            </div>
          )}

          {isTrial && (
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-700">
              <div className="font-bold mb-1">Gostando? 🚀</div>
              <div className="mb-2">Assine por R$ 49,99/mês</div>
              <button className="w-full py-1.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all">Assinar agora</button>
            </div>
          )}
        </aside>

        {/* Conteúdo */}
        <main className="flex-1 p-6">
          {modulo === "Tarifas" && <ModuloTarifas />}
          {modulo === "Conversor" && <ModuloConversor />}
          {modulo === "Reemissão" && <ModuloReemissao />}
          {modulo === "Equipe" && (
            <div className="space-y-4">
              <h2 className="text-2xl font-black text-gray-900">Gestão da Equipe</h2>
              <Card>
                <div className="flex justify-between items-center mb-4">
                  <div><span className="font-bold">{user.company}</span> — <span className="text-gray-500">{user.seats || 1} acesso(s) contratado(s)</span></div>
                  <Button>+ Adicionar usuário</Button>
                </div>
                <div className="text-sm text-gray-500">Gerencie os acessos da sua equipe aqui. Cada usuário adicional custa R$ 49,99/mês.</div>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// ============================================================
// APP ROOT
// ============================================================
export default function App() {
  const [screen, setScreen] = useState("loading");
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Verifica se há sessão ativa
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        let trialDaysLeft = 0;
        if (profile?.plan === "trial" && profile?.trial_start) {
          const diff = (new Date() - new Date(profile.trial_start)) / (1000 * 60 * 60 * 24);
          trialDaysLeft = Math.max(0, 5 - Math.floor(diff));
        }

        const userData = {
          id: session.user.id,
          name: profile?.full_name || session.user.email.split("@")[0],
          email: session.user.email,
          role: profile?.role || "user",
          plan: profile?.plan || "trial",
          trialDays: trialDaysLeft,
          company: profile?.company,
          seats: profile?.seats || 1,
        };
        setUser(userData);
        setScreen(userData.role === "admin" ? "admin" : "app");
      } else {
        setScreen("login");
      }
    });

    // Escuta mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) { setUser(null); setScreen("login"); }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuth = (userData) => {
    if (userData.blocked) { alert("Acesso bloqueado. Entre em contato com o suporte."); return; }
    setUser(userData);
    if (userData.role === "admin") setScreen("admin");
    else setScreen("app");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setScreen("login");
  };

  if (screen === "loading") return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-white text-center">
        <div className="text-4xl mb-4">⚡</div>
        <div className="text-xl font-black">Calcula Fácil</div>
        <div className="text-slate-400 text-sm mt-2">Carregando...</div>
      </div>
    </div>
  );

  if (screen === "landing") return <LandingPage onLogin={() => setScreen("login")} onRegister={() => setScreen("register")} />;
  if (screen === "login") return <AuthPage mode="login" onAuth={handleAuth} onSwitch={() => setScreen("register")} onBack={() => setScreen("landing")} />;
  if (screen === "register") return <AuthPage mode="register" onAuth={handleAuth} onSwitch={() => setScreen("login")} onBack={() => setScreen("landing")} />;
  if (screen === "admin") return <PainelAdmin onLogout={handleLogout} />;
  if (screen === "app") return <Dashboard user={user} onLogout={handleLogout} onGoAdmin={() => setScreen("admin")} />;
}
