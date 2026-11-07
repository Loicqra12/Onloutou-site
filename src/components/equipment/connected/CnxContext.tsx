"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import {
  buildCnxMessage,
  cnxAssetLabel,
  cnxDevicesSection,
  cnxIds,
  cnxInfosOptions,
  cnxInstalledOptions,
  cnxWhatsappUrl,
  type CnxAssetId,
  type CnxDeviceId,
  type CnxInstalledId,
  type CnxRequestFields,
} from "@/content/connected-hub";
import { hubContactValidationError, hubPrepareAndSubmit } from "@/lib/forms/hubPrepare";
import { useHubRequestSubmit } from "@/lib/forms/serviceRequest";

type Ctx = {
  asset: CnxAssetId | "";
  setAsset: (a: CnxAssetId | "") => void;
  config: CnxDeviceId | "";
  quantity: string;
  setQuantity: (v: string) => void;
  zone: string;
  setZone: (v: string) => void;
  power: string;
  setPower: (v: string) => void;
  installed: CnxInstalledId | "";
  setInstalled: (v: CnxInstalledId | "") => void;
  infos: string[];
  toggleInfo: (id: string) => void;
  needs: string;
  setNeeds: (v: string) => void;
  name: string;
  setName: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  fields: CnxRequestFields;
  whatsappUrl: string;
  message: string;
  prepared: boolean;
  prepareError: string;
  reference: string | null;
  saveError: string | null;
  pending: boolean;
  prepare: () => Promise<void>;
  chooseDevice: (d: CnxDeviceId) => void;
  haveEquipment: () => void;
  scrollTo: (id: string) => void;
};

const CnxCtx = createContext<Ctx | null>(null);

export function useCnx() {
  const v = useContext(CnxCtx);
  if (!v) throw new Error("useCnx doit être utilisé dans <CnxProvider>");
  return v;
}

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  if (window.location.hash !== `#${id}`) window.history.replaceState(null, "", `#${id}`);
}

export function CnxProvider({ children }: { children: ReactNode }) {
  const [asset, setAssetState] = useState<CnxAssetId | "">("");
  const [config, setConfig] = useState<CnxDeviceId | "">("");
  const [quantity, setQuantity] = useState("");
  const [zone, setZone] = useState("");
  const [power, setPower] = useState("");
  const [installed, setInstalledState] = useState<CnxInstalledId | "">("");
  const [infos, setInfos] = useState<string[]>([]);
  const [needs, setNeeds] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [prepared, setPrepared] = useState(false);
  const [prepareError, setPrepareError] = useState("");
  const { reference, saveError, pending, submit } = useHubRequestSubmit();

  const setAsset = useCallback((a: CnxAssetId | "") => {
    setAssetState(a);
    setConfig("");
    setPrepared(false);
  }, []);
  const setInstalled = useCallback((v: CnxInstalledId | "") => {
    setInstalledState(v);
    setPrepared(false);
  }, []);
  const chooseDevice = useCallback((d: CnxDeviceId) => {
    const card = cnxDevicesSection.cards.find((c) => c.id === d)!;
    setAssetState(card.asset);
    setConfig(d);
    setPrepared(false);
    scrollToId(cnxIds.form);
  }, []);
  const haveEquipment = useCallback(() => {
    setInstalled("oui");
    scrollToId(cnxIds.form);
  }, [setInstalled]);
  const toggleInfo = useCallback((id: string) => {
    setPrepared(false);
    setInfos((cur) => (cur.includes(id) ? cur.filter((s) => s !== id) : [...cur, id]));
  }, []);
  const scrollTo = useCallback((id: string) => scrollToId(id), []);

  const fields: CnxRequestFields = useMemo(
    () => ({
      config: config ? cnxDevicesSection.cards.find((c) => c.id === config)!.title : "",
      asset: asset ? cnxAssetLabel(asset) : "",
      quantity: quantity.trim(),
      zone: zone.trim(),
      power,
      installed: cnxInstalledOptions.find((o) => o.id === installed)?.label ?? "",
      infos: cnxInfosOptions.filter((o) => infos.includes(o.id)).map((o) => o.label),
      needs: needs.trim(),
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
    }),
    [config, asset, quantity, zone, power, installed, infos, needs, name, phone, email],
  );
  const whatsappUrl = useMemo(() => cnxWhatsappUrl(fields), [fields]);
  const message = useMemo(() => buildCnxMessage(fields), [fields]);

  const prepare = useCallback(async () => {
    const validation = hubContactValidationError(name, phone, email);
    if (validation) {
      setPrepared(false);
      setPrepareError(validation);
      return;
    }
    setPrepareError("");
    await hubPrepareAndSubmit(submit, {
      source: "connectes-hub",
      type: "PRODUCT",
      contactName: name.trim() || phone.trim(),
      contactPhone: phone.trim() || undefined,
      contactEmail: email.trim() || undefined,
      zone: zone.trim() || undefined,
      message,
      payload: fields as unknown as Record<string, unknown>,
      sourcePath: typeof window !== "undefined" ? window.location.pathname : undefined,
    });
    setPrepared(true);
  }, [name, phone, email, zone, message, fields, submit]);

  const value: Ctx = {
    asset, setAsset, config, quantity, setQuantity, zone, setZone, power, setPower, installed, setInstalled,
    infos, toggleInfo, needs, setNeeds, name, setName, phone, setPhone, email, setEmail,
    fields, whatsappUrl, message, prepared, prepareError, reference, saveError, pending, prepare, chooseDevice, haveEquipment, scrollTo,
  };
  return <CnxCtx.Provider value={value}>{children}</CnxCtx.Provider>;
}
