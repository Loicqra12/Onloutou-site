import { Navigate, Route, Routes } from "react-router-dom";
import { AdminShell } from "./components/AdminShell";
import { ClientsPage } from "./pages/ClientsPage";
import { ComingSoonPage } from "./pages/ComingSoonPage";
import { CreateDossierPage } from "./pages/CreateDossierPage";
import { DepositsPage } from "./pages/DepositsPage";
import { DossierDetailPage } from "./pages/DossierDetailPage";
import { DossiersPage } from "./pages/DossiersPage";
import { DriversPage } from "./pages/DriversPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { HomePage } from "./pages/HomePage";
import { InvoicesPage } from "./pages/InvoicesPage";
import { JournalPage } from "./pages/JournalPage";
import { LoginPage } from "./pages/LoginPage";
import { PartnersPage } from "./pages/PartnersPage";
import { PaymentsPage } from "./pages/PaymentsPage";
import { PayoutsPage } from "./pages/PayoutsPage";
import { ArticleDetailPage } from "./pages/ArticleDetailPage";
import { ArticlesPage } from "./pages/ArticlesPage";
import { EntretienPage } from "./pages/EntretienPage";
import { ParcPage } from "./pages/ParcPage";
import { ReportsPage } from "./pages/ReportsPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import { SettingsPage } from "./pages/SettingsPage";
import { TeamPage } from "./pages/TeamPage";
import { TravailPage } from "./pages/TravailPage";
import { VerifyPage } from "./pages/VerifyPage";

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/verification" element={<VerifyPage />} />
      <Route path="/mot-de-passe" element={<ForgotPasswordPage />} />
      <Route path="/mot-de-passe/nouveau" element={<ResetPasswordPage />} />
      <Route element={<AdminShell />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/travail" element={<TravailPage />} />
        <Route path="/dossiers" element={<DossiersPage />} />
        <Route path="/dossiers/nouveau" element={<CreateDossierPage />} />
        <Route path="/dossiers/:id" element={<DossierDetailPage />} />
        <Route path="/demandes" element={<Navigate to="/dossiers" replace />} />
        <Route path="/articles" element={<ArticlesPage />} />
        <Route path="/articles/:id" element={<ArticleDetailPage />} />
        <Route path="/parc" element={<ParcPage />} />
        <Route path="/entretien" element={<EntretienPage />} />
        <Route path="/produits" element={<Navigate to="/articles" replace />} />
        <Route path="/clients" element={<ClientsPage />} />
        <Route path="/partenaires" element={<PartnersPage />} />
        <Route path="/candidatures" element={<Navigate to="/partenaires" replace />} />
        <Route path="/livreurs" element={<DriversPage />} />
        <Route path="/paiements" element={<PaymentsPage />} />
        <Route path="/depots-garantie" element={<DepositsPage />} />
        <Route path="/reversements" element={<PayoutsPage />} />
        <Route path="/facturation" element={<InvoicesPage />} />
        <Route path="/equipe" element={<TeamPage />} />
        <Route path="/parametres" element={<SettingsPage />} />
        <Route path="/rapports" element={<ReportsPage />} />
        <Route path="/journal" element={<JournalPage />} />
        <Route path="/cautions" element={<Navigate to="/depots-garantie" replace />} />
        <Route path="*" element={<ComingSoonPage />} />
      </Route>
    </Routes>
  );
}
