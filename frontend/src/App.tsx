import { useEffect, useState } from "react";
import { Activity, ArrowRight, CheckCircle2, ClipboardList, HeartPulse, ShieldCheck, Stethoscope, AlertTriangle, LoaderCircle } from "lucide-react";

const API = import.meta.env.VITE_API_BASE_URL ?? (
  import.meta.env.DEV ? "http://127.0.0.1:8000" : ""
);

type Symptom = { id: string; label: string };
type Result = {
  assessment_type: string;
  urgency: "emergency" | "prompt_medical_advice" | "routine_guidance";
  title: string;
  summary: string;
  warning_signs: string[];
  next_steps: string[];
  limitations: string[];
  model_used: boolean;
};

export default function App() {
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [age, setAge] = useState("25");
  const [duration, setDuration] = useState("2");
  const [severity, setSeverity] = useState("mild");
  const [temperature, setTemperature] = useState("");
  const [demo, setDemo] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [apiState, setApiState] = useState<"checking" | "online" | "offline">("checking");

  useEffect(() => {
    fetch(`${API}/api/v1/symptoms`)
      .then(r => { if (!r.ok) throw new Error("API unavailable"); return r.json(); })
      .then(d => { setSymptoms(d.symptoms); setApiState("online"); })
      .catch(() => setApiState("offline"));
  }, []);

  const toggleSymptom = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
    setResult(null);
  };

  const runDemo = () => {
    setDemo(true);
    setAge("28");
    setDuration("2");
    setSeverity("mild");
    setTemperature("");
    setSelected(["cough", "fatigue"]);
    setResult(null);
    setError("");
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setResult(null);
    if (selected.length === 0) { setError("Select at least one symptom to continue."); return; }
    setLoading(true);
    try {
      const response = await fetch(`${API}/api/v1/assessments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          age: Number(age),
          symptoms: selected,
          duration_days: Number(duration),
          severity,
          temperature_c: temperature === "" ? null : Number(temperature),
          demo_mode: demo
        })
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.detail?.[0]?.msg || body.detail || "Could not complete assessment.");
      setResult(body);
      document.getElementById("results")?.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to reach the backend. Check that FastAPI is running.");
    } finally {
      setLoading(false);
    }
  }

  const reset = () => {
    setSelected([]); setResult(null); setError(""); setDemo(false);
    setAge("25"); setDuration("2"); setSeverity("mild"); setTemperature("");
  };

  return <div className="app-shell">
    <header className="topbar">
      <a className="brand" href="#" aria-label="EarlyCare AI home">
        <span className="brand-mark"><HeartPulse size={23}/></span>
        <span>EarlyCare <b>AI</b><small>HEALTH AWARENESS</small></span>
      </a>
      <div className="top-actions">
        <span className={`api-pill ${apiState}`}><span className="status-dot"/>{apiState === "online" ? "API connected" : apiState === "offline" ? "API offline" : "Connecting…"}</span>
        <a className="docs-link" href={`${API}/docs`} target="_blank" rel="noreferrer">API docs ↗</a>
      </div>
    </header>

    <main>
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><span/> PRELIMINARY HEALTH SCREENING</div>
          <h1>Understand your symptoms.<br/><em>Take the next step.</em></h1>
          <p>Share what you’re experiencing to receive general health guidance and safety prompts. EarlyCare AI does not diagnose medical conditions.</p>
          <div className="hero-points">
            <span><ShieldCheck size={17}/> Safety-first checks</span>
            <span><Activity size={17}/> Clear next steps</span>
            <span><CheckCircle2 size={17}/> No saved history</span>
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="orbit orbit-one"/><div className="orbit orbit-two"/>
          <div className="pulse-card"><HeartPulse size={58}/><span className="pulse-line"/></div>
          <div className="float-tag tag-one"><ShieldCheck size={16}/> Safety first</div>
          <div className="float-tag tag-two"><Activity size={16}/> Health awareness</div>
          <div className="tiny-cross cross-one">+</div><div className="tiny-cross cross-two">+</div>
        </div>
      </section>

      <section className="notice" role="note">
        <span className="notice-icon"><AlertTriangle size={20}/></span>
        <div><strong>Important health notice</strong><p>If you may be experiencing a medical emergency, contact emergency services immediately. Do not wait for an online assessment.</p></div>
      </section>

      <div className="section-heading">
        <div><span className="eyebrow">YOUR CHECK-IN</span><h2>Symptom assessment</h2><p>Complete the fields below. Only the information needed for this demo is requested.</p></div>
        <button className="text-button" type="button" onClick={reset}>Reset form</button>
      </div>

      <div className="workspace">
        <form className="assessment-card" onSubmit={submit}>
          <div className="card-heading"><span className="step-number">01</span><div><h3>Basic information</h3><p>Help us understand the context.</p></div></div>
          <div className="field-grid">
            <label className="field">Age <span className="required">*</span><div className="input-wrap"><input type="number" min="1" max="120" required value={age} onChange={e => setAge(e.target.value)}/><span>years</span></div></label>
            <label className="field">Symptom duration <span className="required">*</span><div className="input-wrap"><input type="number" min="0" max="365" required value={duration} onChange={e => setDuration(e.target.value)}/><span>days</span></div></label>
          </div>
          <label className="field standalone">Temperature <span className="optional">OPTIONAL</span><div className="input-wrap"><input type="number" min="30" max="45" step="0.1" placeholder="e.g. 37.5" value={temperature} onChange={e => setTemperature(e.target.value)}/><span>°C</span></div><small>Enter a measured value only, if available.</small></label>

          <div className="form-divider"/>
          <div className="card-heading"><span className="step-number">02</span><div><h3>What symptoms are you experiencing?</h3><p>Select all that apply.</p></div></div>
          <div className="symptom-grid">
            {symptoms.map(s => <label key={s.id} className={`symptom-option ${selected.includes(s.id) ? "selected" : ""} ${["chest_pain","shortness_of_breath","confusion","fainting","severe_bleeding"].includes(s.id) ? "warning-option" : ""}`}>
              <input type="checkbox" checked={selected.includes(s.id)} onChange={() => toggleSymptom(s.id)}/>
              <span className="fake-check">{selected.includes(s.id) ? "✓" : ""}</span><span>{s.label}</span>
            </label>)}
          </div>
          <div className="form-divider"/>
          <div className="card-heading"><span className="step-number">03</span><div><h3>How severe do symptoms feel?</h3><p>Choose the option that best reflects your experience.</p></div></div>
          <div className="severity-options">
            {(["mild","moderate","severe"] as const).map((s,i) => <label key={s} className={`severity-option ${severity === s ? "chosen" : ""} severity-${s}`}><input type="radio" name="severity" value={s} checked={severity === s} onChange={() => setSeverity(s)}/><span className="severity-symbol">{["○","◐","●"][i]}</span><span><b>{s[0].toUpperCase()+s.slice(1)}</b><small>{["Noticeable but manageable","Affecting usual activities","Very intense or concerning"][i]}</small></span></label>)}
          </div>
          <label className="demo-toggle"><input type="checkbox" checked={demo} onChange={e => setDemo(e.target.checked)}/><span><b>Demonstration mode</b><small>Marks this as a sample UI demonstration; no synthetic clinical prediction is produced.</small></span></label>
          {error && <div className="error-box" role="alert"><AlertTriangle size={18}/>{String(error)}</div>}
          <button className="submit-button" type="submit" disabled={loading || apiState === "offline"}>{loading ? <><LoaderCircle className="spin" size={19}/> Assessing…</> : <>Review my assessment <ArrowRight size={19}/></>}</button>
          {apiState === "offline" && <p className="form-help">Start the FastAPI backend to submit this form.</p>}
          <p className="privacy-note"><ShieldCheck size={15}/> This demo does not store your assessment history.</p>
        </form>

        <aside className="side-column">
          <div className="side-card safety-card"><div className="side-icon"><ShieldCheck size={22}/></div><h3>Safety comes first</h3><p>Selected warning signs are checked before routine guidance. A reassuring result never overrides an urgent warning.</p><div className="side-divider"/><b>Urgent warning signs include</b><ul><li>Difficulty breathing</li><li>Chest pain</li><li>New confusion or fainting</li><li>Severe bleeding</li></ul><p className="microcopy">This list is not exhaustive.</p></div>
          <div className="side-card process-card"><div className="side-icon pale"><ClipboardList size={22}/></div><h3>What happens next?</h3><div className="process-step"><span>1</span><div><b>Share symptoms</b><small>Complete the short form.</small></div></div><div className="process-step"><span>2</span><div><b>Check safety prompts</b><small>Urgent flags take priority.</small></div></div><div className="process-step"><span>3</span><div><b>Review next steps</b><small>Get general guidance, not a diagnosis.</small></div></div></div>
          <button className="demo-card" type="button" onClick={runDemo}><span className="demo-icon"><Stethoscope size={22}/></span><span><b>Try sample input</b><small>Fill the form with a clearly labelled demo example.</small></span><ArrowRight size={18}/></button>
        </aside>
      </div>

      {result && <section id="results" className={`results-card result-${result.urgency}`} aria-live="polite">
        <div className="result-top"><div className="result-icon">{result.urgency === "emergency" ? <AlertTriangle size={24}/> : <ClipboardList size={24}/>}</div><div><span className="eyebrow">ASSESSMENT RESPONSE · {result.assessment_type.replace(/_/g, " ")}</span><h2>{result.title}</h2></div></div>
        <p className="result-summary">{result.summary}</p>
        {result.warning_signs.length > 0 && <div className="warning-list"><b>Warning signs selected</b><p>{result.warning_signs.join(", ")}</p></div>}
        <h3>Recommended next steps</h3><ul className="next-steps">{result.next_steps.map((s,i) => <li key={i}><CheckCircle2 size={18}/><span>{s}</span></li>)}</ul>
        <div className="limitations"><b>Limitations</b><ul>{result.limitations.map((s,i) => <li key={i}>{s}</li>)}</ul></div>
        <div className="result-footer"><span><ShieldCheck size={16}/> No diagnosis generated</span><button type="button" onClick={reset}>Start a new assessment</button></div>
      </section>}

      <section className="bottom-note"><ShieldCheck size={20}/><div><b>Your health information matters</b><p>EarlyCare AI is an educational prototype. It is not a substitute for medical assessment, diagnosis, or treatment. Do not use it to delay professional care.</p></div></section>
    </main>
    <footer><a className="footer-brand" href="#"><HeartPulse size={17}/> EarlyCare AI</a><span>Student project · SDG 3: Good Health and Well-being</span><span>Educational prototype · v0.1.0</span></footer>
  </div>;
}
