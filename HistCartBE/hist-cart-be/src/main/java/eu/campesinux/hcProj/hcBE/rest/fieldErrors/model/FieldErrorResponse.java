package eu.campesinux.hcProj.hcBE.rest.fieldErrors.model;

import java.util.List;

public class FieldErrorResponse {
	
	private List<CustomFieldError> fieldErrors;
	
	public List<CustomFieldError> getFieldErrors() {
		return fieldErrors;
	}
	
	public void setFieldErrors(List<CustomFieldError> fieldErrors) {
		this.fieldErrors = fieldErrors;
	}
}
