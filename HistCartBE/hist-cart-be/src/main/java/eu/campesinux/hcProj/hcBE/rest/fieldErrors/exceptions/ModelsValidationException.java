package eu.campesinux.hcProj.hcBE.rest.fieldErrors.exceptions;

import eu.campesinux.hcProj.hcBE.rest.fieldErrors.model.FieldErrorResponse;
import lombok.Getter;
import lombok.Setter;

// per comunicare "dati invalidi", forniti in fase di creazione o modifica di una entity, si puo' usare IllegalArgumentException 
// https://stackoverflow.com/questions/17015946/which-exception-to-throw-for-invalid-input-which-is-valid-from-client-perspectiv
// 
// ModelsValidationException e' la classe di eccezioni legate al processo di validazione, che avviene lato BE
// 
// la classe FieldErrorResponse e' quella usata per gestire i "fieldErrors" su FE (che li mostra) e su BE (che li imposta)
@Getter @Setter
public class ModelsValidationException extends IllegalArgumentException {
	
	private static final long serialVersionUID = 1L;
	
	FieldErrorResponse fieldErrorResponse;
	
	public ModelsValidationException(FieldErrorResponse fer) {
		this.fieldErrorResponse = fer;
	}
	
}
