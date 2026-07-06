// Forme des données de portfolio — importée par chaque univers pour l'auto-complétion
// et la vérification de types. Le contenu réel vit dans portfolio.json.
export interface Social {
  label: string;
  handle: string;
  url: string;
}

export interface Project {
  title: string;
  year: string;
  role: string;
  description: string;
  tags: string[];
  url: string;
}

export interface Portfolio {
  name: string;
  role: string;
  tagline: string;
  location: string;
  email: string;
  available: boolean;
  about: string;
  socials: Social[];
  projects: Project[];
  skills: string[];
}
