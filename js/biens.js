/* =============================================
   BIENS JAVASCRIPT
   ============================================= */

// Check authentication
requireAuth();

// Get current user
const currentUser = getCurrentUser();

// Update user info in topbar
document.addEventListener('DOMContentLoaded', async () => {
    if (currentUser) {
        document.getElementById('userName').textContent = `${currentUser.prenom} ${currentUser.nom}`;
        document.getElementById('userRole').textContent = currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1);
        
        // Update avatar
        const avatar = document.getElementById('userAvatar');
        if (avatar) {
            avatar.src = `https://ui-avatars.com/api/?name=${currentUser.prenom}+${currentUser.nom}&background=259B24&color=fff`;
        }
    }
    
    // Load biens data
    await loadBiens();
    
    // Menu toggle for mobile
    const menuToggle = document.querySelector('.btn-menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }
    
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(loadBiens, 300));
    }
});

// Load biens
async function loadBiens() {
    const tbody = document.getElementById('biensTableBody');
    const searchInput = document.getElementById('searchInput');
    
    try {
        // Show loading state
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center">
                    <div class="loading-spinner">
                        <div class="spinner"></div>
                        <p>Chargement des biens...</p>
                    </div>
                </td>
            </tr>
        `;
        
        // Get search term
        const searchTerm = searchInput ? searchInput.value.trim() : '';
        
        // Load biens with search
        const params = { limit: 1000 };
        if (searchTerm) {
            params.search = searchTerm;
        }
        
        const response = await API.get('biens', params);
        const biens = response.data || [];
        
        // Update stats
        updateStats(biens);
        
        // Display biens
        displayBiens(biens);
        
    } catch (error) {
        console.error('Error loading biens:', error);
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center" style="color: var(--accent); padding: 2rem;">
                    Erreur de chargement des biens
                </td>
            </tr>
        `;
        showToast('Erreur lors du chargement des biens', 'error');
    }
}

// Update stats
function updateStats(biens) {
    const totalBiens = biens.length;
    const disponibles = biens.filter(b => b.statut === 'Disponible').length;
    const occupes = biens.filter(b => b.statut === 'Occupé').length;
    const maintenance = biens.filter(b => b.statut === 'En maintenance').length;
    
    document.getElementById('totalBiens').textContent = totalBiens;
    document.getElementById('biensDisponibles').textContent = disponibles;
    document.getElementById('biensOccupes').textContent = occupes;
    document.getElementById('biensMaintenance').textContent = maintenance;
}

// Display biens in table
function displayBiens(biens) {
    const tbody = document.getElementById('biensTableBody');
    
    if (biens.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center" style="padding: 2rem; color: var(--text-light);">
                    Aucun bien trouvé
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = biens.map(bien => `
        <tr>
            <td><strong>${bien.reference || '-'}</strong></td>
            <td>${bien.type_bien || '-'}</td>
            <td>${bien.adresse || '-'}</td>
            <td>${bien.ville || '-'}</td>
            <td><strong>${formatCurrency(bien.loyer_mensuel || 0)}</strong></td>
            <td>
                <span class="status-badge ${(bien.statut || '').toLowerCase().replace('é', 'e')}">
                    ${bien.statut || '-'}
                </span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn-icon-sm btn-view" onclick="viewBien(${bien.id})" title="Voir">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-icon-sm btn-edit" onclick="editBien(${bien.id})" title="Modifier">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon-sm btn-delete" onclick="deleteBien(${bien.id})" title="Supprimer">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Refresh biens
function refreshBiens() {
    loadBiens();
    showToast('Liste actualisée', 'success');
}

// View bien details
function viewBien(id) {
    showToast('Fonctionnalité de visualisation en développement', 'info');
}

// Edit bien
async function editBien(id) {
    try {
        const response = await API.getById('biens', id);
        const bien = response.data;
        
        if (bien) {
            // Fill form with bien data
            document.getElementById('bienId').value = bien.id;
            document.getElementById('type_bien').value = bien.type_bien || '';
            document.getElementById('ville').value = bien.ville || '';
            document.getElementById('adresse').value = bien.adresse || '';
            document.getElementById('superficie').value = bien.superficie || '';
            document.getElementById('nombre_pieces').value = bien.nombre_pieces || '';
            document.getElementById('loyer_mensuel').value = bien.loyer_mensuel || '';
            document.getElementById('statut').value = bien.statut || '';
            document.getElementById('description').value = bien.description || '';
            
            // Update modal title
            document.getElementById('modalTitle').textContent = 'Modifier un bien';
            
            // Open modal
            openModal('addBienModal');
        }
    } catch (error) {
        console.error('Error loading bien:', error);
        showToast('Erreur lors du chargement du bien', 'error');
    }
}

// Save bien (create or update)
async function saveBien() {
    const form = document.getElementById('bienForm');
    const id = document.getElementById('bienId').value;
    
    // Get form data
    const bienData = {
        type_bien: document.getElementById('type_bien').value,
        ville: document.getElementById('ville').value,
        adresse: document.getElementById('adresse').value,
        superficie: document.getElementById('superficie').value,
        nombre_pieces: document.getElementById('nombre_pieces').value,
        loyer_mensuel: document.getElementById('loyer_mensuel').value,
        statut: document.getElementById('statut').value,
        description: document.getElementById('description').value
    };
    
    // Generate reference if creating new
    if (!id) {
        bienData.reference = generateReference('BIEN');
    }
    
    try {
        if (id) {
            // Update existing bien
            await API.update('biens', id, bienData);
            showToast('Bien mis à jour avec succès', 'success');
        } else {
            // Create new bien
            await API.create('biens', bienData);
            showToast('Bien ajouté avec succès', 'success');
        }
        
        // Close modal
        closeModal('addBienModal');
        
        // Reset form
        form.reset();
        document.getElementById('bienId').value = '';
        document.getElementById('modalTitle').textContent = 'Ajouter un bien';
        
        // Refresh biens
        await loadBiens();
        
    } catch (error) {
        console.error('Error saving bien:', error);
        showToast('Erreur lors de l\'enregistrement du bien', 'error');
    }
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
        await API.delete('biens', id);
        showToast('Bien supprimé avec succès', 'success');
        
        // Close modal
        closeModal('deleteModal');
        
        // Refresh biens
        await loadBiens();
        
    } catch (error) {
        console.error('Error deleting bien:', error);
        showToast('Erreur lors de la suppression du bien', 'error');
    }
}

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Toast notification
function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
        <span>${message}</span>
        <button class="btn-close" onclick="this.parentElement.remove()">&times;</button>
    `;
    
    toastContainer.appendChild(toast);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (toast.parentElement) {
            toast.remove();
        }
    }, 3000);
}

// Open modal
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

// Close modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // Reset form if it's the add/edit modal
        if (modalId === 'addBienModal') {
            document.getElementById('bienForm').reset();
            document.getElementById('bienId').value = '';
            document.getElementById('modalTitle').textContent = 'Ajouter un bien';
        }
    }
}