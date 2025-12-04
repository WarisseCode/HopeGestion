/* =============================================
   BIENS JAVASCRIPT
   ============================================= */

// Variables globales
let currentBiens = [];
let editingBienId = null;

// Check authentication
requireAuth();

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', async function() {
    // Initialize page protection
    initializePageProtection();
    
    // Load biens
    await loadBiens();
    
    // Setup search
    setupSearch('searchInput', 'biensTable', [0, 1, 2, 3, 4]);
    
    // Setup form submission
    document.getElementById('bienForm').addEventListener('submit', handleFormSubmit);
    
    // Setup modal close buttons
    document.querySelectorAll('.btn-close').forEach(button => {
        button.addEventListener('click', () => closeModal('addBienModal'));
    });
    
    // Setup delete modal close button
    document.querySelector('#deleteModal .btn-close').addEventListener('click', () => closeModal('deleteModal'));
});

// Charger les biens
async function loadBiens() {
    try {
        showLoadingSpinner('biensTableBody');
        
        // Attendre un court délai pour s'assurer que les spinners sont visibles
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const response = await apiRequest(buildUrl('biens'));
        const biens = response.data || response;
        
        currentBiens = biens;
        renderBiens(biens);
        updateStats();
    } catch (error) {
        console.error('Erreur:', error);
        showToast('Erreur lors du chargement des biens', 'error');
        // En mode simulation en cas d'erreur
        currentBiens = getDemoBiens();
        renderBiens(currentBiens);
        updateStats();
    }
}

// Obtenir les biens de démonstration
function getDemoBiens() {
    return [
        {
            id: 1,
            titre: "Appartement Duplex",
            type: "appartement",
            adresse: "123 Rue de l'Indépendance, Cotonou",
            ville: "Cotonou",
            superficie: 120,
            chambres: 3,
            salles_bain: 2,
            prix_location: 150000,
            prix_achat: 25000000,
            statut: "Disponible",
            description: "Bel appartement duplex avec vue sur la mer",
            equipements: ["Climatisation", "Parking", "Balcon"],
            proprietaire_id: 1
        },
        {
            id: 2,
            titre: "Villa Moderne",
            type: "villa",
            adresse: "456 Avenue de la Liberté, Porto-Novo",
            ville: "Porto-Novo",
            superficie: 250,
            chambres: 5,
            salles_bain: 4,
            prix_location: 250000,
            prix_achat: 45000000,
            statut: "Occupé",
            description: "Villa moderne avec jardin et piscine",
            equipements: ["Piscine", "Jardin", "Garage"],
            proprietaire_id: 2
        },
        {
            id: 3,
            titre: "Boutique Commerciale",
            type: "boutique",
            adresse: "789 Boulevard Triomphal, Parakou",
            ville: "Parakou",
            superficie: 80,
            chambres: 1,
            salles_bain: 1,
            prix_location: 100000,
            prix_achat: 15000000,
            statut: "En maintenance",
            description: "Boutique idéalement située dans le centre-ville",
            equipements: ["Vitrine", "Stockage", "Électricité industrielle"],
            proprietaire_id: 3
        }
    ];
}

// Update stats
function updateStats() {
    const totalBiens = currentBiens.length;
    const disponibles = currentBiens.filter(b => b.statut === 'Disponible').length;
    const occupes = currentBiens.filter(b => b.statut === 'Occupé').length;
    const maintenance = currentBiens.filter(b => b.statut === 'En maintenance').length;
    
    document.getElementById('totalBiens').textContent = totalBiens;
    document.getElementById('biensDisponibles').textContent = disponibles;
    document.getElementById('biensOccupes').textContent = occupes;
    document.getElementById('biensMaintenance').textContent = maintenance;
}

// Render biens in table
function renderBiens(biens) {
    const tbody = document.getElementById('biensTableBody');
    
    if (biens.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center">
                    <div class="empty-state">
                        <i class="fas fa-home fa-3x"></i>
                        <h3>Aucun bien trouvé</h3>
                        <p>Commencez par ajouter votre premier bien immobilier</p>
                        <button class="btn-primary" onclick="openModal('addBienModal')">
                            <i class="fas fa-plus"></i>
                            Ajouter un bien
                        </button>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = biens.map(bien => `
        <tr>
            <td>${bien.titre}</td>
            <td>${bien.type}</td>
            <td>${bien.adresse}</td>
            <td>${bien.ville}</td>
            <td>${formatCurrency(bien.prix_location)}</td>
            <td>
                <span class="status-badge status-${bien.statut.toLowerCase().replace(' ', '-')}">
                    ${bien.statut}
                </span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn-icon btn-view" onclick="viewBien(${bien.id})" data-tooltip="Voir les détails">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-icon btn-edit" onclick="editBien(${bien.id})" data-tooltip="Modifier">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon btn-delete" onclick="deleteBien(${bien.id})" data-tooltip="Supprimer">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// View bien details
function viewBien(id) {
    window.location.href = `bien-details.html?id=${id}`;
}

// Edit bien
function editBien(id) {
    const bien = currentBiens.find(b => b.id == id);
    if (!bien) return;
    
    // Fill form with bien data
    document.getElementById('bienId').value = bien.id;
    document.getElementById('titre').value = bien.titre;
    document.getElementById('type').value = bien.type;
    document.getElementById('adresse').value = bien.adresse;
    document.getElementById('ville').value = bien.ville;
    document.getElementById('superficie').value = bien.superficie;
    document.getElementById('chambres').value = bien.chambres;
    document.getElementById('salles_bain').value = bien.salles_bain;
    document.getElementById('prix_location').value = bien.prix_location;
    document.getElementById('prix_achat').value = bien.prix_achat;
    document.getElementById('description').value = bien.description;
    document.getElementById('equipements').value = Array.isArray(bien.equipements) ? bien.equipements.join(', ') : bien.equipements;
    document.getElementById('statut').value = bien.statut;
    
    // Update modal title
    document.getElementById('modalTitle').textContent = 'Modifier un bien';
    
    // Open modal
    openModal('addBienModal');
    
    editingBienId = id;
}

// Delete bien
function deleteBien(id) {
    document.getElementById('deleteBienId').value = id;
    openModal('deleteModal');
}

// Confirm delete bien
async function confirmDeleteBien() {
    const id = document.getElementById('deleteBienId').value;
    
    try {
        await apiRequest(buildUrl('biens', id), {
            method: 'DELETE'
        });
        
        showToast('Bien supprimé avec succès', 'success');
        closeModal('deleteModal');
        await loadBiens();
    } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        showToast('Erreur lors de la suppression du bien', 'error');
    }
}

// Handle form submission
async function handleFormSubmit(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    // Process equipements
    if (data.equipements) {
        data.equipements = data.equipements.split(',').map(item => item.trim()).filter(item => item);
    }
    
    // Convert numeric fields
    const numericFields = ['superficie', 'chambres', 'salles_bain', 'prix_location', 'prix_achat'];
    numericFields.forEach(field => {
        if (data[field]) {
            data[field] = Number(data[field]);
        }
    });
    
    try {
        if (editingBienId) {
            // Update existing bien
            await apiRequest(buildUrl('biens', editingBienId), {
                method: 'PUT',
                body: JSON.stringify(data)
            });
            
            showToast('Bien mis à jour avec succès', 'success');
        } else {
            // Create new bien
            await apiRequest(buildUrl('biens'), {
                method: 'POST',
                body: JSON.stringify(data)
            });
            
            showToast('Bien ajouté avec succès', 'success');
        }
        
        // Reset form and close modal
        e.target.reset();
        closeModal('addBienModal');
        
        // Reload biens
        await loadBiens();
        
        // Reset editing state
        editingBienId = null;
        document.getElementById('modalTitle').textContent = 'Ajouter un bien';
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement:', error);
        showToast('Erreur lors de l\'enregistrement du bien', 'error');
    }
}

// Cancel edit
function cancelEdit() {
    document.getElementById('bienForm').reset();
    closeModal('addBienModal');
    editingBienId = null;
    document.getElementById('modalTitle').textContent = 'Ajouter un bien';
}

// Setup search functionality
function setupSearch(inputId, tableId, columns) {
    const searchInput = document.getElementById(inputId);
    const table = document.getElementById(tableId);
    
    if (!searchInput || !table) return;
    
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const rows = table.querySelectorAll('tbody tr:not(.empty-state)');
        
        rows.forEach(row => {
            const text = Array.from(row.cells)
                .filter((cell, index) => columns.includes(index))
                .map(cell => cell.textContent.toLowerCase())
                .join(' ');
            
            row.style.display = text.includes(searchTerm) ? '' : 'none';
        });
    });
}