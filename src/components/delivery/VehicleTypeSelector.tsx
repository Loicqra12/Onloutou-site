"use client";

import { useState } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { driverVehicleSection, type DriverVehicleId } from "@/content/driver-partner-page";

export function VehicleTypeSelector() {
  const data = driverVehicleSection;
  const [activeId, setActiveId] = useState<DriverVehicleId>(data.vehicles[0].id);
  const active = data.vehicles.find((v) => v.id === activeId) ?? data.vehicles[0];

  return (
    <section className="drv-vehicles section-spacing bg-brand-white" aria-labelledby="drv-vehicles-title">
      <div className="container-content">
        <Reveal>
          <h2 id="drv-vehicles-title" className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            {data.title}
          </h2>
          <p className="drv-vehicles__tag">{data.tag}</p>
        </Reveal>
        <div className="drv-vehicles__nav" role="tablist" aria-label="Moyens de transport">
          {data.vehicles.map((vehicle) => (
            <button
              key={vehicle.id}
              type="button"
              role="tab"
              id={`drv-vehicle-tab-${vehicle.id}`}
              aria-selected={activeId === vehicle.id}
              aria-controls={`drv-vehicle-panel-${vehicle.id}`}
              className={`drv-vehicles__tab${activeId === vehicle.id ? " drv-vehicles__tab--active" : ""}`}
              onClick={() => setActiveId(vehicle.id)}
            >
              {vehicle.label}
            </button>
          ))}
        </div>
        <div
          id={`drv-vehicle-panel-${active.id}`}
          role="tabpanel"
          aria-labelledby={`drv-vehicle-tab-${active.id}`}
          className="drv-vehicles__panel"
        >
          <p className="drv-vehicles__prepare-label">Informations à préparer</p>
          <ul>
            {active.prepare.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
