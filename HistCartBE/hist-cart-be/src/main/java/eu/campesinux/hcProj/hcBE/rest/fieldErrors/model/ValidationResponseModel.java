package eu.campesinux.hcProj.hcBE.rest.fieldErrors.model;

import lombok.Data;

@Data
public class ValidationResponseModel {
	
	private String message;
	
	private Long entityId;
	
	private String params;

	public ValidationResponseModel(String message) {
		super();
		this.message = message;
		this.entityId = 0L;
	}

	public ValidationResponseModel(String message, Long id) {
		super();
		this.message = message;
		this.entityId = id;
	}

	public ValidationResponseModel(String message, Long entityId, String params) {
		super();
		this.message = message;
		this.entityId = entityId;
		this.params = params;
	}	
}
