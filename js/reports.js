// Système de rapports

// Générer un rapport de revenus
async function generateRevenueReport(startDate, endDate) {
    try {
        if (SIMULATION_MODE) {
            // Données de démonstration
            return {
                periode: {
                    debut: startDate,
                    fin: endDate
                },
                revenus: {
                    total: 1500000,
                    details: [
                        { mois: 'Octobre 2023', montant: 450000 },
                        { mois: 'Septembre 2023', montant: 350000 },
                        { mois: 'Août 2023', montant: 300000 },
                        { mois: 'Juillet 2023', montant: 250000 },
                        { mois: 'Juin 2023', montant: 150000 }
                    ]
                },
                biens: {
                    total: 15,
                    occupes: 12,
                    disponibles: 3
                },
                paiements: {
                    total: 45,
                    valides: 42,
                    enRetard: 3
                }
            };
        }
        
        // Mode API réelle
        const response = await fetch(`${API_BASE_URL}/reports/revenue?start=${startDate}&end=${endDate}`);
        if (!response.ok) throw new Error('Erreur lors de la génération du rapport');
        return await response.json();
    } catch (error) {
        console.error('Erreur:', error);
        throw error;
    }
}

// Générer un rapport d'occupation
async function generateOccupancyReport() {
    try {
        if (SIMULATION_MODE) {
            // Données de démonstration
            return {
                tauxGlobal: 80,
                parType: [
                    { type: 'Appartement', taux: 85 },
                    { type: 'Villa', taux: 75 },
                    { type: 'Boutique', taux: 90 }
                ],
                parVille: [
                    { ville: 'Cotonou', taux: 82 },
                    { ville: 'Porto-Novo', taux: 78 },
                    { ville: 'Parakou', taux: 75 }
                ]
            };
        }
        
        // Mode API réelle
        const response = await fetch(`${API_BASE_URL}/reports/occupancy`);
        if (!response.ok) throw new Error('Erreur lors de la génération du rapport');
        return await response.json();
    } catch (error) {
        console.error('Erreur:', error);
        throw error;
    }
}

// Générer un rapport de maintenance
async function generateMaintenanceReport() {
    try {
        if (SIMULATION_MODE) {
            // Données de démonstration
            return {
                tickets: {
                    total: 25,
                    resolus: 20,
                    enCours: 3,
                    ouverts: 2
                },
                tempsMoyenResolution: '2.5 jours',
                categorie: [
                    { categorie: 'Plomberie', nombre: 8 },
                    { categorie: 'Électricité', nombre: 7 },
                    { categorie: 'Menuiserie', nombre: 5 },
                    { categorie: 'Climatisation', nombre: 3 },
                    { categorie: 'Autre', nombre: 2 }
                ]
            };
        }
        
        // Mode API réelle
        const response = await fetch(`${API_BASE_URL}/reports/maintenance`);
        if (!response.ok) throw new Error('Erreur lors de la génération du rapport');
        return await response.json();
    } catch (error) {
        console.error('Erreur:', error);
        throw error;
    }
}

// Exporter un rapport au format CSV
function exportToCSV(data, filename) {
    // Convertir les données en format CSV
    let csv = '';
    
    // Si c'est un tableau d'objets
    if (Array.isArray(data) && data.length > 0) {
        // Entêtes
        const headers = Object.keys(data[0]);
        csv += headers.join(',') + '\n';
        
        // Données
        data.forEach(row => {
            const values = headers.map(header => {
                const value = row[header];
                // Échapper les valeurs contenant des virgules
                return typeof value === 'string' && value.includes(',') 
                    ? `"${value}"` 
                    : value;
            });
            csv += values.join(',') + '\n';
        });
    } else if (typeof data === 'object') {
        // Si c'est un objet simple
        Object.entries(data).forEach(([key, value]) => {
            csv += `${key},${value}\n`;
        });
    }
    
    // Créer et télécharger le fichier
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Exporter un rapport au format PDF (simulation)
function exportToPDF(data, filename) {
    // Dans une vraie application, on utiliserait une bibliothèque comme jsPDF
    // Ici, nous simulons l'export en affichant un message
    showToast(`Export PDF de "${filename}" en cours...`, 'info');
    
    // Simulation d'un traitement asynchrone
    setTimeout(() => {
        showToast(`Rapport "${filename}.pdf" généré avec succès`, 'success');
    }, 2000);
}

// Générer un résumé statistique
function generateSummaryStats() {
    // En mode simulation, retourner des données de démonstration
    if (SIMULATION_MODE) {
        return {
            revenusMensuels: 450000,
            tauxOccupation: 80,
            paiementsRetard: 3,
            ticketsOuverts: 2,
            biensDisponibles: 3,
            locatairesActifs: 12
        };
    }
    
    // En mode API réelle, charger les données
    return loadSummaryStatsFromAPI();
}

// Charger les statistiques depuis l'API
async function loadSummaryStatsFromAPI() {
    try {
        const responses = await Promise.all([
            fetch(`${API_BASE_URL}/biens`),
            fetch(`${API_BASE_URL}/paiements`),
            fetch(`${API_BASE_URL}/tickets`),
            fetch(`${API_BASE_URL}/locataires`)
        ]);
        
        const [biens, paiements, tickets, locataires] = await Promise.all(
            responses.map(res => res.json())
        );
        
        // Calculer les statistiques
        const biensDisponibles = biens.filter(b => b.statut === 'Disponible').length;
        const paiementsRetard = paiements.filter(p => p.statut === 'En retard').length;
        const ticketsOuverts = tickets.filter(t => t.statut === 'Ouvert').length;
        const locatairesActifs = locataires.filter(l => l.statut === 'Actif').length;
        
        // Calculer le taux d'occupation
        const tauxOccupation = biens.length > 0 
            ? Math.round(((biens.length - biensDisponibles) / biens.length) * 100)
            : 0;
        
        // Calculer les revenus mensuels (simulation)
        const revenusMensuels = paiements
            .filter(p => p.statut === 'Validé')
            .reduce((sum, p) => sum + p.montant, 0);
        
        return {
            revenusMensuels,
            tauxOccupation,
            paiementsRetard,
            ticketsOuverts,
            biensDisponibles,
            locatairesActifs
        };
    } catch (error) {
        console.error('Erreur lors du chargement des statistiques:', error);
        return null;
    }
}

// Afficher les statistiques dans le dashboard
function displaySummaryStats(stats) {
    if (!stats) return;
    
    // Mettre à jour les éléments du DOM
    document.getElementById('revenusMensuels')?.textContent = formatCurrency(stats.revenusMensuels);
    document.getElementById('tauxOccupation')?.textContent = `${stats.tauxOccupation}%`;
    document.getElementById('paiementsRetard')?.textContent = stats.paiementsRetard;
    document.getElementById('ticketsOuverts')?.textContent = stats.ticketsOuverts;
    document.getElementById('biensDisponibles')?.textContent = stats.biensDisponibles;
    document.getElementById('locatairesActifs')?.textContent = stats.locatairesActifs;
}

// Formater une valeur monétaire
function formatCurrency(amount) {
    return new Intl.NumberFormat('fr-FR', { 
        style: 'currency', 
        currency: 'XOF' 
    }).format(amount);
}