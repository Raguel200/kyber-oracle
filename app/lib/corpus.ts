import type { Archetype, Element, Planet } from "./types";

export const PLANETS: Planet[] = ["Soleil", "Lune", "Mercure", "Vénus", "Mars", "Jupiter", "Saturne"];
export const ELEMENTS: Element[] = ["Feu", "Eau", "Air", "Terre", "Éther"];

export const PLANET_AFFINITIES: Record<Planet, Element[]> = {
  Soleil: ["Feu", "Éther"],
  Lune: ["Eau", "Éther"],
  Mercure: ["Air", "Terre"],
  Vénus: ["Eau", "Terre"],
  Mars: ["Feu", "Terre"],
  Jupiter: ["Air", "Feu"],
  Saturne: ["Terre", "Éther"],
};

const a = (
  id: string,
  name: string,
  number: string,
  planets: Archetype["planets"],
  elements: Archetype["elements"],
  polarity: Archetype["polarity"],
  baseIntensity: number,
  oracle: string,
  interpretation: string,
  action: string,
  conflicts: string | string[],
  tags: string[],
): Archetype => ({
  id, name, number, planets, elements, polarity, baseIntensity, oracle, interpretation, action,
  conflicts: Array.isArray(conflicts) ? conflicts : conflicts.split(",").filter(Boolean),
  tags,
});

export const ARCHETYPES: Archetype[] = [
  a("roi-inverse","Le Roi Inversé","I·R",["Saturne","Soleil"],["Terre","Feu"],"Descendante",4,"Le commandement se fissure là où personne n’osait regarder.","Une structure d’autorité a perdu sa légitimité. La force revient à ce qui accepte de rendre des comptes.","Retire un pouvoir implicite de ton système et nomme clairement qui décide.","couronne-vide,ange-fer",["pouvoir","décision"]),
  a("machine-veuve","La Machine Veuve","0x02",["Mercure","Saturne"],["Air","Terre"],"Descendante",4,"Le système continue de tourner après la disparition de sa raison d’être.","Un automatisme survivant absorbe de l’énergie sans produire de sens.","Désactive pendant vingt-quatre heures un processus que personne ne questionne.","soleil-captif,fleuve-vertical",["système","projet"]),
  a("miroir-noir","Le Miroir Noir","III·N",["Lune","Mercure"],["Eau","Éther"],"Liminale",3,"Ce que l’écran refuse de montrer façonne pourtant la réponse.","La perception est filtrée par une peur ou une hypothèse non examinée.","Écris l’hypothèse la plus inconfortable, puis cherche une preuve qui pourrait l’invalider.","temoin-fossile,main-interdite",["vérité","intuition"]),
  a("architecte-affame","L’Architecte Affamé","IV·A",["Jupiter","Saturne"],["Terre","Air"],"Ascendante",5,"Le plan dévore le territoire qu’il prétend servir.","L’ambition structurelle dépasse les ressources et transforme l’élégance en dette.","Supprime une couche, une règle ou un livrable avant d’ajouter quoi que ce soit.","porte-sans-mur,fleuve-vertical",["projet","expansion"]),
  a("porte-sans-mur","La Porte sans Mur","V·Ø",["Mercure","Jupiter"],["Air","Éther"],"Liminale",2,"Le passage existe déjà ; seule l’habitude réclame une clé.","Une contrainte supposée n’est peut-être qu’une convention héritée.","Teste aujourd’hui le chemin direct que tu avais écarté sans preuve.","architecte-affame,chien-saturne",["opportunité","mutation"]),
  a("chien-saturne","Le Chien de Saturne","VI·S",["Saturne","Mars"],["Terre","Feu"],"Descendante",5,"Le gardien mord d’abord ce qui veut grandir trop vite.","La résistance protège une limite réelle, même si sa forme paraît hostile.","Définis la limite non négociable avant de poursuivre l’expansion.","porte-sans-mur,soleil-captif",["limite","stabilité"]),
  a("couronne-vide","La Couronne Vide","VII·V",["Soleil","Saturne"],["Éther","Terre"],"Liminale",3,"Le centre est libre parce que le titre ne suffit plus.","L’identité officielle se vide et permet une autorité plus distribuée.","Délègue une décision visible et conserve seulement le principe directeur.","roi-inverse,main-interdite",["pouvoir","mutation"]),
  a("temoin-fossile","Le Témoin Fossile","VIII·F",["Lune","Saturne"],["Terre","Eau"],"Descendante",2,"Une ancienne preuve exige encore d’être crue.","Le passé fournit des données, mais son contexte n’existe plus.","Archive un indicateur historique qui gouverne encore ton jugement.","miroir-noir,enfant-radar",["mémoire","stabilité"]),
  a("soleil-captif","Le Soleil Captif","IX·C",["Soleil","Saturne"],["Feu","Terre"],"Descendante",4,"La lumière enfermée devient chaleur, puis pression.","Une énergie créative retenue commence à déformer le système.","Publie une version imparfaite ou partage le travail avec une personne précise.","machine-veuve,chien-saturne",["création","pression"]),
  a("ange-fer","L’Ange de Fer","X·Fe",["Mars","Soleil"],["Feu","Air"],"Ascendante",5,"La protection devient destin quand elle oublie de s’ouvrir.","La discipline est puissante, mais elle rigidifie ce qu’elle défend.","Transforme une interdiction absolue en règle mesurable et révisable.","roi-inverse,serpent-verre",["discipline","conflit"]),
  a("fleuve-vertical","Le Fleuve Vertical","XI·↑",["Lune","Jupiter"],["Eau","Air"],"Ascendante",4,"Ce qui devait descendre apprend soudain à gravir.","Le mouvement contredit la gravité habituelle : une inversion de flux devient possible.","Inverse l’ordre d’une séquence et observe où l’effort diminue.","machine-veuve,architecte-affame",["flux","innovation"]),
  a("main-interdite","La Main Interdite","XII·M",["Mars","Mercure"],["Feu","Éther"],"Liminale",4,"Le geste défendu contient la forme exacte du changement.","Une capacité refoulée cherche une expression éthique et contrôlée.","Formule la version sûre de l’action que tu n’oses pas accomplir.","miroir-noir,couronne-vide",["action","tabou"]),
  a("bibliotheque-cendres","La Bibliothèque de Cendres","XIII·B",["Mercure","Saturne"],["Air","Feu"],"Descendante",3,"Le savoir brûlé éclaire encore la pièce.","Une perte contient une méthode transmissible si elle est nommée sans nostalgie.","Écris trois leçons utilisables issues d’un échec récent.","horloge-aveugle",["savoir","mémoire"]),
  a("enfant-radar","L’Enfant Radar","XIV·R",["Lune","Mercure"],["Air","Eau"],"Ascendante",2,"Le signal faible arrive avant son langage.","Une intuition précoce détecte une tendance que les métriques ignorent.","Note le signal le plus fragile et définis une observation qui le confirmerait.","temoin-fossile",["intuition","signal"]),
  a("serpent-verre","Le Serpent de Verre","XV·G",["Vénus","Mercure"],["Eau","Air"],"Liminale",3,"La transparence peut être une autre manière de se cacher.","Une élégance séduisante dissimule une fragilité systémique.","Demande à quelqu’un de casser volontairement ton scénario idéal.","ange-fer",["risque","apparence"]),
  a("horloge-aveugle","L’Horloge Aveugle","XVI·H",["Saturne","Mercure"],["Terre","Air"],"Descendante",4,"Le délai mesure tout sauf le moment juste.","Le calendrier impose son rythme à une réalité qui a changé.","Renégocie une échéance en fonction du risque, pas de l’habitude.","bibliotheque-cendres,comete-clouee",["temps","projet"]),
  a("comete-clouee","La Comète Clouée","XVII·K",["Jupiter","Mars"],["Feu","Éther"],"Descendante",5,"L’élan immobilisé invente une violence intérieure.","Une vision expansive est bloquée par une dépendance ou un engagement obsolète.","Identifie le seul verrou externe et contacte aujourd’hui son détenteur.","horloge-aveugle,puits-antennes",["élan","blocage"]),
  a("jardin-electrique","Le Jardin Électrique","XVIII·E",["Vénus","Jupiter"],["Terre","Air"],"Ascendante",3,"Les connexions cultivées produisent une énergie que nul ne possède.","La croissance vient de relations entretenues, non d’une optimisation solitaire.","Nourris une collaboration existante par une contribution sans contrepartie.","moine-circuit",["relation","expansion"]),
  a("moine-circuit","Le Moine Circuit","XIX·Ω",["Mercure","Saturne"],["Air","Éther"],"Ascendante",2,"La répétition consciente transforme le bruit en voie.","Une pratique minimale et régulière vaut mieux qu’une refonte spectaculaire.","Répète le geste essentiel pendant sept jours sans en modifier le protocole.","jardin-electrique,nuage-plomb",["discipline","signal"]),
  a("tourbiere-memoire","La Tourbière Mémoire","XX·T",["Lune","Vénus"],["Eau","Terre"],"Descendante",3,"Ce qui s’enfonce conserve une forme que la surface oublie.","Une émotion ancienne ralentit le présent tout en préservant une information utile.","Nomme ce qui doit être honoré avant de pouvoir être abandonné.","lame-horizon",["mémoire","émotion"]),
  a("lame-horizon","La Lame d’Horizon","XXI·L",["Mars","Soleil"],["Air","Feu"],"Ascendante",4,"Une limite nette rend l’avenir visible.","Le discernement exige une coupe franche entre deux directions incompatibles.","Élimine une option afin de rendre l’autre réellement praticable.","tourbiere-memoire,oracle-muet",["décision","clarté"]),
  a("oracle-muet","L’Oracle Muet","XXII·…",["Lune","Saturne"],["Éther","Eau"],"Liminale",1,"L’absence de réponse est une donnée, pas un vide.","Le système manque d’information ou refuse un cadrage prématuré.","Attends un cycle, mais fixe dès maintenant la condition qui déclenchera l’action.","lame-horizon",["attente","intuition"]),
  a("ruche-souterraine","La Ruche Souterraine","XXIII·R",["Vénus","Saturne"],["Terre","Éther"],"Ascendante",3,"Sous le silence, le collectif construit déjà.","Des contributions invisibles convergent sans centre officiel.","Cartographie les acteurs informels et rends une contribution visible.","antenne-sans-ciel",["collectif","système"]),
  a("antenne-sans-ciel","L’Antenne sans Ciel","XXIV·A",["Mercure","Jupiter"],["Air","Éther"],"Descendante",3,"Le récepteur parfait ne reçoit rien quand il oublie son milieu.","La recherche de signal s’est détachée des usages et des personnes réelles.","Observe un utilisateur réel avant de modifier le système.","ruche-souterraine,puits-antennes",["signal","projet"]),
  a("saint-algorithme","Le Saint Algorithme","XXV·Σ",["Mercure","Soleil"],["Air","Feu"],"Ascendante",4,"La règle devient idole dès qu’elle échappe à la contestation.","Une méthode efficace est confondue avec une vérité universelle.","Documente un cas où ta règle favorite doit être ignorée.","peau-protocole",["système","pouvoir"]),
  a("peau-protocole","La Peau du Protocole","XXVI·P",["Vénus","Saturne"],["Terre","Eau"],"Liminale",3,"L’interface est une frontière vivante, pas une décoration.","La forme de l’échange modifie ce qu’il devient possible de dire ou faire.","Réécris une règle du point de vue de la personne qui la subit.","saint-algorithme",["interface","relation"]),
  a("puits-antennes","Le Puits d’Antennes","XXVII·W",["Lune","Mercure"],["Eau","Air"],"Descendante",4,"Tous les signaux descendent vers un centre qui ne répond plus.","L’accumulation d’informations remplace la décision et crée une dette d’attention.","Supprime une source de données et décide avec le signal restant.","comete-clouee,antenne-sans-ciel",["signal","décision"]),
  a("cavalier-neon","Le Cavalier Néon","XXVIII·N",["Mars","Jupiter"],["Feu","Air"],"Ascendante",5,"La vitesse révèle le chemin tout en effaçant les panneaux.","L’impulsion ouvre une fenêtre rare, mais réduit la capacité de correction.","Lance une expérience réversible avec une limite de temps stricte.","nuage-plomb",["action","expansion"]),
  a("nuage-plomb","Le Nuage de Plomb","XXIX·Pb",["Saturne","Lune"],["Air","Terre"],"Descendante",4,"La lourdeur flotte parce que personne ne la nomme.","Une inquiétude diffuse ralentit chaque décision sans devenir un risque explicite.","Transforme l’appréhension en liste de trois risques chiffrés.","cavalier-neon,moine-circuit",["risque","pression"]),
  a("chambre-echo","La Chambre d’Écho Zéro","XXX·0",["Mercure","Vénus"],["Air","Éther"],"Liminale",2,"La première voix entendue n’est peut-être pas la tienne.","Le consensus apparent provient d’une boucle de répétition.","Cherche un avis indépendant hors de ton cercle habituel.","jardin-electrique",["vérité","collectif"]),
  a("phare-interieur","Le Phare Intérieur","XXXI·Φ",["Soleil","Lune"],["Feu","Eau"],"Ascendante",3,"La direction la plus fiable éclaire d’abord le dedans.","Une valeur stable peut orienter la décision malgré l’incertitude externe.","Choisis une valeur non négociable et évalue chaque option contre elle.","miroir-noir",["clarté","décision"]),
  a("tombeau-futur","Le Tombeau du Futur","XXXII·†",["Saturne","Jupiter"],["Terre","Éther"],"Liminale",5,"Certains futurs doivent mourir pour rendre le présent habitable.","Une projection séduisante occupe trop d’espace et empêche l’apprentissage.","Abandonne publiquement une promesse devenue irréaliste.","architecte-affame",["mutation","projet"]),
];
