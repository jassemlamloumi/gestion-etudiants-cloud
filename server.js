require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

// Connexion à MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connexion MongoDB réussie'))
  .catch(err => console.error('Erreur MongoDB :', err));

// Modèle Etudiant
const Etudiant = mongoose.model('Etudiant', {
  nom: String,
  prenom: String,
  email: String,
  specialite: String
});

// Route d'accueil
app.get('/', (req, res) => {
  res.send('Application de gestion des étudiants');
});

// Create
app.post('/etudiants', async (req, res) => {
  try {
    const etudiant = new Etudiant(req.body);
    await etudiant.save();
    res.status(201).json(etudiant);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Read all
app.get('/etudiants', async (req, res) => {
  try {
    const etudiants = await Etudiant.find();
    res.json(etudiants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Read one
app.get('/etudiants/:id', async (req, res) => {
  try {
    const etudiant = await Etudiant.findById(req.params.id);
    if (!etudiant) {
      return res.status(404).json({ message: 'Etudiant introuvable' });
    }
    res.json(etudiant);
  } catch (err) {
    res.status(400).json({ message: 'Identifiant invalide' });
  }
});

// Update
app.put('/etudiants/:id', async (req, res) => {
  try {
    const etudiant = await Etudiant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!etudiant) {
      return res.status(404).json({ message: 'Etudiant introuvable' });
    }
    res.json(etudiant);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete
app.delete('/etudiants/:id', async (req, res) => {
  try {
    const etudiant = await Etudiant.findByIdAndDelete(req.params.id);
    if (!etudiant) {
      return res.status(404).json({ message: 'Etudiant introuvable' });
    }
    res.json({ message: 'Etudiant supprimé avec succès' });
  } catch (err) {
    res.status(400).json({ message: 'Identifiant invalide' });
  }
});

// Démarrage du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});