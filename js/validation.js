// Système de validation avancé

// Validation des formulaires
class FormValidator {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.errors = {};
        this.init();
    }
    
    init() {
        if (!this.form) return;
        
        // Ajouter des écouteurs d'événements pour la validation en temps réel
        const inputs = this.form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }
    
    // Valider un champ spécifique
    validateField(field) {
        const fieldName = field.name || field.id;
        const value = field.value.trim();
        const rules = this.getFieldRules(fieldName);
        
        // Réinitialiser les erreurs pour ce champ
        delete this.errors[fieldName];
        
        // Appliquer les règles de validation
        for (const rule of rules) {
            if (!this.applyRule(rule, value, field)) {
                this.errors[fieldName] = rule.message;
                this.showFieldError(field, rule.message);
                return false;
            }
        }
        
        this.clearFieldError(field);
        return true;
    }
    
    // Appliquer une règle de validation
    applyRule(rule, value, field) {
        switch (rule.type) {
            case 'required':
                return value !== '';
                
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return value === '' || emailRegex.test(value);
                
            case 'phone':
                const phoneRegex = /^(\+229\s?)?[0-9]{2}(\s?[0-9]{2}){3}$/;
                return value === '' || phoneRegex.test(value);
                
            case 'minLength':
                return value.length >= rule.minLength;
                
            case 'maxLength':
                return value.length <= rule.maxLength;
                
            case 'number':
                return value === '' || !isNaN(value) && !isNaN(parseFloat(value));
                
            case 'min':
                return value === '' || parseFloat(value) >= rule.minValue;
                
            case 'max':
                return value === '' || parseFloat(value) <= rule.maxValue;
                
            case 'pattern':
                return value === '' || rule.pattern.test(value);
                
            case 'custom':
                return rule.validator(value, field);
                
            default:
                return true;
        }
    }
    
    // Obtenir les règles de validation pour un champ
    getFieldRules(fieldName) {
        // Règles par défaut - à personnaliser selon les besoins
        const defaultRules = {
            email: [
                { type: 'required', message: 'L\'email est requis' },
                { type: 'email', message: 'Veuillez entrer un email valide' }
            ],
            telephone: [
                { type: 'phone', message: 'Veuillez entrer un numéro de téléphone valide (+229 XX XX XX XX)' }
            ],
            password: [
                { type: 'required', message: 'Le mot de passe est requis' },
                { type: 'minLength', minLength: 6, message: 'Le mot de passe doit contenir au moins 6 caractères' }
            ],
            prix_location: [
                { type: 'required', message: 'Le prix de location est requis' },
                { type: 'number', message: 'Veuillez entrer un nombre valide' },
                { type: 'min', minValue: 0, message: 'Le prix doit être positif' }
            ],
            superficie: [
                { type: 'number', message: 'Veuillez entrer un nombre valide' },
                { type: 'min', minValue: 0, message: 'La superficie doit être positive' }
            ]
        };
        
        return defaultRules[fieldName] || [];
    }
    
    // Afficher une erreur pour un champ
    showFieldError(field, message) {
        // Retirer l'erreur précédente si elle existe
        this.clearFieldError(field);
        
        // Ajouter la classe d'erreur
        field.classList.add('error');
        
        // Créer l'élément d'erreur
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        errorElement.style.color = '#dc3545';
        errorElement.style.fontSize = '0.875rem';
        errorElement.style.marginTop = '0.25rem';
        
        // Insérer l'erreur après le champ
        field.parentNode.insertBefore(errorElement, field.nextSibling);
    }
    
    // Effacer l'erreur d'un champ
    clearFieldError(field) {
        field.classList.remove('error');
        
        // Supprimer l'élément d'erreur s'il existe
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }
    
    // Valider le formulaire entier
    validateForm() {
        const inputs = this.form.querySelectorAll('input, select, textarea');
        let isValid = true;
        
        // Valider tous les champs
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    // Obtenir les erreurs
    getErrors() {
        return this.errors;
    }
    
    // Effacer toutes les erreurs
    clearAllErrors() {
        const inputs = this.form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => this.clearFieldError(input));
        this.errors = {};
    }
}

// Validation spécifique pour les propriétaires
class ProprietaireValidator extends FormValidator {
    getFieldRules(fieldName) {
        const rules = super.getFieldRules(fieldName);
        
        // Règles spécifiques aux propriétaires
        const proprietaireRules = {
            type: [
                { type: 'required', message: 'Le type de propriétaire est requis' }
            ],
            nom: [
                { type: 'required', message: 'Le nom est requis' },
                { type: 'maxLength', maxLength: 100, message: 'Le nom ne doit pas dépasser 100 caractères' }
            ],
            prenom: [
                { type: 'maxLength', maxLength: 100, message: 'Le prénom ne doit pas dépasser 100 caractères' }
            ],
            entreprise: [
                { type: 'maxLength', maxLength: 200, message: 'Le nom de l\'entreprise ne doit pas dépasser 200 caractères' }
            ],
            telephone: [
                { type: 'phone', message: 'Veuillez entrer un numéro de téléphone valide (+229 XX XX XX XX)' }
            ],
            email: [
                { type: 'email', message: 'Veuillez entrer un email valide' }
            ],
            ifu: [
                { type: 'maxLength', maxLength: 50, message: 'L\'IFU ne doit pas dépasser 50 caractères' }
            ]
        };
        
        return proprietaireRules[fieldName] || rules;
    }
}

// Validation spécifique pour les locataires
class LocataireValidator extends FormValidator {
    getFieldRules(fieldName) {
        const rules = super.getFieldRules(fieldName);
        
        // Règles spécifiques aux locataires
        const locataireRules = {
            nom: [
                { type: 'required', message: 'Le nom est requis' },
                { type: 'maxLength', maxLength: 100, message: 'Le nom ne doit pas dépasser 100 caractères' }
            ],
            prenom: [
                { type: 'required', message: 'Le prénom est requis' },
                { type: 'maxLength', maxLength: 100, message: 'Le prénom ne doit pas dépasser 100 caractères' }
            ],
            telephone: [
                { type: 'phone', message: 'Veuillez entrer un numéro de téléphone valide (+229 XX XX XX XX)' }
            ],
            email: [
                { type: 'email', message: 'Veuillez entrer un email valide' }
            ],
            profession: [
                { type: 'maxLength', maxLength: 100, message: 'La profession ne doit pas dépasser 100 caractères' }
            ],
            employeur: [
                { type: 'maxLength', maxLength: 100, message: 'L\'employeur ne doit pas dépasser 100 caractères' }
            ],
            cni: [
                { type: 'maxLength', maxLength: 50, message: 'Le numéro de CNI ne doit pas dépasser 50 caractères' }
            ],
            contact_urgence: [
                { type: 'phone', message: 'Veuillez entrer un numéro de contact d\'urgence valide (+229 XX XX XX XX)' }
            ]
        };
        
        return locataireRules[fieldName] || rules;
    }
}

// Validation spécifique pour les baux
class BailValidator extends FormValidator {
    getFieldRules(fieldName) {
        const rules = super.getFieldRules(fieldName);
        
        // Règles spécifiques aux baux
        const bailRules = {
            bien_id: [
                { type: 'required', message: 'Le bien concerné est requis' }
            ],
            locataire_id: [
                { type: 'required', message: 'Le locataire est requis' }
            ],
            date_debut: [
                { type: 'required', message: 'La date de début est requise' }
            ],
            date_fin: [
                { type: 'required', message: 'La date de fin est requise' },
                { 
                    type: 'custom', 
                    validator: (value, field) => {
                        const startDate = document.getElementById('date_debut').value;
                        return !startDate || !value || new Date(value) > new Date(startDate);
                    },
                    message: 'La date de fin doit être postérieure à la date de début'
                }
            ],
            loyer_base: [
                { type: 'required', message: 'Le loyer de base est requis' },
                { type: 'number', message: 'Veuillez entrer un nombre valide' },
                { type: 'min', minValue: 0, message: 'Le loyer doit être positif' }
            ],
            charges: [
                { type: 'number', message: 'Veuillez entrer un nombre valide' },
                { type: 'min', minValue: 0, message: 'Les charges doivent être positives' }
            ],
            caution: [
                { type: 'number', message: 'Veuillez entrer un nombre valide' },
                { type: 'min', minValue: 0, message: 'La caution doit être positive' }
            ]
        };
        
        return bailRules[fieldName] || rules;
    }
}

// Fonction utilitaire pour créer un validateur selon le type de formulaire
function createValidator(formId, type = 'generic') {
    switch (type) {
        case 'proprietaire':
            return new ProprietaireValidator(formId);
        case 'locataire':
            return new LocataireValidator(formId);
        case 'bail':
            return new BailValidator(formId);
        default:
            return new FormValidator(formId);
    }
}

// Exporter les classes et fonctions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        FormValidator,
        ProprietaireValidator,
        LocataireValidator,
        BailValidator,
        createValidator
    };
}