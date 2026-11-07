"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import {
  buildCmeMessage,
  cmeCatalog,
  cmeCategoryById,
  cmeFilterProducts,
  cmeForm,
  cmeMissions,
  cmeWhatsappUrl,
  type CmeCapacityId,
  type CmeCategoryId,
  type CmeGroupId,
  type CmeMissionId,
  type CmeProduct,
  type CmeRequestFields,
} from "@/content/trucks-hub";
import { hubContactValidationError, hubPrepareAndSubmit } from "@/lib/forms/hubPrepare";
import { useHubRequestSubmit } from "@/lib/forms/serviceRequest";

export type CmeItem = { key: number; productId?: string; name: string };
export type CmeOperator = "" | "avec" | "sans" | "etudier";

type Ctx = {
  query: string;
  setQuery: (v: string) => void;
  group: CmeGroupId;
  category: CmeCategoryId | null;
  missionFilter: CmeMissionId | "";
  capacityFilter: CmeCapacityId | "";
  selectGroup: (g: CmeGroupId) => void;
  selectCategory: (c: CmeCategoryId | null) => void;
  setMissionFilter: (m: CmeMissionId | "") => void;
  setCapacityFilter: (c: CmeCapacityId | "") => void;
  resetFilters: () => void;
  runSearch: () => void;
  products: CmeProduct[];
  items: CmeItem[];
  named: CmeItem[];
  hasProduct: (id: string) => boolean;
  toggleProduct: (p: CmeProduct) => void;
  setItemName: (key: number, name: string) => void;
  addRow: () => number;
  removeRow: (key: number) => void;
  quantity: number;
  setQuantity: (v: number) => void;
  description: string;
  setDescription: (v: string) => void;
  capacity: string;
  setCapacity: (v: string) => void;
  mission: string;
  missionSet: boolean;
  setMission: (v: string) => void;
  terrain: string;
  setTerrain: (v: string) => void;
  operator: CmeOperator;
  setOperator: (v: CmeOperator) => void;
  applyConfig: () => void;
  configApplied: boolean;
  place: string;
  setPlace: (v: string) => void;
  zoneHint: string;
  setZoneHint: (v: string) => void;
  start: string;
  setStart: (v: string) => void;
  periodHint: string;
  setPeriodHint: (v: string) => void;
  duration: string;
  setDuration: (v: string) => void;
  access: string;
  setAccess: (v: string) => void;
  services: string[];
  toggleService: (id: string) => void;
  fileName: string;
  fileError: string;
  pickFile: (file: File | null) => void;
  name: string;
  setName: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  fields: CmeRequestFields;
  whatsappUrl: string;
  message: string;
  prepared: boolean;
  prepareError: string;
  reference: string | null;
  saveError: string | null;
  pending: boolean;
  prepare: () => Promise<void>;
  scrollTo: (id: string) => void;
};

const CmeCtx = createContext<Ctx | null>(null);

export function useCme() {
  const v = useContext(CmeCtx);
  if (!v) throw new Error("useCme doit être utilisé dans <CmeProvider>");
  return v;
}

export function fmtDate(v: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v);
  return m ? `${m[3]}/${m[2]}/${m[1]}` : v;
}

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  if (window.location.hash !== `#${id}`) window.history.replaceState(null, "", `#${id}`);
}

const OPERATOR_LABEL: Record<Exclude<CmeOperator, "">, string> = { avec: "Avec opérateur", sans: "Sans opérateur", etudier: "À étudier" };

export function CmeProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState<CmeGroupId>("terrassement");
  const [category, setCategory] = useState<CmeCategoryId | null>(null);
  const [missionFilter, setMissionFilterState] = useState<CmeMissionId | "">("");
  const [capacityFilter, setCapacityFilter] = useState<CmeCapacityId | "">("");
  const keyRef = useRef(1);
  const [items, setItems] = useState<CmeItem[]>([{ key: 0, name: "" }]);
  const [quantity, setQuantityState] = useState(1);
  const [description, setDescription] = useState("");
  const [capacity, setCapacity] = useState("");
  const [mission, setMissionState] = useState("Terrassement");
  const [missionSet, setMissionSet] = useState(false);
  const [terrain, setTerrain] = useState("");
  const [operator, setOperatorState] = useState<CmeOperator>("");
  const [configApplied, setConfigApplied] = useState(false);
  const [place, setPlace] = useState("");
  const [zoneHint, setZoneHint] = useState("");
  const [start, setStart] = useState("");
  const [periodHint, setPeriodHint] = useState("");
  const [duration, setDuration] = useState("");
  const [access, setAccess] = useState("");
  const [services, setServices] = useState<string[]>([]);
  const [fileName, setFileName] = useState("");
  const [fileError, setFileError] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [prepared, setPrepared] = useState(false);
  const [prepareError, setPrepareError] = useState("");
  const { reference, saveError, pending, submit } = useHubRequestSubmit();

  const products = useMemo(
    () => cmeFilterProducts({ query, group, category, mission: missionFilter, capacity: capacityFilter }),
    [query, group, category, missionFilter, capacityFilter],
  );

  const selectGroup = useCallback((g: CmeGroupId) => {
    setGroup(g);
    setCategory(null);
    setQuery("");
    setMissionFilterState("");
    setCapacityFilter("");
  }, []);

  const selectCategory = useCallback((c: CmeCategoryId | null) => {
    setCategory(c);
    setQuery("");
    setMissionFilterState("");
    setCapacityFilter("");
    if (c) setGroup(cmeCategoryById(c).group);
  }, []);

  const setMissionFilter = useCallback((m: CmeMissionId | "") => {
    setMissionFilterState(m);
    if (m) {
      setGroup("all");
      setCategory(null);
      setQuery("");
      const label = cmeMissions.find((x) => x.id === m)?.label;
      if (label) {
        setMissionState(label);
        setMissionSet(true);
      }
    }
  }, []);

  const resetFilters = useCallback(() => {
    setQuery("");
    setMissionFilterState("");
    setCapacityFilter("");
    setCategory(null);
    setGroup("all");
  }, []);

  const scrollTo = useCallback((id: string) => scrollToId(id), []);

  const runSearch = useCallback(() => {
    setCategory(null);
    scrollToId(cmeCatalog.id);
  }, []);

  const named = useMemo(() => items.filter((i) => i.name.trim()), [items]);
  const hasProduct = useCallback((id: string) => items.some((i) => i.productId === id), [items]);

  const toggleProduct = useCallback((p: CmeProduct) => {
    setPrepared(false);
    const freshKey = keyRef.current++;
    setItems((cur) => {
      if (cur.some((i) => i.productId === p.id)) {
        const next = cur.filter((i) => i.productId !== p.id);
        return next.length ? next : [{ key: freshKey, name: "" }];
      }
      const blank = cur.findIndex((i) => !i.name.trim() && !i.productId);
      if (blank >= 0) return cur.map((i, idx) => (idx === blank ? { ...i, productId: p.id, name: p.name } : i));
      return [...cur, { key: freshKey, productId: p.id, name: p.name }];
    });
  }, []);

  const setItemName = useCallback((key: number, value: string) => {
    setPrepared(false);
    setItems((cur) => cur.map((i) => (i.key === key ? { key, name: value } : i)));
  }, []);
  const addRow = useCallback(() => {
    const key = keyRef.current++;
    setItems((cur) => [...cur, { key, name: "" }]);
    return key;
  }, []);
  const removeRow = useCallback((key: number) => {
    setPrepared(false);
    const freshKey = keyRef.current++;
    setItems((cur) => {
      const next = cur.filter((i) => i.key !== key);
      return next.length ? next : [{ key: freshKey, name: "" }];
    });
  }, []);

  const setQuantity = useCallback((v: number) => setQuantityState(Math.min(99, Math.max(1, Math.round(v) || 1))), []);

  const setMission = useCallback((v: string) => {
    setMissionState(v);
    setMissionSet(true);
    setConfigApplied(false);
  }, []);

  const setOperator = useCallback((v: CmeOperator) => {
    setOperatorState(v);
    setConfigApplied(false);
    setServices((cur) => {
      const base = cur.filter((s) => s !== "operateur" && s !== "etudier");
      if (v === "avec") return [...base, "operateur"];
      if (v === "etudier") return [...base, "etudier"];
      return base;
    });
  }, []);

  const toggleService = useCallback((id: string) => {
    setServices((cur) => {
      const on = cur.includes(id);
      const next = on ? cur.filter((s) => s !== id) : [...cur, id];
      return next;
    });
    if (id === "operateur") setOperatorState((o) => (o === "avec" ? "" : "avec"));
    if (id === "etudier") setOperatorState((o) => (o === "etudier" ? "" : "etudier"));
  }, []);

  const applyConfig = useCallback(() => {
    setMissionSet(true);
    setConfigApplied(true);
    scrollToId(cmeForm.id);
  }, []);

  const pickFile = useCallback((file: File | null) => {
    setFileError("");
    if (!file) {
      setFileName("");
      return;
    }
    const okType = /^image\/(jpeg|png)$/.test(file.type) || file.type === "application/pdf" || /\.(jpe?g|png|pdf)$/i.test(file.name);
    if (!okType) {
      setFileName("");
      setFileError("Format non accepté. Utilisez JPG, PNG ou PDF.");
      return;
    }
    if (file.size > cmeForm.maxFileBytes) {
      setFileName("");
      setFileError("Fichier trop volumineux (10 Mo maximum).");
      return;
    }
    setFileName(file.name);
  }, []);

  const fields: CmeRequestFields = useMemo(
    () => ({
      items: named.map((i) => i.name.trim()),
      quantity,
      mission: missionSet ? mission : "",
      terrain: terrain.trim(),
      capacity: capacity.trim(),
      description: description.trim(),
      place: place.trim() || zoneHint,
      start: fmtDate(start),
      duration: duration.trim(),
      period: periodHint,
      access: access.trim(),
      operator: operator ? OPERATOR_LABEL[operator] : "",
      services: cmeForm.services.filter((s) => services.includes(s.id)).map((s) => s.label),
      fileName,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
    }),
    [named, quantity, missionSet, mission, terrain, capacity, description, place, zoneHint, start, duration, periodHint, access, operator, services, fileName, name, phone, email],
  );

  const whatsappUrl = useMemo(() => cmeWhatsappUrl(fields), [fields]);
  const message = useMemo(() => buildCmeMessage(fields), [fields]);

  const prepare = useCallback(async () => {
    if (!named.length) {
      setPrepared(false);
      setPrepareError("Indiquez au moins un équipement recherché.");
      return;
    }
    const validation = hubContactValidationError(name, phone, email);
    if (validation) {
      setPrepared(false);
      setPrepareError(validation);
      return;
    }
    setPrepareError("");
    await hubPrepareAndSubmit(submit, {
      source: "camions-hub",
      type: "RENTAL",
      contactName: name.trim() || phone.trim(),
      contactPhone: phone.trim() || undefined,
      contactEmail: email.trim() || undefined,
      zone: place.trim() || zoneHint || undefined,
      message,
      payload: { ...fields, attachmentNote: fileName ? "Nom de fichier indiqué — pièce non transmise en ligne." : undefined },
      sourcePath: typeof window !== "undefined" ? window.location.pathname : undefined,
    });
    setPrepared(true);
  }, [named, name, phone, email, place, zoneHint, message, fields, fileName, submit]);

  const value: Ctx = {
    query, setQuery, group, category, missionFilter, capacityFilter, selectGroup, selectCategory, setMissionFilter, setCapacityFilter,
    resetFilters, runSearch, products,
    items, named, hasProduct, toggleProduct, setItemName, addRow, removeRow,
    quantity, setQuantity, description, setDescription, capacity, setCapacity,
    mission, missionSet, setMission, terrain, setTerrain, operator, setOperator, applyConfig, configApplied,
    place, setPlace, zoneHint, setZoneHint, start, setStart, periodHint, setPeriodHint, duration, setDuration, access, setAccess,
    services, toggleService, fileName, fileError, pickFile, name, setName, phone, setPhone, email, setEmail,
    fields, whatsappUrl, message, prepared, prepareError, reference, saveError, pending, prepare, scrollTo,
  };
  return <CmeCtx.Provider value={value}>{children}</CmeCtx.Provider>;
}
