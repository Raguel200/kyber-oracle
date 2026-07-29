# KYBER ORACLE

KYBER ORACLE est une machine de divination locale inspirée du tarot contemporain, des manuscrits hermétiques et des terminaux cybernétiques. Elle génère un triptyque de cartes — force dominante, obstacle caché et mutation nécessaire — à partir d’une seed reproductible. Aucun texte saisi ne quitte le navigateur.

## Installation et lancement

Prérequis : Node.js 22.13 ou plus récent.

```bash
npm install
npm run dev
```

L’application est ensuite disponible sur `http://localhost:3000`.

## Vérifications et build

```bash
npm test
npm run lint
npm run typecheck
npm run build
```

Le build de production est créé dans `dist/`.

## Architecture

- `app/components/` : interface, cartes et sigils procéduraux.
- `app/lib/corpus.ts` : corpus de 32 archétypes, planètes, éléments, affinités et conflits.
- `app/lib/engine.ts` : hash, PRNG déterministe, sélection pondérée, règles et scores.
- `app/lib/storage.ts` : validation, migration défensive et persistance locale.
- `tests/engine.test.ts` : tests du déterminisme, des verrous, des scores et de la restauration.

L’interface utilise React, TypeScript strict, Tailwind CSS, Framer Motion, Lucide React et `html-to-image`. Vinext fournit l’intégration Vite compatible avec l’hébergement Cloudflare Workers.

## Seed et moteur symbolique

Une seed est normalisée puis combinée avec le mode et la question. Le hash FNV-1a initialise un générateur Mulberry32. Chaque choix ultérieur consomme ce flux pseudo-aléatoire : archétype, planète, élément et intensité restent donc identiques pour les mêmes entrées.

La sélection n’est pas un assemblage uniforme. Les archétypes reçoivent un poids selon le mode ; les affinités planète/élément modifient l’intensité ; les conflits entre archétypes et les répétitions symboliques influencent quatre scores bornés entre 0 et 100 : tension, expansion, stabilité et mutation. La synthèse finale dépend du score dominant et des trois cartes.

Lors d’une relance partielle, les cartes verrouillées sont réinjectées intactes et exclues du nouveau tirage.

## Sigils

Chaque carte dérive une seed dédiée de la seed principale, de sa position et de son archétype. Le composant SVG combine polygones radiaux, cercles, axes bilatéraux, arcs, points satellites et rotations. Le tracé est animé, puis réduit au minimum si `prefers-reduced-motion` est actif.

## Stockage local

Les tirages sauvegardés sont stockés dans `localStorage` sous la clé `kyber-oracle:readings:v1`, avec un maximum de 50 entrées. Les données sont validées à la lecture ; une valeur ancienne, corrompue ou incompatible est ignorée proprement. L’utilisateur peut restaurer, supprimer individuellement ou vider l’archive après confirmation.

## Export PNG

`html-to-image` capture la zone du tirage à une densité 2× et déclenche un téléchargement local. Certains navigateurs très restrictifs peuvent bloquer le téléchargement ou manquer de mémoire sur un zoom élevé ; l’interface affiche alors une erreur exploitable.

## Déploiement

### Vercel

Importez le dépôt, conservez `npm run build` comme commande de build et utilisez `dist` comme répertoire de sortie si l’assistant de détection ne configure pas Vinext automatiquement.

### Netlify

Créez un site depuis le dépôt avec :

```text
Build command: npm run build
Publish directory: dist/client
```

Pour un hébergement strictement statique, une adaptation de la sortie Vinext peut être nécessaire. Le déploiement Cloudflare/Sites fourni par le projet conserve le rendu complet.

## Limites connues

- L’historique est propre au navigateur et n’est pas synchronisé entre appareils.
- L’effacement des données du site par le navigateur supprime l’archive.
- Le PNG dépend des capacités de rendu et de téléchargement du navigateur.
