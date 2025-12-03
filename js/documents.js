// Gestion des documents
let currentDocuments = [];
let currentBiens = [];
let editingDocumentId = null;

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    loadUserData();
    Promise.all([
        loadDocuments(),
        loadBiens()
    ]).then(() => {
        populateSelects();
        setupEventListeners();
        updateStats();
    });
});

// Charger les données utilisateur
function loadUserData() {
    const userData = getUserData();
    if (userData) {
        document.getElementById('userName').textContent = `${userData.prenom} ${userData.nom}`;
        document.getElementById('userRole').textContent = userData.role === 'admin' ? 'Administrateur' : 'Gestionnaire';
        document.getElementById('userAvatar').src = `https://ui-avatars.com/api/?name=${userData.prenom}+${userData.nom}&background=259B24&color=fff`;
    }
}

// Charger les documents
async function loadDocuments() {
    try {
        showLoadingSpinner('documentsGrid');
        
        if (SIMULATION_MODE) {
            // Mode simulation avec données de démonstration
            currentDocuments = getDemoDocuments();
            renderDocuments(currentDocuments);
            updateStats();
            return;
        }
        
        const response = await fetch(`${API_BASE_URL}/documents`);
        if (!response.ok) throw new Error('Erreur lors du chargement des documents');
        
        currentDocuments = await response.json();
        renderDocuments(currentDocuments);
        updateStats();
    } catch (error) {
        console.error('Erreur:', error);
        showToast('Erreur lors du chargement des documents', 'error');
        // En mode simulation en cas d'erreur
        currentDocuments = getDemoDocuments();
        renderDocuments(currentDocuments);
        updateStats();
    }
}

// Charger les biens
async function loadBiens() {
    try {
        if (SIMULATION_MODE) {
            currentBiens = getDemoBiens();
            return;
        }
        
        const response = await fetch(`${API_BASE_URL}/biens`);
        if (!response.ok) throw new Error('Erreur lors du chargement des biens');
        currentBiens = await response.json();
    } catch (error) {
        console.error('Erreur:', error);
        currentBiens = getDemoBiens();
    }
}

// Obtenir les données de démonstration des biens
function getDemoBiens() {
    return [
        { id: 1, titre: 'Appartement Duplex', type: 'appartement', adresse: '123 Rue de l\'Indépendance, Cotonou' },
        { id: 2, titre: 'Villa Moderne', type: 'villa', adresse: '456 Avenue de la Liberté, Porto-Novo' },
        { id: 3, titre: 'Boutique Commerciale', type: 'boutique', adresse: '789 Boulevard Triomphal, Parakou' }
    ];
}

// Obtenir les données de démonstration
function getDemoDocuments() {
    return [
        {
            id: 1,
            titre: 'Contrat de bail - Appartement Duplex',
            type_document: 'Contrat',
            bien_associe: 1,
            date_creation: '2023-01-15',
            description: 'Contrat de bail signé pour l\'appartement duplex',
            fichier_url: '#',
            tags: 'bail, contrat, 2023'
        },
        {
            id: 2,
            titre: 'Facture de réparation',
            type_document: 'Facture',
            bien_associe: 2,
            date_creation: '2023-05-20',
            description: 'Facture pour les réparations effectuées dans la villa',
            fichier_url: '#',
            tags: 'facture, réparation, mai 2023'
        },
        {
            id: 3,
            titre: 'Photos de l\'appartement',
            type_document: 'Photo',
            bien_associe: 1,
            date_creation: '2022-12-10',
            description: 'Photos prises lors de la visite de l\'appartement',
            fichier_url: '#',
            tags: 'photo, appartement, visite'
        }
    ];
}

// Remplir les selects
function populateSelects() {
    // Biens
    const bienSelect = document.getElementById('bien_associe');
    if (bienSelect) {
        bienSelect.innerHTML = '<option value="">-- Sélectionner un bien (optionnel) --</option>';
        currentBiens.forEach(bien => {
            const option = document.createElement('option');
            option.value = bien.id;
            option.textContent = `${bien.titre} (${bien.type})`;
            bienSelect.appendChild(option);
        });
    }
    
    // Pour le formulaire d'édition
    const documentBienSelect = document.getElementById('documentForm')?.querySelector('#bien_associe');
    if (documentBienSelect) {
        documentBienSelect.innerHTML = '<option value="">-- Sélectionner un bien (optionnel) --</option>';
        currentBiens.forEach(bien => {
            const option = document.createElement('option');
            option.value = bien.id;
            option.textContent = `${bien.titre} (${bien.type})`;
            documentBienSelect.appendChild(option);
        });
    }
}

// Afficher les documents dans la grille
function renderDocuments(documents) {
    const grid = document.getElementById('documentsGrid');
    
    if (documents.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-file-alt fa-3x"></i>
                <h3>Aucun document trouvé</h3>
                <p>Commencez par ajouter votre premier document</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = documents.map(document => {
        const bien = currentBiens.find(b => b.id === document.bien_associe) || { titre: 'Aucun bien associé' };
        const fileType = getFileType(document.type_document);
        const fileIcon = getFileIcon(fileType);
        
        return `
            <div class="document-card" onclick="previewDocument(${document.id})">
                <div class="document-icon">
                    <i class="${fileIcon}"></i>
                </div>
                <div class="document-info">
                    <h4>${document.titre}</h4>
                    <p class="document-type">${document.type_document}</p>
                    <p class="document-bien">${bien.titre}</p>
                    <p class="document-date">${formatDate(document.date_creation)}</p>
                    <div class="document-tags">
                        ${(document.tags || '').split(',').map(tag => 
                            `<span class="tag">${tag.trim()}</span>`
                        ).join('')}
                    </div>
                </div>
                <div class="document-actions">
                    <button class="btn-icon-sm" onclick="event.stopPropagation(); editDocument(${document.id})" title="Modifier">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon-sm btn-danger" onclick="event.stopPropagation(); deleteDocument(${document.id})" title="Supprimer">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Obtenir le type de fichier
function getFileType(type) {
    switch (type.toLowerCase()) {
        case 'pdf': return 'pdf';
        case 'contrat':
        case 'facture':
        case 'quittance': return 'document';
        case 'photo':
        case 'image': return 'image';
        case 'plan': return 'plan';
        default: return 'document';
    }
}

// Obtenir l'icône de fichier
function getFileIcon(fileType) {
    switch (fileType) {
        case 'pdf': return 'fas fa-file-pdf';
        case 'image': return 'fas fa-file-image';
        case 'plan': return 'fas fa-file-contract';
        default: return 'fas fa-file-alt';
    }
}

// Formater la date
function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
}

// Mettre à jour les statistiques
function updateStats() {
    const total = currentDocuments.length;
    const pdfCount = currentDocuments.filter(d => d.type_document.toLowerCase() === 'pdf').length;
    const imageCount = currentDocuments.filter(d => ['photo', 'image'].includes(d.type_document.toLowerCase())).length;
    const wordCount = currentDocuments.filter(d => ['contrat', 'facture', 'quittance', 'plan'].includes(d.type_document.toLowerCase())).length;
    
    document.getElementById('totalDocuments').textContent = total;
    document.getElementById('pdfDocuments').textContent = pdfCount;
    document.getElementById('imageDocuments').textContent = imageCount;
    document.getElementById('wordDocuments').textContent = wordCount;
}

// Configurer les écouteurs d'événements
function setupEventListeners() {
    // Recherche
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function(e) {
            filterDocuments(e.target.value);
        }, 300));
    }
}

// Filtrer les documents
function filterDocuments(searchTerm) {
    if (!searchTerm) {
        renderDocuments(currentDocuments);
        return;
    }
    
    const filtered = currentDocuments.filter(document => {
        const searchLower = searchTerm.toLowerCase();
        const bien = currentBiens.find(b => b.id === document.bien_associe) || {};
        
        return (
            (document.titre && document.titre.toLowerCase().includes(searchLower)) ||
            (document.type_document && document.type_document.toLowerCase().includes(searchLower)) ||
            (document.description && document.description.toLowerCase().includes(searchLower)) ||
            (bien.titre && bien.titre.toLowerCase().includes(searchLower)) ||
            (document.tags && document.tags.toLowerCase().includes(searchLower))
        );
    });
    
    renderDocuments(filtered);
}

// Rafraîchir la liste
function refreshDocuments() {
    Promise.all([
        loadDocuments(),
        loadBiens()
    ]).then(() => {
        populateSelects();
        showToast('Liste actualisée', 'success');
    });
}

// Aperçu d'un document
function previewDocument(id) {
    const document = currentDocuments.find(d => d.id === id);
    if (!document) return;
    
    const previewTitle = document.getElementById('previewTitle');
    const documentPreview = document.getElementById('documentPreview');
    const downloadBtn = document.getElementById('downloadBtn');
    
    if (previewTitle) previewTitle.textContent = document.titre;
    if (downloadBtn) downloadBtn.href = document.fichier_url || '#';
    
    if (documentPreview) {
        const fileType = getFileType(document.type_document);
        
        if (fileType === 'image') {
            documentPreview.innerHTML = `
                <div class="image-preview">
                    <img src="https://placehold.co/600x400?text=Image+Preview" alt="${document.titre}">
                </div>
            `;
        } else {
            documentPreview.innerHTML = `
                <div class="document-preview-content">
                    <i class="${getFileIcon(fileType)} fa-3x"></i>
                    <h4>${document.titre}</h4>
                    <p>Type: ${document.type_document}</p>
                    <p>Date: ${formatDate(document.date_creation)}</p>
                    <p>Description: ${document.description || 'Aucune description'}</p>
                </div>
            `;
        }
    }
    
    openModal('previewModal');
}

// Ouvrir le modal d'ajout/modification
function openAddDocumentModal() {
    editingDocumentId = null;
    document.getElementById('modalTitle').textContent = 'Ajouter un document';
    document.getElementById('documentForm').reset();
    openModal('addDocumentModal');
}

// Modifier un document
function editDocument(id) {
    const document = currentDocuments.find(d => d.id === id);
    if (!document) return;
    
    editingDocumentId = id;
    document.getElementById('modalTitle').textContent = 'Modifier un document';
    
    // Remplir le formulaire
    document.getElementById('documentId').value = document.id;
    document.getElementById('titre').value = document.titre || '';
    document.getElementById('type_document').value = document.type_document || '';
    document.getElementById('bien_associe').value = document.bien_associe || '';
    document.getElementById('date_creation').value = document.date_creation || '';
    document.getElementById('description').value = document.description || '';
    document.getElementById('tags').value = document.tags || '';
    
    openModal('addDocumentModal');
}

// Sauvegarder un document
async function saveDocument() {
    const form = document.getElementById('documentForm');
    const formData = new FormData(form);
    
    const documentData = {
        titre: formData.get('titre'),
        type_document: formData.get('type_document'),
        bien_associe: parseInt(formData.get('bien_associe')) || null,
        date_creation: formData.get('date_creation'),
        description: formData.get('description') || '',
        tags: formData.get('tags') || '',
        fichier_url: '#' // Simulation d'URL de fichier
    };
    
    try {
        if (SIMULATION_MODE) {
            // Mode simulation
            if (editingDocumentId) {
                // Modification
                const index = currentDocuments.findIndex(d => d.id === editingDocumentId);
                if (index !== -1) {
                    currentDocuments[index] = {...currentDocuments[index], ...documentData};
                }
            } else {
                // Ajout
                const newId = Math.max(...currentDocuments.map(d => d.id), 0) + 1;
                currentDocuments.push({...documentData, id: newId});
            }
            
            renderDocuments(currentDocuments);
            updateStats();
            closeModal('addDocumentModal');
            showToast('Document enregistré avec succès', 'success');
            return;
        }
        
        // Mode API réelle
        let response;
        if (editingDocumentId) {
            // Modification
            response = await fetch(`${API_BASE_URL}/documents/${editingDocumentId}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(documentData)
            });
        } else {
            // Ajout
            response = await fetch(`${API_BASE_URL}/documents`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(documentData)
            });
        }
        
        if (!response.ok) throw new Error('Erreur lors de l\'enregistrement');
        
        closeModal('addDocumentModal');
        loadDocuments();
        showToast('Document enregistré avec succès', 'success');
    } catch (error) {
        console.error('Erreur:', error);
        showToast('Erreur lors de l\'enregistrement du document', 'error');
    }
}

// Supprimer un document
function deleteDocument(id) {
    document.getElementById('deleteDocumentId').value = id;
    openModal('deleteModal');
}

// Confirmer la suppression
async function confirmDeleteDocument() {
    const id = document.getElementById('deleteDocumentId').value;
    
    try {
        if (SIMULATION_MODE) {
            // Mode simulation
            currentDocuments = currentDocuments.filter(d => d.id != id);
            renderDocuments(currentDocuments);
            updateStats();
            closeModal('deleteModal');
            showToast('Document supprimé avec succès', 'success');
            return;
        }
        
        // Mode API réelle
        const response = await fetch(`${API_BASE_URL}/documents/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Erreur lors de la suppression');
        
        closeModal('deleteModal');
        loadDocuments();
        showToast('Document supprimé avec succès', 'success');
    } catch (error) {
        console.error('Erreur:', error);
        showToast('Erreur lors de la suppression du document', 'error');
    }
}

// Fonction helper pour le debounce
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