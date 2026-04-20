// ===== Utilisateur =====
export interface Utilisateur {
  id?: number;
  nom: string;
  prenom: string;
  email: string;
  motDePasse?: string;
  actif: boolean;
  profil?: Profil;
  role?: Role;
}

// ===== Profil =====
export interface Profil {
  idProfil?: number;
  nom: string;
  description?: string;
  vues?: Vue[];
}

// ===== Role =====
export interface Role {
  idRole?: number;
  nom: string;
  magasins?: Magasin[];
}

// ===== Vue =====
export interface Vue {
  id?: number;
  nom: string;
  url: string;
}

// ===== Magasin =====
export interface Magasin {
  id?: number;
  code: string;
  nom: string;
  type: string;
}

// ===== FichierImport =====
export interface FichierImport {
  id?: number;
  nomFichier: string;
  dateImport?: string;
  statut: string;
  utilisateur?: Utilisateur;
  lignes?: LigneFichier[];
}

// ===== LigneFichier =====
export interface LigneFichier {
  id?: number;
  numeroLigne: number;
  donnees: string;
  statutValidation: string;
  messageErreur?: string;
}

// ===== Produit =====
export interface Produit {
  id?: number;
  nom: string;
  reference: string;
  categorie?: string;
  unite?: string;
  prixUnitaire?: number;
  stockActuel: number;
  seuilAlerte: number;
  magasin?: Magasin;
  statutStock?: string; // RUPTURE, CRITIQUE, OK
}

// ===== Vente =====
export interface Vente {
  id?: number;
  produit?: Produit;
  magasin?: Magasin;
  quantite: number;
  montantTotal?: number;
  dateVente?: string;
}

// ===== StockMouvement =====
export interface StockMouvement {
  id?: number;
  produit?: Produit;
  magasinSource?: Magasin;
  magasinDest?: Magasin;
  quantite: number;
  type: string; // ENTREE, SORTIE, TRANSFERT
  dateMouvement?: string;
  motif?: string;
}

// ===== KPI Dashboard =====
export interface KpiMagasin {
  caTotal: number;
  caJour: number;
  caMois: number;
  nombreVentes: number;
}