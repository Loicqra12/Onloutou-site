"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import {
  buildVhpMessage,
  vhpForm,
  vhpModes,
  vhpTypeSingular,
  vhpWhatsappUrl,
  type VhpModeId,
  type VhpRequestFields,
  type VhpTypeId,
} from "@/content/vehicles-hub";
import { hubContactValidationError } from "@/lib/forms/hubPrepare";
import { useHubRequestSubmit } from "@/lib/forms/serviceRequest";

type Ctx = {
  mode: VhpModeId;
  setMode: (m: VhpModeId) => void;
  type: VhpTypeId | "";
  setType: (t: VhpTypeId | "") => void;
  other: string;
  setOther: (v: string) => void;
  quantity: string;
  setQuantity: (v: string) => void;
  load: string;
  setLoad: (v: string) => void;
  place: string;
  setPlace: (v: string) => void;
  dates: string;
  setDates: (v: string) => void;
  mission: string;
  setMission: (v: string) => void;
  services: string[];
  toggleService: (id: string) => void;
  name: string;
  setName: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  fields: VhpRequestFields;
  whatsappUrl: string;
  message: string;
  prepared: boolean;
  prepareError: string;
  reference: string | null;
  saveError: string | null;
  pending: boolean;
  prepare: () => Promise<void>;
  chooseType: (t: VhpTypeId) => void;
  scrollTo: (id: string) => void;
};

const VhpCtx = createContext<Ctx | null>(null);

export function useVhp() {
  const v = useContext(VhpCtx);
  if (!v) throw new Error("useVhp doit être utilisé dans <VhpProvider>");
  return v;
}

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  if (window.location.hash !== `#${id}`) window.history.replaceState(null, "", `#${id}`);
}

export function VhpProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<VhpModeId>("location");
  const [type, setTypeState] = useState<VhpTypeId | "">("");
  const [other, setOther] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [load, setLoad] = useState("");
  const [place, setPlace] = useState("");
  const [dates, setDates] = useState("");
  const [mission, setMission] = useState("");
  const [services, setServices] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [prepared, setPrepared] = useState(false);
  const [prepareError, setPrepareError] = useState("");
  const { reference, saveError, pending, submit, resetSubmit } = useHubRequestSubmit();

  const setMode = useCallback((m: VhpModeId) => {
    setModeState(m);
    setPrepared(false);
    resetSubmit();
  }, [resetSubmit]);
  const setType = useCallback((t: VhpTypeId | "") => {
    setTypeState(t);
    setPrepared(false);
    resetSubmit();
  }, [resetSubmit]);
  const chooseType = useCallback(
    (t: VhpTypeId) => {
      setType(t);
      scrollToId(vhpForm.id);
    },
    [setType],
  );
  const toggleService = useCallback((id: string) => {
    setPrepared(false);
    resetSubmit();
    setServices((cur) => (cur.includes(id) ? cur.filter((s) => s !== id) : [...cur, id]));
  }, [resetSubmit]);
  const scrollTo = useCallback((id: string) => scrollToId(id), []);

  const fields: VhpRequestFields = useMemo(
    () => ({
      mode: vhpModes.find((m) => m.id === mode)?.label ?? "Location",
      type: type ? vhpTypeSingular[type] : "",
      other,
      quantity,
      load,
      place: place.trim(),
      dates,
      mission: mission.trim(),
      services: vhpForm.services.filter((s) => services.includes(s.id)).map((s) => s.label),
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
    }),
    [mode, type, other, quantity, load, place, dates, mission, services, name, phone, email],
  );
  const whatsappUrl = useMemo(() => vhpWhatsappUrl(fields), [fields]);
  const message = useMemo(() => buildVhpMessage(fields), [fields]);

  const prepare = useCallback(async () => {
    const validation = hubContactValidationError(name, phone, email);
    if (validation) {
      setPrepared(false);
      setPrepareError(validation);
      return;
    }
    setPrepareError("");
    const type = mode === "achat" ? "PURCHASE" : "RENTAL";
    const outcome = await submit({
      source: "vehicules-hub",
      type,
      contactName: name.trim(),
      contactPhone: phone.trim() || undefined,
      contactEmail: email.trim() || undefined,
      zone: place.trim() || undefined,
      message,
      payload: fields as unknown as Record<string, unknown>,
      sourcePath: typeof window !== "undefined" ? window.location.pathname : undefined,
    });
    if (outcome.apiDisabled) {
      setPrepared(true);
      return;
    }
    setPrepared(true);
  }, [name, phone, email, place, mode, message, fields, submit]);

  const value: Ctx = {
    mode, setMode, type, setType, other, setOther, quantity, setQuantity, load, setLoad, place, setPlace, dates, setDates,
    mission, setMission, services, toggleService, name, setName, phone, setPhone, email, setEmail,
    fields, whatsappUrl, message, prepared, prepareError, reference, saveError, pending, prepare, chooseType, scrollTo,
  };
  return <VhpCtx.Provider value={value}>{children}</VhpCtx.Provider>;
}
