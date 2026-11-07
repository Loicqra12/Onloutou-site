"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import {
  buildTemMessage,
  temCategoryById,
  temFilterProducts,
  temWhatsappUrl,
  temForm,
  type TemCategoryId,
  type TemEnergyId,
  type TemFamilyId,
  type TemProduct,
  type TemRequestFields,
  type TemUsageId,
} from "@/content/tools-hub";
import { hubContactValidationError, hubPrepareAndSubmit } from "@/lib/forms/hubPrepare";
import { useHubRequestSubmit } from "@/lib/forms/serviceRequest";

export type TemItem = { key: number; productId?: string; name: string };

type Ctx = {
  // recherche et filtres
  query: string;
  setQuery: (v: string) => void;
  city: string;
  setCity: (v: string) => void;
  family: TemFamilyId;
  category: TemCategoryId | null;
  usage: TemUsageId | "";
  setUsage: (v: TemUsageId | "") => void;
  energy: TemEnergyId | "";
  setEnergy: (v: TemEnergyId | "") => void;
  selectFamily: (id: TemFamilyId) => void;
  selectCategory: (id: TemCategoryId) => void;
  resetFilters: () => void;
  runSearch: () => void;
  products: TemProduct[];
  // comparaison
  compared: string[];
  toggleCompare: (id: string) => void;
  clearCompare: () => void;
  // demande
  items: TemItem[];
  named: TemItem[];
  hasProduct: (id: string) => boolean;
  toggleProduct: (p: TemProduct) => void;
  setItemName: (key: number, name: string) => void;
  addRow: () => number;
  removeRow: (key: number) => void;
  // projet
  zone: string;
  setZone: (v: string) => void;
  start: string;
  setStart: (v: string) => void;
  end: string;
  setEnd: (v: string) => void;
  quantity: number;
  setQuantity: (v: number) => void;
  usageText: string;
  setUsageText: (v: string) => void;
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
  profile: string;
  setProfile: (v: string) => void;
  // sortie
  fields: TemRequestFields;
  whatsappUrl: string;
  prepared: boolean;
  message: string;
  prepareError: string;
  reference: string | null;
  saveError: string | null;
  pending: boolean;
  prepare: () => Promise<void>;
  scrollTo: (id: string) => void;
};

const TemCtx = createContext<Ctx | null>(null);

export function useTem() {
  const v = useContext(TemCtx);
  if (!v) throw new Error("useTem doit être utilisé dans <TemProvider>");
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

export function TemProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("Abidjan");
  const [family, setFamily] = useState<TemFamilyId>("energie");
  const [category, setCategory] = useState<TemCategoryId | null>(null);
  const [usage, setUsage] = useState<TemUsageId | "">("chantier");
  const [energy, setEnergy] = useState<TemEnergyId | "">("");
  const [compared, setCompared] = useState<string[]>([]);
  const keyRef = useRef(1);
  const [items, setItems] = useState<TemItem[]>([{ key: 0, name: "" }]);
  const [zone, setZone] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [quantity, setQuantityState] = useState(1);
  const [usageText, setUsageText] = useState("");
  const [services, setServices] = useState<string[]>([]);
  const [fileName, setFileName] = useState("");
  const [fileError, setFileError] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [profile, setProfile] = useState("particulier");
  const [prepared, setPrepared] = useState(false);
  const [prepareError, setPrepareError] = useState("");
  const { reference, saveError, pending, submit } = useHubRequestSubmit();

  const products = useMemo(
    () => temFilterProducts({ query, family, category, usage, energy }),
    [query, family, category, usage, energy],
  );

  // Si la sélection de famille ne contient rien avec l'usage courant, on retire l'usage.
  const relaxUsage = useCallback(
    (nextFamily: TemFamilyId, nextCategory: TemCategoryId | null) => {
      if (!usage) return;
      const any = temFilterProducts({ query: "", family: nextFamily, category: nextCategory, usage, energy });
      if (any.length === 0) setUsage("");
    },
    [usage, energy],
  );

  const selectFamily = useCallback(
    (id: TemFamilyId) => {
      relaxUsage(id, null);
      setFamily(id);
      setCategory(null);
      setQuery("");
    },
    [relaxUsage],
  );

  const selectCategory = useCallback(
    (id: TemCategoryId) => {
      const fam = temCategoryById(id).family;
      relaxUsage(fam, id);
      setFamily(fam);
      setCategory(id);
      setQuery("");
      setEnergy("");
    },
    [relaxUsage],
  );

  const resetFilters = useCallback(() => {
    setQuery("");
    setUsage("");
    setEnergy("");
    setCategory(null);
  }, []);

  const scrollTo = useCallback((id: string) => scrollToId(id), []);

  const runSearch = useCallback(() => {
    setCategory(null);
    scrollToId("familles-materiels");
  }, []);

  const toggleCompare = useCallback((id: string) => {
    setCompared((c) => (c.includes(id) ? c.filter((x) => x !== id) : c.length >= 3 ? c : [...c, id]));
  }, []);

  const named = useMemo(() => items.filter((i) => i.name.trim()), [items]);
  const hasProduct = useCallback((id: string) => items.some((i) => i.productId === id), [items]);

  const toggleProduct = useCallback((p: TemProduct) => {
    setPrepared(false);
    setItems((cur) => {
      if (cur.some((i) => i.productId === p.id)) {
        const next = cur.filter((i) => i.productId !== p.id);
        return next.length ? next : [{ key: keyRef.current++, name: "" }];
      }
      const blank = cur.findIndex((i) => !i.name.trim() && !i.productId);
      if (blank >= 0) return cur.map((i, idx) => (idx === blank ? { ...i, productId: p.id, name: p.name } : i));
      return [...cur, { key: keyRef.current++, productId: p.id, name: p.name }];
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
    setItems((cur) => {
      const next = cur.filter((i) => i.key !== key);
      return next.length ? next : [{ key: keyRef.current++, name: "" }];
    });
  }, []);

  const setQuantity = useCallback((v: number) => setQuantityState(Math.min(99, Math.max(1, Math.round(v) || 1))), []);
  const toggleService = useCallback((id: string) => {
    setServices((cur) => (cur.includes(id) ? cur.filter((s) => s !== id) : [...cur, id]));
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
    if (file.size > temForm.maxFileBytes) {
      setFileName("");
      setFileError("Fichier trop volumineux (10 Mo maximum).");
      return;
    }
    setFileName(file.name);
  }, []);

  const fields: TemRequestFields = useMemo(
    () => ({
      items: named.map((i) => i.name.trim()),
      quantity,
      place: zone.trim() || city,
      start: fmtDate(start),
      end: fmtDate(end),
      usage: usageText.trim(),
      services: temForm.services.filter((s) => services.includes(s.id)).map((s) => s.label),
      fileName,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      profile: temForm.profiles.find((p) => p.id === profile)?.label ?? "Particulier",
    }),
    [named, quantity, zone, city, start, end, usageText, services, fileName, name, phone, email, profile],
  );

  const whatsappUrl = useMemo(() => temWhatsappUrl(fields), [fields]);
  const message = useMemo(() => buildTemMessage(fields), [fields]);

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
      source: "outils-hub",
      type: "EQUIPMENT_CATALOG",
      contactName: name.trim() || phone.trim(),
      contactPhone: phone.trim() || undefined,
      contactEmail: email.trim() || undefined,
      zone: zone.trim() || city || undefined,
      message,
      payload: { ...fields, attachmentNote: fileName ? "Nom de fichier indiqué — pièce non transmise en ligne." : undefined },
      sourcePath: typeof window !== "undefined" ? window.location.pathname : undefined,
    });
    setPrepared(true);
  }, [named, name, phone, email, zone, city, message, fields, fileName, submit]);

  const value: Ctx = {
    query, setQuery, city, setCity, family, category, usage, setUsage, energy, setEnergy,
    selectFamily, selectCategory, resetFilters, runSearch, products,
    compared, toggleCompare, clearCompare: () => setCompared([]),
    items, named, hasProduct, toggleProduct, setItemName, addRow, removeRow,
    zone, setZone, start, setStart, end, setEnd, quantity, setQuantity, usageText, setUsageText,
    services, toggleService, fileName, fileError, pickFile, name, setName, phone, setPhone, email, setEmail, profile, setProfile,
    fields, whatsappUrl, message, prepared, prepareError, reference, saveError, pending, prepare, scrollTo,
  };
  return <TemCtx.Provider value={value}>{children}</TemCtx.Provider>;
}
