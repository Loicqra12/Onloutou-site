"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import {
  buildMopMessage,
  mopForm,
  mopModes,
  mopUsageLabel,
  mopWhatsappUrl,
  type MopModeId,
  type MopRequestFields,
  type MopUsageId,
} from "@/content/motos-hub";
import { hubContactValidationError, hubModeToRequestType, hubPrepareAndSubmit } from "@/lib/forms/hubPrepare";
import { useHubRequestSubmit } from "@/lib/forms/serviceRequest";

type Ctx = {
  mode: MopModeId;
  setMode: (m: MopModeId) => void;
  usage: MopUsageId | "";
  setUsage: (u: MopUsageId | "") => void;
  model: string;
  setModel: (v: string) => void;
  quantity: string;
  setQuantity: (v: string) => void;
  place: string;
  setPlace: (v: string) => void;
  dates: string;
  setDates: (v: string) => void;
  distance: string;
  setDistance: (v: string) => void;
  needs: string;
  setNeeds: (v: string) => void;
  options: string[];
  toggleOption: (id: string) => void;
  name: string;
  setName: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  fields: MopRequestFields;
  whatsappUrl: string;
  message: string;
  prepared: boolean;
  prepareError: string;
  reference: string | null;
  saveError: string | null;
  pending: boolean;
  prepare: () => Promise<void>;
  chooseUsage: (u: MopUsageId) => void;
  scrollTo: (id: string) => void;
};

const MopCtx = createContext<Ctx | null>(null);

export function useMop() {
  const v = useContext(MopCtx);
  if (!v) throw new Error("useMop doit être utilisé dans <MopProvider>");
  return v;
}

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  if (window.location.hash !== `#${id}`) window.history.replaceState(null, "", `#${id}`);
}

export function MopProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<MopModeId>("location");
  const [usage, setUsageState] = useState<MopUsageId | "">("");
  const [model, setModel] = useState("");
  const [quantity, setQuantity] = useState("");
  const [place, setPlace] = useState("");
  const [dates, setDates] = useState("");
  const [distance, setDistance] = useState("");
  const [needs, setNeeds] = useState("");
  const [options, setOptions] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [prepared, setPrepared] = useState(false);
  const [prepareError, setPrepareError] = useState("");
  const { reference, saveError, pending, submit, resetSubmit } = useHubRequestSubmit();

  const setMode = useCallback((m: MopModeId) => {
    setModeState(m);
    setPrepared(false);
    resetSubmit();
  }, [resetSubmit]);
  const setUsage = useCallback((u: MopUsageId | "") => {
    setUsageState(u);
    setPrepared(false);
    resetSubmit();
  }, [resetSubmit]);
  const chooseUsage = useCallback(
    (u: MopUsageId) => {
      setUsage(u);
      scrollToId(mopForm.id);
    },
    [setUsage],
  );
  const toggleOption = useCallback((id: string) => {
    setPrepared(false);
    resetSubmit();
    setOptions((cur) => (cur.includes(id) ? cur.filter((s) => s !== id) : [...cur, id]));
  }, [resetSubmit]);
  const scrollTo = useCallback((id: string) => scrollToId(id), []);

  const fields: MopRequestFields = useMemo(
    () => ({
      mode: mopModes.find((m) => m.id === mode)?.label ?? "Location",
      usage: usage ? mopUsageLabel(usage) : "",
      model: model.trim(),
      quantity,
      place: place.trim(),
      dates,
      distance: distance.trim(),
      needs: needs.trim(),
      options: mopForm.options.filter((o) => options.includes(o.id)).map((o) => o.label),
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
    }),
    [mode, usage, model, quantity, place, dates, distance, needs, options, name, phone, email],
  );
  const whatsappUrl = useMemo(() => mopWhatsappUrl(fields), [fields]);
  const message = useMemo(() => buildMopMessage(fields), [fields]);

  const prepare = useCallback(async () => {
    const validation = hubContactValidationError(name, phone, email);
    if (validation) {
      setPrepared(false);
      setPrepareError(validation);
      return;
    }
    setPrepareError("");
    await hubPrepareAndSubmit(submit, {
      source: "motos-hub",
      type: hubModeToRequestType(mode),
      contactName: name.trim() || phone.trim(),
      contactPhone: phone.trim() || undefined,
      contactEmail: email.trim() || undefined,
      zone: place.trim() || undefined,
      message,
      payload: fields as unknown as Record<string, unknown>,
      sourcePath: typeof window !== "undefined" ? window.location.pathname : undefined,
    });
    setPrepared(true);
  }, [name, phone, email, place, mode, message, fields, submit]);

  const value: Ctx = {
    mode, setMode, usage, setUsage, model, setModel, quantity, setQuantity, place, setPlace, dates, setDates,
    distance, setDistance, needs, setNeeds, options, toggleOption, name, setName, phone, setPhone, email, setEmail,
    fields, whatsappUrl, message, prepared, prepareError, reference, saveError, pending, prepare, chooseUsage, scrollTo,
  };
  return <MopCtx.Provider value={value}>{children}</MopCtx.Provider>;
}
