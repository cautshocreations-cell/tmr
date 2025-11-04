# 📋 CHECKLIST : Ce que vous devez faire MAINTENANT

## 🎯 ÉTAPE IMMÉDIATE (à faire aujourd'hui)

### 1. 🛒 COMMANDER L'HÉBERGEMENT
- [ ] Aller sur : https://www.ovh.com/fr/hebergement-web/
- [ ] Choisir "Hébergement Pro" (pour Node.js)
- [ ] Acheter un domaine OU utiliser un existant
- [ ] ✅ Cocher : SSL Let's Encrypt (gratuit)
- [ ] ✅ Cocher : Base de données PostgreSQL
- [ ] Finaliser la commande (environ 10-20€ pour commencer)

### 2. 📧 APRÈS LA COMMANDE
- [ ] Vérifier vos emails pour les identifiants OVH
- [ ] Noter précieusement :
  - Login espace client
  - Mot de passe espace client
  - Informations FTP (arriveront par email)
- [ ] Se connecter à : https://www.ovh.com/manager/

---

## ⏰ ÉTAPES SUIVANTES (dans les 24-48h après commande)

### 3. 🔧 CONFIGURATION BASE DE DONNÉES
Une fois l'hébergement activé :
- [ ] Créer la base PostgreSQL dans l'espace client
- [ ] Noter les informations de connexion :
  ```
  Serveur : postgresql-XXX.ovh.net
  Base : codex_rp  
  User : votre_login
  Password : MotDePasseSécurisé123!
  ```

### 4. 📝 MODIFIER VOTRE .ENV
- [ ] Copier `.env.example` vers `.env`
- [ ] Remplacer les valeurs avec celles d'OVH
- [ ] Générer des clés secrètes sur : https://www.allkeysgenerator.com/

### 5. 🚀 ACTIVER NODE.JS
Dans l'espace client OVH :
- [ ] Hébergements Web → Multisite
- [ ] Modifier votre domaine
- [ ] Runtime : Node.js 18+
- [ ] Point d'entrée : `src/server/app.js`

### 6. 📁 UPLOADER LES FICHIERS
- [ ] Télécharger FileZilla
- [ ] Connecter avec les infos FTP d'OVH
- [ ] Uploader TOUT sauf `node_modules/` et `.git/`

### 7. 🗄️ CONFIGURER LA BASE
Via SSH ou interface OVH :
- [ ] `npm install --production`
- [ ] `npm run setup-db`

### 8. ✅ TESTER
- [ ] Visiter votre site : https://votre-domaine.fr
- [ ] Tester l'interface admin
- [ ] Créer un type de règlement
- [ ] Créer un règlement

---

## 💡 QUESTIONS FRÉQUENTES

### "Quel hébergement choisir ?"
**Réponse :** Hébergement Pro (environ 10€/mois) - Il inclut Node.js et PostgreSQL.

### "J'ai déjà un domaine ailleurs"
**Réponse :** Pas de problème ! Vous pouvez :
1. Transférer le domaine chez OVH, OU
2. Juste pointer votre domaine vers l'IP OVH

### "Je ne comprends pas SSH/FTP"
**Réponse :** 
- **FTP** = Comme copier des fichiers sur une clé USB, mais vers le serveur
- **SSH** = Comme ouvrir l'invite de commande, mais sur le serveur
- FileZilla pour FTP est très visuel et simple

### "Combien ça coûte ?"
**Réponse :**
- Hébergement Pro : ~10€/mois
- Domaine : ~10€/an
- SSL : Gratuit
- **Total : ~15€/mois tout compris**

### "Et si ça ne marche pas ?"
**Réponse :**
- Support OVH gratuit par téléphone : 1007
- Je peux vous aider via les logs d'erreur
- La communauté OVH est très active

---

## 🎯 PAR OÙ COMMENCER ?

### MAINTENANT (5 minutes) :
1. **Allez sur** https://www.ovh.com/fr/hebergement-web/
2. **Choisissez** "Hébergement Pro"
3. **Commandez** (vous pouvez toujours annuler dans les 14 jours)

### ENSUITE :
Suivez le guide détaillé dans `GUIDE-DETAILLE-OVH.md` étape par étape.

---

## 📞 AIDE

- **Questions ?** Regardez `GUIDE-DETAILLE-OVH.md`
- **Bloqué ?** Support OVH au 1007
- **Technique ?** Je peux vous aider avec les logs

🚀 **C'EST PARTI ! Dans quelques heures votre site sera en ligne !**