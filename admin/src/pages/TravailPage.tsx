import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch } from "../api";

type Overview = {
  tasks: { id: string; title: string; subtitle: string; href: string }[];
};

export function TravailPage() {
  const nav = useNavigate();
  const [tasks, setTasks] = useState<Overview["tasks"]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      const res = await apiFetch<Overview>("/admin/overview");
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          nav("/login", { replace: true });
          return;
        }
        setError(res.error);
        return;
      }
      setTasks(res.data.tasks);
    })();
  }, [nav]);

  return (
    <div className="as-page">
      <div className="as-crumb">
        <span>Pilotage / Mon travail</span>
      </div>
      <h1 className="as-h1">Mon travail</h1>
      <p className="as-lead">Dossiers qui vous sont affectés.</p>
      <section className="as-card">
        {error ? (
          <p className="as-error" role="alert">
            {error}
          </p>
        ) : null}
        {tasks.length === 0 && !error ? (
          <p className="as-empty">Aucun dossier ne vous est affecté pour le moment.</p>
        ) : (
          tasks.map((task) => (
            <Link className="as-task" key={task.id} to={task.href}>
              <i aria-hidden="true" />
              <span>
                <strong>{task.title}</strong>
                <span className="as-empty">{task.subtitle}</span>
              </span>
            </Link>
          ))
        )}
      </section>
    </div>
  );
}
